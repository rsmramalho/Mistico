import { motion } from 'framer-motion';
import { FlowerOfLife } from '../geometry/FlowerOfLife';

interface LandingProps {
  onEnter: () => void;
}

const lines = [
  'Cada pessoa chega ao mundo carregando um padrão.',
  'Não é destino. Não é horóscopo.',
  'É a geometria que opera por baixo de tudo que você faz,\nsente, escolhe, evita.',
];

export function Landing({ onEnter }: LandingProps) {
  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.4 }}
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
      {/* Geometry — full bleed, breathing */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.04, 1] }}
          transition={{
            rotate: { duration: 160, repeat: Infinity, ease: 'linear' },
            scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
          }}
          style={{ width: 'min(720px, 120vw)', height: 'min(720px, 120vw)', opacity: 0.09 }}
        >
          <FlowerOfLife />
        </motion.div>
      </div>

      {/* Radial glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '520px' }}>

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          style={{
            fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
            letterSpacing: '0.45em', color: 'var(--gold)',
            textTransform: 'uppercase', marginBottom: '28px',
          }}
        >
          seis tradições · um mapa
        </motion.p>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(52px, 9vw, 100px)',
            fontWeight: 300, lineHeight: 1.0,
            color: 'var(--white)', marginBottom: '48px',
            letterSpacing: '-0.01em',
          }}
        >
          Cartografia<br />
          <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>da Alma</em>
        </motion.h1>

        {/* Body — three lines, staggered */}
        <div style={{ marginBottom: '56px' }}>
          {lines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 + i * 0.35 }}
              style={{
                fontFamily: 'var(--serif)', fontSize: 'clamp(17px, 2.2vw, 20px)',
                fontWeight: 300, fontStyle: i === 2 ? 'italic' : 'normal',
                color: i === 2 ? 'var(--white-dim)' : 'var(--white)',
                lineHeight: 1.65, marginBottom: i < lines.length - 1 ? '4px' : 0,
                whiteSpace: 'pre-line',
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Divider */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '40px' }}
          transition={{ duration: 0.8, delay: 2.1 }}
          style={{ height: '1px', background: 'var(--gold)', margin: '0 auto 48px' }}
        />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.3 }}
        >
          <motion.button
            onClick={onEnter}
            whileHover={{ letterSpacing: '0.48em' }}
            style={{
              background: 'transparent', border: 'none',
              fontFamily: 'var(--sans)', fontSize: '11px', fontWeight: 300,
              letterSpacing: '0.38em', color: 'var(--gold)',
              textTransform: 'uppercase', padding: '0 0 8px',
              borderBottom: '1px solid var(--gold)',
              transition: 'letter-spacing 0.4s',
              display: 'inline-block',
            }}
          >
            revelar meu mapa →
          </motion.button>
        </motion.div>

        {/* Subtle systems list */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.8 }}
          style={{
            fontFamily: 'var(--sans)', fontSize: '8px', fontWeight: 200,
            letterSpacing: '0.3em', color: 'var(--white-ghost)',
            textTransform: 'uppercase', marginTop: '40px',
          }}
        >
          Astrologia · Kabbalah · Jung · Freud · Solfeggio · Numerologia
        </motion.p>
      </div>
    </motion.div>
  );
}
