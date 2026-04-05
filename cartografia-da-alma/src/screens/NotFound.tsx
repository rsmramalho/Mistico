import { motion } from 'framer-motion';
import { Metatron } from '../geometry/Metatron';

// ═══════════════════════════════════════
// 404 — este mapa não está mais aqui
// ═══════════════════════════════════════

interface NotFoundProps {
  onHome: () => void;
}

export function NotFound({ onHome }: NotFoundProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
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
      {/* Background geometry */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.06,
          pointerEvents: 'none',
          width: 'min(90vw, 600px)',
          height: 'min(90vw, 600px)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 200, repeat: Infinity, ease: 'linear' }}
      >
        <Metatron />
      </motion.div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '480px' }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            fontFamily: 'var(--sans)',
            fontSize: '9px',
            fontWeight: 200,
            letterSpacing: '0.4em',
            color: 'var(--gold)',
            textTransform: 'uppercase',
            marginBottom: '32px',
          }}
        >
          cartografia da alma
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 300,
            color: 'var(--white)',
            lineHeight: 1.2,
            marginBottom: '24px',
          }}
        >
          este mapa<br />
          <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>não está mais aqui</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          style={{
            fontFamily: 'var(--serif)',
            fontSize: '17px',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'var(--white-dim)',
            lineHeight: 1.7,
            marginBottom: '48px',
          }}
        >
          Talvez tenha expirado. Talvez nunca tenha existido.
          De qualquer forma — o seu está esperando.
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          onClick={onHome}
          whileHover={{ letterSpacing: '0.42em' }}
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
            transition: 'letter-spacing 0.3s, color 0.3s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--white)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--gold)'; }}
        >
          gerar meu mapa →
        </motion.button>
      </div>
    </motion.div>
  );
}
