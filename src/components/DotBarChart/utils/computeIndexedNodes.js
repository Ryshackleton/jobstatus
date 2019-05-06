import { reduce } from 'lodash-es';

const uniqueColor = (index) => {
  return (index < 16777215)
    ? `rgb(${index & 0xff},${(index & 0xff00) >> 8},${(index & 0xff0000) >> 16})`
    : '';
};

export default ({
  nodes,
  uniqueIdPropName = 'uniqueId',
  groupPropName,
  groupIndexPropName = 'groupIndex',
  groupKeys,
}) => {
  const groupCounts = Array.isArray(groupKeys)
    ? groupKeys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
    : {};

  const colorToNode = {};
  const nodeIdToColor = {};
  const indexed = reduce(nodes, (acc, node, index) => {
    const { [groupPropName]: group, [uniqueIdPropName]: id = index, } = node;
    if(!groupCounts[group]) {
      groupCounts[group] = 0;
    }
    const groupIndex = groupCounts[group]++;

    // unique color (from http://bl.ocks.org/Jverma/70f7975a72358e6d69cdd4bf6a0569e7)
    const color = uniqueColor(index + 1);
    colorToNode[color] = node;
    nodeIdToColor[id] = color;

    acc[id] = {
      ...node,
      [uniqueIdPropName]: id,
      [groupIndexPropName]: groupIndex,
      [groupPropName]: group,
    };
    return acc;
  }, {});
  return { colorToNode, nodes: indexed, groupCounts, groupIndexPropName, nodeIdToColor };
};
