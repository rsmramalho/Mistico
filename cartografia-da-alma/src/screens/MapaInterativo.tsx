// ═══════════════════════════════════════
// Cartografia da Alma — Mapa Interativo
// 6 atos · scroll-snap · experiência imersiva
// Cada dado da pessoa vira estética
// ═══════════════════════════════════════

import { useState, useEffect, useRef, useMemo } from 'react';
import type { SoulMap, Element } from '../types/soul-map';
import type { ReadingTier } from '../types/database';
import { FrequencyWave } from '../geometry/FrequencyWave';
import { FlowerOfLife } from '../geometry/FlowerOfLife';
import { Hexagram } from '../geometry/Hexagram';
import { Metatron } from '../geometry/Metatron';
import { SriYantra } from '../geometry/SriYantra';
import { ElementGlyph, SephirahGlyph, ArchetypeGlyph } from '../geometry/glyphs';
import { PsycheBar } from '../components/PsycheBar';
import { computeBridges } from '../engine/bridges';
import { useAudio } from '../hooks/useAudio';
import { useExport } from '../hooks/useExport';
import type { BridgeHighlight } from '../engine/bridges';

// ── Props ──

interface MapaInterativoProps {
  soulMap: SoulMap;
  onShare: () => void;
  onMeet: (token: string) => Promise<string | null>;
  onReset: () => void;
  shareUrl?: string | null;
  isSharing?: boolean;
  shareError?: boolean;
  shareCopied?: boolean;
  tier?: ReadingTier;
  readingId?: string | null;
}

// ── Translations ──

const SIGN_PT: Record<string, string> = {
  Aries: 'Áries', Taurus: 'Touro', Gemini: 'Gêmeos', Cancer: 'Câncer',
  Leo: 'Leão', Virgo: 'Virgem', Libra: 'Libra', Scorpio: 'Escorpião',
  Sagittarius: 'Sagitário', Capricorn: 'Capricórnio', Aquarius: 'Aquário', Pisces: 'Peixes',
};

const ELEMENT_PT: Record<Element, string> = {
  fire: 'Fogo', earth: 'Terra', air: 'Ar', water: 'Água',
};

// ── Element palettes — each person gets a different atmosphere ──

const ELEMENT_PALETTE: Record<Element, { accent: string; glow: string; bg: string }> = {
  fire:  { accent: '#e8a040', glow: 'rgba(232,160,64,0.06)', bg: '#0a0806' },
  water: { accent: '#5a9ab8', glow: 'rgba(90,154,184,0.06)', bg: '#060810' },
  earth: { accent: '#7a9a5a', glow: 'rgba(122,154,90,0.06)', bg: '#080a06' },
  air:   { accent: '#a8a8c8', glow: 'rgba(168,168,200,0.06)', bg: '#0a0a10' },
};

// ── Element geometry ──

function ElementGeometry({ element }: { element: Element }) {
  switch (element) {
    case 'fire': return <Hexagram />;
    case 'water': return <SriYantra />;
    case 'earth': return <Metatron />;
    case 'air': return <FlowerOfLife />;
  }
}

// ── Scroll-triggered visibility hook ──

function useActVisible(threshold = 0.25): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

// ── Particle field — count derived from numerology ──

function ParticleField({ count, color }: { count: number; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * (w || 800),
      y: Math.random() * (h || 600),
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      a: Math.random() * 0.35 + 0.08,
    }));

    let frame: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = p.a;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [count, color]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  );
}

// ── Synthesis fallback ──

function buildFallback(soulMap: SoulMap): string {
  const { archetype, sephirah, frequency, numerology } = soulMap;
  return `${archetype.titlePt} em ${sephirah.name}. ${sephirah.tikkun ?? ''} A frequência é ${frequency.hz} Hz — ${frequency.keywordPt}. O número ${numerology.number} carrega ${numerology.namePt}.`;
}

// ── CSS Keyframes (injected once) ──

const KEYFRAMES = `
@keyframes mapa-fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes mapa-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}
@keyframes mapa-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
@keyframes mapa-rotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
`;

// ── Shared styles ──

const label: React.CSSProperties = {
  fontFamily: 'var(--sans)', fontSize: '8px', fontWeight: 200,
  letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase',
  margin: 0,
};

const bodyText: React.CSSProperties = {
  fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 300,
  fontStyle: 'italic', color: 'var(--white-dim)', lineHeight: 1.8,
  maxWidth: '520px', margin: '0 auto',
};

const actionBtn: React.CSSProperties = {
  background: 'transparent', border: 'none',
  borderBottom: '1px solid var(--gold)',
  fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 300,
  letterSpacing: '0.32em', color: 'var(--gold)', textTransform: 'uppercase',
  padding: '0 0 6px', transition: 'color 0.3s, letter-spacing 0.3s',
  cursor: 'none',
};

// ══════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════

export function MapaInterativo({
  soulMap, onShare, onMeet, onReset,
  shareUrl, isSharing, shareError, shareCopied,
}: MapaInterativoProps) {

  // ── Derived data ──
  const firstName = soulMap.birthData.name.split(' ')[0];
  const fullName = soulMap.birthData.name;
  const nameLetters = fullName.split('');
  const signPT = SIGN_PT[soulMap.sunSign] ?? soulMap.sunSign;
  const elementPT = ELEMENT_PT[soulMap.element];
  const palette = ELEMENT_PALETTE[soulMap.element];
  const particleCount = Math.min(soulMap.numerology.number * 12 + 20, 100);
  const nameAnimEnd = 0.6 + nameLetters.length * 0.08 + 0.5;

  // ── Visibility per act ──
  const [act1Ref, act1] = useActVisible(0.2);
  const [act2Ref, act2] = useActVisible(0.25);
  const [act3Ref, act3] = useActVisible(0.25);
  const [act4Ref, act4] = useActVisible(0.25);
  const [act5Ref, act5] = useActVisible(0.2);
  const [act6Ref, act6] = useActVisible(0.2);

  // ── Synthesis from API ──
  const [synthesis, setSynthesis] = useState<string | null>(null);
  const [synthLoading, setSynthLoading] = useState(true);
  const bridges = useMemo(() => computeBridges(soulMap), [soulMap]);

  useEffect(() => {
    let cancelled = false;
    async function fetchSynthesis() {
      try {
        const bridgePayload = bridges.highlights.map(h => ({
          systemA: h.systemA, systemB: h.systemB, resonance: h.resonance,
        }));
        const res = await fetch('/api/carta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ soulMap, prompt: 'synthesis', bridges: bridgePayload }),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!cancelled) {
          setSynthesis(data.carta ?? data.synthesis ?? data.answer ?? data.text ?? buildFallback(soulMap));
          setSynthLoading(false);
        }
      } catch {
        if (!cancelled) { setSynthesis(buildFallback(soulMap)); setSynthLoading(false); }
      }
    }
    fetchSynthesis();
    return () => { cancelled = true; };
  }, [soulMap, bridges]);

  // ── Audio ──
  const audio = useAudio(soulMap.frequency.hz);

  // ── Export ──
  const { exportPNG, exporting } = useExport();
  const sealRef = useRef<HTMLDivElement | null>(null);

  // ── Meet input ──
  const [showMeetInput, setShowMeetInput] = useState(false);
  const [meetInput, setMeetInput] = useState('');
  const [meetError, setMeetError] = useState<string | null>(null);
  const [meetLoading, setMeetLoading] = useState(false);

  // ── Share label ──
  const shareLabel = isSharing ? 'gerando...'
    : shareCopied ? 'link copiado ✓'
    : shareError ? 'erro — tentar novamente'
    : shareUrl ? 'copiar link' : 'compartilhar meu mapa';

  // ── Viewport width for wave ──
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 600);
  useEffect(() => {
    const h = () => setVw(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  const waveWidth = Math.min(vw - 48, 800);

  // ── Hover handlers ──
  const onEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.color = 'var(--white)';
    e.currentTarget.style.letterSpacing = '0.42em';
  };
  const onLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.color = 'var(--gold)';
    e.currentTarget.style.letterSpacing = '0.32em';
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      overflowY: 'auto', overflowX: 'hidden',
      scrollSnapType: 'y mandatory',
      background: '#07070f',
    }}>
      <style>{KEYFRAMES}</style>
      <ParticleField count={particleCount} color={palette.accent} />

      {/* ════════════════════════════════════
          ATO 1 — SILÊNCIO
          O nome emerge do vazio
      ════════════════════════════════════ */}
      <section
        ref={act1Ref}
        style={{
          minHeight: '100svh', scrollSnapAlign: 'start',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          position: 'relative', padding: '48px 24px',
        }}
      >
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Name — letter by letter */}
          <h1 style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(42px, 11vw, 88px)',
            fontWeight: 300, color: 'var(--gold)',
            margin: 0, lineHeight: 1.15, letterSpacing: '0.02em',
          }}>
            {nameLetters.map((letter, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  opacity: act1 ? 1 : 0,
                  transform: act1 ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 0.7s ease ${0.6 + i * 0.08}s, transform 0.7s ease ${0.6 + i * 0.08}s`,
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </h1>

          {/* Gold line */}
          <div style={{
            width: '100px', height: '1px', background: 'var(--gold)',
            margin: '36px auto',
            transform: act1 ? 'scaleX(1)' : 'scaleX(0)',
            transition: `transform 1s ease ${nameAnimEnd}s`,
          }} />

          {/* Subtitle */}
          <p style={{
            ...label,
            opacity: act1 ? 1 : 0,
            transition: `opacity 1.2s ease ${nameAnimEnd + 0.8}s`,
          }}>
            cada pessoa carrega um padrão
          </p>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '36px', left: '50%', transform: 'translateX(-50%)',
          opacity: act1 ? 1 : 0,
          transition: `opacity 1s ease ${nameAnimEnd + 2}s`,
          textAlign: 'center',
        }}>
          <div style={{
            width: '1px', height: '28px', background: 'var(--gold-line)',
            margin: '0 auto 10px', animation: 'mapa-pulse 2.5s ease-in-out infinite',
          }} />
          <p style={{ ...label, fontSize: '7px', color: 'var(--white-ghost)' }}>
            desça
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════
          ATO 2 — ORIGEM
          O signo, o elemento, a geometria
      ════════════════════════════════════ */}
      <section
        ref={act2Ref}
        style={{
          minHeight: '100svh', scrollSnapAlign: 'start',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          position: 'relative', padding: '48px 24px',
          background: `radial-gradient(ellipse at 50% 50%, ${palette.glow} 0%, transparent 70%)`,
        }}
      >
        {/* Background geometry */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 'min(80vw, 480px)', height: 'min(80vw, 480px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: act2 ? 0.07 : 0,
          transition: 'opacity 3s ease 0.3s',
          animation: act2 ? 'mapa-rotate 180s linear infinite' : 'none',
          pointerEvents: 'none',
        }}>
          <ElementGeometry element={soulMap.element} />
        </div>

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: '560px' }}>
          {/* Element glyph */}
          <div style={{
            opacity: act2 ? 1 : 0,
            transform: act2 ? 'scale(1)' : 'scale(0.7)',
            transition: 'opacity 1s ease 0.5s, transform 1s ease 0.5s',
            margin: '0 auto 20px', display: 'flex', justifyContent: 'center',
          }}>
            <ElementGlyph element={soulMap.element} size={48} color={palette.accent} animated />
          </div>

          {/* Label */}
          <p style={{
            ...label,
            opacity: act2 ? 1 : 0,
            transition: 'opacity 0.8s ease 0.8s',
          }}>
            {elementPT} · {soulMap.modality === 'cardinal' ? 'cardinal' : soulMap.modality === 'fixed' ? 'fixo' : 'mutável'}
          </p>

          {/* Sign name — large */}
          <h2 style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(36px, 9vw, 72px)',
            fontWeight: 300, color: 'var(--white)', margin: '12px 0 0', lineHeight: 1.1,
            opacity: act2 ? 1 : 0,
            transform: act2 ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 1s ease 1s, transform 1s ease 1s',
          }}>
            {signPT}
          </h2>

          {/* Ruler meaning */}
          <p style={{
            ...bodyText, fontSize: '15px', margin: '24px auto 0',
            opacity: act2 ? 1 : 0,
            transition: 'opacity 1.2s ease 1.6s',
          }}>
            {soulMap.sunSign && `Regido por ${(soulMap as any).ruler ?? ''} — `}
            {(soulMap as any).rulerMeaning ?? ''}
          </p>

          {/* Personal phrase with name */}
          <p style={{
            ...bodyText, margin: '28px auto 0', fontSize: '20px',
            color: 'var(--white)',
            opacity: act2 ? 1 : 0,
            transition: 'opacity 1.5s ease 2.2s',
          }}>
            Em <span style={{ color: palette.accent }}>{firstName}</span>, o {elementPT.toLowerCase()} se manifesta como{' '}
            <span style={{ color: 'var(--white-dim)' }}>
              {soulMap.element === 'fire' ? 'impulso — o gesto antes do cálculo'
               : soulMap.element === 'water' ? 'intuição — o campo que sente antes de pensar'
               : soulMap.element === 'earth' ? 'raiz — o que planta, permanece'
               : 'visão — a mente que habita mais de um lugar'}.
            </span>
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════
          ATO 3 — PROFUNDIDADE
          Arquétipo, sombra, árvore
      ════════════════════════════════════ */}
      <section
        ref={act3Ref}
        style={{
          minHeight: '100svh', scrollSnapAlign: 'start',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          position: 'relative', padding: '48px 24px',
          background: '#050508',
        }}
      >
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: '560px' }}>
          {/* Archetype glyph */}
          <div style={{
            opacity: act3 ? 1 : 0,
            transform: act3 ? 'scale(1)' : 'scale(0.6)',
            transition: 'opacity 1.2s ease 0.4s, transform 1.2s ease 0.4s',
            margin: '0 auto 16px', display: 'flex', justifyContent: 'center',
          }}>
            <ArchetypeGlyph name={soulMap.archetype.name} size={72} color={palette.accent} animated />
          </div>

          {/* Archetype title */}
          <p style={{ ...label, opacity: act3 ? 1 : 0, transition: 'opacity 0.8s ease 0.8s' }}>
            arquétipo
          </p>
          <h2 style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 7vw, 52px)',
            fontWeight: 300, color: 'var(--white)', margin: '8px 0 0', lineHeight: 1.2,
            opacity: act3 ? 1 : 0,
            transition: 'opacity 1s ease 1s',
          }}>
            {soulMap.archetype.titlePt}
          </h2>

          {/* Core desire */}
          <p style={{
            ...bodyText, fontSize: '16px', margin: '16px auto 0',
            opacity: act3 ? 1 : 0,
            transition: 'opacity 1s ease 1.4s',
          }}>
            O que {firstName} busca: <span style={{ color: 'var(--white)' }}>{soulMap.archetype.coreDesire}</span>
          </p>

          {/* Shadow divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            margin: '32px auto', maxWidth: '300px',
            opacity: act3 ? 1 : 0,
            transition: 'opacity 0.8s ease 1.8s',
          }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--gold-line)' }} />
            <span style={{ ...label, margin: 0, fontSize: '7px' }}>a sombra</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--gold-line)' }} />
          </div>

          {/* Shadow duality */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px',
            maxWidth: '480px', margin: '0 auto',
            opacity: act3 ? 1 : 0,
            transform: act3 ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 1.2s ease 2s, transform 1.2s ease 2s',
          }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ ...label, fontSize: '7px', marginBottom: '6px' }}>inflada</p>
              <p style={{ ...bodyText, fontSize: '14px', textAlign: 'right', color: 'rgba(232,160,64,0.7)' }}>
                {soulMap.archetype.shadow.inflated}
              </p>
            </div>
            <div style={{ textAlign: 'left', borderLeft: '1px solid var(--gold-line)', paddingLeft: '24px' }}>
              <p style={{ ...label, fontSize: '7px', marginBottom: '6px' }}>esvaziada</p>
              <p style={{ ...bodyText, fontSize: '14px', textAlign: 'left', color: 'rgba(232,228,218,0.4)' }}>
                {soulMap.archetype.shadow.deflated}
              </p>
            </div>
          </div>

          {/* Sephirah */}
          <div style={{
            marginTop: '40px',
            opacity: act3 ? 1 : 0,
            transition: 'opacity 1.2s ease 2.6s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
              <SephirahGlyph name={soulMap.sephirah.name} size={36} color="var(--gold)" animated />
            </div>
            <p style={{ ...label }}>
              {soulMap.sephirah.name} · árvore da vida
            </p>
            {soulMap.sephirah.tikkun && (
              <p style={{
                ...bodyText, fontSize: '15px', margin: '12px auto 0', maxWidth: '420px',
              }}>
                {soulMap.sephirah.tikkun}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          ATO 4 — VIBRAÇÃO
          Frequência, onda, som
      ════════════════════════════════════ */}
      <section
        ref={act4Ref}
        style={{
          minHeight: '100svh', scrollSnapAlign: 'start',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          position: 'relative', padding: '48px 24px',
          background: `radial-gradient(ellipse at 50% 60%, ${palette.glow} 0%, transparent 60%)`,
        }}
      >
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, width: '100%', maxWidth: '800px' }}>
          {/* Hz — huge */}
          <p style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(56px, 14vw, 130px)',
            fontWeight: 300, color: palette.accent, margin: 0, lineHeight: 1,
            opacity: act4 ? 1 : 0,
            transform: act4 ? 'scale(1)' : 'scale(0.8)',
            transition: 'opacity 1.5s ease 0.3s, transform 1.5s ease 0.3s',
          }}>
            {soulMap.frequency.hz}
          </p>
          <p style={{
            ...label, margin: '8px 0 0',
            opacity: act4 ? 1 : 0,
            transition: 'opacity 1s ease 0.8s',
          }}>
            hertz · {soulMap.frequency.keywordPt}
          </p>

          {/* Wave */}
          <div style={{
            margin: '40px auto', overflow: 'hidden',
            opacity: act4 ? 1 : 0,
            transform: act4 ? 'scaleY(1)' : 'scaleY(0.2)',
            transition: 'opacity 1.5s ease 1.2s, transform 2s cubic-bezier(0.16,1,0.3,1) 1.2s',
          }}>
            <FrequencyWave
              hz={soulMap.frequency.hz}
              width={waveWidth}
              height={140}
              color={palette.accent}
              opacity={0.7}
            />
          </div>

          {/* Play button */}
          <button
            type="button"
            onClick={audio.toggle}
            style={{
              ...actionBtn,
              opacity: act4 ? 1 : 0,
              transition: 'opacity 1s ease 2s, color 0.3s, letter-spacing 0.3s',
            }}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
          >
            {audio.playing ? `ouvindo ${soulMap.frequency.hz} Hz...` : `tocar a frequência de ${firstName}`}
          </button>

          {/* Personal text */}
          <p style={{
            ...bodyText, margin: '32px auto 0', fontSize: '19px',
            opacity: act4 ? 1 : 0,
            transition: 'opacity 1.5s ease 2.5s',
          }}>
            A frequência de <span style={{ color: palette.accent }}>{firstName}</span> é{' '}
            {soulMap.frequency.hz} Hz — {soulMap.frequency.description.charAt(0).toLowerCase() + soulMap.frequency.description.slice(1)}
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════
          ATO 5 — SÍNTESE
          Tudo converge
      ════════════════════════════════════ */}
      <section
        ref={act5Ref}
        style={{
          minHeight: '100svh', scrollSnapAlign: 'start',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          position: 'relative', padding: '48px 24px',
        }}
      >
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: '600px' }}>
          <p style={{
            ...label,
            opacity: act5 ? 1 : 0,
            transition: 'opacity 1s ease 0.3s',
          }}>
            o que o mapa de {firstName} revela
          </p>

          <div style={{
            width: '60px', height: '1px', background: 'var(--gold)',
            margin: '20px auto 32px',
            transform: act5 ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 0.8s ease 0.6s',
          }} />

          {/* Synthesis text — word by word */}
          <div style={{ ...bodyText, textAlign: 'center', minHeight: '80px' }}>
            {synthLoading ? (
              <p style={{
                ...label, textAlign: 'center',
                animation: 'mapa-pulse 2s ease-in-out infinite',
              }}>
                o mapa se revela...
              </p>
            ) : act5 && synthesis ? (
              synthesis.split('\n').filter(Boolean).map((paragraph, pi) => (
                <p key={pi} style={{ margin: pi === 0 ? 0 : '1.4em 0 0' }}>
                  {paragraph.split(' ').map((word, wi) => (
                    <span
                      key={wi}
                      style={{
                        opacity: 0,
                        animation: 'mapa-fadeIn 0.5s ease forwards',
                        animationDelay: `${1 + pi * 0.6 + wi * 0.05}s`,
                      }}
                    >
                      {word}{wi < paragraph.split(' ').length - 1 ? ' ' : ''}
                    </span>
                  ))}
                </p>
              ))
            ) : null}
          </div>

          {/* Bridges */}
          {act5 && bridges.highlights.length > 0 && (
            <div style={{
              marginTop: '40px',
              opacity: 0,
              animation: `mapa-fadeIn 1s ease forwards`,
              animationDelay: `${2 + (synthesis?.split(' ').length ?? 0) * 0.05}s`,
            }}>
              <div style={{
                width: '40px', height: '1px', background: 'var(--gold-line)',
                margin: '0 auto 24px',
              }} />
              <p style={{ ...label, marginBottom: '20px' }}>conexões entre os sistemas</p>
              {bridges.highlights.slice(0, 3).map((h: BridgeHighlight, i: number) => (
                <div
                  key={i}
                  style={{
                    padding: '10px 0 10px 16px',
                    borderLeft: `2px solid ${palette.accent}`,
                    marginBottom: '12px', textAlign: 'left',
                    opacity: 0,
                    animation: 'mapa-fadeIn 0.6s ease forwards',
                    animationDelay: `${3 + (synthesis?.split(' ').length ?? 0) * 0.05 + i * 0.3}s`,
                  }}
                >
                  <p style={{ ...label, fontSize: '7px', marginBottom: '4px' }}>
                    {h.systemA} · {h.systemB}
                  </p>
                  <p style={{ ...bodyText, fontSize: '14px', textAlign: 'left', margin: 0 }}>
                    {h.resonance}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Psyche bar */}
          {act5 && (
            <div style={{
              marginTop: '32px',
              opacity: 0,
              animation: 'mapa-fadeIn 1s ease forwards',
              animationDelay: `${4 + (synthesis?.split(' ').length ?? 0) * 0.05}s`,
            }}>
              <p style={{ ...label, marginBottom: '12px' }}>estrutura psíquica</p>
              <PsycheBar psyche={soulMap.psyche} delay={0} />
              <p style={{
                ...bodyText, fontSize: '13px', marginTop: '10px', textAlign: 'center',
              }}>
                {soulMap.psyche.signature}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════
          ATO 6 — SELO
          O nome fica. Os dados ficam.
      ════════════════════════════════════ */}
      <section
        ref={act6Ref}
        style={{
          minHeight: '100svh', scrollSnapAlign: 'start',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          position: 'relative', padding: '48px 24px',
          background: `radial-gradient(ellipse at 50% 30%, ${palette.glow} 0%, transparent 60%)`,
        }}
      >
        <div
          ref={sealRef}
          style={{
            textAlign: 'center', position: 'relative', zIndex: 1,
            maxWidth: '600px', width: '100%', padding: '40px 24px',
            background: '#07070f',
          }}
        >
          {/* Header */}
          <p style={{
            ...label,
            opacity: act6 ? 1 : 0,
            transition: 'opacity 1s ease 0.3s',
          }}>
            Cartografia da Alma
          </p>

          {/* Name */}
          <h2 style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(32px, 8vw, 56px)',
            fontWeight: 300, color: 'var(--gold)',
            margin: '16px 0 0', lineHeight: 1.15,
            opacity: act6 ? 1 : 0,
            transition: 'opacity 1.2s ease 0.6s',
          }}>
            {fullName}
          </h2>

          {/* Gold line */}
          <div style={{
            width: '80px', height: '1px', background: 'var(--gold)',
            margin: '24px auto',
            transform: act6 ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 0.8s ease 1s',
          }} />

          {/* Data grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px',
            margin: '0 auto 8px', maxWidth: '480px',
            opacity: act6 ? 1 : 0,
            transition: 'opacity 1s ease 1.2s',
          }}>
            <div>
              <p style={{ ...label, marginBottom: '4px' }}>signo</p>
              <p style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 300, color: 'var(--white)', margin: 0 }}>
                {signPT}
              </p>
            </div>
            <div>
              <p style={{ ...label, marginBottom: '4px' }}>arquétipo</p>
              <p style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 300, color: 'var(--white)', margin: 0 }}>
                {soulMap.archetype.titlePt}
              </p>
            </div>
            <div>
              <p style={{ ...label, marginBottom: '4px' }}>árvore</p>
              <p style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 300, color: 'var(--white)', margin: 0 }}>
                {soulMap.sephirah.name}
              </p>
            </div>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px',
            margin: '0 auto', maxWidth: '320px',
            opacity: act6 ? 1 : 0,
            transition: 'opacity 1s ease 1.5s',
          }}>
            <div>
              <p style={{ ...label, marginBottom: '4px' }}>frequência</p>
              <p style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 300, color: 'var(--white)', margin: 0 }}>
                {soulMap.frequency.hz} Hz
              </p>
            </div>
            <div>
              <p style={{ ...label, marginBottom: '4px' }}>número</p>
              <p style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 300, color: 'var(--white)', margin: 0 }}>
                {soulMap.numerology.number}
              </p>
            </div>
          </div>

          {/* Provenance */}
          <p style={{
            ...label, fontSize: '7px', color: 'var(--white-ghost)',
            margin: '28px 0 0',
            opacity: act6 ? 1 : 0,
            transition: 'opacity 1s ease 1.8s',
          }}>
            cada conclusão tem origem rastreável · {signPT} · {soulMap.sephirah.name} · {soulMap.archetype.titlePt} · {soulMap.frequency.hz} Hz · {soulMap.numerology.number}
          </p>

          {/* Gold line before actions */}
          <div style={{
            width: '100%', height: '1px', background: 'var(--gold-line)',
            margin: '32px 0',
            opacity: act6 ? 1 : 0,
            transition: 'opacity 0.8s ease 2s',
          }} />

          {/* Actions */}
          <div style={{
            display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '28px',
            opacity: act6 ? 1 : 0,
            transition: 'opacity 1s ease 2.2s',
          }}>
            <button type="button" onClick={onShare} disabled={isSharing}
              style={{ ...actionBtn, opacity: isSharing ? 0.5 : 1 }}
              onMouseEnter={onEnter} onMouseLeave={onLeave}
            >
              {shareLabel}
            </button>
            <button type="button"
              onClick={() => setShowMeetInput(prev => !prev)}
              style={actionBtn}
              onMouseEnter={onEnter} onMouseLeave={onLeave}
            >
              cruzar com outra alma
            </button>
            <button type="button"
              onClick={() => {
                const signSlug = (signPT ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                const nameSlug = firstName.toLowerCase();
                exportPNG(sealRef.current, `cartografia-${nameSlug}-${signSlug}.png`);
              }}
              disabled={exporting}
              style={{ ...actionBtn, opacity: exporting ? 0.5 : 1 }}
              onMouseEnter={onEnter} onMouseLeave={onLeave}
            >
              {exporting ? 'gerando imagem...' : 'salvar como imagem'}
            </button>
            <button type="button" onClick={onReset}
              style={actionBtn}
              onMouseEnter={onEnter} onMouseLeave={onLeave}
            >
              nova cartografia
            </button>
          </div>

          {/* Meet input */}
          {showMeetInput && (
            <div style={{ marginTop: '24px' }}>
              {meetError && (
                <p style={{
                  fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 300,
                  letterSpacing: '0.2em', color: '#e85d5d', textAlign: 'center',
                  marginBottom: '12px',
                }}>
                  {meetError}
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', maxWidth: '420px', margin: '0 auto' }}>
                <input
                  type="text"
                  value={meetInput}
                  onChange={e => setMeetInput(e.target.value)}
                  placeholder="cole o link de outro mapa"
                  style={{
                    flex: 1, background: 'transparent', border: 'none',
                    borderBottom: '1px solid var(--gold-line)',
                    color: 'var(--white)', fontFamily: 'var(--serif)',
                    fontSize: '16px', fontWeight: 300, padding: '0 0 8px',
                    outline: 'none', caretColor: 'var(--gold)',
                  }}
                  onFocus={e => { e.target.style.borderBottomColor = 'var(--gold)'; }}
                  onBlur={e => { e.target.style.borderBottomColor = 'var(--gold-line)'; }}
                />
                <button
                  type="button"
                  disabled={meetLoading}
                  onClick={async () => {
                    if (!meetInput.trim() || meetLoading) return;
                    setMeetError(null);
                    setMeetLoading(true);
                    let token = meetInput.trim();
                    console.log('[cruzar] raw input:', token);
                    try { const url = new URL(token); const t = url.searchParams.get('token'); if (t) token = t; } catch { /* raw */ }
                    console.log('[cruzar] extracted token:', token);
                    const err = await onMeet(token);
                    console.log('[cruzar] result:', err ?? 'success');
                    if (err) setMeetError(err);
                    setMeetLoading(false);
                  }}
                  style={{ ...actionBtn, flexShrink: 0, opacity: meetLoading ? 0.5 : 1 }}
                  onMouseEnter={onEnter} onMouseLeave={onLeave}
                >
                  {meetLoading ? 'buscando...' : 'cruzar mapas →'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 480px) {
          section > div > div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
