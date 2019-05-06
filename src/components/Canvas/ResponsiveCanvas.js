import React from 'react';
import Canvas2d from './Canvas2d';

export default function ResponsiveCanvas({
  click,
  canvasPixelRatio = 2,
  canvasStyle = {},
  canvasDrawFunction = () => {},
  eventCanvasDrawFunction,
  eventCanvasStyle = { position: 'absolute', top: 0, left: 0, opacity: 0 },
  height,
  mousemove,
  mousedown,
  mouseup,
  touchend,
  touchmove,
  touchstart,
  width,
  wrapperClassName = 'canvasWrapper',
  wrapperSizeRef,
  wrapperStyle = {},
}) {
  const touchCanvas = eventCanvasDrawFunction
    ? <Canvas2d
      canvasPixelRatio={canvasPixelRatio}
      width={width}
      height={height}
      drawFunction={eventCanvasDrawFunction}
      style={{ ...canvasStyle, ...eventCanvasStyle }}
      touchstart={touchstart}
      touchmove={touchmove}
      touchend={touchend}
      mousemove={mousemove}
      mousedown={mousedown}
      mouseup={mouseup}
      click={click}
    />
    : '';
  const touchStyles = eventCanvasDrawFunction
    ? { pointerEvents: 'none' }
    : {};
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
    {touchCanvas}
    <Canvas2d
      canvasPixelRatio={canvasPixelRatio}
      width={width}
      height={height}
      drawFunction={canvasDrawFunction}
      style={{ ...canvasStyle, ...touchStyles }}
    />
  </div>;
};
