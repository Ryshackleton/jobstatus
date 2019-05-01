
export default ({
  colorAccessor,
  font = '30px Arial',
  fontSecondary = '20px Arial',
  fontStrokeStyle = '#aaa',
  fontOutlineWidth = 0.25,
  groupCounts,
  groupKeys,
  labels,
  xAccessor,
  yAccessor,
  numberOffset = 20,
}) => {
  return (ctx) => {

    let counts = [];
    let total = 0;
    if (groupCounts) {
      counts = Object.values(groupCounts);
      total = counts.reduce((sum, count) => (sum + count), 0);
    }
    if (groupKeys.length !== labels.length) {
      return;
    }
    groupKeys.forEach(function(group, i) {
      const x = xAccessor(group);
      const y = yAccessor(group);
      const color = colorAccessor(group);

      ctx.font = font;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labels[i], x, y);
      ctx.lineWidth = fontOutlineWidth;
      ctx.strokeStyle = fontStrokeStyle;
      ctx.strokeText(labels[i], x, y);

      if (counts.length === labels.length) {
        const percent = counts[i] / total * 100;
        const percentPrecise = percent < 1 ? percent.toPrecision(1) : Math.round(percent);
        const progressLabel = `${percentPrecise}% (${counts[i]})`;
        ctx.font = fontSecondary;
        ctx.fillText(progressLabel, x, y + numberOffset);
        ctx.strokeText(progressLabel, x, y + numberOffset);
      }
    });
  };
}
