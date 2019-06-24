import React from 'react';
import JobStatusPoller from '../../components/JobStatusPoller/JobStatusPoller';
import Title from '../../components/Title/Title';
import { getFakeProgress } from './demoDataGenerator';

const defaultGroupMetadata = [
  {
    color: '#D6EAF8',
    group_id: 'G',
    label: 'REGISTERED',
    sort_order: 1,
  },
  {
    color: '#3498DB',
    group_id: 'Q',
    label: 'QUEUED',
    sort_order: 2,
  },
  {
    color: '#5DADE2',
    group_id: 'I',
    label: 'INSTANTIATED',
    sort_order: 3,
  },
  {
    color: '#ebd857',
    group_id: 'R',
    label: 'RUNNING',
    sort_order: 4,
  },
  {
    color: '#F1948A',
    group_id: 'E',
    label: 'RECOVERABLE',
    sort_order: 5,
  },
  {
    color: '#E74C3C',
    group_id: 'F',
    label: 'FATAL',
    sort_order: 6,
  },
  {
    color: '#2ECC71',
    group_id: 'D',
    label: 'DONE',
    sort_order: 7,
  },
];

export default function DemoWorkflowStatus({
  className = 'Job-status-graph',
  match = {},
  circleStrokeColor,
  circleStrokeWidth,
  colorPropName = 'color',
  fontStrokeColor,
  fontStrokeWidth,
  groupMetadataArray,
  labelColorAccessor,
  labelFont = '700 1.1rem Nunito',
  labelFontSecondary  = '700 0.9rem Nunito',
  labelPropName = 'label',
  margin = { top: 60, right: 20, bottom: 20, left: 20 },
  pollingInterval = 1000,
  uniqueIdPropName = 'unique_id',
  wrapperStyle = { height: '80%', width: '80%' },
}) {
  const nNodes = (match.params && match.params.nNodes) ? Number(match.params.nNodes) : 1000;
  const groupPropName = 'group_id';

  // start with all nodes at first status
  let nodes = (new Array(nNodes).fill({}))
    .map((node, i) => ({
      unique_id: `id_${i + 1}`,
      group_id: 'G',
      some_other_prop: 'with a very long name',
    }));

  const groupMetadata = groupMetadataArray || defaultGroupMetadata;
  const groupKeys = defaultGroupMetadata.map((meta) => (meta[groupPropName]));

  // title with user name and workflow arguments
  const fetchTitlePromise = async () =>  (`Demo status with ${nNodes} jobs`);

  // metadata for nodes, including labels, sort order, colors
  const fetchMetadataPromise = async () => ({ groupMetadataArray: groupMetadata });

  // actual array of nodes
  const fetchNodesPromise = async () => {
    nodes = getFakeProgress(nodes, groupKeys, groupPropName);
    return { nodes };
  };

  const title =
    <Title
      className="Job-status-title"
      fetchTitlePromise={fetchTitlePromise}
    />;
  const jobStatusComponent =
    <div className="Job-status-graph-container">
      <JobStatusPoller
        circleStrokeColor={circleStrokeColor}
        circleStrokeWidth={circleStrokeWidth}
        fontStrokeColor={fontStrokeColor}
        fontStrokeWidth={fontStrokeWidth}
        labelColorAccessor={labelColorAccessor}

        colorPropName={colorPropName}
        className={className}
        fetchMetadataPromise={fetchMetadataPromise}
        fetchNodesPromise={fetchNodesPromise}
        groupPropName={groupPropName}
        labelFont={labelFont}
        labelFontSecondary={labelFontSecondary}
        labelPropName={labelPropName}
        margin={margin}
        pollingInterval={pollingInterval}
        uniqueIdPropName={uniqueIdPropName}
        wrapperStyle={wrapperStyle}
      />
    </div>;

  return <div
    className={className}>
    {title}
    {jobStatusComponent}
  </div>;
};

