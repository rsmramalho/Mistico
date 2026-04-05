import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════
// CartaReveal — The card opening ceremony
// A sealed card flips open with light, particles, and sound.
// Plays once per card, then yields to the content.
// ═══════════════════════════════════════

interface CartaRevealProps {
  label: string;
  icon: string;
  onComplete: () => void;
  onFlip?: () => void;        // sound trigger: flip
  onReveal?: (hz?: number) => void;  // sound trigger: reveal shimmer
  frequencyHz?: number;
}

// Gold particle burst
function Particles() {
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const distance = 60 + Math.random() * 80;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const size = 2 + Math.random() * 3;
    return { x, y, size, delay: Math.random() * 0.3 };
  });

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.8, x: 0, y: 0, scale: 1 }}
          animate={{ opacity: 0, x: p.x, y: p.y, scale: 0 }}
          transition={{ duration: 1.2, delay: p.delay, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'var(--gold)',
            top: '50%',
            left: '50%',
            marginTop: -p.size / 2,
            marginLeft: -p.size / 2,
          }}
        />
      ))}
    </>
  );
}

export function CartaReveal({ label, icon, onComplete, onFlip, onReveal, frequencyHz }: CartaRevealProps) {
  const [phase, setPhase] = useState<'sealed' | 'flipping' | 'revealed' | 'done'>('sealed');

  useEffect(() => {
    // sealed → flipping (after 0.8s)
    const t1 = setTimeout(() => {
      setPhase('flipping');
      onFlip?.();
    }, 800);

    // flipping → revealed (after 1.5s)
    const t2 = setTimeout(() => {
      setPhase('revealed');
      onReveal?.(frequencyHz);
    }, 1500);

    // revealed → done (after 3.0s)
    const t3 = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 3000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete, onFlip, onReveal, frequencyHz]);

  if (phase === 'done') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#07070f',
        }}
      >
        {/* ── The card ── */}
        <div style={{ position: 'relative', perspective: '800px' }}>
          <motion.div
            initial={{ rotateY: 0 }}
            animate={phase === 'flipping' || phase === 'revealed'
              ? { rotateY: 180 }
              : { rotateY: 0 }
            }
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            style={{
              width: '200px',
              height: '300px',
              position: 'relative',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Front (sealed) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                border: '1px solid var(--gold)',
                borderRadius: '2px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.08) 0%, transparent 70%), #0a0a14',
              }}
            >
              {/* Sealed geometry pattern */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{
                  width: '80px',
                  height: '80px',
                  border: '1px solid rgba(201,168,76,0.3)',
                  transform: 'rotate(45deg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    border: '1px solid rgba(201,168,76,0.2)',
                    borderRadius: '50%',
                  }}
                />
              </motion.div>
            </div>

            {/* Back (revealed) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                border: '1px solid var(--gold)',
                borderRadius: '2px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                background: 'radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.12) 0%, transparent 60%), #0a0a14',
              }}
            >
              <span style={{ fontSize: '36px' }}>{icon}</span>
              <span style={{
                fontFamily: 'var(--sans)',
                fontSize: '10px',
                fontWeight: 200,
                letterSpacing: '0.4em',
                color: 'var(--gold)',
                textTransform: 'uppercase',
              }}>
                {label}
              </span>
            </div>
          </motion.div>

          {/* Particle burst on reveal */}
          {(phase === 'revealed') && <Particles />}

          {/* Light flash on flip */}
          {phase === 'flipping' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 0.4, 0], scale: [0.5, 2, 3] }}
              transition={{ duration: 0.8 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '200px',
                height: '200px',
                marginTop: '-100px',
                marginLeft: '-100px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>

        {/* Label below card (fades in on reveal) */}
        {phase === 'revealed' && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontFamily: 'var(--serif)',
              fontSize: '20px',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'var(--white-dim)',
              marginTop: '32px',
              textAlign: 'center',
            }}
          >
            uma verdade de cada vez
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
