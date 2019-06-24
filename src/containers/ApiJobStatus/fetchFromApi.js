import fetchJSON from '../../utils/fetch';
import { isNil, toArray } from 'lodash-es';

export const fetchNodeMetadata = async ({ url }) => {
  const { job_statuses_dict: meta } = await fetchJSON({ url });
  const jobStatusMetaData = Array.isArray(toArray(meta))
    ? toArray(meta)
      .map(({ label, id: status, ...rest }, i) => ({
        sort_order: i, // add a sort order if it doesn't exist
        color: 'gray',
        ...rest, // but default to a specified sort order
        status,
        label,
      }))
      .sort((a, b) => (a.sort_order - b.sort_order))
    : [];

  return { groupMetadataArray: jobStatusMetaData };
};

export const fetchNodes = async ({ url }) => {
 const { jobs } = await fetchJSON({ url });
  if (!jobs) {
    return [];
  }

   // first row is header names
  const keys = jobs.shift();
  // key remaining rows by header names
  const nodes = jobs.map((values) => {
    return values.reduce((acc, val, i) => {
      return { ...acc, [keys[i]]: val };
    }, {});
  });

  return { nodes };
};

export const fetchTitle = async ({ url, job_id }) => {
  // no job_id
  if (isNil(job_id)) { return 'No job id specified.'; }

  const { workflow_dcts } = await fetchJSON({ url });
  if (isNil(workflow_dcts)) { return 'No workflow metadata specified.'; }

  const jobMetadata = workflow_dcts.find((job) => (job.dag_id === job_id));

  // job_id not in metadata
  if (!jobMetadata) { return 'Job id not found'; }

  const workflowName = jobMetadata.workflow_args || 'unnamed workflow';
  const workflowUser = jobMetadata.user || 'unknown user';

  return `Status of ${workflowName} initiated by ${workflowUser}`;
};

