import React from 'react';
import  useCanvas from '../../hooks/useCanvas';

export default function Canvas2d({
  click,
  drawFunction = () => {},
  height = 500,
  width = 500,
  canvasPixelRatio = 2,
  mousedown,
  mousemove,
  mouseup,
  style = {},
  touchend,
  touchmove,
  touchstart,
}) {
  const canvasRef = useCanvas(drawFunction, canvasPixelRatio);
  const sizeInPixels = { width: `${width}px`, height: `${height}px` };
  return <canvas
    width={width * canvasPixelRatio}
    height={height * canvasPixelRatio}
    style={{ ...sizeInPixels, ...style }}
    ref={canvasRef}
    onTouchStart={touchstart}
    onTouchMove={touchmove}
    onTouchEnd={touchend}
    onMouseMove={mousemove}
    onMouseDown={mousedown}
    onMouseUp={mouseup}
    onClick={click}
  />;
}

