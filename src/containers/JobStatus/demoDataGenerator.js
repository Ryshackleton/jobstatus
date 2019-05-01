import { csvParse } from 'd3-dsv';

const jobStatusCSV = `id,label,sort_order,color
D,DONE,7,#2ECC71
E,RECOVERABLE,5,#F1948A
F,FATAL,6,#E74C3C
G,REGISTERED,1,#D6EAF8
I,INSTANTIATED,3,#5DADE2
Q,QUEUED,2,#3498DB
R,RUNNING,4,#ebd857`;

export const getDemoMetaDataAndNodes = async ({ nNodes = 20000, groupPropName = 'id' }) => {
  const statusCSV = await csvParse(jobStatusCSV);
  const jobStatusMetaData = Array.isArray(statusCSV)
    ? statusCSV.sort((a, b) => (a.sort_order - b.sort_order))
    : [];

  // start with all nodes at first status
  const nodes = (new Array(nNodes).fill({}))
    .map((node, i) => ({
      uniqueId: i,
      [groupPropName]: jobStatusMetaData[0][groupPropName],
    }));

  return { nodes, groupMetadataArray: jobStatusMetaData };
};

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

