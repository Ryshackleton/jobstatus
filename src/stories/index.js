import React from 'react';
import { storiesOf } from '@storybook/react';
import { BaseSquare, SpinningSquare, ResponsiveSpinningSquare } from './Canvas';
import JobStatus from '../containers/JobStatus/JobStatus';
import { getDemoMetaDataAndNodes } from '../containers/JobStatus/demoDataGenerator';

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

const metaDataWhiteOutlined = `group_id,label,sort_order,color
G,REGISTERED,1,#fff
Q,QUEUED,2,#fff
I,INSTANTIATED,3,#fff
R,RUNNING,4,#fff
E,RECOVERABLE,5,#fff
F,FATAL,6,#fff
D,DONE,7,#fff`;

const metaDataGrayscaleDoneInWhite = `group_id,label,sort_order,color
G,REGISTERED,1,#bdbdbd
Q,QUEUED,2,#969696
I,INSTANTIATED,3,#737373
R,RUNNING,4,#f7f7f7
E,RECOVERABLE,5,#525252
F,FATAL,6,#252525
D,DONE,7,#fff`;

const metaDataGrayscaleDoneInColor = `group_id,label,sort_order,color
G,REGISTERED,1,#bdbdbd
Q,QUEUED,2,#969696
I,INSTANTIATED,3,#737373
R,RUNNING,4,#F0C808
E,RECOVERABLE,5,#525252
F,FATAL,6,#252525
D,DONE,7,#59A96A`;

const metaDataGrayscaleHighlightRDE = `group_id,label,sort_order,color
G,REGISTERED,1,#bdbdbd
Q,QUEUED,2,#bdbdbd
I,INSTANTIATED,3,#bdbdbd
R,RUNNING,4,#F0C808
E,RECOVERABLE,5,#F1948A
F,FATAL,6,#E74C3C
D,DONE,7,#59A96A`;

const groupPropName = 'group_id';
storiesOf('JobStatus', module)
  .add('...white circles',
    () => {
      const nodesMetadataPromise = getDemoMetaDataAndNodes.bind(null, {
        metadataCsv: metaDataWhiteOutlined,
        nNodes: 1000,
        groupPropName,
      });
      return <div>
        <h2>Job Monitoring Prototype: separate components</h2>
        <h4>Divided into JobStatus and DotBarChart components</h4>
        <JobStatus
          circleStrokeColor={'#aaa'}
          circleStrokeWidth={2.5}
          colorPropName="color"
          fontStrokeColor={'#737373'}
          fontStrokeWidth={0.1}
          groupPropName={groupPropName}
          labelColorAccessor={() => ('#737373')}
          labelPropName="label"
          nodesMetadataPromise={nodesMetadataPromise}
          uniqueIdPropName="unique_id"
          wrapperStyle={{ height: '80%', width: '90%' }}
        />
      </div>
    })
  .add('...grayscale: done in white',
    () => {
      const nodesMetadataPromise = getDemoMetaDataAndNodes.bind(null, {
        metadataCsv: metaDataGrayscaleDoneInWhite,
        nNodes: 1000,
        groupPropName,
      });
      return <div>
        <h2>Job Monitoring Prototype: separate components</h2>
        <h4>Divided into JobStatus and DotBarChart components</h4>
        <JobStatus
          circleStrokeColor={'#aaa'}
          circleStrokeWidth={1}
          colorPropName="color"
          fontStrokeColor={'#aaa'}
          fontStrokeWidth={0.75}
          groupPropName={groupPropName}
          labelPropName="label"
          nodesMetadataPromise={nodesMetadataPromise}
          uniqueIdPropName="unique_id"
          wrapperStyle={{ height: '80%', width: '90%' }}
        />
      </div>
    })
  .add('...grayscale: running and done in color',
    () => {
      const nodesMetadataPromise = getDemoMetaDataAndNodes.bind(null, {
        metadataCsv: metaDataGrayscaleDoneInColor,
        nNodes: 1000,
        groupPropName,
      });
      return <div>
        <h2>Job Monitoring Prototype: separate components</h2>
        <h4>Divided into JobStatus and DotBarChart components</h4>
        <JobStatus
          circleStrokeColor={'#aaa'}
          circleStrokeWidth={0.25}
          colorPropName="color"
          fontStrokeColor={'#aaa'}
          fontStrokeWidth={0.25}
          groupPropName={groupPropName}
          labelPropName="label"
          nodesMetadataPromise={nodesMetadataPromise}
          uniqueIdPropName="unique_id"
          wrapperStyle={{ height: '80%', width: '90%' }}
        />
      </div>
    })
  .add('...grayscale: highlight running, done, error in color',
    () => {
      const nodesMetadataPromise = getDemoMetaDataAndNodes.bind(null, {
        metadataCsv: metaDataGrayscaleHighlightRDE,
        nNodes: 1000,
        groupPropName,
      });
      return <div>
        <h2>Job Monitoring Prototype: separate components</h2>
        <h4>Divided into JobStatus and DotBarChart components</h4>
        <JobStatus
          circleStrokeColor={'#aaa'}
          circleStrokeWidth={0.25}
          colorPropName="color"
          fontStrokeColor={'#aaa'}
          fontStrokeWidth={0.25}
          groupPropName={groupPropName}
          labelPropName="label"
          nodesMetadataPromise={nodesMetadataPromise}
          uniqueIdPropName="unique_id"
          wrapperStyle={{ height: '80%', width: '90%' }}
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
      const nodesMetadataPromise = getDemoMetaDataAndNodes.bind(null, {
        nNodes: 1000,
        groupPropName,
      });
      return <div>
        <h2>Job Monitoring Prototype: separate components</h2>
        <h4>Divided into JobStatus and DotBarChart components</h4>
        <JobStatus
          colorPropName="color"
          groupPropName={groupPropName}
          labelPropName="label"
          nodesMetadataPromise={nodesMetadataPromise}
          uniqueIdPropName="unique_id"
          wrapperStyle={{ height: '80%', width: '90%' }}
        />
      </div>
    })


