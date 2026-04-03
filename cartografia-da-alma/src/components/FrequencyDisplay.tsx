import { motion } from 'framer-motion';
import type { FrequencyResult } from '../types/soul-map';

interface FrequencyDisplayProps {
  frequency: FrequencyResult;
  delay?: number;
}

export function FrequencyDisplay({ frequency, delay = 0 }: FrequencyDisplayProps) {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay, ease: 'easeOut' }}
        className="inline-block mb-4"
      >
        <span
          className="text-5xl md:text-6xl text-[#c9a84c] font-light"
          style={{ fontFamily: "'Cinzel Decorative', serif" }}
        >
          {frequency.hz}
        </span>
        <span className="text-lg text-[#c9a84c]/60 ml-2">Hz</span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.3 }}
        className="text-lg text-[#c9a84c]/80 tracking-widest uppercase mb-3"
      >
        {frequency.keywordPt}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.6 }}
        className="text-[#e8dcc8]/80 max-w-md mx-auto text-lg leading-relaxed"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        {frequency.description}
      </motion.p>
    </div>
  );
}
