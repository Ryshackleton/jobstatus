import React from 'react';

export default function Tooltip({
  borderWidth,
  opacity,
  content,
  contentWidth,
  left,
  font,
  padding,
  top,
}) {
  return <div
    className={'tooltipWrapper'}
    style={{
      position: 'absolute',
      opacity,
      top: `${top}px`,
      left: `${left}px`,
    }}
  >
    <span
      className={'tooltipArrow'}
      style={{
        content: "",
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        borderWidth: `-${borderWidth}px`,
        borderStyle: 'solid',
        borderColor: 'transparent transparent #999 transparent',
      }}
    />
    <span
      className={'tooltipContent'}
      style={{
        position: 'absolute',
        padding: `${padding}px`,
        width: `${contentWidth}px`,
        top: '100%',
        left: '50%',
        marginLeft: `-${contentWidth / 2}px`, /* center the tooltip */
        font: font,
        color: '#000',
        backgroundColor: '#fff',
        border: '2px solid #999',
        borderRadius: '5px',
        pointerEvents: 'none',
        opacity: 1,
        zIndex: 1,
      }}
    >
      {content}
    </span>
  </div>;
}
