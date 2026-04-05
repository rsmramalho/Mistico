import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { SoulMap, Element } from '../types/soul-map';
import { FlowerOfLife } from '../geometry/FlowerOfLife';
import { Hexagram } from '../geometry/Hexagram';
import { Metatron } from '../geometry/Metatron';
import { SriYantra } from '../geometry/SriYantra';
import { ElementGlyph } from '../geometry/glyphs';
import { FrequencyWave } from '../geometry/FrequencyWave';
import { PsycheBar } from '../components/PsycheBar';
import { computeBridges } from '../engine/bridges';
import type { BridgeHighlight } from '../engine/bridges';

// ── Props ──

interface MapaFinalProps {
  soulMap: SoulMap;
  onShare: () => void;
  onMeet: (token: string) => void;
  onReset: () => void;
  shareUrl?: string | null;
  isSharing?: boolean;
  shareError?: boolean;
  shareCopied?: boolean;
  tier?: import('../types/database').ReadingTier;
  readingId?: string | null;
}

// ── PT maps ──

const SIGN_PT: Record<string, string> = {
  Aries: 'Áries', Taurus: 'Touro', Gemini: 'Gêmeos', Cancer: 'Câncer',
  Leo: 'Leão', Virgo: 'Virgem', Libra: 'Libra', Scorpio: 'Escorpião',
  Sagittarius: 'Sagitário', Capricorn: 'Capricórnio', Aquarius: 'Aquário', Pisces: 'Peixes',
};

const ELEMENT_PT: Record<Element, string> = {
  fire: 'Fogo', earth: 'Terra', air: 'Ar', water: 'Água',
};

const MONTHS_PT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

// ── Element geometry ──

function ElementGeometry({ element }: { element: Element }) {
  switch (element) {
    case 'air': return <FlowerOfLife />;
    case 'fire': return <Hexagram />;
    case 'earth': return <Metatron />;
    case 'water': return <SriYantra />;
  }
}

// ── Fallback synthesis builder ──

function buildFallback(soulMap: SoulMap): string {
  const { archetype, sephirah, frequency, numerology } = soulMap;
  return `${archetype.titlePt} em ${sephirah.name}. ${sephirah.tikkun ?? ''} A frequência é ${frequency.hz} Hz — ${frequency.keywordPt}. O número ${numerology.number} carrega ${numerology.namePt}.`;
}

// ── Gold divider ──

function GoldLine() {
  return (
    <div
      style={{
        width: '100%',
        height: '1px',
        background: 'var(--gold-line)',
        margin: '32px 0',
      }}
    />
  );
}

// ── Word-by-word text reveal ──

function WordReveal({
  text,
  delayMs,
  perWordMs,
  style,
}: {
  text: string;
  delayMs: number;
  perWordMs: number;
  style?: React.CSSProperties;
}) {
  const words = text.split(' ');
  return (
    <span style={style}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: delayMs / 1000 + (i * perWordMs) / 1000 }}
        >
          {word}{i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </span>
  );
}

// ── Component ──

export function MapaFinal({ soulMap, onShare, onMeet, onReset, shareUrl, isSharing, shareError, shareCopied, tier = 'session', readingId }: MapaFinalProps) {
  const [synthesis, setSynthesis] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [meetInput, setMeetInput] = useState('');
  const [showMeetInput, setShowMeetInput] = useState(false);

  const signPT = SIGN_PT[soulMap.sunSign] ?? soulMap.sunSign;
  const elementPT = ELEMENT_PT[soulMap.element];

  const now = useMemo(() => new Date(), []);
  const dateStr = `${now.getDate()} ${MONTHS_PT[now.getMonth()]} ${now.getFullYear()}`;

  // Compute bridges for API call
  const bridges = useMemo(() => computeBridges(soulMap), [soulMap]);

  // Fetch synthesis on mount
  useEffect(() => {
    let cancelled = false;

    async function fetchSynthesis() {
      try {
        const bridgePayload = bridges.highlights.map(h => ({
          systemA: h.systemA,
          systemB: h.systemB,
          resonance: h.resonance,
        }));
        const res = await fetch('/api/carta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ soulMap, prompt: 'synthesis', bridges: bridgePayload }),
        });
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        if (!cancelled) {
          setSynthesis(data.carta ?? data.synthesis ?? data.answer ?? data.text ?? buildFallback(soulMap));
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setSynthesis(buildFallback(soulMap));
          setLoading(false);
        }
      }
    }

    fetchSynthesis();
    return () => { cancelled = true; };
  }, [soulMap, bridges]);

  // Share label with feedback
  const shareLabel = isSharing
    ? 'gerando...'
    : shareCopied
      ? 'link copiado ✓'
      : shareError
        ? 'erro — tentar novamente'
        : shareUrl
          ? 'copiar link'
          : 'compartilhar meu mapa';

  // Synthesis timing
  const synthesisWords = (synthesis ?? '').split(' ').length;
  const synthesisEnd = 3.0 + (synthesisWords * 60) / 1000;
  const actionsDelay = synthesisEnd + 1;

  // ── Styles ──

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--sans)',
    fontSize: '8px',
    fontWeight: 200,
    letterSpacing: '0.35em',
    color: 'var(--gold)',
    textTransform: 'uppercase',
    margin: '0 0 6px',
  };

  const actionStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--gold)',
    fontFamily: 'var(--sans)',
    fontSize: '10px',
    fontWeight: 300,
    letterSpacing: '0.32em',
    color: 'var(--gold)',
    textTransform: 'uppercase',
    padding: '0 0 6px',
    transition: 'color 0.3s, letter-spacing 0.3s',
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.color = 'var(--white)';
    e.currentTarget.style.letterSpacing = '0.42em';
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.color = 'var(--gold)';
    e.currentTarget.style.letterSpacing = '0.32em';
  };

  const nameWords = soulMap.birthData.name.split(' ');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      style={{ position: 'relative' }}
    >
      {/* ── Background element geometry ── */}
      <motion.div
        style={{
          position: 'absolute',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0.12,
          pointerEvents: 'none',
          width: 'min(80vw, 500px)',
          height: 'min(80vw, 500px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 0,
        }}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{
          scale: { duration: 3, delay: 0.5, ease: 'easeOut' },
          rotate: { duration: 160, repeat: Infinity, ease: 'linear' },
        }}
      >
        <ElementGeometry element={soulMap.element} />
      </motion.div>

      {/* ── Scrollable content ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '640px',
          margin: '0 auto',
          padding: '64px 24px',
        }}
      >
        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--sans)', fontSize: '8px', fontWeight: 200, letterSpacing: '0.35em', color: 'var(--gold)', textTransform: 'uppercase' }}>
            Cartografia da Alma
          </span>
          <span style={{ fontFamily: 'var(--sans)', fontSize: '8px', fontWeight: 200, letterSpacing: '0.35em', color: 'var(--gold)', textTransform: 'uppercase' }}>
            {dateStr}
          </span>
        </div>

        <GoldLine />

        {/* ── Name ── */}
        <div style={{ marginBottom: '8px' }}>
          <h1 style={{
            fontFamily: 'var(--serif)', fontSize: '48px', fontWeight: 300,
            color: 'var(--white)', margin: '0 0 8px', lineHeight: 1.1, textAlign: 'left',
          }}>
            {nameWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.0 + i * 0.1 }}
              >
                {word}{i < nameWords.length - 1 ? ' ' : ''}
              </motion.span>
            ))}
          </h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200, letterSpacing: '0.35em', color: 'var(--gold)', textTransform: 'uppercase', margin: 0 }}>
            {signPT} &middot; {elementPT} &middot; {soulMap.archetype.titlePt} &middot; {soulMap.frequency.hz} Hz &middot; {soulMap.numerology.number}
          </p>
        </div>

        <GoldLine />

        {/* ── Your map — clean summary ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '8px' }}>
            <div>
              <p style={labelStyle}>signo</p>
              <ElementGlyph element={soulMap.element} size={24} />
              <p style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 300, color: 'var(--white)', margin: '4px 0 0' }}>
                {signPT}
              </p>
            </div>
            <div>
              <p style={labelStyle}>arquétipo</p>
              <p style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 300, color: 'var(--white)', margin: '4px 0 0' }}>
                {soulMap.archetype.titlePt}
              </p>
            </div>
            <div>
              <p style={labelStyle}>árvore</p>
              <p style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 300, color: 'var(--white)', margin: '4px 0 0' }}>
                {soulMap.sephirah.name}
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <p style={labelStyle}>frequência</p>
              <FrequencyWave hz={soulMap.frequency.hz} width={100} height={32} />
              <p style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 300, color: 'var(--white)', margin: '4px 0 0' }}>
                {soulMap.frequency.hz} Hz — {soulMap.frequency.keywordPt}
              </p>
            </div>
            <div>
              <p style={labelStyle}>número</p>
              <p style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 300, color: 'var(--white)', margin: '4px 0 0' }}>
                {soulMap.numerology.number} — {soulMap.numerology.namePt}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Divider before synthesis ── */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 2.5 }}
          style={{ transformOrigin: 'left' }}
        >
          <GoldLine />
        </motion.div>

        {/* ── Synthesis (the star of the show) ── */}
        <div
          style={{
            fontFamily: 'var(--serif)',
            fontSize: '18px',
            fontWeight: 300,
            fontStyle: 'italic',
            lineHeight: 1.8,
            color: 'var(--white-dim)',
            maxWidth: '580px',
            textAlign: 'center',
            margin: '0 auto',
            minHeight: '60px',
          }}
        >
          {loading ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
                letterSpacing: '0.35em', color: 'var(--gold)', textTransform: 'uppercase',
                textAlign: 'center',
              }}
            >
              o mapa se revela...
            </motion.p>
          ) : synthesis ? (
            synthesis.split('\n').filter(Boolean).map((paragraph, pi) => (
              <p key={pi} style={{ margin: pi === 0 ? 0 : '1.2em 0 0' }}>
                <WordReveal
                  text={paragraph}
                  delayMs={3000 + pi * 400}
                  perWordMs={60}
                />
              </p>
            ))
          ) : null}
        </div>

        {/* ── Psyche — visual bar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: synthesisEnd + 0.3 }}
          style={{ margin: '8px 0 0' }}
        >
          <p style={{
            fontFamily: 'var(--sans)', fontSize: '8px', fontWeight: 200,
            letterSpacing: '0.35em', color: 'var(--gold)', textTransform: 'uppercase',
            margin: '0 0 12px', textAlign: 'center',
          }}>
            estrutura psíquica
          </p>
          <PsycheBar psyche={soulMap.psyche} delay={synthesisEnd + 0.5} />
          <p style={{
            fontFamily: 'var(--serif)', fontSize: '14px', fontWeight: 300,
            fontStyle: 'italic', color: 'var(--white-dim)', textAlign: 'center',
            marginTop: '10px', lineHeight: 1.6,
          }}>
            {soulMap.psyche.signature}
          </p>
        </motion.div>

        {/* ── Resonances — cross-system connections ── */}
        {bridges.highlights.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: synthesisEnd + 0.8 }}
            style={{ margin: '24px 0 0' }}
          >
            <GoldLine />
            <p style={{
              fontFamily: 'var(--sans)', fontSize: '8px', fontWeight: 200,
              letterSpacing: '0.35em', color: 'var(--gold)', textTransform: 'uppercase',
              margin: '0 0 16px', textAlign: 'center',
            }}>
              conexões entre os sistemas
            </p>
            <div style={{ maxWidth: '520px', margin: '0 auto' }}>
              {bridges.highlights.map((h: BridgeHighlight, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: synthesisEnd + 1.0 + i * 0.25 }}
                  style={{
                    padding: '12px 0 12px 14px',
                    borderLeft: '2px solid var(--gold)',
                    marginBottom: '12px',
                  }}
                >
                  <p style={{
                    fontFamily: 'var(--sans)', fontSize: '8px', fontWeight: 200,
                    letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase',
                    margin: '0 0 4px',
                  }}>
                    {h.systemA} · {h.systemB}
                  </p>
                  <p style={{
                    fontFamily: 'var(--serif)', fontSize: '15px', fontWeight: 300,
                    color: 'var(--white-dim)', lineHeight: 1.6, margin: 0,
                  }}>
                    {h.resonance}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Provenance seal ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: synthesisEnd + 1.5 }}
          style={{ textAlign: 'center', margin: '24px 0 0' }}
        >
          <p style={{
            fontFamily: 'var(--sans)', fontSize: '8px', fontWeight: 200,
            letterSpacing: '0.25em', color: 'var(--white-ghost)', textTransform: 'uppercase',
          }}>
            cada conclusão tem origem rastreável · {signPT} · {soulMap.sephirah.name} · {soulMap.archetype.titlePt} · {soulMap.frequency.hz} Hz · {soulMap.numerology.number}
          </p>
        </motion.div>

        {/* ── Divider before actions ── */}
        <GoldLine />

        {/* ── Actions ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: loading ? 5 : actionsDelay }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '32px',
          }}
        >
          <button
            type="button"
            onClick={onShare}
            disabled={isSharing}
            style={{ ...actionStyle, opacity: isSharing ? 0.5 : 1 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {shareLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              if (tier === 'oracle') {
                setShowMeetInput(prev => !prev);
              } else {
                // Open payment for Soul Mate
                const kiwifyUrl = import.meta.env.VITE_KIWIFY_SOULMATE_URL;
                const stripeUrl = import.meta.env.VITE_STRIPE_SOULMATE_URL;
                if (kiwifyUrl) {
                  window.open(`${kiwifyUrl}${readingId ? `?custom_field_1=${readingId}` : ''}`, '_blank');
                } else if (stripeUrl) {
                  window.open(`${stripeUrl}${readingId ? `?client_reference_id=${readingId}` : ''}`, '_blank');
                } else {
                  // Fallback: Stripe API checkout
                  fetch('/api/create-checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ readingId, product: 'soulmate' }),
                  })
                    .then(r => r.json())
                    .then(data => { if (data.url) window.open(data.url, '_blank'); });
                }
              }
            }}
            style={actionStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {tier === 'oracle' ? 'cruzar com outra alma' : 'cruzar com outra alma — R$29'}
          </button>
          <button
            type="button"
            onClick={onReset}
            style={actionStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            nova cartografia
          </button>
        </motion.div>

        {/* ── Meet input (toggled) ── */}
        {showMeetInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.4 }}
            style={{ overflow: 'hidden', marginTop: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', maxWidth: '480px', margin: '0 auto' }}>
              <input
                type="text"
                value={meetInput}
                onChange={e => setMeetInput(e.target.value)}
                placeholder="cole o link de outro mapa"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--gold-line)',
                  color: 'var(--white)',
                  fontFamily: 'var(--serif)',
                  fontSize: '16px',
                  fontWeight: 300,
                  padding: '0 0 8px',
                  outline: 'none',
                  caretColor: 'var(--gold)',
                }}
                onFocus={e => { e.target.style.borderBottomColor = 'var(--gold)'; }}
                onBlur={e => { e.target.style.borderBottomColor = 'var(--gold-line)'; }}
              />
              <button
                type="button"
                onClick={() => {
                  if (!meetInput.trim()) return;
                  let token = meetInput.trim();
                  try { const url = new URL(token); const t = url.searchParams.get('token'); if (t) token = t; } catch { /* raw token */ }
                  onMeet(token);
                }}
                style={{ ...actionStyle, flexShrink: 0 }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                cruzar mapas →
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Responsive: single column on mobile ── */}
      <style>{`
        @media (max-width: 480px) {
          div[style*="gridTemplateColumns: '1fr 1fr 1fr'"],
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </motion.div>
  );
}
