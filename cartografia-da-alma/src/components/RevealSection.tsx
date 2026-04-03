import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealSectionProps {
  title: string;
  subtitle?: string;
  delay?: number;
  children: ReactNode;
}

export function RevealSection({ title, subtitle, delay = 0, children }: RevealSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay, ease: 'easeOut' }}
      style={{ marginBottom: '80px' }}
    >
      {/* Section header */}
      <div style={{ marginBottom: '24px' }}>
        {subtitle && (
          <p style={{
            fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
            letterSpacing: '0.38em', color: 'var(--gold)',
            textTransform: 'uppercase', marginBottom: '12px',
          }}>
            {subtitle}
          </p>
        )}
        <h2 style={{
          fontFamily: 'var(--serif)', fontSize: 'clamp(24px, 3.5vw, 36px)',
          fontWeight: 300, color: 'var(--white)', lineHeight: 1.15,
        }}>
          {title}
        </h2>
        <div style={{ width: '40px', height: '1px', background: 'var(--gold-line)', marginTop: '18px' }} />
      </div>

      {/* Section body */}
      <div style={{
        fontFamily: 'var(--serif)', fontSize: '17px', fontWeight: 300,
        lineHeight: 1.7, color: 'var(--white-dim)',
      }}>
        {children}
      </div>
    </motion.section>
  );
}
