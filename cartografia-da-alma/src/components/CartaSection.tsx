// ═══════════════════════════════════════
// Cartografia da Alma — A Carta
// Streaming letter component
// Words emerge one by one
// ═══════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { SoulMap } from '../types/soul-map';
import { computeBridges } from '../engine/bridges';

interface CartaSectionProps {
  soulMap: SoulMap;
  tier?: 'session' | 'email' | 'oracle';
  onEmailSubmit?: (email: string) => Promise<boolean>;
  onComplete?: () => void;
}

const FREE_CHARS = 800; // chars visible without email

export function CartaSection({ soulMap, tier = 'session', onEmailSubmit, onComplete }: CartaSectionProps) {
  const [text, setText]         = useState('');
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState(false);
  const [email, setEmail]       = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [unlocked, setUnlocked] = useState(tier !== 'session');
  const calledRef               = useRef(false);

  const isPaywalled = !unlocked && text.length >= FREE_CHARS;
  const visibleText  = isPaywalled ? text.slice(0, FREE_CHARS) : text;

  const fetchCarta = useCallback(async () => {
    if (calledRef.current) return;
    calledRef.current = true;

    try {
      const bridges = computeBridges(soulMap);
      const res = await fetch('/api/carta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ soulMap, bridges: { synthesis: bridges.synthesis } }),
      });

      if (!res.ok || !res.body) { setError(true); return; }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;
        const chunk = decoder.decode(value, { stream: true });
        setText(prev => prev + chunk);
      }

      setDone(true);
      onComplete?.();
    } catch {
      setError(true);
    }
  }, [soulMap, onComplete]);

  useEffect(() => { fetchCarta(); }, [fetchCarta]);

  // Unlock when tier changes externally
  useEffect(() => {
    if (tier !== 'session') setUnlocked(true);
  }, [tier]);

  const handleEmailSubmit = async () => {
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    const ok = await onEmailSubmit?.(email.trim());
    if (ok) setUnlocked(true);
    setSubmitting(false);
  };

  const paragraphs = visibleText.split('\n\n').filter(Boolean);

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 24px 120px' }}>

      {/* ── The letter ── */}
      <div style={{ position: 'relative' }}>
        {paragraphs.map((para, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(18px, 2.5vw, 22px)',
              fontWeight: 300,
              lineHeight: 1.8,
              color: 'var(--white-dim)',
              marginBottom: '32px',
            }}
          >
            {para}
          </motion.p>
        ))}

        {/* Cursor while streaming */}
        {!done && !error && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{
              display: 'inline-block',
              width: '2px', height: '22px',
              background: 'var(--gold)',
              verticalAlign: 'middle',
              marginLeft: '4px',
            }}
          />
        )}

        {/* Blur fade for paywall */}
        {isPaywalled && (
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '200px',
            background: 'linear-gradient(to bottom, transparent, #07070f)',
            pointerEvents: 'none',
          }} />
        )}
      </div>

      {/* Error state */}
      {error && (
        <p style={{
          fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
          letterSpacing: '0.38em', color: 'var(--gold)', textTransform: 'uppercase',
          opacity: 0.5, marginTop: '32px',
        }}>
          a carta não chegou. tente recarregar.
        </p>
      )}

      {/* ── Email wall ── */}
      {isPaywalled && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            marginTop: '64px',
            padding: '48px 0',
            borderTop: '1px solid var(--gold-line)',
            borderBottom: '1px solid var(--gold-line)',
            textAlign: 'center',
          }}
        >
          <p style={{
            fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
            letterSpacing: '0.42em', color: 'var(--gold)', textTransform: 'uppercase',
            marginBottom: '24px',
          }}>
            a carta continua
          </p>
          <p style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 300,
            color: 'var(--white)', lineHeight: 1.3, marginBottom: '8px',
          }}>
            entramos no mapa.
          </p>
          <p style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 300,
            fontStyle: 'italic', color: 'var(--white-dim)', lineHeight: 1.4, marginBottom: '40px',
          }}>
            vamos até o fim.
          </p>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', maxWidth: '380px', margin: '0 auto' }}>
            <div style={{ flex: 1 }}>
              <p style={{
                fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
                letterSpacing: '0.38em', color: 'var(--gold)', textTransform: 'uppercase',
                marginBottom: '14px', textAlign: 'left',
              }}>
                seu email
              </p>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleEmailSubmit(); }}
                placeholder="você@email.com"
                style={{
                  width: '100%', background: 'transparent', border: 'none',
                  borderBottom: '1px solid rgba(201,168,76,0.3)',
                  color: 'var(--white)', fontFamily: 'var(--serif)',
                  fontSize: '18px', fontWeight: 300, padding: '0 0 10px',
                  outline: 'none', caretColor: 'var(--gold)', transition: 'border-color 0.3s',
                }}
                onFocus={e => (e.target.style.borderBottomColor = 'var(--gold)')}
                onBlur={e => (e.target.style.borderBottomColor = 'rgba(201,168,76,0.3)')}
              />
            </div>
            <button
              onClick={handleEmailSubmit}
              disabled={!email.trim() || submitting}
              style={{
                background: 'transparent', border: 'none',
                borderBottom: `1px solid ${email.trim() ? 'var(--gold)' : 'rgba(201,168,76,0.2)'}`,
                fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 300,
                letterSpacing: '0.32em',
                color: email.trim() ? 'var(--gold)' : 'rgba(201,168,76,0.3)',
                textTransform: 'uppercase', padding: '0 0 10px', flexShrink: 0,
                opacity: submitting ? 0.4 : 1, transition: 'all 0.3s',
              }}
            >
              {submitting ? 'abrindo...' : 'continuar →'}
            </button>
          </div>
          <p style={{
            fontFamily: 'var(--sans)', fontSize: '8px', fontWeight: 200,
            letterSpacing: '0.2em', color: 'rgba(232,228,218,0.2)',
            textTransform: 'uppercase', marginTop: '20px',
          }}>
            enviamos o link da sua leitura
          </p>
        </motion.div>
      )}

      {/* ── Gold line after complete carta ── */}
      {done && unlocked && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.2 }}
          style={{
            height: '1px',
            background: 'linear-gradient(to right, transparent, var(--gold), transparent)',
            margin: '64px 0',
          }}
        />
      )}
    </div>
  );
}
