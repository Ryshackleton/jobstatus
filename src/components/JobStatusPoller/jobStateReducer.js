import { scaleOrdinal } from 'd3-scale';
import { has } from 'lodash-es';

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

export default jobStateReducer;
