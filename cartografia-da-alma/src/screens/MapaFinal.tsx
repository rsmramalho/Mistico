import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { SoulMap, Element } from '../types/soul-map';
import { FlowerOfLife } from '../geometry/FlowerOfLife';
import { Hexagram } from '../geometry/Hexagram';
import { Metatron } from '../geometry/Metatron';
import { SriYantra } from '../geometry/SriYantra';
import { SephirahGlyph, ElementGlyph, ArchetypeGlyph } from '../geometry/glyphs';
import { FrequencyWave } from '../geometry/FrequencyWave';
import { getSignData } from '../engine/astrology';
import { getAllProvenance, getMapSeal } from '../engine/provenance';
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
}

// ── PT maps ──

const SIGN_PT: Record<string, string> = {
  Aries: '\u00c1ries', Taurus: 'Touro', Gemini: 'G\u00eameos', Cancer: 'C\u00e2ncer',
  Leo: 'Le\u00e3o', Virgo: 'Virgem', Libra: 'Libra', Scorpio: 'Escorpi\u00e3o',
  Sagittarius: 'Sagit\u00e1rio', Capricorn: 'Capric\u00f3rnio', Aquarius: 'Aqu\u00e1rio', Pisces: 'Peixes',
};

const ELEMENT_PT: Record<Element, string> = {
  fire: 'Fogo', earth: 'Terra', air: 'Ar', water: '\u00c1gua',
};

const MODALITY_PT: Record<string, string> = {
  cardinal: 'Cardinal', fixed: 'Fixo', mutable: 'Mut\u00e1vel',
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
  return `${archetype.titlePt} em ${sephirah.name}. ${sephirah.tikkun ?? ''} A frequ\u00eancia \u00e9 ${frequency.hz} Hz \u2014 ${frequency.keywordPt}. O n\u00famero ${numerology.number} carrega ${numerology.namePt}.`;
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

// ── Provenance Seal ──

function ProvenanceSeal({ soulMap, synthesisEnd }: { soulMap: SoulMap; synthesisEnd: number }) {
  const [open, setOpen] = useState(false);
  const seal = getMapSeal(soulMap);
  const allProvenance = getAllProvenance(soulMap);
  const delay = synthesisEnd + 0.5;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay }}
      style={{ margin: '24px 0 0', textAlign: 'center' }}
    >
      {/* Seal text */}
      <p
        style={{
          fontFamily: 'var(--sans)',
          fontSize: '8px',
          fontWeight: 200,
          letterSpacing: '0.3em',
          color: 'var(--white-ghost)',
          textTransform: 'uppercase',
          margin: '0 0 8px',
        }}
      >
        selo de proveniência
      </p>
      <p
        style={{
          fontFamily: 'var(--serif)',
          fontSize: '13px',
          fontWeight: 300,
          fontStyle: 'italic',
          color: 'var(--gold)',
          margin: '0 0 16px',
          lineHeight: 1.6,
          maxWidth: '520px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {seal}
      </p>

      {/* Expand full chain */}
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        style={{
          background: 'transparent',
          border: 'none',
          fontFamily: 'var(--sans)',
          fontSize: '8px',
          fontWeight: 200,
          letterSpacing: '0.3em',
          color: 'var(--white-ghost)',
          textTransform: 'uppercase',
          cursor: 'pointer',
          padding: '4px 0',
          transition: 'color 0.3s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--gold)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--white-ghost)'; }}
      >
        {open ? 'ocultar rastreio completo' : 'ver rastreio completo'}
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.4 }}
          style={{
            overflow: 'hidden',
            marginTop: '20px',
            textAlign: 'left',
            maxWidth: '520px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {allProvenance.map((prov, pi) => (
            <motion.div
              key={prov.cardId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: pi * 0.1 }}
              style={{ marginBottom: '24px' }}
            >
              <p
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '8px',
                  fontWeight: 200,
                  letterSpacing: '0.35em',
                  color: 'var(--gold)',
                  textTransform: 'uppercase',
                  margin: '0 0 8px',
                }}
              >
                {prov.title}
              </p>
              <div style={{ paddingLeft: '10px', borderLeft: '1px solid var(--gold-line)' }}>
                {prov.steps.map((step, si) => (
                  <div key={si} style={{ marginBottom: si < prov.steps.length - 1 ? '8px' : 0 }}>
                    <p
                      style={{
                        fontFamily: 'var(--sans)',
                        fontSize: '8px',
                        fontWeight: 200,
                        letterSpacing: '0.25em',
                        color: 'var(--white-ghost)',
                        textTransform: 'uppercase',
                        margin: '0 0 2px',
                      }}
                    >
                      {step.from}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--serif)',
                        fontSize: '13px',
                        fontWeight: 300,
                        color: 'var(--white-dim)',
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      → {step.to}
                    </p>
                  </div>
                ))}
              </div>
              <p
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: '12px',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: 'var(--gold)',
                  margin: '6px 0 0',
                  lineHeight: 1.5,
                  opacity: 0.7,
                }}
              >
                {prov.anchor}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

// ── Component ──

export function MapaFinal({ soulMap, onShare, onMeet, onReset, shareUrl, isSharing, shareError, shareCopied }: MapaFinalProps) {
  const [synthesis, setSynthesis] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [meetInput, setMeetInput] = useState('');
  const [showMeetInput, setShowMeetInput] = useState(false);

  const signPT = SIGN_PT[soulMap.sunSign] ?? soulMap.sunSign;
  const elementPT = ELEMENT_PT[soulMap.element];
  const modalityPT = MODALITY_PT[soulMap.modality] ?? soulMap.modality;
  const signData = getSignData(soulMap.sunSign);

  const now = useMemo(() => new Date(), []);
  const dateStr = `${now.getDate()} ${MONTHS_PT[now.getMonth()]} ${now.getFullYear()}`;

  // Compute bridges for this person
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
          setSynthesis(data.synthesis ?? data.answer ?? data.text ?? buildFallback(soulMap));
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
  }, [soulMap]);

  // Share / copy handler
  const handleShare = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      return;
    }
    onShare();
  };

  const shareLabel = isSharing
    ? 'gerando...'
    : shareCopied
      ? 'link copiado ✓'
      : shareError
        ? 'erro — tentar novamente'
        : shareUrl
          ? 'copiar link'
          : 'compartilhar meu mapa';

  // ── Styles ──

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--sans)',
    fontSize: '8px',
    fontWeight: 200,
    letterSpacing: '0.35em',
    color: 'var(--gold)',
    textTransform: 'uppercase',
    margin: '0 0 12px',
  };

  const cellTitleStyle: React.CSSProperties = {
    fontFamily: 'var(--serif)',
    fontSize: '28px',
    fontWeight: 300,
    color: 'var(--white)',
    margin: '8px 0 4px',
    lineHeight: 1.3,
  };

  const cellSubtitleStyle: React.CSSProperties = {
    fontFamily: 'var(--sans)',
    fontSize: '10px',
    fontWeight: 200,
    color: 'var(--white-dim)',
    margin: 0,
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
    const el = e.currentTarget;
    el.style.color = 'var(--white)';
    el.style.letterSpacing = '0.42em';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    el.style.color = 'var(--gold)';
    el.style.letterSpacing = '0.32em';
  };

  // Name words for word-by-word animation
  const nameWords = soulMap.birthData.name.split(' ');

  // Compute total animation end for actions delay
  const synthesisWords = (synthesis ?? '').split(' ').length;
  const synthesisEnd = 4.0 + (synthesisWords * 60) / 1000;
  const actionsDelay = synthesisEnd + 1;

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
          opacity: 0.18,
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
          <span
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '8px',
              fontWeight: 200,
              letterSpacing: '0.35em',
              color: 'var(--gold)',
              textTransform: 'uppercase',
            }}
          >
            Cartografia da Alma
          </span>
          <span
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '8px',
              fontWeight: 200,
              letterSpacing: '0.35em',
              color: 'var(--gold)',
              textTransform: 'uppercase',
            }}
          >
            {dateStr}
          </span>
        </div>

        <GoldLine />

        {/* ── Name section ── */}
        <div style={{ margin: '0 0 0' }}>
          <h1
            style={{
              fontFamily: 'var(--serif)',
              fontSize: '48px',
              fontWeight: 300,
              color: 'var(--white)',
              margin: '0 0 8px',
              lineHeight: 1.1,
              textAlign: 'left',
            }}
          >
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
          <p
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '9px',
              fontWeight: 200,
              letterSpacing: '0.35em',
              color: 'var(--gold)',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            {signPT} &middot; {elementPT} &middot; {modalityPT}
          </p>
        </div>

        <GoldLine />

        {/* ── Systems grid ── */}
        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.0 }}
        >
          {/* Signo Solar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.0 }}
          >
            <p style={labelStyle}>Signo Solar</p>
            <ElementGlyph element={soulMap.element} size={32} />
            <p style={cellTitleStyle}>{signPT}</p>
            <p style={cellSubtitleStyle}>{signData.elementQuality}</p>
          </motion.div>

          {/* Kabbalah */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.2 }}
          >
            <p style={labelStyle}>Kabbalah</p>
            <SephirahGlyph name={soulMap.sephirah.name} size={32} />
            <p style={cellTitleStyle}>{soulMap.sephirah.name}</p>
            <p style={cellSubtitleStyle}>{soulMap.sephirah.planet}</p>
          </motion.div>

          {/* Arqu\u00e9tipo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.4 }}
          >
            <p style={labelStyle}>Arqu\u00e9tipo</p>
            <ArchetypeGlyph name={soulMap.archetype.name} size={32} />
            <p style={cellTitleStyle}>{soulMap.archetype.titlePt}</p>
            <p style={cellSubtitleStyle}>{soulMap.archetype.coreDesire}</p>
          </motion.div>

          {/* Frequ\u00eancia */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.6 }}
          >
            <p style={labelStyle}>Frequ\u00eancia</p>
            <FrequencyWave hz={soulMap.frequency.hz} width={120} height={40} />
            <p style={cellTitleStyle}>{soulMap.frequency.hz} Hz</p>
            <p style={cellSubtitleStyle}>{soulMap.frequency.keywordPt}</p>
          </motion.div>

          {/* Numerologia — full width */}
          <motion.div
            style={{ gridColumn: '1 / -1' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.8 }}
          >
            <p style={labelStyle}>Numerologia</p>
            <p style={cellTitleStyle}>
              N\u00famero {soulMap.numerology.number} &middot; {soulMap.numerology.namePt}
            </p>
            <p
              style={{
                fontFamily: 'var(--serif)',
                fontSize: '16px',
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'var(--white-dim)',
                margin: '8px 0 0',
                lineHeight: 1.6,
              }}
            >
              {soulMap.numerology.traits}
            </p>
          </motion.div>
        </motion.div>

        {/* ── Bridge highlights — cross-system resonances ── */}
        {bridges.highlights.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 3.0 }}
            style={{ margin: '32px 0 0' }}
          >
            <p
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '8px',
                fontWeight: 200,
                letterSpacing: '0.35em',
                color: 'var(--gold)',
                textTransform: 'uppercase',
                margin: '0 0 16px',
              }}
            >
              ressonâncias
            </p>
            {bridges.highlights.map((h: BridgeHighlight, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 3.2 + i * 0.2 }}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '8px',
                  marginBottom: '10px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '8px',
                    fontWeight: 200,
                    letterSpacing: '0.2em',
                    color: 'var(--gold)',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {h.systemA} · {h.systemB}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--serif)',
                    fontSize: '14px',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    color: 'var(--white-dim)',
                    lineHeight: 1.5,
                  }}
                >
                  {h.resonance}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ── Divider before synthesis ── */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 3.5 }}
          style={{ transformOrigin: 'left' }}
        >
          <GoldLine />
        </motion.div>

        {/* ── Synthesis ── */}
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
                fontFamily: 'var(--sans)',
                fontSize: '9px',
                fontWeight: 200,
                letterSpacing: '0.35em',
                color: 'var(--gold)',
                textTransform: 'uppercase',
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
                  delayMs={4000 + pi * 400}
                  perWordMs={60}
                />
              </p>
            ))
          ) : null}
        </div>

        {/* ── Provenance seal ── */}
        <ProvenanceSeal soulMap={soulMap} synthesisEnd={synthesisEnd} />

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
            onClick={handleShare}
            disabled={isSharing}
            style={{ ...actionStyle, opacity: isSharing ? 0.5 : 1 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {shareLabel}
          </button>
          <button
            type="button"
            onClick={() => setShowMeetInput(prev => !prev)}
            style={actionStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            cruzar com outra alma
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
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </motion.div>
  );
}
