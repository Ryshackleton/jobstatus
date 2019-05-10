import React, { useEffect, useReducer } from 'react';
import { omit, map, reduce } from 'lodash-es';
import useResizeObserver from "use-resize-observer";
import ResponsiveCanvas from '../../components/Canvas/ResponsiveCanvas';
import Tooltip from '../../components/Tooltip/Tooltip';
import computeIndexedNodes from './utils/computeIndexedNodes';
import computeLayout from './utils/computeLayout';
import dotBarDrawFunction from './utils/drawDotBarFunction';
import labelDrawFunction from './utils/drawLabelsFunction';

export const stateReducer = (state, action) => {
  switch(action.type) {
    case 'SET_TOOLTIP_CONTENT':
      return { ...state, ...action.payload };
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
  circleStrokeColor = '#aaa',
  circleStrokeWidth,
  colorAccessor,
  canvasStyle = { background: 'transparent' },
  eventCanvasStyle,
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
  const tooltipPadding = 3; // px

  const [sizeRef, width, height] = useResizeObserver();

  const [state, dispatch] = useReducer(stateReducer, {
    isRendering: false,
    nodeCount: 0,
    tooltipContent: '',
    tooltipContentWidth: 0,
    tooltipOffset: [0, 0],
    radiusWithPadding: 1,
    radiusAccessor: () => (1),
    xAccessor: () => (0),
    xScale: () => (0),
    yAccessor: () => (0),
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
    strokeColorAccessor: (node) => (nodeIdToColor[node[uniqueIdPropName]] || ''),
    strokeWidth: 0,
    xAccessor: state.xAccessor,
    yAccessor: state.yAccessor,
  });

  // detect mouse movements and update the tooltip content
  const mousemove = (e) => {
    const event = e;

    const hiddenCtx = event.target.getContext('2d');
    const rgb = hiddenCtx.getImageData(
      event.nativeEvent.offsetX * canvasPixelRatio,
      event.nativeEvent.offsetY * canvasPixelRatio,
      1,
      1).data;

    // find the node associated with the unique color
    const node = colorToNode[`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`];

    if (node){
      const renderProps = omit(node, [groupIndexPropName]);

      // find the longest text width
      const tooltipContentWidth = reduce(renderProps, (maxWidth, value, key) => {
        // measure content width
        hiddenCtx.font = labelFontSecondary;
        const width = hiddenCtx.measureText(`${value}: ${key}`).width;
        return width > maxWidth
          ? width + (2 * tooltipPadding)
          : maxWidth;
      }, 0);

      dispatch({
        type: 'SET_TOOLTIP_CONTENT',
        payload: {
          tooltipContent: map(
            renderProps,
            (value, key) => (<p style={{ margin: '2px', textAlign: 'center' }} key={key}>{key}: {value}</p>)
          ),
          tooltipContentWidth,
          tooltipOffset: [event.pageX, event.pageY],
        }
      });
    } else {
      dispatch({
        type: 'SET_TOOLTIP_CONTENT',
        payload: {
          tooltipContent: '',
          tooltipContentWidth: 0,
          tooltipOffset: state.tooltipContent,
        }
      });
    }
  };

  // render by calling the stateful layout functions
  const dotBarDraw = dotBarDrawFunction({
    nodes: indexed,
    colorAccessor,
    radiusAccessor: state.radiusAccessor,
    strokeColorAccessor: () => (circleStrokeColor),
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
      canvasStyle={canvasStyle}
      eventCanvasStyle={eventCanvasStyle}
      eventCanvasDrawFunction={eventCanvasDrawFunction}
      height={height}
      mousemove={mousemove}
      width={width}
      wrapperClassName={className}
      wrapperSizeRef={sizeRef}
      wrapperStyle={wrapperStyle}
    />
    <Tooltip
      borderWidth={state.radiusWithPadding}
      content={state.tooltipContent}
      opacity={state.tooltipContent === '' ? 0 : 0.85}
      contentWidth={state.tooltipContentWidth}
      left={state.tooltipOffset[0]}
      font={labelFontSecondary}
      padding={tooltipPadding}
      top={state.tooltipOffset[1]}
    />
    </>;
};
