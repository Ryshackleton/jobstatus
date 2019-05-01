import React from 'react';
import Canvas2d from './Canvas2d';

export default ({
  canvasPixelRatio = 2,
  canvasStyle = {},
  canvasDrawFunction = () => {},
  height,
  width,
  wrapperClassName = 'canvasWrapper',
  wrapperSizeRef,
  wrapperStyle = {},
}) => {
  return <div
    className={wrapperClassName}
    ref={wrapperSizeRef}
    style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      ...wrapperStyle,
    }}
  >
    <Canvas2d
      canvasPixelRatio={canvasPixelRatio}
      width={width}
      height={height}
      drawFunction={canvasDrawFunction}
      style={canvasStyle}
    />
  </div>;
};
