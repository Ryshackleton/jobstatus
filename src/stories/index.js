import { csvParse } from 'd3';
import React from 'react';
import { storiesOf } from '@storybook/react';
import { BaseSquare, SpinningSquare, ResponsiveSpinningSquare } from './Canvas';
import DemoWorkflowStatus from '../containers/DemoWorkflowStatus/DemoWorkflowStatus';
import JobStatusPoller from '../components/JobStatusPoller/JobStatusPoller';

storiesOf('Canvas', module)
  .add('Canvas Fixed', () => (
    <div>
      <h2>A 2d canvas that takes a drawFunction and internally resizes the canvas increase resolution</h2>
      <h3>With much help from <a href={"https://philna.sh/blog/2018/09/27/techniques-for-animating-on-the-canvas-in-react/"}>this article</a>
      </h3>
      <BaseSquare/>
    </div>
    ))
  .add('Canvas Spinning', () => (
    <div>
      <h2>A 2d canvas that takes a drawFunction and resizes the canvas to increase resolution</h2>
      <h3>Spinning canvas example from <a href={"https://codepen.io/philnash/pen/QVeOrd"}>this Pen</a></h3>
      <SpinningSquare/>
    </div>
  ))
  .add('Responsive Canvas Spinning', () => (
    <div>
      <h2>A responsive 2d canvas that takes a drawFunction and resizes the canvas to increase resolution</h2>
      <h3>Try Resizing the Canvas (or really the wrapper around the canvas div)</h3>
      <ResponsiveSpinningSquare/>
    </div>
  ));

const metaDataWhiteOutlined = csvParse(`group_id,label,sort_order,color
G,REGISTERED,1,#fff
Q,QUEUED,2,#fff
I,INSTANTIATED,3,#fff
R,RUNNING,4,#fff
E,RECOVERABLE,5,#fff
F,FATAL,6,#fff
D,DONE,7,#fff`);

const metaDataGrayscaleDoneInWhite = csvParse(`group_id,label,sort_order,color
G,REGISTERED,1,#bdbdbd
Q,QUEUED,2,#969696
I,INSTANTIATED,3,#737373
R,RUNNING,4,#f7f7f7
E,RECOVERABLE,5,#525252
F,FATAL,6,#252525
D,DONE,7,#fff`);

const metaDataGrayscaleDoneInColor = csvParse(`group_id,label,sort_order,color
G,REGISTERED,1,#bdbdbd
Q,QUEUED,2,#969696
I,INSTANTIATED,3,#737373
R,RUNNING,4,#F0C808
E,RECOVERABLE,5,#525252
F,FATAL,6,#252525
D,DONE,7,#59A96A`);

const metaDataGrayscaleHighlightRDE = csvParse(`group_id,label,sort_order,color
G,REGISTERED,1,#bdbdbd
Q,QUEUED,2,#bdbdbd
I,INSTANTIATED,3,#bdbdbd
R,RUNNING,4,#F0C808
E,RECOVERABLE,5,#F1948A
F,FATAL,6,#E74C3C
D,DONE,7,#59A96A`);

storiesOf('JobStatusPoller', module)
  .add('...showing mouse event canvas',
    () => {
      return <div>
        <h2>Job monitoring prototype</h2>
        <h4>Showing only the hidden mouse event canvas, which color each node, slightly differently to uniquely identify each node by pixel color.</h4>
        <DemoWorkflowStatus
          canvasStyle={{ background: 'transparent', opacity: 0  }}
          colorPropName="color"
          fontStrokeColor={'#737373'}
          fontStrokeWidth={0.1}
          groupMetadataArray={metaDataWhiteOutlined}
          eventCanvasStyle = {{ position: 'absolute', top: 0, left: 0, opacity: 1 }}
          labelColorAccessor={() => ('#737373')}
        />
      </div>
    })
  .add('...white circles',
    () => {
      return <div>
        <h2>Job Monitoring Prototype</h2>
        <h4>No color.</h4>
        <DemoWorkflowStatus
          circleStrokeColor={'#aaa'}
          circleStrokeWidth={2.5}
          fontStrokeColor={'#737373'}
          fontStrokeWidth={0.1}
          groupMetadataArray={metaDataWhiteOutlined}
          labelColorAccessor={() => ('#737373')}
        />
      </div>
    })
  .add('...grayscale: done in white',
    () => {
      return <div>
        <h2>Job Monitoring Prototype</h2>
        <h4>Grayscale.</h4>
        <DemoWorkflowStatus
          circleStrokeColor={'#aaa'}
          circleStrokeWidth={1}
          fontStrokeColor={'#aaa'}
          fontStrokeWidth={0.75}
          groupMetadataArray={metaDataGrayscaleDoneInWhite}
        />
      </div>
    })
  .add('...grayscale: running and done in color',
    () => {
      return <div>
        <h2>Job Monitoring Prototype</h2>
        <h4>Grayscale + two colors.</h4>
        <DemoWorkflowStatus
          circleStrokeColor={'#aaa'}
          circleStrokeWidth={0.25}
          fontStrokeColor={'#aaa'}
          fontStrokeWidth={0.25}
          groupMetadataArray={metaDataGrayscaleDoneInColor}
        />
      </div>
    })
  .add('...grayscale: highlight running, done, error in color',
    () => {
      return <div>
        <h2>Job Monitoring Prototype</h2>
        <h4>Grayscale + 4 colors</h4>
        <DemoWorkflowStatus
          circleStrokeColor={'#aaa'}
          circleStrokeWidth={0.25}
          fontStrokeColor={'#aaa'}
          fontStrokeWidth={0.25}
          groupMetadataArray={metaDataGrayscaleHighlightRDE}
        />
      </div>
    })
  .add('...fully colored',
    () => {
      /** nodesMetadataPromise should resolve to an object with properties:
       * {
       *  groupMetadataArray - array of objects with properties colorPropName, groupPropName, and labelPropName
       *  nodes - array of objects with colorPropName, groupPropName and (optional) uniqueIdPropName
       * }
       */
      return <div>
        <h2>Job Monitoring Prototype</h2>
        <h4>Fully colored</h4>
        <DemoWorkflowStatus />
      </div>
    })


