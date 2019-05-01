import React, { useReducer } from 'react';
import useResizeObserver from 'use-resize-observer';
import useInterval from '../../hooks/useInterval';
import Canvas2d from '../../components/Canvas/Canvas2d';
import ResponsiveCanvas from '../../components/Canvas/ResponsiveCanvas';
import { drawSquareAtAngle, rotateReducer } from '../utils/utils';

export const BaseSquare = ({
  angle = 0,
  width = 500,
  height = 500,
}) => (<Canvas2d
    width={width}
    height={height}
    drawFunction={(ctx) => drawSquareAtAngle(ctx, { width, height, angle })}
  />);

export const SpinningSquare = ({
  width = 700,
  height = 700,
}) => {
  const [state, dispatch] = useReducer(rotateReducer, { angle: 0 });

  useInterval(() => { dispatch({ type: 'ROTATE', rotation: 0.5 }); }, 10);

  return <Canvas2d
    width={width}
    height={height}
    drawFunction={(ctx) => drawSquareAtAngle(ctx, { angle: state.angle, width, height })}
  />;
};

export const ResponsiveSpinningSquare = () => {
  const [sizeRef, width, height] = useResizeObserver();
  const [state, dispatch] = useReducer(rotateReducer, { angle: 0 });

  useInterval(() => { dispatch({ type: 'ROTATE', rotation: 0.5 }); }, 10);

  return <div style={{
    position: 'absolute',
    width: 700,
    height: 700,
    resize: 'both',
    overflow: 'auto',
    border: '1px solid black',
  }}>
    <ResponsiveCanvas
      canvasPixelRatio={2}
      canvasStyle={{ /* could add canvas styles, but usually leave this alone */ }}
      canvasDrawFunction={(ctx) => drawSquareAtAngle(ctx, { angle: state.angle, width, height })}
      width={width}
      height={height}
      wrapperClassName="spinningResponsiveCanvas"
      wrapperSizeRef={sizeRef}
      wrapperStyle={{ /* could add wrapper styles here, avoid width/height/position! */}}
    />
  </div>
};

