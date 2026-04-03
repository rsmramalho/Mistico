import { useGeometry } from '../hooks/useGeometry';
import { useCallback } from 'react';

// Metatron's Cube — Element: Earth
// 13 circles with lines connecting all centers

export function Metatron() {
  const draw = useCallback((ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => {
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) * 0.08;
    const outerR = Math.min(w, h) * 0.22;
    const breathe = 1 + Math.sin(t * 0.4) * 0.02;
    const rotation = t * 0.05;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);

    // Calculate 13 circle centers
    const centers: [number, number][] = [[0, 0]];

    // Inner ring — 6 circles
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      centers.push([
        Math.cos(angle) * outerR * 0.5 * breathe,
        Math.sin(angle) * outerR * 0.5 * breathe,
      ]);
    }

    // Outer ring — 6 circles
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      centers.push([
        Math.cos(angle) * outerR * breathe,
        Math.sin(angle) * outerR * breathe,
      ]);
    }

    // Draw lines connecting ALL centers
    for (let i = 0; i < centers.length; i++) {
      for (let j = i + 1; j < centers.length; j++) {
        const linePhase = (i + j) * 0.2;
        const alpha = 0.04 + 0.08 * ((Math.sin(t * 0.3 + linePhase) + 1) / 2);
        ctx.beginPath();
        ctx.moveTo(centers[i][0], centers[i][1]);
        ctx.lineTo(centers[j][0], centers[j][1]);
        ctx.strokeStyle = `rgba(201, 168, 76, ${alpha})`;
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }
    }

    // Draw circles at each center
    centers.forEach(([x, y], i) => {
      const phase = i * 0.3;
      const alpha = 0.15 + 0.25 * ((Math.sin(t * 0.5 + phase) + 1) / 2);
      ctx.beginPath();
      ctx.arc(x, y, r * breathe, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(201, 168, 76, ${alpha})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    });

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
