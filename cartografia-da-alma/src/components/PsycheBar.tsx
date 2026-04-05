import { motion } from 'framer-motion';
import type { PsycheDistribution } from '../types/soul-map';

// ═══════════════════════════════════════
// PsycheBar V2 — Visual + human explanation
// Not just numbers — translates to something felt
// ═══════════════════════════════════════

interface PsycheBarProps {
  psyche: PsycheDistribution;
  delay?: number;
}

const SEGMENTS = [
  { key: 'id' as const, color: '#c94c4c', label: 'impulso', icon: '🔥' },
  { key: 'ego' as const, color: '#c9a84c', label: 'razão', icon: '⚖️' },
  { key: 'superego' as const, color: '#4c8bc9', label: 'dever', icon: '🏛️' },
];

// Human-readable descriptions per dominant force
function getDominantDesc(psyche: PsycheDistribution): string {
  const { id, ego, superego } = psyche;
  if (id >= ego && id >= superego) {
    return 'O impulso lidera. Você age antes de justificar — o corpo decide antes da mente. Isso é força quando precisa. Problema quando não.';
  }
  if (ego >= id && ego >= superego) {
    return 'A razão media. Você calcula antes de agir — o pragmatismo filtra o que o impulso sugere e o dever exige. Equilíbrio que pode virar distância.';
  }
  return 'O dever estrutura. Você carrega princípios como fundação — o que é certo pesa mais que o que quer. Integridade que pode virar rigidez.';
}

export function PsycheBar({ psyche, delay = 0 }: PsycheBarProps) {
  const values = { id: psyche.id, ego: psyche.ego, superego: psyche.superego };
  const desc = getDominantDesc(psyche);

  return (
    <div>
      {/* Visual bar — animated */}
      <div style={{
        height: '4px', display: 'flex', overflow: 'hidden',
        background: 'rgba(232,228,218,0.08)', marginBottom: '20px',
      }}>
        {SEGMENTS.map((seg) => (
          <motion.div
            key={seg.key}
            initial={{ width: 0 }}
            animate={{ width: `${values[seg.key]}%` }}
            transition={{ duration: 2, delay: delay + 0.2, ease: 'easeOut' }}
            style={{
              height: '100%',
              backgroundColor: seg.color,
              boxShadow: `0 0 8px ${seg.color}40`,
            }}
          />
        ))}
      </div>

      {/* Three forces with icons and % */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '16px' }}>
        {SEGMENTS.map((seg) => (
          <motion.div
            key={seg.key}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: delay + 0.5 + SEGMENTS.indexOf(seg) * 0.15 }}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '12px 8px',
              borderRight: seg.key !== 'superego' ? '1px solid rgba(201,168,76,0.1)' : 'none',
            }}
          >
            <div style={{ fontSize: '16px', marginBottom: '6px' }}>{seg.icon}</div>
            <div style={{
              fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 300,
              color: seg.color, lineHeight: 1,
            }}>
              {values[seg.key]}%
            </div>
            <div style={{
              fontFamily: 'var(--sans)', fontSize: '8px', fontWeight: 200,
              letterSpacing: '0.25em', color: 'var(--white-ghost)', textTransform: 'uppercase',
              marginTop: '4px',
            }}>
              {seg.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Human explanation */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: delay + 1.0 }}
        style={{
          fontFamily: 'var(--serif)', fontSize: '15px', fontWeight: 300,
          color: 'var(--white-dim)', lineHeight: 1.7, textAlign: 'center',
          fontStyle: 'italic',
        }}
      >
        {desc}
      </motion.p>
    </div>
  );
}
