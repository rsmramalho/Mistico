import { motion } from 'framer-motion';
import type { SoulMap, Element } from '../types/soul-map';
import { getSignData } from '../engine/astrology';

const ELEMENT_PT: Record<Element, string> = {
  fire: 'Fogo',
  earth: 'Terra',
  air: 'Ar',
  water: 'Agua',
};

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

export function CartaAstrologia({ soulMap }: Props) {
  const signData = getSignData(soulMap.sunSign);

  return (
    <div>
      {/* Block 1 — Element Quality */}
      <motion.div {...fadeBlock(0)}>
        <div style={labelStyle}>elemento</div>
        <p style={bodyStyle}>
          {ELEMENT_PT[soulMap.element]} — {signData.elementQuality}
        </p>
      </motion.div>

      <div style={goldLine} />

      {/* Block 2 — Ruler */}
      <motion.div {...fadeBlock(1)}>
        <div style={labelStyle}>planeta regente</div>
        <p style={bodyStyle}>
          {signData.ruler} — {signData.rulerMeaning}
        </p>
        <p style={{ ...bodyStyle, fontStyle: 'italic', marginTop: '8px' }}>
          {signData.rulerForSign}
        </p>
      </motion.div>

      <div style={goldLine} />

      {/* Block 3 — Expression */}
      <motion.div {...fadeBlock(2)}>
        <div style={labelStyle}>expressao na arvore</div>
        <p style={bodyStyle}>
          {soulMap.sephirah.description}
        </p>
      </motion.div>
    </div>
  );
}
