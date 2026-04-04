// ═══════════════════════════════════════
// Cartografia da Alma — A Carta
// Word-by-word reveal on client
// No streaming — full text from API
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

const FREE_WORDS = 120; // words visible without email
const WORD_DELAY = 60;  // ms per word

export function CartaSection({ soulMap, tier = 'session', onEmailSubmit, onComplete }: CartaSectionProps) {
  const [allWords, setAllWords]         = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(false);
  const [email, setEmail]               = useState('');
  const [submitting, setSubmitting]     = useState(false);
  const [unlocked, setUnlocked]         = useState(tier !== 'session');
  const calledRef                       = useRef(false);
  const intervalRef                     = useRef<ReturnType<typeof setInterval> | null>(null);

  const maxVisible = unlocked ? allWords.length : Math.min(FREE_WORDS, allWords.length);
  const done = visibleCount >= allWords.length && allWords.length > 0;
  const paywalled = !unlocked && visibleCount >= FREE_WORDS && allWords.length > FREE_WORDS;

  // Fetch carta
  const fetchCarta = useCallback(async () => {
    if (calledRef.current) return;
    calledRef.current = true;
    setLoading(true);

    try {
      const bridges = computeBridges(soulMap);
      const res = await fetch('/api/carta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ soulMap, synthesis: bridges.synthesis }),
      });
      if (!res.ok) { setError(true); setLoading(false); return; }
      const { carta } = await res.json() as { carta: string };
      if (!carta) { setError(true); setLoading(false); return; }
      setAllWords(carta.split(' ').filter(Boolean));
      setLoading(false);
    } catch {
      setError(true);
      setLoading(false);
    }
  }, [soulMap]);

  useEffect(() => { fetchCarta(); }, [fetchCarta]);

  // Word-by-word reveal
  useEffect(() => {
    if (loading || error || allWords.length === 0) return;
    if (visibleCount >= maxVisible) return;

    intervalRef.current = setInterval(() => {
      setVisibleCount(c => {
        const next = c + 1;
        if (next >= maxVisible) {
          clearInterval(intervalRef.current!);
          if (next >= allWords.length) onComplete?.();
        }
        return next;
      });
    }, WORD_DELAY);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [loading, error, allWords.length, maxVisible, visibleCount, onComplete]);

  // Unlock when tier changes
  useEffect(() => {
    if (tier !== 'session') {
      setUnlocked(true);
      // Trigger completion if carta was already fully loaded
      if (allWords.length > 0 && done) onComplete?.();
    }
  }, [tier, allWords.length, done, onComplete]);

  // Restart reveal after unlock (reveal remaining words)
  useEffect(() => {
    if (!unlocked || loading || error) return;
    if (visibleCount >= allWords.length) return;
    // interval above will pick this up via maxVisible change
  }, [unlocked, loading, error, allWords.length, visibleCount]);

  const handleEmailSubmit = async () => {
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    const ok = await onEmailSubmit?.(email.trim());
    if (ok) {
      setUnlocked(true);
      // Resume reveal
    }
    setSubmitting(false);
  };

  // Reconstruct visible text from words
  const visibleText = allWords.slice(0, visibleCount).join(' ');
  const paragraphs = visibleText.split(/\n\n+/).filter(Boolean);

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 24px' }}>

      {/* Loading state */}
      {loading && (
        <motion.div
          style={{ textAlign: 'center', padding: '80px 0' }}
        >
          <motion.p
            animate={{ opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{
              fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
              letterSpacing: '0.42em', color: 'var(--gold)', textTransform: 'uppercase',
            }}
          >
            a carta está sendo escrita
          </motion.p>
        </motion.div>
      )}

      {/* Error state */}
      {error && (
        <p style={{
          fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
          letterSpacing: '0.38em', color: 'var(--gold)', textTransform: 'uppercase',
          opacity: 0.5, padding: '48px 0',
        }}>
          a carta não chegou. recarregue a página.
        </p>
      )}

      {/* The letter */}
      {!loading && !error && (
        <div style={{ position: 'relative' }}>
          {paragraphs.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 'clamp(19px, 2.5vw, 23px)',
                fontWeight: 300,
                lineHeight: 1.85,
                color: i === 0 ? 'var(--white)' : 'var(--white-dim)',
                marginBottom: '36px',
                letterSpacing: '0.01em',
              }}
            >
              {para}
            </motion.p>
          ))}

          {/* Cursor */}
          {!done && !paywalled && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.9, repeat: Infinity }}
              style={{
                display: 'inline-block', width: '2px', height: '20px',
                background: 'var(--gold)', verticalAlign: 'middle', marginLeft: '4px',
              }}
            />
          )}

          {/* Blur fade before paywall */}
          {paywalled && (
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '180px',
              background: 'linear-gradient(to bottom, transparent, #07070f)',
              pointerEvents: 'none',
            }} />
          )}
        </div>
      )}

      {/* Email wall */}
      {paywalled && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            marginTop: '48px', padding: '48px 0',
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
            fontFamily: 'var(--serif)', fontSize: 'clamp(22px, 3.5vw, 32px)',
            fontWeight: 300, color: 'var(--white)', lineHeight: 1.3, marginBottom: '8px',
          }}>
            entramos no mapa.
          </p>
          <p style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(20px, 3vw, 28px)',
            fontWeight: 300, fontStyle: 'italic', color: 'var(--white-dim)',
            lineHeight: 1.4, marginBottom: '40px',
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
                type="email" value={email}
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

      {/* Gold line after complete carta */}
      {done && unlocked && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4 }}
          style={{
            height: '1px',
            background: 'linear-gradient(to right, transparent, var(--gold), transparent)',
            margin: '64px 0',
            transformOrigin: 'center',
          }}
        />
      )}
    </div>
  );
}
