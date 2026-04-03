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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay, ease: 'easeOut' }}
      className="mb-12 md:mb-16"
    >
      <div className="mb-4">
        <h2
          className="text-2xl md:text-3xl text-[#c9a84c] mb-1"
          style={{ fontFamily: "'Cinzel Decorative', serif" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-[#c9a84c]/50 tracking-widest uppercase">
            {subtitle}
          </p>
        )}
        <div className="w-16 h-px bg-[#c9a84c]/20 mt-3" />
      </div>
      <div className="text-[#e8dcc8] leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {children}
      </div>
    </motion.section>
  );
}
