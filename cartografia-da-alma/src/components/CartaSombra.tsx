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

export function CartaSombra({ soulMap }: Props) {
  const { archetype } = soulMap;

  return (
    <div>
      {/* Block 1 — Archetype */}
      <motion.div {...fadeBlock(0)}>
        <div style={labelStyle}>arquetipo</div>
        <p style={{
          fontFamily: 'var(--serif)',
          fontSize: '22px',
          fontWeight: 400,
          color: 'var(--white)',
          lineHeight: 1.5,
          marginBottom: '10px',
        }}>
          {archetype.titlePt}
        </p>
        <p style={bodyStyle}>
          {archetype.description}
        </p>
      </motion.div>

      <div style={goldLine} />

      {/* Block 2 — Desires & Fears */}
      <motion.div {...fadeBlock(1)}>
        <div style={{
          display: 'flex',
          gap: '32px',
          flexWrap: 'wrap',
        }}>
          <div style={{ flex: '1 1 200px' }}>
            <div style={labelStyle}>desejo central</div>
            <p style={bodyStyle}>{archetype.coreDesire}</p>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <div style={labelStyle}>medo central</div>
            <p style={bodyStyle}>{archetype.coreFear}</p>
          </div>
        </div>
      </motion.div>

      <div style={goldLine} />

      {/* Block 3 — Shadow */}
      <motion.div {...fadeBlock(2)}>
        <div style={labelStyle}>a sombra</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{
            borderLeft: '1px solid var(--gold-line)',
            paddingLeft: '16px',
          }}>
            <div style={{
              ...labelStyle,
              color: 'rgba(201, 76, 76, 0.7)',
            }}>
              inflada — excesso
            </div>
            <p style={bodyStyle}>{archetype.shadow.inflated}</p>
          </div>
          <div style={{
            borderLeft: '1px solid var(--gold-line)',
            paddingLeft: '16px',
          }}>
            <div style={{
              ...labelStyle,
              color: 'rgba(76, 139, 201, 0.7)',
            }}>
              deflacionada — falta
            </div>
            <p style={bodyStyle}>{archetype.shadow.deflated}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
