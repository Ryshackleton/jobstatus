import { forEach } from 'lodash-es';

// modified from flubber's src: https://github.com/veltman/flubber/blob/master/src/shape.js
function circlePath(x, y, radius) {
  /* eslint-disable prefer-template */
  const l = x - radius + ',' + y;
  const r = x + radius + ',' + y;
  const pre = 'A' + radius + ',' + radius + ',0,1,1,';

  return 'M' + l + pre + r + pre + l + 'Z';
  /* eslint-enable prefer-template */
}

export default ({
  nodes,
  colorAccessor,
  radiusAccessor,
  strokeColor = '#aaa',
  strokeWidth = '2',
  strokeLineJoin = 'round',
  xAccessor,
  yAccessor,
}) => {
  return (ctx) => {
    forEach(nodes, (d) => {
      const r = radiusAccessor(d);
      const x = xAccessor(d);
      const y = yAccessor(d);

      const path2 = new Path2D(circlePath(x, y, r));

      // Node outline
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineJoin = strokeLineJoin;
      ctx.stroke(path2);

      // Node fill
      ctx.fillStyle = colorAccessor(d);
      ctx.fill(path2);
    });
  };
}
