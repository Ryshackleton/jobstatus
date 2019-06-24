export const getFakeProgress = (nodes, groupKeys, groupPropName) => {
  const numberToAdvance = Math.floor(Math.random() * 50);
  const indicesToAdvance = (new Array(numberToAdvance))
    .fill(0).map(() => (Math.floor(Math.random() * nodes.length)));
  // copy nodes and move some of them forward
  return nodes.map((node, index) => {
    if (indicesToAdvance.includes(index)) {
      const groupIndex = groupKeys.findIndex((key) => (key === node[groupPropName]));
      let nextGroupIndex = groupIndex;
      if (groupKeys[groupIndex] === 'E') { // RECOVERABLE
        nextGroupIndex = 1;
      } else if (groupKeys[groupIndex] === 'F') { // FATAL
          nextGroupIndex = groupIndex;
      } else if (groupKeys[groupIndex] === 'R') { // RUNNING
        const randomErrorState = Math.random() <= 0.05 ? groupIndex + 2 : groupIndex + 1;
        nextGroupIndex = (Math.random() <= 0.1)
          ? randomErrorState
          : groupKeys.length - 1;
      } else {
        nextGroupIndex = groupIndex < groupKeys.length - 2 ? groupIndex + 1 : groupKeys.length - 1;
      }
      return { ...node, [groupPropName]: groupKeys[nextGroupIndex] };
    }
    return { ...node }
  });
};

