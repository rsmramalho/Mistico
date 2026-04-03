import { motion } from 'framer-motion';
import { TreeOfLife } from '../geometry/TreeOfLife';
import type { SoulMap, Element } from '../types/soul-map';

interface LoadingProps {
  soulMap?: SoulMap | null;
}

const SIGN_PT: Record<string, string> = {
  Aries: 'Áries', Taurus: 'Touro', Gemini: 'Gêmeos', Cancer: 'Câncer',
  Leo: 'Leão', Virgo: 'Virgem', Libra: 'Libra', Scorpio: 'Escorpião',
  Sagittarius: 'Sagitário', Capricorn: 'Capricórnio', Aquarius: 'Aquário', Pisces: 'Peixes',
};

const ELEMENT_PT: Record<Element, string> = {
  fire: 'Fogo', earth: 'Terra', air: 'Ar', water: 'Água',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
  letterSpacing: '0.38em', color: 'var(--gold)', textTransform: 'uppercase',
};

const valueStyle: React.CSSProperties = {
  fontFamily: 'var(--serif)', fontSize: '32px', fontWeight: 300,
  color: 'var(--white)', lineHeight: 1.2,
};

function getSteps(soulMap: SoulMap) {
  return [
    { label: 'signo solar', value: SIGN_PT[soulMap.sunSign] ?? soulMap.sunSign },
    { label: 'sephirah', value: soulMap.sephirah.name },
    { label: 'arquétipo', value: soulMap.archetype.titlePt },
    { label: 'frequência', value: `${soulMap.frequency.hz} Hz` },
    { label: 'número', value: String(soulMap.numerology.number) },
    { label: 'elemento', value: ELEMENT_PT[soulMap.element] },
  ];
}

export function Loading({ soulMap }: LoadingProps) {
  const steps = soulMap ? getSteps(soulMap) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '24px',
        position: 'relative',
      }}
    >
      {/* Tree of Life background */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center', opacity: 0.12,
        pointerEvents: 'none',
      }}>
        <div style={{ width: 'min(400px, 80vw)', height: 'min(500px, 70vh)' }}>
          <TreeOfLife />
        </div>
      </div>

      {/* Ritual sequence */}
      {steps ? (
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '48px' }}>
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 1, ease: 'easeOut' }}
              >
                <p style={{ ...labelStyle, marginBottom: '6px' }}>{step.label}</p>
                <p style={valueStyle}>{step.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Closing line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 6.2 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ width: '40px', height: '1px', background: 'var(--gold-line)', margin: '0 auto 20px' }} />
            <p style={{
              fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 300,
              fontStyle: 'italic', color: 'var(--white-ghost)',
            }}>
              cartografando sua alma
            </p>
          </motion.div>
        </div>
      ) : (
        /* Fallback — no soulMap (e.g. loading shared reading from URL) */
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <motion.span
            animate={{ opacity: [0.25, 0.7, 0.25] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={labelStyle}
          >
            consultando os mapas
          </motion.span>
        </motion.p>
      )}
    </motion.div>
  );
}
