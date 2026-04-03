import { useGeometry } from '../hooks/useGeometry';
import { useCallback } from 'react';

// Sri Yantra (simplified) — Element: Water
// Concentric triangles and circles representing cosmic unity

export function SriYantra() {
  const draw = useCallback((ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => {
    const cx = w / 2;
    const cy = h / 2;
    const maxR = Math.min(w, h) * 0.28;
    const breathe = 1 + Math.sin(t * 0.35) * 0.03;

    ctx.save();
    ctx.translate(cx, cy);

    // Outer circle
    const outerAlpha = 0.15 + 0.1 * ((Math.sin(t * 0.3) + 1) / 2);
    ctx.beginPath();
    ctx.arc(0, 0, maxR * breathe, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(201, 168, 76, ${outerAlpha})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Downward triangles (Shakti — feminine/water)
    const downTriangles = [
      { r: maxR * 0.9, offset: 0 },
      { r: maxR * 0.7, offset: 0.02 },
      { r: maxR * 0.5, offset: 0.04 },
      { r: maxR * 0.3, offset: 0.06 },
    ];

    downTriangles.forEach(({ r, offset }, i) => {
      const phase = i * 0.4;
      const alpha = 0.1 + 0.2 * ((Math.sin(t * 0.4 + phase) + 1) / 2);
      const localR = r * breathe;
      const rot = offset * Math.sin(t * 0.2);

      ctx.save();
      ctx.rotate(rot);
      ctx.beginPath();
      for (let j = 0; j < 3; j++) {
        const angle = Math.PI / 2 + (j * Math.PI * 2) / 3;
        const x = Math.cos(angle) * localR;
        const y = Math.sin(angle) * localR;
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(201, 168, 76, ${alpha})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();
    });

    // Upward triangles (Shiva — masculine/fire complement)
    const upTriangles = [
      { r: maxR * 0.85, offset: 0 },
      { r: maxR * 0.6, offset: -0.02 },
      { r: maxR * 0.4, offset: -0.04 },
      { r: maxR * 0.2, offset: -0.06 },
      { r: maxR * 0.1, offset: -0.08 },
    ];

    upTriangles.forEach(({ r, offset }, i) => {
      const phase = i * 0.35 + 1.5;
      const alpha = 0.1 + 0.2 * ((Math.sin(t * 0.4 + phase) + 1) / 2);
      const localR = r * breathe;
      const rot = offset * Math.sin(t * 0.2);

      ctx.save();
      ctx.rotate(rot);
      ctx.beginPath();
      for (let j = 0; j < 3; j++) {
        const angle = -Math.PI / 2 + (j * Math.PI * 2) / 3;
        const x = Math.cos(angle) * localR;
        const y = Math.sin(angle) * localR;
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(201, 168, 76, ${alpha})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();
    });

    // Central bindu (point of unity)
    const binduAlpha = 0.4 + 0.4 * ((Math.sin(t * 0.8) + 1) / 2);
    ctx.beginPath();
    ctx.arc(0, 0, 3 * breathe, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201, 168, 76, ${binduAlpha})`;
    ctx.fill();

    // Inner circles (lotus petals simplified)
    for (let ring = 0; ring < 2; ring++) {
      const ringR = maxR * (0.35 + ring * 0.25) * breathe;
      const petals = ring === 0 ? 8 : 16;
      const petalR = ringR * 0.15;

      for (let i = 0; i < petals; i++) {
        const angle = (i * Math.PI * 2) / petals + t * 0.05;
        const px = Math.cos(angle) * ringR;
        const py = Math.sin(angle) * ringR;
        const petalAlpha = 0.06 + 0.08 * ((Math.sin(t * 0.3 + i * 0.3) + 1) / 2);

        ctx.beginPath();
        ctx.arc(px, py, petalR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(201, 168, 76, ${petalAlpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
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
