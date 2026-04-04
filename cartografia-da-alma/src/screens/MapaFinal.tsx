import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { SoulMap, Element } from '../types/soul-map';
import { FlowerOfLife } from '../geometry/FlowerOfLife';
import { Hexagram } from '../geometry/Hexagram';
import { Metatron } from '../geometry/Metatron';
import { SriYantra } from '../geometry/SriYantra';

// ── Props ──

interface MapaFinalProps {
  soulMap: SoulMap;
  onShare: () => void;
  onMeet: () => void;
  onReset: () => void;
  shareUrl?: string | null;
  isSharing?: boolean;
}

// ── Sign names (Portuguese) ──

const SIGN_PT: Record<string, string> = {
  Aries: 'Aries', Taurus: 'Touro', Gemini: 'Gemeos', Cancer: 'Cancer',
  Leo: 'Leao', Virgo: 'Virgem', Libra: 'Libra', Scorpio: 'Escorpiao',
  Sagittarius: 'Sagitario', Capricorn: 'Capricornio', Aquarius: 'Aquario', Pisces: 'Peixes',
};

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
  return `${archetype.titlePt} em ${sephirah.name}. ${sephirah.tikkun ?? ''} A frequencia e ${frequency.hz} Hz — ${frequency.keywordPt}. O numero ${numerology.number} carrega ${numerology.namePt}.`;
}

// ── Component ──

export function MapaFinal({ soulMap, onShare, onMeet, onReset, shareUrl, isSharing }: MapaFinalProps) {
  const [synthesis, setSynthesis] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSynthesis, setShowSynthesis] = useState(false);

  const signPT = SIGN_PT[soulMap.sunSign] ?? soulMap.sunSign;
  const metaLine = `${soulMap.birthData.name} · ${signPT} · ${soulMap.sephirah.name} · ${soulMap.archetype.titlePt}`;

  // Fetch synthesis on mount
  useEffect(() => {
    let cancelled = false;

    async function fetchSynthesis() {
      try {
        const res = await fetch('/api/carta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(soulMap),
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

  // Show synthesis with delay after loading completes
  useEffect(() => {
    if (!loading && synthesis) {
      const timer = setTimeout(() => setShowSynthesis(true), 500);
      return () => clearTimeout(timer);
    }
  }, [loading, synthesis]);

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
    : shareUrl
      ? 'copiar link'
      : 'compartilhar meu mapa';

  // ── Styles ──

  const containerStyle: React.CSSProperties = {
    height: '100svh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const geometryWrapperStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: 0.25,
    pointerEvents: 'none',
    width: 'min(90vw, 600px)',
    height: 'min(90vw, 600px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const metaStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: '32px 24px',
    textAlign: 'center',
    fontFamily: 'var(--sans)',
    fontSize: '9px',
    fontWeight: 200,
    letterSpacing: '0.35em',
    color: 'var(--gold)',
    textTransform: 'uppercase',
  };

  const synthesisStyle: React.CSSProperties = {
    fontFamily: 'var(--serif)',
    fontSize: '20px',
    fontWeight: 300,
    lineHeight: 1.8,
    color: 'var(--white-dim)',
    maxWidth: '580px',
    textAlign: 'center',
    padding: '0 24px',
    position: 'relative',
    zIndex: 1,
  };

  const loadingStyle: React.CSSProperties = {
    fontFamily: 'var(--sans)',
    fontSize: '9px',
    fontWeight: 200,
    letterSpacing: '0.35em',
    color: 'var(--gold)',
    textTransform: 'uppercase',
    position: 'relative',
    zIndex: 1,
  };

  const footerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '32px 24px',
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '32px',
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      style={containerStyle}
    >
      {/* Background geometry — slow rotation */}
      <motion.div
        style={geometryWrapperStyle}
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
      >
        <ElementGeometry element={soulMap.element} />
      </motion.div>

      {/* Top bar — metadata */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        style={metaStyle}
      >
        {metaLine}
      </motion.div>

      {/* Center — synthesis or loading */}
      {loading ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={loadingStyle}
        >
          o mapa se revela...
        </motion.p>
      ) : showSynthesis && synthesis ? (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0 }}
          style={synthesisStyle}
        >
          {synthesis.split('\n').filter(Boolean).map((p, i) => (
            <p key={i} style={{ margin: i === 0 ? 0 : '1.2em 0 0' }}>{p}</p>
          ))}
        </motion.div>
      ) : null}

      {/* Footer — three actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        style={footerStyle}
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
          onClick={onMeet}
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
    </motion.div>
  );
}
