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

export function CartaKabbalah({ soulMap }: Props) {
  const { sephirah } = soulMap;
  let blockIndex = 0;

  return (
    <div>
      {/* Block 1 — Sephirah */}
      <motion.div {...fadeBlock(blockIndex++)}>
        <div style={labelStyle}>sephirah</div>
        <p style={{
          fontFamily: 'var(--serif)',
          fontSize: '22px',
          fontWeight: 400,
          color: 'var(--white)',
          lineHeight: 1.5,
          marginBottom: '10px',
        }}>
          {sephirah.name} — {sephirah.meaning}
        </p>
        <p style={bodyStyle}>
          {sephirah.description}
        </p>
      </motion.div>

      {/* Block 2 — Paths */}
      {sephirah.paths && sephirah.paths.length > 0 && (
        <>
          <div style={goldLine} />
          <motion.div {...fadeBlock(blockIndex++)}>
            <div style={labelStyle}>caminhos adjacentes</div>
            <p style={bodyStyle}>
              {sephirah.paths.join(' \u00b7 ')}
            </p>
          </motion.div>
        </>
      )}

      {/* Block 3 — Tikkun */}
      {sephirah.tikkun && (
        <>
          <div style={goldLine} />
          <motion.div {...fadeBlock(blockIndex++)}>
            <div style={labelStyle}>tikkun — a correcao</div>
            <p style={bodyStyle}>
              {sephirah.tikkun}
            </p>
          </motion.div>
        </>
      )}

      {/* Block 4 — Polarity */}
      {sephirah.polarity && (
        <>
          <div style={goldLine} />
          <motion.div {...fadeBlock(blockIndex++)}>
            <div style={labelStyle}>polaridade</div>
            <p style={bodyStyle}>
              {sephirah.polarity}
            </p>
          </motion.div>
        </>
      )}
    </div>
  );
}
