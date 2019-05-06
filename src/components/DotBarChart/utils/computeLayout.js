import { scaleBand, scaleLinear } from 'd3-scale';

const optRadius = ({ bandwidth, height, margin, maxNodesPerBar }) => {
  // how much area do we have per bar
  const totalBarArea = bandwidth * (height - margin.top - margin.bottom);
  const areaPerSquare = totalBarArea / maxNodesPerBar;
  // radius will be half the side of the square
  return Math.sqrt(areaPerSquare) * 0.5;
};

export default ({
  bandPaddingInner = 0.5,
  bandPaddingOuter = 0.7,
  isHangingBar = true,
  groupIndexPropName = 'groupIndex',
  groupPropName,
  groupKeys,
  height,
  margin = { top: 10, right: 10, bottom: 10, left: 10 },
  nodeCount,
  radiusToPaddingRatio = 0.9,
  width,
}) => {
  // determine x scale based on the width and number of groups
  const xScale = scaleBand()
    .domain(groupKeys)
    .range([margin.left, width - margin.right])
    .paddingInner([bandPaddingInner])
    .paddingOuter([bandPaddingOuter]);

  // optimum radius and radius padding, given the amount of space we have
  const radiusWithPadding = optRadius({
    bandwidth: xScale.bandwidth(),
    height,
    maxNodesPerBar: nodeCount,
    margin,
    width,
  });
  // divide radius and padding up according to user defined ratio
  const radius = radiusWithPadding * radiusToPaddingRatio;

  // constants to compute the x and y positions from a node indexed by group
  const diameter = radiusWithPadding * 2;
  const outerSpace = xScale.step() * xScale.paddingOuter();
  const nNodesPerRow = Math.ceil(xScale.bandwidth() / diameter);

  const xAccessor = (node) => {
    const xOff = (Math.floor(node[groupIndexPropName] % nNodesPerRow) * diameter) + radiusWithPadding - outerSpace;
    return xScale(node[groupPropName])+ xOff;
  };

  const yRange = [height - margin.bottom, margin.top];
  const yScale = scaleLinear()
    .domain([0, height])
    .range(isHangingBar ? yRange.reverse() : yRange);

  const yAccessor = (node) => {
    const rowN = Math.ceil((node[groupIndexPropName] + 1) / nNodesPerRow);
    return yScale(rowN * diameter);
  };

  const radiusAccessor = () => (radius);

  return {
    radiusWithPadding,
    radiusAccessor,
    xAccessor,
    xScale,
    yAccessor,
  };
};
