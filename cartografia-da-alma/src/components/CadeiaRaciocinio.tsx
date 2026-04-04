import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CardProvenance } from '../engine/provenance';

// ═══════════════════════════════════════
// CadeiaRaciocinio — provenance chain UI
// Collapsible: button → step-by-step chain
// "Cada conclusão tem origem rastreável."
// ═══════════════════════════════════════

interface CadeiaRaciocinionProps {
  provenance: CardProvenance;
}

const stepFromStyle: React.CSSProperties = {
  fontFamily: 'var(--sans)',
  fontSize: '8px',
  fontWeight: 200,
  letterSpacing: '0.3em',
  color: 'var(--gold)',
  textTransform: 'uppercase',
  margin: '0 0 4px',
};

const stepToStyle: React.CSSProperties = {
  fontFamily: 'var(--serif)',
  fontSize: '15px',
  fontWeight: 300,
  color: 'var(--white)',
  margin: '0 0 2px',
  lineHeight: 1.5,
};

const stepRuleStyle: React.CSSProperties = {
  fontFamily: 'var(--serif)',
  fontSize: '13px',
  fontWeight: 300,
  fontStyle: 'italic',
  color: 'var(--white-dim)',
  margin: '0 0 0',
  lineHeight: 1.5,
};

const arrowStyle: React.CSSProperties = {
  fontFamily: 'var(--sans)',
  fontSize: '10px',
  color: 'var(--gold-line)',
  margin: '8px 0',
  textAlign: 'center',
};

export function CadeiaRaciocinio({ provenance }: CadeiaRaciocinionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginTop: '32px' }}>
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        style={{
          background: 'transparent',
          border: 'none',
          fontFamily: 'var(--sans)',
          fontSize: '9px',
          fontWeight: 200,
          letterSpacing: '0.3em',
          color: 'var(--white-ghost)',
          textTransform: 'uppercase',
          cursor: 'pointer',
          padding: '4px 0',
          transition: 'color 0.3s',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--gold)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--white-ghost)'; }}
      >
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'inline-block', fontSize: '8px' }}
        >
          ▸
        </motion.span>
        {open ? 'ocultar cadeia' : 'ver cadeia de raciocínio'}
      </button>

      {/* Chain content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                marginTop: '16px',
                paddingLeft: '12px',
                borderLeft: '1px solid var(--gold-line)',
              }}
            >
              {provenance.steps.map((step, i) => (
                <div key={i}>
                  {i > 0 && <div style={arrowStyle}>↓</div>}
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.12 }}
                  >
                    <p style={stepFromStyle}>{step.from}</p>
                    <p style={stepToStyle}>{step.to}</p>
                    <p style={stepRuleStyle}>{step.rule}</p>
                  </motion.div>
                </div>
              ))}

              {/* Anchor phrase */}
              <div style={arrowStyle}>—</div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: provenance.steps.length * 0.12 }}
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: '14px',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: 'var(--gold)',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {provenance.anchor}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
