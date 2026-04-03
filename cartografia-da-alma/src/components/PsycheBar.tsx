import { motion } from 'framer-motion';
import type { PsycheDistribution } from '../types/soul-map';

interface PsycheBarProps {
  psyche: PsycheDistribution;
  delay?: number;
}

const SEGMENTS = [
  { key: 'id' as const, color: '#c94c4c', label: 'id' },
  { key: 'ego' as const, color: '#c9a84c', label: 'ego' },
  { key: 'superego' as const, color: '#4c8bc9', label: 'superego' },
];

export function PsycheBar({ psyche, delay = 0 }: PsycheBarProps) {
  const values = { id: psyche.id, ego: psyche.ego, superego: psyche.superego };

  return (
    <div>
      {/* Bar — thin, no rounded corners */}
      <div style={{
        height: '3px', display: 'flex', overflow: 'hidden',
        background: 'var(--white-ghost)', marginBottom: '18px',
      }}>
        {SEGMENTS.map((seg) => (
          <motion.div
            key={seg.key}
            initial={{ width: 0 }}
            animate={{ width: `${values[seg.key]}%` }}
            transition={{ duration: 1.5, delay: delay + 0.2, ease: 'easeOut' }}
            style={{ height: '100%', backgroundColor: seg.color }}
          />
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '24px' }}>
        {SEGMENTS.map((seg) => (
          <div key={seg.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              backgroundColor: seg.color,
            }} />
            <span style={{
              fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
              letterSpacing: '0.2em', color: 'var(--white-dim)', textTransform: 'uppercase',
            }}>
              {seg.label} {values[seg.key]}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
