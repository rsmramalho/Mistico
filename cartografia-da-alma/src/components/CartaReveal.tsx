import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════
// CartaReveal — The card opening ceremony (V2)
// Slower. More mystical. Each card has its own phrase.
// sealed (2s) → pulse (1.5s) → flip (1.2s) → reveal (3s) → fade out (1.5s)
// Total: ~9s of ritual before content
// ═══════════════════════════════════════

interface CartaRevealProps {
  label: string;
  icon: string;
  cardIndex: number;
  onComplete: () => void;
  onFlip?: () => void;
  onReveal?: (hz?: number) => void;
  frequencyHz?: number;
}

// Each card has a unique mystical phrase
const CARD_PHRASES: Record<number, string[]> = {
  0: ['o céu daquela data', 'carrega um padrão', 'que ainda não foi nomeado'],
  1: ['existe uma posição', 'na árvore invisível', 'que é sua por direito'],
  2: ['há algo que você', 'protege demais', 'e que precisa ser visto'],
  3: ['uma frequência vibra', 'no seu campo', 'desde antes de você nascer'],
  4: ['seu nome carrega', 'um número', 'e o número carrega um segredo'],
};

// More particles, slower, with trails
function Particles() {
  const particles = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * Math.PI * 2 + Math.random() * 0.3;
    const distance = 80 + Math.random() * 120;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const size = 1.5 + Math.random() * 3;
    return { x, y, size, delay: Math.random() * 0.6 };
  });

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.9, x: 0, y: 0, scale: 1 }}
          animate={{ opacity: 0, x: p.x, y: p.y, scale: 0 }}
          transition={{ duration: 2.0, delay: p.delay, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'var(--gold)',
            boxShadow: `0 0 ${p.size * 2}px rgba(201,168,76,0.4)`,
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

// Floating dust in background
function FloatingDust() {
  const motes = Array.from({ length: 8 }, () => ({
    x: 20 + Math.random() * 60,
    y: 20 + Math.random() * 60,
    size: 1 + Math.random() * 2,
    duration: 4 + Math.random() * 6,
    delay: Math.random() * 3,
  }));

  return (
    <>
      {motes.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0], y: [0, -30, -60] }}
          transition={{ duration: m.duration, delay: m.delay, repeat: Infinity }}
          style={{
            position: 'absolute',
            left: `${m.x}%`,
            top: `${m.y}%`,
            width: m.size,
            height: m.size,
            borderRadius: '50%',
            background: 'var(--gold)',
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  );
}

export function CartaReveal({ label, icon, cardIndex, onComplete, onFlip, onReveal, frequencyHz }: CartaRevealProps) {
  const [phase, setPhase] = useState<'sealed' | 'pulsing' | 'flipping' | 'revealed' | 'fading'>('sealed');
  const phrases = CARD_PHRASES[cardIndex] ?? CARD_PHRASES[0];

  useEffect(() => {
    // sealed: card appears with dust (2s)
    const t1 = setTimeout(() => setPhase('pulsing'), 2000);

    // pulsing: card breathes/glows (1.5s)
    const t2 = setTimeout(() => {
      setPhase('flipping');
      onFlip?.();
    }, 3500);

    // flipping → revealed (1.2s flip + 0.3s settle)
    const t3 = setTimeout(() => {
      setPhase('revealed');
      onReveal?.(frequencyHz);
    }, 5000);

    // revealed: phrases appear one by one (3.5s)
    // then fade out (1.5s)
    const t4 = setTimeout(() => setPhase('fading'), 8500);

    const t5 = setTimeout(() => onComplete(), 10000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, [onComplete, onFlip, onReveal, frequencyHz]);

  if (phase === 'fading') {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#07070f',
        }}
      />
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.03) 0%, transparent 60%), #07070f',
        }}
      >
        <FloatingDust />

        {/* ── The card ── */}
        <div style={{ position: 'relative', perspective: '1000px' }}>
          <motion.div
            initial={{ rotateY: 0 }}
            animate={
              phase === 'pulsing' ? { rotateY: 0, scale: [1, 1.03, 1] } :
              phase === 'flipping' || phase === 'revealed' ? { rotateY: 180, scale: 1 } :
              { rotateY: 0, scale: 1 }
            }
            transition={
              phase === 'pulsing'
                ? { scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } }
                : { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }
            }
            style={{
              width: '220px', height: '330px',
              position: 'relative', transformStyle: 'preserve-3d',
            }}
          >
            {/* Front (sealed) */}
            <div
              style={{
                position: 'absolute', inset: 0,
                backfaceVisibility: 'hidden',
                border: '1px solid var(--gold)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: 'radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.08) 0%, transparent 70%), #0a0a14',
                boxShadow: phase === 'pulsing'
                  ? '0 0 40px rgba(201,168,76,0.15), inset 0 0 30px rgba(201,168,76,0.05)'
                  : '0 0 20px rgba(201,168,76,0.08)',
                transition: 'box-shadow 1s',
              }}
            >
              {/* Nested geometry */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                style={{
                  width: '90px', height: '90px',
                  border: '1px solid rgba(201,168,76,0.25)',
                  transform: 'rotate(45deg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  style={{
                    width: '55px', height: '55px',
                    border: '1px solid rgba(201,168,76,0.18)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <div style={{
                    width: '20px', height: '20px',
                    border: '1px solid rgba(201,168,76,0.12)',
                    transform: 'rotate(45deg)',
                  }} />
                </motion.div>
              </motion.div>

              {/* Mystery text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  fontFamily: 'var(--sans)', fontSize: '8px', fontWeight: 200,
                  letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase',
                  marginTop: '24px', position: 'absolute', bottom: '28px',
                }}
              >
                ? ? ?
              </motion.p>
            </div>

            {/* Back (revealed) */}
            <div
              style={{
                position: 'absolute', inset: 0,
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                border: '1px solid var(--gold)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '20px',
                background: 'radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.15) 0%, transparent 50%), #0a0a14',
                boxShadow: '0 0 60px rgba(201,168,76,0.2), inset 0 0 40px rgba(201,168,76,0.06)',
              }}
            >
              <span style={{ fontSize: '42px', filter: 'drop-shadow(0 0 8px rgba(201,168,76,0.4))' }}>{icon}</span>
              <span style={{
                fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 200,
                letterSpacing: '0.45em', color: 'var(--gold)', textTransform: 'uppercase',
              }}>
                {label}
              </span>
            </div>
          </motion.div>

          {/* Particle burst on reveal */}
          {phase === 'revealed' && <Particles />}

          {/* Light flash on flip */}
          {phase === 'flipping' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: [0, 0.5, 0], scale: [0.3, 2.5, 4] }}
              transition={{ duration: 1.2 }}
              style={{
                position: 'absolute', top: '50%', left: '50%',
                width: '220px', height: '220px',
                marginTop: '-110px', marginLeft: '-110px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(201,168,76,0.35) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>

        {/* ── Mystical phrases (appear one by one after reveal) ── */}
        {phase === 'revealed' && (
          <div style={{ marginTop: '40px', textAlign: 'center', maxWidth: '400px' }}>
            {phrases.map((phrase, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.7 }}
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: i === phrases.length - 1 ? '22px' : '18px',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: i === phrases.length - 1 ? 'var(--gold)' : 'var(--white-dim)',
                  lineHeight: 1.5,
                  margin: '0 0 4px',
                }}
              >
                {phrase}
              </motion.p>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
