import { motion } from 'framer-motion';
import type { FrequencyResult } from '../types/soul-map';

interface FrequencyDisplayProps {
  frequency: FrequencyResult;
  delay?: number;
}

export function FrequencyDisplay({ frequency, delay = 0 }: FrequencyDisplayProps) {
  return (
    <div style={{ textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay, ease: 'easeOut' }}
        style={{ marginBottom: '20px' }}
      >
        <span style={{
          fontFamily: 'var(--serif)', fontSize: 'clamp(48px, 7vw, 72px)',
          fontWeight: 300, color: 'var(--gold)',
        }}>
          {frequency.hz}
        </span>
        <span style={{
          fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 200,
          color: 'var(--white-dim)', marginLeft: '8px', letterSpacing: '0.1em',
        }}>
          Hz
        </span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.3 }}
        style={{
          fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
          letterSpacing: '0.38em', color: 'var(--gold)',
          textTransform: 'uppercase', marginBottom: '16px',
        }}
      >
        {frequency.keywordPt}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.6 }}
        style={{
          fontFamily: 'var(--serif)', fontSize: '17px', fontWeight: 300,
          lineHeight: 1.7, color: 'var(--white-dim)', maxWidth: '440px', margin: '0 auto',
        }}
      >
        {frequency.description}
      </motion.p>
    </div>
  );
}
