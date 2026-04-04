import { motion } from 'framer-motion';
import type { SoulMap } from '../types/soul-map';
import { PsycheBar } from './PsycheBar';
import { FrequencyWave } from '../geometry/FrequencyWave';

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
        <div style={{ position: 'relative', width: '100%', marginBottom: '12px' }}>
          <FrequencyWave
            hz={frequency.hz}
            width={400}
            height={80}
            animated
            color="var(--gold)"
            opacity={0.6}
          />
          <p style={{
            position: 'absolute',
            bottom: '4px',
            left: '0',
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(48px, 7vw, 72px)',
            fontWeight: 300,
            color: 'var(--gold)',
            lineHeight: 1.1,
            margin: 0,
            textShadow: '0 0 24px rgba(7,7,15,0.9), 0 0 48px rgba(7,7,15,0.7)',
          }}>
            {frequency.hz} Hz
          </p>
        </div>
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
