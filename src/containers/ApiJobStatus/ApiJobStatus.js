import React from 'react';
import JobStatusPoller from '../../components/JobStatusPoller/JobStatusPoller';
import Title from '../../components/Title/Title';
import { fetchNodes, fetchNodeMetadata, fetchTitle } from './fetchFromApi';
import { isNil } from 'lodash-es';

export default function ApiJobStatus({
  className,
  match,
  baseUrl,
  port
}) {
  const job_id = match.params.job_id ? Number(match.params.job_id) : null;
  const groupPropName = 'status';
  const urlString = port ? `${baseUrl}:${port}` : baseUrl;

  // title with user name and workflow arguments
  const fetchTitlePromise = fetchTitle.bind(null, {
    job_id,
    url: `${urlString}/workflow`,
  });

  // metadata for nodes, including labels, sort order, colors
  const fetchMetadataPromise = fetchNodeMetadata.bind(null, {
    url: `${urlString}/job_status`,
  });

  // actual array of nodes
  const fetchNodesPromise = fetchNodes.bind(null, {
    groupPropName: 'status',
    url: `${urlString}/workflow/${job_id}/job_display_details`,
  });

  const title =
    <Title
      className="Job-status-title"
      fetchTitlePromise={fetchTitlePromise}
    />;
  const jobStatusComponent =
    <div className="Job-status-graph-container">
      <JobStatusPoller
        colorPropName="color"
        className="Job-status-graph"
        fetchMetadataPromise={fetchMetadataPromise}
        fetchNodesPromise={fetchNodesPromise}
        groupPropName={groupPropName}
        labelFont="700 1.1rem Nunito"
        labelFontSecondary = "700 0.9rem Nunito"
        labelPropName="label"
        margin={{ top: 60, right: 20, bottom: 20, left: 20 }}
        pollingInterval={5000}
        uniqueIdPropName="id"
        wrapperStyle={{ height: '80%', width: '80%' }}
      />
    </div>;

  return isNil(job_id)
    ? <div className={className}>{title}</div>
    : <div className={className}>
      {title}
      {isNil(job_id) ? '' : jobStatusComponent}
    </div>;
};

