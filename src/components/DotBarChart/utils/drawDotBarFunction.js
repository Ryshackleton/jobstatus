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
  strokeColorAccessor = () => ('#aaa'),
  strokeWidth = '2',
  strokeLineJoin = 'round',
  xAccessor,
  yAccessor,
}) => {
  return (ctx) => {
    forEach(nodes, (d, i) => {
      const path2 = new Path2D(circlePath(xAccessor(d), yAccessor(d), radiusAccessor(d)));

      // Node outline
      ctx.strokeStyle = strokeColorAccessor(d);
      ctx.lineWidth = strokeWidth;
      ctx.lineJoin = strokeLineJoin;
      ctx.stroke(path2);

      // Node fill
      ctx.fillStyle = colorAccessor(d);
      ctx.fill(path2);
    });
  };
}
