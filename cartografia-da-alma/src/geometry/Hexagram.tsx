import { useGeometry } from '../hooks/useGeometry';
import { useCallback } from 'react';

// Hexagram (Star of David / Seal of Solomon) — Element: Fire
// Two interlocking triangles

export function Hexagram() {
  const draw = useCallback((ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => {
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) * 0.25;
    const breathe = 1 + Math.sin(t * 0.6) * 0.04;
    const rotation = t * 0.08;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);

    const drawTriangle = (radius: number, startAngle: number, alpha: number) => {
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const angle = startAngle + (i * Math.PI * 2) / 3;
        const x = Math.cos(angle) * radius * breathe;
        const y = Math.sin(angle) * radius * breathe;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(201, 168, 76, ${alpha})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    };

    // Upward triangle (fire ascending)
    const alpha1 = 0.25 + 0.3 * ((Math.sin(t * 0.5) + 1) / 2);
    drawTriangle(r, -Math.PI / 2, alpha1);

    // Downward triangle
    const alpha2 = 0.25 + 0.3 * ((Math.sin(t * 0.5 + Math.PI) + 1) / 2);
    drawTriangle(r, Math.PI / 2, alpha2);

    // Inner hexagon
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 - Math.PI / 6;
      const innerR = r * 0.577 * breathe; // r / sqrt(3)
      const x = Math.cos(angle) * innerR;
      const y = Math.sin(angle) * innerR;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = `rgba(201, 168, 76, 0.15)`;
    ctx.lineWidth = 0.6;
    ctx.stroke();

    // Center point — pulsing
    const centerAlpha = 0.3 + 0.4 * ((Math.sin(t * 1.2) + 1) / 2);
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201, 168, 76, ${centerAlpha})`;
    ctx.fill();

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
