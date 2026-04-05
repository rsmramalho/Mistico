import { useState } from 'react';
import { motion } from 'framer-motion';

// ═══════════════════════════════════════
// PaywallOverlay — inline email capture
// Appears over the body of gated cards
// "sua sombra já apareceu. para ver o que ela revela..."
// ═══════════════════════════════════════

interface PaywallOverlayProps {
  microReveal: string;         // one sentence teaser from the shadow
  onEmailSubmit: (email: string) => void;
  isSubmitting?: boolean;
}

export function PaywallOverlay({ microReveal, onEmailSubmit, isSubmitting }: PaywallOverlayProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;
    setSubmitted(true);
    onEmailSubmit(email.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{
        position: 'relative',
        padding: '40px 0',
      }}
    >
      {/* Blur gradient over card body */}
      <div
        style={{
          position: 'absolute',
          top: '-80px',
          left: 0,
          right: 0,
          height: '80px',
          background: 'linear-gradient(to bottom, transparent, #07070f)',
          pointerEvents: 'none',
        }}
      />

      {/* Micro-revelation */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{
          fontFamily: 'var(--serif)',
          fontSize: '18px',
          fontWeight: 300,
          fontStyle: 'italic',
          color: 'var(--gold)',
          lineHeight: 1.7,
          marginBottom: '32px',
          textAlign: 'center',
        }}
      >
        {microReveal}
      </motion.p>

      {/* Gate message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        style={{
          fontFamily: 'var(--serif)',
          fontSize: '16px',
          fontWeight: 300,
          color: 'var(--white-dim)',
          lineHeight: 1.7,
          marginBottom: '32px',
          textAlign: 'center',
        }}
      >
        {submitted
          ? 'verificando...'
          : 'sua sombra já apareceu. para ver o que ela revela, precisamos saber onde te encontrar.'
        }
      </motion.p>

      {/* Email form */}
      {!submitted && (
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          onSubmit={handleSubmit}
          style={{ maxWidth: '400px', margin: '0 auto' }}
        >
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="seu email"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(201,168,76,0.3)',
              color: 'var(--white)',
              fontFamily: 'var(--serif)',
              fontSize: '20px',
              fontWeight: 300,
              padding: '0 0 12px',
              outline: 'none',
              caretColor: 'var(--gold)',
              textAlign: 'center',
              transition: 'border-color 0.4s',
            }}
            onFocus={e => { e.target.style.borderBottomColor = 'var(--gold)'; }}
            onBlur={e => { e.target.style.borderBottomColor = 'rgba(201,168,76,0.3)'; }}
          />
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: `1px solid ${isValid ? 'var(--gold)' : 'rgba(201,168,76,0.2)'}`,
                fontFamily: 'var(--sans)',
                fontSize: '10px',
                fontWeight: 300,
                letterSpacing: '0.32em',
                color: isValid ? 'var(--gold)' : 'rgba(201,168,76,0.3)',
                textTransform: 'uppercase',
                padding: '0 0 6px',
                transition: 'color 0.3s, letter-spacing 0.3s',
              }}
              onMouseEnter={e => { if (isValid) { e.currentTarget.style.color = 'var(--white)'; e.currentTarget.style.letterSpacing = '0.42em'; } }}
              onMouseLeave={e => { if (isValid) { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.letterSpacing = '0.32em'; } }}
            >
              continuar a revelação →
            </button>
          </div>
        </motion.form>
      )}

      {/* Privacy note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        style={{
          fontFamily: 'var(--sans)',
          fontSize: '8px',
          fontWeight: 200,
          letterSpacing: '0.2em',
          color: 'var(--white-ghost)',
          textTransform: 'uppercase',
          textAlign: 'center',
          marginTop: '24px',
        }}
      >
        sem spam · seu mapa esperará por você
      </motion.p>
    </motion.div>
  );
}
