import { useCallback, useState } from 'react';

// ═══════════════════════════════════════
// Export Hook — PNG screenshot of a DOM element
// Uses html2canvas (lazy loaded)
// ═══════════════════════════════════════

export function useExport() {
  const [exporting, setExporting] = useState(false);

  const exportPNG = useCallback(async (
    element: HTMLElement | null,
    filename: string = 'cartografia.png',
  ) => {
    if (!element || exporting) return;
    setExporting(true);

    try {
      const { default: html2canvas } = await import('html2canvas');
      const dpr = window.devicePixelRatio || 1;
      const canvas = await html2canvas(element, {
        backgroundColor: '#07070f',
        scale: Math.max(3, 2 * dpr),
        useCORS: true,
        logging: false,
      });

      // Add watermark
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = '14px Georgia, serif';
        ctx.fillStyle = 'rgba(201,168,76,0.4)';
        ctx.textAlign = 'center';
        ctx.fillText('cartografia da alma', canvas.width / 2, canvas.height - 20);
      }

      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      // silent fail
    } finally {
      setExporting(false);
    }
  }, [exporting]);

  return { exportPNG, exporting };
}
