// ═══════════════════════════════════════
// Cartografia da Alma — Audio Hook
// Web Audio API · Solfeggio frequencies
// Zero libraries
// ═══════════════════════════════════════

import { useCallback, useRef, useState } from 'react';
import type { Sign } from '../types/soul-map';

// Solfeggio frequency per sign — uses engine result directly
// but also exported for manual use
export const SIGN_FREQUENCIES: Record<Sign, number> = {
  // Fire — 396 Hz · Liberation
  Aries: 396, Leo: 396, Sagittarius: 396,
  // Earth — 174 Hz · Foundation
  Taurus: 174, Virgo: 174, Capricorn: 174,
  // Air — 741 Hz · Expression
  Gemini: 741, Libra: 741, Aquarius: 741,
  // Water — 528 Hz · Transformation
  Cancer: 528, Scorpio: 528, Pisces: 528,
};

interface AudioState {
  playing: boolean;
  hz: number;
}

export function useAudio(hz: number) {
  const ctxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [state, setState] = useState<AudioState>({ playing: false, hz });

  const start = useCallback(() => {
    // Create context on first user gesture (browser requirement)
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }

    const ctx = ctxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    // Clean up previous oscillator
    if (oscRef.current) {
      oscRef.current.stop();
      oscRef.current.disconnect();
    }

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 3); // fade in 3s
    gain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(hz, ctx.currentTime);
    osc.connect(gain);
    osc.start();

    oscRef.current = osc;
    gainRef.current = gain;
    setState({ playing: true, hz });
  }, [hz]);

  const stop = useCallback(() => {
    if (!gainRef.current || !ctxRef.current || !oscRef.current) return;

    const ctx = ctxRef.current;
    const gain = gainRef.current;
    const osc = oscRef.current;

    // Fade out 1.5s then stop
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    setTimeout(() => {
      try { osc.stop(); osc.disconnect(); } catch { /* already stopped */ }
    }, 1600);

    oscRef.current = null;
    gainRef.current = null;
    setState(s => ({ ...s, playing: false }));
  }, []);

  const toggle = useCallback(() => {
    if (state.playing) stop();
    else start();
  }, [state.playing, start, stop]);

  return { ...state, toggle, start, stop };
}
