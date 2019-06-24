import { isArray } from 'lodash-es';
import React, { useEffect, useReducer } from 'react';
import jobStateReducer from './jobStateReducer';
import useInterval from '../../hooks/useInterval';
import DotBarChart from '../DotBarChart/DotBarChart';

export default function JobStatusPoller({
  canvasStyle,
  circleStrokeColor,
  circleStrokeWidth,
  className,
  colorPropName = 'color',
  eventCanvasStyle,
  fontStrokeColor,
  fontStrokeWidth,
  fetchMetadataPromise,
  fetchNodesPromise,
  groupPropName = 'status',
  labelColorAccessor,
  labelPropName = 'label',
  labelFont = 'bold 1.1em Arial',
  labelFontSecondary = '0.9em Arial',
  margin = { top: 60, right: 20, bottom: 10, left: 20 },
  pollingInterval = 500,
  uniqueIdPropName,
  wrapperStyle = { height: '100%', width: '100%' },
}) {
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
      const { nodes } = await fetchNodesPromise();
      dispatch({ type: 'SET_NODES', payload: nodes });

      const { groupMetadataArray } = await fetchMetadataPromise();
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
    };
    fetchData();
  }, []);

  // poll the "server" for new data
  useInterval(() => {
    fetchNodesPromise()
      .then(({ nodes }) => {
        dispatch({
          type: 'SET_NODES',
          payload: nodes,
        });
      })
    },
    pollingInterval);

  return (!isArray(state.nodes) || !state.nodes.length)
    ? ''
    : <DotBarChart
      canvasStyle={canvasStyle}
      circleStrokeColor={circleStrokeColor}
      circleStrokeWidth={circleStrokeWidth}
      className={className}
      colorAccessor={state.colorAccessor}
      eventCanvasStyle={eventCanvasStyle}
      fontStrokeColor={fontStrokeColor}
      fontStrokeWidth={fontStrokeWidth}
      groupPropName={groupPropName}
      groupCounts={state.groupKeys.length}
      groupKeys={state.groupKeys}
      groupLabels={state.groupLabels}
      labelColorAccessor={labelColorAccessor}
      labelFont={labelFont}
      labelFontSecondary={labelFontSecondary}
      nodes={state.nodes}
      margin={margin}
      uniqueIdPropName={uniqueIdPropName}
      wrapperStyle={wrapperStyle}
    />;
};
