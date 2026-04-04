import { motion } from 'framer-motion';
import type { SoulMap } from '../types/soul-map';
import { PsycheBar } from './PsycheBar';

const fadeBlock = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay: i * 0.4, ease: 'easeOut' as const },
});

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--sans)',
  fontSize: '9px',
  fontWeight: 200,
  letterSpacing: '0.38em',
  color: 'var(--gold)',
  textTransform: 'uppercase',
  marginBottom: '14px',
};

const bodyStyle: React.CSSProperties = {
  fontFamily: 'var(--serif)',
  fontSize: '18px',
  fontWeight: 300,
  color: 'var(--white-dim)',
  lineHeight: 1.7,
};

const goldLine: React.CSSProperties = {
  width: '40px',
  height: '1px',
  background: 'var(--gold-line)',
  margin: '32px 0',
};

interface Props {
  soulMap: SoulMap;
}

export function CartaFrequencia({ soulMap }: Props) {
  const { frequency, psyche } = soulMap;

  return (
    <div>
      {/* Block 1 — Frequency */}
      <motion.div {...fadeBlock(0)}>
        <p style={{
          fontFamily: 'var(--serif)',
          fontSize: 'clamp(48px, 7vw, 72px)',
          fontWeight: 300,
          color: 'var(--gold)',
          lineHeight: 1.1,
          margin: '0 0 12px 0',
        }}>
          {frequency.hz} Hz
        </p>
        <div style={labelStyle}>{frequency.keywordPt}</div>
        <p style={bodyStyle}>{frequency.description}</p>
      </motion.div>

      <div style={goldLine} />

      {/* Block 2 — Psyche */}
      <motion.div {...fadeBlock(1)}>
        <div style={labelStyle}>estrutura psiquica</div>
        <p style={{ ...bodyStyle, marginBottom: '20px' }}>{psyche.signature}</p>
        <PsycheBar psyche={psyche} delay={0} />
      </motion.div>
    </div>
  );
}
