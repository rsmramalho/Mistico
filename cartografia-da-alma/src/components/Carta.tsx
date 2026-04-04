import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

// ═══════════════════════════════════════
// Cartografia da Alma — Carta (base template)
// Full-screen card for each journey step
// ═══════════════════════════════════════

interface CartaProps {
  label: string;
  geometry: ReactNode;
  variation: string;
  body: ReactNode;
  oracle?: ReactNode;
  onContinue: () => void;
  showContinue: boolean;
  progress: string;
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--sans)',
  fontSize: '9px',
  fontWeight: 200,
  letterSpacing: '0.38em',
  color: 'var(--gold)',
  textTransform: 'uppercase',
};

const progressStyle: React.CSSProperties = {
  fontFamily: 'var(--sans)',
  fontSize: '9px',
  fontWeight: 200,
  letterSpacing: '0.38em',
  color: 'var(--white-ghost)',
  textTransform: 'uppercase',
};

export function Carta({
  label,
  geometry,
  variation,
  body,
  oracle,
  onContinue,
  showContinue,
  progress,
}: CartaProps) {
  const words = useMemo(() => variation.split(' '), [variation]);
  const variationDuration = words.length * 0.08 + 1.2;
  const bodyDelay = variationDuration;
  const oracleDelay = bodyDelay + 1.2;
  const continueDelay = oracle ? oracleDelay + 0.8 : bodyDelay + 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '48px 24px',
      }}
    >
      {/* ── Top bar ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '28px 32px',
        }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={labelStyle}
        >
          {label}
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={progressStyle}
        >
          {progress}
        </motion.span>
      </div>

      {/* ── Geometry background ── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.14,
          pointerEvents: 'none',
          animation: 'carta-rotate 100s linear infinite',
        }}
      >
        {geometry}
      </div>

      {/* ── Content ── */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '580px', width: '100%' }}>
        {/* Variation — word by word */}
        <p
          style={{
            fontFamily: 'var(--serif)',
            fontSize: '22px',
            fontWeight: 300,
            color: 'var(--white)',
            lineHeight: 1.6,
            marginBottom: '40px',
          }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 + i * 0.08 }}
              style={{ display: 'inline-block', marginRight: '0.3em' }}
            >
              {word}
            </motion.span>
          ))}
        </p>

        {/* Body */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: bodyDelay }}
        >
          {body}
        </motion.div>

        {/* Oracle */}
        {oracle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: oracleDelay }}
            style={{ marginTop: '48px' }}
          >
            {oracle}
          </motion.div>
        )}

        {/* Continue button */}
        {showContinue && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: continueDelay }}
            style={{ marginTop: '48px', textAlign: 'center' }}
          >
            <button
              onClick={onContinue}
              style={{
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
              }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.color = 'var(--white)';
                (e.target as HTMLElement).style.letterSpacing = '0.42em';
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.color = 'var(--gold)';
                (e.target as HTMLElement).style.letterSpacing = '0.32em';
              }}
            >
              continuar &rarr;
            </button>
          </motion.div>
        )}
      </div>

      {/* Keyframe for geometry rotation */}
      <style>{`
        @keyframes carta-rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
}
