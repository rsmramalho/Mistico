import { motion } from 'framer-motion';
import type { SoulMap } from '../types/soul-map';

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

export function CartaNumerologia({ soulMap }: Props) {
  const { numerology } = soulMap;

  return (
    <div>
      {/* Block 1 — Number */}
      <motion.div {...fadeBlock(0)}>
        <p style={{
          fontFamily: 'var(--serif)',
          fontSize: '64px',
          fontWeight: 300,
          color: 'var(--gold)',
          lineHeight: 1.1,
          margin: '0 0 8px 0',
        }}>
          {numerology.number}
        </p>
        {numerology.isMasterNumber && (
          <div style={{
            ...labelStyle,
            marginBottom: '12px',
          }}>
            numero mestre
          </div>
        )}
        <p style={{
          fontFamily: 'var(--serif)',
          fontSize: '22px',
          fontWeight: 400,
          color: 'var(--white)',
          lineHeight: 1.5,
          marginBottom: '10px',
        }}>
          {numerology.namePt}
        </p>
        <p style={bodyStyle}>{numerology.description}</p>
      </motion.div>

      <div style={goldLine} />

      {/* Block 2 — Traits */}
      <motion.div {...fadeBlock(1)}>
        <div style={labelStyle}>tracos</div>
        <p style={bodyStyle}>{numerology.traits}</p>
      </motion.div>

      <div style={goldLine} />

      {/* Block 3 — Shadow */}
      <motion.div {...fadeBlock(2)}>
        <div style={labelStyle}>sombra</div>
        <p style={{
          ...bodyStyle,
          opacity: 0.85,
        }}>
          {numerology.shadow}
        </p>
      </motion.div>
    </div>
  );
}
