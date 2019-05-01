import { scaleOrdinal } from 'd3-scale';
import { has } from 'lodash-es';
import React, { useEffect, useReducer } from 'react';
import useInterval from '../../hooks/useInterval';
import DotBarChart from '../../components/DotBarChart/DotBarChart';
import { getDemoMetaDataAndNodes, getFakeProgress } from './demoDataGenerator';

const jobStateReducer = (state, action) => {
  switch(action.type) {
    case 'SET_NODES':
      return { ...state, nodes: action.payload };
    case 'SET_GROUP_METADATA':
      const {
        colorPropName,
        groupMetadataArray,
        groupPropName,
        labelPropName,
      } = action.payload;

      const groupMetadata = groupMetadataArray
        .reduce((acc, meta) => ({ ...acc, [meta[groupPropName]]: meta }), {});
      const colorRange = groupMetadataArray.map(meta => meta[colorPropName]);
      const groupKeys = groupMetadataArray.map(meta => meta[groupPropName]);
      const groupLabels = groupMetadataArray.map(meta => meta[labelPropName]);

      const colorScale = scaleOrdinal()
        .domain(groupKeys)
        .range(colorRange)
      // dual use color accessor:
      // takes either a node object where node = { [groupPropName]: 'someGroupId' }
      // OR the group id itself: node = 'someGroupId'
      const colorAccessor = node => {
        return has(node, groupPropName)
          ? colorScale(node[groupPropName])
          : colorScale(node)
      };

      return { ...state, colorAccessor, groupMetadata, groupKeys, groupLabels };
    default:
      throw new Error('Invalid action type in jobStateReducer');
  }
};

export default ({
  className,
  groupPropName = 'id',
  colorPropName = 'color',
  labelPropName = 'label',
  labelFont = 'bold 1.1em Arial',
  labelFontSecondary = '0.9em Arial',
  margin = { top: 60, right: 20, bottom: 10, left: 20 },
  nNodes = 2000,
  nodesMetadataPromise = getDemoMetaDataAndNodes.bind(null, { nNodes, groupPropName }),
  pollingInterval = 500,
  wrapperStyle = { height: '100%', width: '100%' },
}) => {
  const [state, dispatch] = useReducer(jobStateReducer, {
    colorAccessor: () => ('#fff'),
    groupMetadata: {},
    groupKeys: [],
    groupLabels: [],
    nodes: [],
  });

  // fetch initial metadata and state
  useEffect(() => {
    async function fetchData() {
      const {
        groupMetadataArray,
        nodes,
      } = await nodesMetadataPromise();

      dispatch({
        type: 'SET_GROUP_METADATA',
        // keyed by groupPropName
        payload: {
          colorPropName,
          groupPropName,
          groupMetadataArray,
          labelPropName,
        },
      });
      dispatch({ type: 'SET_NODES', payload: nodes });
    };
    fetchData();
  }, []);

  // poll the "server" for new data
  useInterval(() => {
    // TODO: implement real function to poll for data
    dispatch({
      type: 'SET_NODES',
      payload: getFakeProgress(state.nodes, state.groupKeys, groupPropName),
    });
    },
    pollingInterval);

  return <DotBarChart
    className={className}
    colorAccessor={state.colorAccessor}
    groupPropName={groupPropName}
    groupCounts={state.groupKeys.length}
    groupKeys={state.groupKeys}
    groupLabels={state.groupLabels}
    labelFont={labelFont}
    labelFontSecondary={labelFontSecondary}
    nodes={state.nodes}
    margin={margin}
    uniqueIdPropName
    wrapperStyle={wrapperStyle}
  />
};
