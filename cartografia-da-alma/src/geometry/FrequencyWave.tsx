import { useRef, useEffect } from 'react';

export interface FrequencyWaveProps {
  hz: number;
  width?: number;
  height?: number;
  color?: string;
  opacity?: number;
  animated?: boolean;
}

function drawWave(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  hz: number,
  color: string,
  phase: number,
) {
  const visualFreq = hz / 100;
  const amp = h * 0.35;
  const cy = h / 2;

  ctx.clearRect(0, 0, w, h);
  ctx.beginPath();

  for (let x = 0; x <= w; x++) {
    const t = x / w;
    // Primary wave
    const y1 = Math.sin(t * visualFreq * Math.PI * 2 + phase) * amp;
    // Secondary wave — half amplitude, 1.5x frequency
    const y2 = Math.sin(t * visualFreq * 1.5 * Math.PI * 2 + phase * 1.3) * (amp * 0.5);
    const y = cy + y1 + y2;

    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

export function FrequencyWave({
  hz,
  width = 300,
  height = 80,
  color = '#c9a84c',
  opacity = 1,
  animated = true,
}: FrequencyWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    if (!animated) {
      drawWave(ctx, width, height, hz, color, 0);
      return;
    }

    const animate = () => {
      // Reset transform then re-apply for each frame
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      phaseRef.current += 0.02;
      drawWave(ctx, width, height, hz, color, phaseRef.current);
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [hz, width, height, color, animated]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width, height, opacity, display: 'block', background: 'transparent' }}
    />
  );
}
