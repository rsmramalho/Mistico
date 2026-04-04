import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useInView } from '../hooks/useInView';

interface RevealSectionProps {
  title: string;
  subtitle?: string;
  delay?: number;
  children: ReactNode;
}

export function RevealSection({ title, subtitle, children }: RevealSectionProps) {
  const { ref, inView } = useInView(0.12);

  return (
    <div ref={ref} style={{ marginBottom: '96px' }}>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          background: 'rgba(201,168,76,0.02)',
          borderLeft: '1px solid var(--gold-line)',
          paddingLeft: '28px',
          paddingTop: '4px',
        }}
      >
        <div style={{ marginBottom: '28px' }}>
          {subtitle && (
            <p style={{
              fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
              letterSpacing: '0.42em', color: 'var(--gold)',
              textTransform: 'uppercase', marginBottom: '14px',
            }}>
              {subtitle}
            </p>
          )}
          <h2 style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(36px, 5vw, 52px)',
            fontWeight: 300, color: 'var(--white)', lineHeight: 1.1,
            margin: 0,
          }}>
            {title}
          </h2>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: '48px' } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            style={{ height: '1px', background: 'var(--gold)', marginTop: '20px' }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.25 }}
          style={{
            fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 300,
            lineHeight: 1.75, color: 'var(--white-dim)',
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
