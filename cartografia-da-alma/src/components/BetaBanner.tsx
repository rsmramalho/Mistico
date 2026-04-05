import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════
// BetaBanner — fixed top bar + newsletter signup
// Shows when VITE_BETA_MODE=true
// ═══════════════════════════════════════

export function BetaBanner() {
  const isBeta = import.meta.env.VITE_BETA_MODE === 'true';
  const [email, setEmail] = useState('');
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isBeta) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Send to capture-email API (no readingId — just newsletter)
    fetch('/api/capture-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), name: 'newsletter' }),
    }).catch(() => {});

    setSubmitted(true);
    setTimeout(() => setShowNewsletter(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: 'rgba(7,7,15,0.95)',
        borderTop: '1px solid var(--gold-line)',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        flexWrap: 'wrap',
        backdropFilter: 'blur(8px)',
      }}
    >
      <span style={{
        fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
        letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase',
      }}>
        beta
      </span>
      <span style={{
        fontFamily: 'var(--serif)', fontSize: '13px', fontWeight: 300,
        color: 'var(--white-dim)', fontStyle: 'italic',
      }}>
        versão de teste — feedback bem-vindo
      </span>

      {!showNewsletter && !submitted && (
        <button
          onClick={() => setShowNewsletter(true)}
          style={{
            background: 'transparent', border: 'none',
            borderBottom: '1px solid var(--gold)',
            fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
            letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase',
            padding: '0 0 3px', transition: 'color 0.3s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--white)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--gold)'; }}
        >
          avisar quando lançar
        </button>
      )}

      <AnimatePresence>
        {showNewsletter && !submitted && (
          <motion.form
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu email"
              autoFocus
              style={{
                background: 'transparent', border: 'none',
                borderBottom: '1px solid var(--gold-line)',
                color: 'var(--white)', fontFamily: 'var(--serif)',
                fontSize: '14px', fontWeight: 300, padding: '0 0 4px',
                outline: 'none', caretColor: 'var(--gold)', width: '180px',
              }}
            />
            <button
              type="submit"
              style={{
                background: 'transparent', border: 'none',
                fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
                letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase',
              }}
            >
              →
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {submitted && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
            letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase',
          }}
        >
          avisaremos ✓
        </motion.span>
      )}
    </div>
  );
}
