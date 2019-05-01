
export const drawSquareAtAngle = (ctx, { width, height, angle }) => {
  const shorter = Math.min(width, height);
  ctx.save();
  ctx.beginPath();
  ctx.translate(width / 2, height / 2 );
  ctx.rotate(angle * Math.PI / 180);
  ctx.fillStyle = '#4397AC';
  ctx.fillRect(-shorter / 4, -shorter / 4, shorter / 2, shorter / 2);
  ctx.restore();
};

export const rotateReducer = (state, action) => {
  switch(action.type) {
    case 'ROTATE':
      return { ...state, angle: state.angle + (action.rotation || 1) };
    default:
      throw new Error('Invalid action type in rotateReducer');
  }
};

