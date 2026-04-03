import { motion } from 'framer-motion';
import type { PsycheDistribution } from '../types/soul-map';

interface PsycheBarProps {
  psyche: PsycheDistribution;
  delay?: number;
}

const COLORS = {
  id: '#c94c4c',
  ego: '#c9a84c',
  superego: '#4c8bc9',
};

const LABELS = {
  id: 'Id',
  ego: 'Ego',
  superego: 'Superego',
};

export function PsycheBar({ psyche, delay = 0 }: PsycheBarProps) {
  const segments = [
    { key: 'id' as const, value: psyche.id, color: COLORS.id, label: LABELS.id },
    { key: 'ego' as const, value: psyche.ego, color: COLORS.ego, label: LABELS.ego },
    { key: 'superego' as const, value: psyche.superego, color: COLORS.superego, label: LABELS.superego },
  ];

  return (
    <div>
      {/* Bar */}
      <div className="h-8 md:h-10 rounded-full overflow-hidden flex bg-white/5 mb-4">
        {segments.map((seg) => (
          <motion.div
            key={seg.key}
            initial={{ width: 0 }}
            animate={{ width: `${seg.value}%` }}
            transition={{ duration: 1.5, delay: delay + 0.2, ease: 'easeOut' }}
            className="h-full flex items-center justify-center text-xs font-medium"
            style={{ backgroundColor: seg.color + '40', color: seg.color }}
          >
            {seg.value}%
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-sm">
        {segments.map((seg) => (
          <div key={seg.key} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-[#e8dcc8]/70">{seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
