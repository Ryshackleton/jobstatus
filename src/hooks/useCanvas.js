import { useRef, useEffect } from "react";

export default function useCanvas(draw, ratio = 1) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    function renderFrame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(ratio, ratio);
      draw(ctx);
      ctx.restore();
    }
    const animationFrameId = requestAnimationFrame(renderFrame);

    return () => cancelAnimationFrame(animationFrameId);
  }, [draw]);

  return canvasRef;
}

