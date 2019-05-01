import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import JobStatus from './containers/JobStatus/JobStatus';

const JobStatusDemoWithNNodes = ({ match }) => {
  const nNodes = match.params.nNodes ? Number(match.params.nNodes) : 1000;
  return <div className="App">
    <h2 className="Job-status-title">Job Status Monitor for {nNodes} nodes</h2>
    <div className="Job-status-graph-container">
      <JobStatus
        className="Job-status-graph"
        labelFont="700 1.1rem Nunito"
        labelFontSecondary = "700 0.9rem Nunito"
        margin={{ top: 60, right: 20, bottom: 20, left: 20 }}
        nNodes={nNodes}
        pollingInterval={500}
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
