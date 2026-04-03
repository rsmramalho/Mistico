import { motion } from 'framer-motion';
import { TreeOfLife } from '../geometry/TreeOfLife';

export function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '24px',
      }}
    >
      {/* Tree of Life — larger, more presence */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{ width: 'min(320px, 70vw)', height: 'min(400px, 55vh)', marginBottom: '48px' }}
      >
        <TreeOfLife />
      </motion.div>

      {/* Ritual text — breathing pulse */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.6 }}
        style={{ textAlign: 'center' }}
      >
        <motion.span
          animate={{ opacity: [0.25, 0.7, 0.25] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
            letterSpacing: '0.4em', color: 'var(--gold)',
            textTransform: 'uppercase',
          }}
        >
          consultando os mapas
        </motion.span>
      </motion.p>
    </motion.div>
  );
}
