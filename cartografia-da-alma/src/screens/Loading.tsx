import { motion } from 'framer-motion';
import { TreeOfLife } from '../geometry/TreeOfLife';

export function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex flex-col items-center justify-center px-4"
    >
      <div className="w-64 h-80 md:w-80 md:h-96 mb-8">
        <TreeOfLife />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-center"
      >
        <motion.p
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-[#c9a84c]/70 text-lg tracking-widest uppercase"
          style={{ fontFamily: "'Cinzel Decorative', serif" }}
        >
          Consultando os mapas...
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
