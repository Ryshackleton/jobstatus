import React, { useEffect, useReducer } from 'react';
import useResizeObserver from "use-resize-observer";
import ResponsiveCanvas from '../../components/Canvas/ResponsiveCanvas';
import computeIndexedNodes from './utils/computeIndexedNodes';
import computeLayout from './utils/computeLayout';
import dotBarDrawFunction from './utils/drawDotBarFunction';
import labelDrawFunction from './utils/drawLabelsFunction';

export const stateReducer = (state, action) => {
  switch(action.type) {
    case 'SET_LAYOUT':
      return { ...state, ...action.payload };
    case 'START_RENDER':
      return { ...state, isRendering: true };
    case 'FINISH_RENDER':
      return { ...state, isRendering: false };
    default:
      throw new Error('Invalid action type in progressReducer');
  }
};

export default ({
  bandPaddingInner = 0.1,
  bandPaddingOuter = 0.1,
  className,
  colorAccessor,
  groupPropName,
  groupKeys,
  groupLabels,
  isHangingBar = true,
  labelFont = 'bold 1.1rem Arial',
  labelFontSecondary = '0.9rem Arial',
  nodes,
  margin = { top: 60, right: 20, bottom: 10, left: 20 },
  radiusToPaddingRatio = 0.8,
  uniqueIdPropName,
  wrapperStyle,
}) => {
  const [sizeRef, width, height] = useResizeObserver();

  const [state, dispatch] = useReducer(stateReducer, {
    nodeCount: 0,
    radiusAccessor: () => (1),
    xAccessor: () => (0),
    xScale: () => (0),
    yAccessor: () => (0),
    isRendering: false,
  });

  // rebuild the layout when the dimensions, chart direction, or number of group keys changes
  useEffect(() => {
    // compute the layout
    const {
      radiusAccessor,
      xAccessor,
      xScale,
      yAccessor,
    } = computeLayout({
      bandPaddingInner,
      bandPaddingOuter,
      isHangingBar,
      groupIndexPropName,
      groupKeys,
      groupPropName,
      margin,
      nodeCount: nodes.length,
      width,
      height,
      radiusToPaddingRatio,
    });

    // store the layout functions as state
    dispatch({
      type: 'SET_LAYOUT',
      payload: {
        nodeCount: nodes.length,
        radiusAccessor,
        xAccessor,
        xScale,
        yAccessor,
        },
    });
  }, [width, height, groupKeys, isHangingBar, state.nodeCount]);

  // index the nodes by group, which lets the layout place each node in a particular order
  const { nodes: indexed, groupCounts, groupIndexPropName } = computeIndexedNodes({
    groupPropName,
    groupKeys,
    nodes,
    uniqueIdPropName,
  });

  // render by calling the stateful layout functions
  const dotBarDraw = dotBarDrawFunction({
    nodes: indexed,
    colorAccessor,
    radiusAccessor: state.radiusAccessor,
    xAccessor: state.xAccessor,
    yAccessor: state.yAccessor,
  });
  // render labels (top label is user defined, bottom is "% (count)"
  const labelDraw = labelDrawFunction({
    colorAccessor,
    font: labelFont,
    fontSecondary: labelFontSecondary,
    groupCounts,
    groupKeys,
    labels: groupLabels,
    xAccessor: (group) => (
      state.xScale(group) // start at left edge of bar
      - state.xScale.step() * state.xScale.paddingOuter() // offset the outer left padding
      + state.xScale.bandwidth() / 2 // add the half bandwidth to center the text
    ),
    yAccessor: () => (margin.top / 3),
    numberOffset: margin.top / 3 + 5,
  });
  const drawFunction = (ctx) => {
    dispatch({ type: 'START_RENDER' });
    dotBarDraw(ctx);
    labelDraw(ctx);
    dispatch({ type: 'FINISH_RENDER' });
  };

  return <ResponsiveCanvas
    canvasDrawFunction={drawFunction}
    canvasStyle={{ background: '#fff' }}
    width={width}
    height={height}
    wrapperClassName={className}
    wrapperSizeRef={sizeRef}
    wrapperStyle={wrapperStyle}
  />;
};
