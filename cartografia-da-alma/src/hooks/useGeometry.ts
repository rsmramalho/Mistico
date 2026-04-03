import { useRef, useEffect, useCallback } from 'react';

interface UseGeometryOptions {
  draw: (ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => void;
  fps?: number;
}

export function useGeometry({ draw, fps = 60 }: UseGeometryOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    resize();
    window.addEventListener('resize', resize);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    startRef.current = performance.now();
    const interval = 1000 / fps;
    let last = 0;

    const animate = (now: number) => {
      frameRef.current = requestAnimationFrame(animate);
      const delta = now - last;
      if (delta < interval) return;
      last = now - (delta % interval);

      const t = (now - startRef.current) / 1000;
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      draw(ctx, t, rect.width, rect.height);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [draw, fps, resize]);

  return canvasRef;
}
