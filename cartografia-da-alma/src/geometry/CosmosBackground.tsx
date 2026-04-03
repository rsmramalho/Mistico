import { useGeometry } from '../hooks/useGeometry';
import { useCallback } from 'react';

interface Star {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
}

const STAR_COUNT = 200;
let stars: Star[] | null = null;

function initStars(w: number, h: number): Star[] {
  return Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.5 + 0.3,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.5 + 0.3,
  }));
}

export function CosmosBackground() {
  const draw = useCallback((ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => {
    if (!stars || stars.length === 0) {
      stars = initStars(w, h);
    }

    for (const star of stars) {
      const alpha = 0.3 + 0.7 * ((Math.sin(t * star.speed + star.phase) + 1) / 2);
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 168, 76, ${alpha})`;
      ctx.fill();
    }
  }, []);

  const canvasRef = useGeometry({ draw, fps: 30 });

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
