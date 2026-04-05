import { useCallback, useRef } from 'react';

// ═══════════════════════════════════════
// Sound Effects — Web Audio API
// Ritualistic sounds for card reveals
// Zero libraries. Pure oscillation.
// ═══════════════════════════════════════

let sharedCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!sharedCtx) sharedCtx = new AudioContext();
  if (sharedCtx.state === 'suspended') sharedCtx.resume();
  return sharedCtx;
}

// ── Card flip — short percussive "whoosh" ──
function playFlip() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Noise burst (white noise filtered)
  const bufferSize = ctx.sampleRate * 0.15;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize); // decay
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(2000, now);
  filter.frequency.exponentialRampToValueAtTime(400, now + 0.12);
  filter.Q.value = 1.5;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 0.15);
}

// ── Card reveal — harmonic shimmer (rising overtones) ──
function playReveal(baseHz: number = 396) {
  const ctx = getCtx();
  const now = ctx.currentTime;

  // 3 harmonics rising slowly
  const harmonics = [1, 1.5, 2];
  harmonics.forEach((mult, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseHz * mult * 0.5, now);
    osc.frequency.exponentialRampToValueAtTime(baseHz * mult, now + 1.2);

    const gain = ctx.createGain();
    const delay = i * 0.15;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.04, now + delay + 0.3);
    gain.gain.linearRampToValueAtTime(0, now + 2.0);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + delay);
    osc.stop(now + 2.2);
  });
}

// ── Transition — low resonant pulse between cards ──
function playTransition() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(80, now);
  osc.frequency.exponentialRampToValueAtTime(40, now + 0.6);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.7);
}

// ── Seal — crystalline chime for the final map ──
function playSeal() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const notes = [528, 639, 741, 852]; // solfeggio progression
  notes.forEach((hz, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = hz;

    const gain = ctx.createGain();
    const onset = i * 0.3;
    gain.gain.setValueAtTime(0, now + onset);
    gain.gain.linearRampToValueAtTime(0.035, now + onset + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + onset + 1.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + onset);
    osc.stop(now + onset + 1.6);
  });
}

// ── Hook ──

export function useSoundEffects() {
  const enabledRef = useRef(false);

  const enable = useCallback(() => { enabledRef.current = true; }, []);
  const disable = useCallback(() => { enabledRef.current = false; }, []);

  const flip = useCallback(() => { if (enabledRef.current) playFlip(); }, []);
  const reveal = useCallback((hz?: number) => { if (enabledRef.current) playReveal(hz); }, []);
  const transition = useCallback(() => { if (enabledRef.current) playTransition(); }, []);
  const seal = useCallback(() => { if (enabledRef.current) playSeal(); }, []);

  return { enable, disable, enabled: enabledRef, flip, reveal, transition, seal };
}
