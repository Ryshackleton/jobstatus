import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import JobStatus from './containers/JobStatus/JobStatus';
import { getDemoMetaDataAndNodes } from './containers/JobStatus/demoDataGenerator';


const JobStatusDemoWithNNodes = ({ match }) => {
  const nNodes = match.params.nNodes ? Number(match.params.nNodes) : 1000;
  const groupPropName = 'group_id';
  /** nodesMetadataPromise should resolve to an object with properties:
   * {
   *  groupMetadataArray - array of objects with properties colorPropName, groupPropName, and labelPropName
   *  nodes - array of objects with colorPropName, groupPropName and (optional) uniqueIdPropName
   * }
  */
  const nodesMetadataPromise = getDemoMetaDataAndNodes.bind(null, { nNodes, groupPropName });

  return <div className="App">
    <h2 className="Job-status-title">Job Status Monitor for {nNodes} nodes</h2>
    <div className="Job-status-graph-container">
      <JobStatus
        colorPropName="color"
        className="Job-status-graph"
        groupPropName={groupPropName}
        labelFont="700 1.1rem Nunito"
        labelFontSecondary = "700 0.9rem Nunito"
        labelPropName="label"
        margin={{ top: 60, right: 20, bottom: 20, left: 20 }}
        nodesMetadataPromise={nodesMetadataPromise}
        pollingInterval={500}
        uniqueIdPropName="demoDataGeneratorId"
        wrapperStyle={{ height: '80%', width: '80%' }}
      />
    </div>
  </div>;
};

export default function App() {
  return (
    <Router>
      <Switch>
        {["/jobstatus/:nNodes", "/jobstatus", "/:nNodes", ""].map((path, i) => (
          <Route
            key={i}
            exact path={path}
            component={JobStatusDemoWithNNodes}
          />
        ))}
      </Switch>
    </Router>
  );
}
