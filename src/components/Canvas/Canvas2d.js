import React from 'react';
import  useCanvas from '../../hooks/useCanvas';

export default ({
  drawFunction = () => {},
  height = 500,
  width = 500,
  canvasPixelRatio = 2,
  style = {},
}) => {
  const canvasRef = useCanvas(drawFunction, canvasPixelRatio);
  const sizeInPixels = { width: `${width}px`, height: `${height}px` };
  return <canvas
    width={width * canvasPixelRatio}
    height={height * canvasPixelRatio}
    style={{ ...sizeInPixels, ...style }}
    ref={canvasRef}
  />;
}

