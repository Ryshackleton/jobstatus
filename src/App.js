import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ApiJobStatus from './containers/ApiJobStatus/ApiJobStatus';
import DemoWorkflowStatus from './containers/DemoWorkflowStatus/DemoWorkflowStatus';

export default function App({
  baseUrl = process.env.REACT_APP_API_BASE_URL,
  port = process.env.REACT_APP_API_PORT,
  routeName = process.env.REACT_APP_API_JOB_STATUS_ROUTE_NAME
}) {
  return (
    <Router>
      <Switch>
        {/*/jobstatus/demo/ routes below are for public github hosting */}
        {['/jobstatus/demo/:nNodes', '/jobstatus/demo', '/demo/:nNodes'].map((path) => (
          <Route
            key="demo"
            exact path={path}
            render={(matchProps) => (
              <DemoWorkflowStatus
                {...matchProps} // contains params.match.nNodes
                className="App"
              />
            )}
          />
        ))}
        {[`/${routeName}/:job_id`, ''].map((path, i) => (
          <Route
            key={i}
            exact path={path}
            render={(matchProps) => (
              <ApiJobStatus
                { ...matchProps } // contains params.match.job_id
                className="App"
                baseUrl={baseUrl}
                port={port}
              />
            )}
          />
        ))}
      </Switch>
    </Router>
  );
}
