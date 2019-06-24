# Job Status Monitor

A demo app to monitor the state of multiple "jobs" or other entities using a bar chart composed of circles.

Uses React and canvas rendering to scale to thousands of nodes.

[Live demo](https://ryshackleton.github.io/jobstatus/demo/2000)

The numeric URL parameter governs the number of nodes to render: `/demo/:numberOfNodes`

[React storybook](https://ryshackleton.github.io/jobstatus/storybook) showing the components in this demo

### Available Scripts

### `npm run start:[ENVIRONMENT_NAME]`

The default script

`npm run start:dev`

runs the app in the development mode, using parameters from `/node/.env.dev`<br>

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build:dev`

To build the application without starting the server.

### Custom environments 

To create different `ENVIRONMENT`s that use different API endpoints, create an `.env.[ENVIRONMENT_NAME]` file in `/node_env/` with the following environment variables:

```bash
REACT_APP_API_BASE_URL=http://my-api-endpoint.com
REACT_APP_API_PORT=10001
REACT_APP_API_JOB_STATUS_ROUTE_NAME=status
```

and start the server using.

`REACT_APP_ENV=[ENVIRONMENT_NAME] npm run start`

Similarly, you can use

`REACT_APP_ENV=[ENVIRONMENT_NAME] npm run build`

to just build the application.

### `npm run storybook`

Runs a [React Storybook](https://storybook.js.org/) to display and debug different components in this application.

### Other scripts

See [Create React App ReadMe](CreateReactAppReadMe.md) for all other available scripts.
