import { useGeometry } from '../hooks/useGeometry';
import { useCallback } from 'react';

// Flower of Life — Element: Air
// Overlapping circles forming sacred pattern

export function FlowerOfLife() {
  const draw = useCallback((ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => {
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) * 0.12;
    const breathe = 1 + Math.sin(t * 0.5) * 0.03;
    const rotation = t * 0.1;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);

    // Draw circles in concentric rings
    const drawCircle = (x: number, y: number, radius: number, alpha: number) => {
      ctx.beginPath();
      ctx.arc(x, y, radius * breathe, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(201, 168, 76, ${alpha})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    };

    // Center circle
    drawCircle(0, 0, r, 0.4);

    // First ring — 6 circles
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const fadeDelay = i * 0.15;
      const alpha = 0.15 + 0.25 * ((Math.sin(t * 0.7 + fadeDelay) + 1) / 2);
      drawCircle(Math.cos(angle) * r, Math.sin(angle) * r, r, alpha);
    }

    // Second ring — 12 circles
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      const dist = r * Math.sqrt(3);
      const fadeDelay = i * 0.1;
      const alpha = 0.08 + 0.15 * ((Math.sin(t * 0.5 + fadeDelay) + 1) / 2);
      drawCircle(Math.cos(angle) * dist, Math.sin(angle) * dist, r, alpha);
    }

    // Third ring — 18 circles (outer)
    for (let i = 0; i < 18; i++) {
      const angle = (i * Math.PI) / 9;
      const dist = r * 2;
      const fadeDelay = i * 0.08;
      const alpha = 0.05 + 0.1 * ((Math.sin(t * 0.4 + fadeDelay) + 1) / 2);
      drawCircle(Math.cos(angle) * dist, Math.sin(angle) * dist, r, alpha);
    }

    ctx.restore();
  }, []);

  const canvasRef = useGeometry({ draw, fps: 30 });

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ maxHeight: '400px' }}
    />
  );
}
