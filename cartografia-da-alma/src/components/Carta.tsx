import { useMemo, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

// ═══════════════════════════════════════
// Cartografia da Alma — Carta (base template)
// Full-screen card for each journey step
// Timing from ROADMAP-V2:
//   t=0.0s  Fade in (opacity 0→1, 1.2s)
//   t=0.3s  Label appears
//   t=0.8s  Geometry scale 0.95→1.0 (2s ease out)
//   t=1.0s  Variation emerges (word by word, 80ms each)
//   t=?     Body (paragraph by paragraph, stagger 0.4s)
//   t=?+1.5s  Oracle appears (if any)
//   t=?+1.5s  [continuar →] appears — NEVER before 3s after body start
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
  minPause?: number;        // minimum seconds before "continuar" is clickable (default 3)
  fundoEscuro?: boolean;    // darker background for shadow card (#050508)
  audioPlaying?: boolean;
  onAudioToggle?: () => void;
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
  minPause = 4,
  fundoEscuro = false,
  audioPlaying = false,
  onAudioToggle,
}: CartaProps) {
  const words = useMemo(() => variation.split(' '), [variation]);
  const variationDuration = words.length * 0.14 + 0.8; // word animation starts at t=0.8
  const bodyDelay = variationDuration;
  const oracleDelay = bodyDelay + 4.0;
  const continueDelay = oracle ? oracleDelay + 1.5 : bodyDelay + 4.0;

  // Track whether minPause has elapsed since body appeared
  const [continueEnabled, setContinueEnabled] = useState(false);
  const bodyAppearedRef = useRef(false);

  useEffect(() => {
    if (!showContinue) {
      setContinueEnabled(false);
      bodyAppearedRef.current = false;
      return;
    }

    if (bodyAppearedRef.current) return;
    bodyAppearedRef.current = true;

    const timer = setTimeout(() => {
      setContinueEnabled(true);
    }, minPause * 1000);

    return () => clearTimeout(timer);
  }, [showContinue, minPause]);

  return (
    <>
      {/* Dark background overlay for shadow card */}
      {fundoEscuro && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#050508',
            zIndex: 0,
          }}
        />
      )}

      {/* Atmospheric texture — warm ambient glow */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: fundoEscuro
            ? 'radial-gradient(ellipse at 50% 30%, rgba(120,60,30,0.06) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at 50% 20%, rgba(201,168,76,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(140,100,50,0.03) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        style={{
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: '48px 24px',
          zIndex: 1,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {onAudioToggle && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                onClick={onAudioToggle}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontFamily: 'var(--sans)',
                  fontSize: '9px',
                  fontWeight: 200,
                  letterSpacing: '0.2em',
                  color: audioPlaying ? 'var(--gold)' : 'var(--white-ghost)',
                  textTransform: 'uppercase',
                  padding: 0,
                  transition: 'color 0.3s',
                }}
              >
                {audioPlaying ? '♪ on' : '♪ off'}
              </motion.button>
            )}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              style={progressStyle}
            >
              {progress}
            </motion.span>
          </div>
        </div>

        {/* ── Geometry background ── */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0.14 }}
          animate={{ scale: 1.0, opacity: 0.14 }}
          transition={{ duration: 2, delay: 0.8, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            animation: 'carta-rotate 160s linear infinite',
          }}
        >
          {geometry}
        </motion.div>

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
                transition={{ duration: 0.5, delay: 0.8 + i * 0.14 }}
                style={{ display: 'inline-block', marginRight: '0.3em' }}
              >
                {word}
              </motion.span>
            ))}
          </p>

          {/* Body — fade in with breathing pace */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: bodyDelay + 1.2 }}
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
              animate={{ opacity: continueEnabled ? 1 : 0.2 }}
              transition={{ duration: 1.2, delay: continueDelay }}
              style={{ marginTop: '48px', textAlign: 'center' }}
            >
              <button
                onClick={onContinue}
                disabled={!continueEnabled}
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
                  cursor: continueEnabled ? 'pointer' : 'default',
                  transition: 'color 0.3s, letter-spacing 0.3s, opacity 0.8s',
                  opacity: continueEnabled ? 1 : 0.2,
                }}
                onMouseEnter={e => {
                  if (!continueEnabled) return;
                  (e.target as HTMLElement).style.color = 'var(--white)';
                  (e.target as HTMLElement).style.letterSpacing = '0.42em';
                }}
                onMouseLeave={e => {
                  if (!continueEnabled) return;
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
    </>
  );
}
