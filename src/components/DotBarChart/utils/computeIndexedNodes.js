import { reduce } from 'lodash-es';

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

  const indexed = reduce(nodes, (acc, node, index) => {
    const { [groupPropName]: group, [uniqueIdPropName]: id = index, } = node;
    if(!groupCounts[group]) {
      groupCounts[group] = 0;
    }
    const groupIndex = groupCounts[group]++;
    acc[id] = {
      ...node,
      [uniqueIdPropName]: id,
      [groupIndexPropName]: groupIndex,
      [groupPropName]: group,
    };
    return acc;
  }, {});
  return { nodes: indexed, groupCounts, groupIndexPropName };
};
