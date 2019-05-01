import React from 'react';
import { storiesOf } from '@storybook/react';
import { BaseSquare, SpinningSquare, ResponsiveSpinningSquare } from './Canvas';
import JobStatus from '../containers/JobStatus/JobStatus';

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

storiesOf('<JobStatus>', module)
  .add('...with random data',
    () => (
      <div>
        <h2>Job Monitoring Prototype: separate components</h2>
        <h4>Divided into JobStatus and DotBarChart components</h4>
        <JobStatus/>
      </div>
    ));
