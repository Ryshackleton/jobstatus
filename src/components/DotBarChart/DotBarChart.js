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

export default function DotBarChart({
  bandPaddingInner = 0.1,
  bandPaddingOuter = 0.1,
  className,
  circleStrokeColor,
  circleStrokeWidth,
  colorAccessor,
  fontStrokeColor,
  fontStrokeWidth,
  groupPropName,
  groupKeys,
  groupLabels,
  isHangingBar = true,
  labelColorAccessor,
  labelFont = 'bold 1.1rem Arial',
  labelFontSecondary = '0.9rem Arial',
  nodes,
  margin = { top: 60, right: 20, bottom: 10, left: 20 },
  radiusToPaddingRatio = 0.8,
  uniqueIdPropName,
  wrapperStyle,
}) {
  // force pixel ratio to be 2 so we can map x/y back to color for tooltip
  const canvasPixelRatio = 2;

  const [sizeRef, width, height] = useResizeObserver();

  const [state, dispatch] = useReducer(stateReducer, {
    nodeCount: 0,
    radiusWithPadding: 1,
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
      radiusWithPadding,
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
        radiusWithPadding,
        radiusAccessor,
        xAccessor,
        xScale,
        yAccessor,
        },
    });
  }, [width, height, groupKeys, isHangingBar, state.nodeCount]);

  // index the nodes by group, which lets the layout place each node in a particular order
  const {
    colorToNode, // unique mapping of rgb() -> unique node
    nodes: indexed,
    groupCounts,
    groupIndexPropName,
    nodeIdToColor,
  } = computeIndexedNodes({
    groupPropName,
    groupKeys,
    nodes,
    uniqueIdPropName,
  });

  // build a draw function that renders every node as a unique color
  const eventCanvasDrawFunction = dotBarDrawFunction({
    nodes: indexed,
    // access the color that maps to a node
    colorAccessor: (node) => (nodeIdToColor[node[uniqueIdPropName]] || ''),
    radiusAccessor: () => (state.radiusWithPadding),
    strokeColor: 'transparent',
    strokeWidth: 0,
    xAccessor: state.xAccessor,
    yAccessor: state.yAccessor,
  });
  // render by calling the stateful layout functions
  const dotBarDraw = dotBarDrawFunction({
    nodes: indexed,
    colorAccessor,
    radiusAccessor: state.radiusAccessor,
    strokeColor: circleStrokeColor,
    strokeWidth: circleStrokeWidth,
    xAccessor: state.xAccessor,
    yAccessor: state.yAccessor,
  });
  // render labels (top label is user defined, bottom is "% (count)"
  const labelDraw = labelDrawFunction({
    colorAccessor: labelColorAccessor || colorAccessor,
    font: labelFont,
    fontSecondary: labelFontSecondary,
    fontStrokeColor,
    fontStrokeWidth,
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

  return <>
    <ResponsiveCanvas
      canvasPixelRatio={canvasPixelRatio}
      canvasDrawFunction={drawFunction}
      canvasStyle={{ background: 'transparent' }}
      /* un-comment the next two lines to display the event canvas instead of the actual canvas */
      /* canvasStyle={{ background: 'transparent', opacity: 0  }}
      eventCanvasStyle = {{ position: 'absolute', top: 0, left: 0, opacity: 1 }} */
      eventCanvasDrawFunction={eventCanvasDrawFunction}
      height={height}
      mousemove={mousemove}
      width={width}
      wrapperClassName={className}
      wrapperSizeRef={sizeRef}
      wrapperStyle={wrapperStyle}
    />
    </>;
};
