import { useGeometry } from '../hooks/useGeometry';
import { useCallback } from 'react';
import type { SephirahName } from '../types/soul-map';

// Tree of Life — Always-present overlay
// 10 Sephiroth + 22 paths

interface TreeOfLifeProps {
  activeSephirah?: SephirahName;
}

// Normalized positions (0-1) based on traditional Tree layout
const SEPHIROTH_POS: Record<SephirahName, [number, number]> = {
  Kether:   [0.5, 0.05],
  Chokmah:  [0.72, 0.15],
  Binah:    [0.28, 0.15],
  Daath:    [0.5, 0.28],
  Chesed:   [0.72, 0.38],
  Geburah:  [0.28, 0.38],
  Tiphareth: [0.5, 0.48],
  Netzach:  [0.72, 0.62],
  Hod:      [0.28, 0.62],
  Yesod:    [0.5, 0.75],
  Malkuth:  [0.5, 0.92],
};

// Paths (connections between sephiroth)
const PATHS: [SephirahName, SephirahName][] = [
  ['Kether', 'Chokmah'], ['Kether', 'Binah'], ['Kether', 'Tiphareth'],
  ['Chokmah', 'Binah'], ['Chokmah', 'Chesed'], ['Chokmah', 'Tiphareth'],
  ['Binah', 'Geburah'], ['Binah', 'Tiphareth'],
  ['Chesed', 'Geburah'], ['Chesed', 'Tiphareth'], ['Chesed', 'Netzach'],
  ['Geburah', 'Tiphareth'], ['Geburah', 'Hod'],
  ['Tiphareth', 'Netzach'], ['Tiphareth', 'Hod'], ['Tiphareth', 'Yesod'],
  ['Netzach', 'Hod'], ['Netzach', 'Yesod'], ['Netzach', 'Malkuth'],
  ['Hod', 'Yesod'], ['Hod', 'Malkuth'],
  ['Yesod', 'Malkuth'],
];

export function TreeOfLife({ activeSephirah }: TreeOfLifeProps) {
  const draw = useCallback((ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => {
    const nodeR = Math.min(w, h) * 0.025;

    // Draw paths
    PATHS.forEach(([from, to], i) => {
      const [x1, y1] = SEPHIROTH_POS[from];
      const [x2, y2] = SEPHIROTH_POS[to];
      const phase = i * 0.2;
      const alpha = 0.06 + 0.04 * ((Math.sin(t * 0.3 + phase) + 1) / 2);

      ctx.beginPath();
      ctx.moveTo(x1 * w, y1 * h);
      ctx.lineTo(x2 * w, y2 * h);
      ctx.strokeStyle = `rgba(201, 168, 76, ${alpha})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();
    });

    // Draw sephiroth
    const entries = Object.entries(SEPHIROTH_POS) as [SephirahName, [number, number]][];
    entries.forEach(([name, [nx, ny]], i) => {
      const x = nx * w;
      const y = ny * h;
      const isActive = name === activeSephirah;
      const isDaath = name === 'Daath';
      const phase = i * 0.4;
      const baseAlpha = isDaath ? 0.05 : 0.1;
      const pulseAlpha = isActive ? 0.5 + 0.3 * ((Math.sin(t * 1.5) + 1) / 2) : baseAlpha + 0.06 * ((Math.sin(t * 0.4 + phase) + 1) / 2);

      ctx.beginPath();
      ctx.arc(x, y, isActive ? nodeR * 1.3 : nodeR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(201, 168, 76, ${pulseAlpha})`;
      ctx.lineWidth = isActive ? 1.5 : 0.8;
      ctx.stroke();

      if (isActive) {
        ctx.beginPath();
        ctx.arc(x, y, nodeR * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 168, 76, ${0.4 + 0.3 * ((Math.sin(t * 1.5) + 1) / 2)})`;
        ctx.fill();
      }

      if (isDaath) {
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.arc(x, y, nodeR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(201, 168, 76, 0.08)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
  }, [activeSephirah]);

  const canvasRef = useGeometry({ draw, fps: 30 });

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ maxHeight: '500px' }}
    />
  );
}
