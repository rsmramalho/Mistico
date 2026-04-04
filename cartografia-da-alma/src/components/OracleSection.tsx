import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { SoulMap, OracleSession } from '../types/soul-map';
import type { ReadingTier } from '../types/database';
import { useInView } from '../hooks/useInView';

interface OracleSectionProps {
  soulMap: SoulMap;
  tier?: ReadingTier;
  readingId?: string | null;
  onTierUpgrade?: (newTier: ReadingTier) => void;
}

const FREE_QUESTIONS = 1; // questions allowed without payment

export function OracleSection({ soulMap, tier = 'session', readingId, onTierUpgrade }: OracleSectionProps) {
  const [session, setSession] = useState<OracleSession>({
    soulMap, messages: [], questionsUsed: 0, closed: false,
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [polling, setPolling] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { ref, inView } = useInView(0.1);

  // Kiwify payment URL — built with reading_id as passthrough
  const kiwifyUrl = readingId
    ? `${import.meta.env.VITE_KIWIFY_ORACLE_URL ?? 'https://pay.kiwify.com.br/CONFIGURE'}?custom_field_1=${readingId}`
    : import.meta.env.VITE_KIWIFY_ORACLE_URL ?? '#';

  // Poll for tier upgrade after payment redirect
  useEffect(() => {
    if (!polling || !readingId) return;
    let attempts = 0;
    pollRef.current = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`/api/check-tier?readingId=${readingId}`);
        const data = await res.json() as { tier: ReadingTier };
        if (data.tier === 'oracle') {
          clearInterval(pollRef.current!);
          setPolling(false);
          setShowPaywall(false);
          onTierUpgrade?.('oracle');
        }
      } catch { /* silent */ }
      if (attempts >= 40) { // 2min max
        clearInterval(pollRef.current!);
        setPolling(false);
      }
    }, 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [polling, readingId, onTierUpgrade]);

  const handleAsk = async () => {
    if (!input.trim() || isLoading || session.closed) return;

    // Paywall check: free tier gets FREE_QUESTIONS, oracle tier gets all 3
    const isOracleTier = tier === 'oracle';
    if (!isOracleTier && session.questionsUsed >= FREE_QUESTIONS) {
      setShowPaywall(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const { askOracle } = await import('../engine/oracle');
      const { session: newSession } = await askOracle(session, input.trim());
      setSession(newSession);
      setInput('');
      setShowPaywall(false);
    } catch {
      setError('o oráculo está em silêncio');
    } finally {
      setIsLoading(false);
    }
  };

  const qaPairs: { question: string; answer: string }[] = [];
  for (let i = 0; i < session.messages.length; i += 2) {
    const q = session.messages[i];
    const a = session.messages[i + 1];
    if (q && a) qaPairs.push({ question: q.content, answer: a.content });
  }

  const isOracleTier = tier === 'oracle';
  const totalAllowed = isOracleTier ? 3 : FREE_QUESTIONS;
  const remaining = totalAllowed - session.questionsUsed;

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
    letterSpacing: '0.42em', color: 'var(--gold)', textTransform: 'uppercase',
  };

  return (
    <div ref={ref} style={{ borderTop: '1px solid var(--gold-line)', marginTop: '80px', paddingTop: '96px', paddingBottom: '80px' }}>

      {/* Portal header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2 }}
        style={{ textAlign: 'center', marginBottom: '64px' }}
      >
        <p style={{ ...labelStyle, marginBottom: '20px' }}>o oráculo</p>
        <h2 style={{
          fontFamily: 'var(--serif)', fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 300, color: 'var(--white)', lineHeight: 1.1, margin: '0 0 20px',
        }}>
          Você tem {isOracleTier ? 'três' : 'uma'} pergunta{isOracleTier ? 's' : ''}.
        </h2>
        <p style={{
          fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 300,
          fontStyle: 'italic', color: 'var(--white-dim)', marginBottom: '32px',
        }}>
          Escolha com intenção.
        </p>

        {/* Dots */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {Array.from({ length: isOracleTier ? 3 : 1 }, (_, i) => (
            <div key={i} style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: i < remaining ? 'var(--gold)' : 'transparent',
              border: '1px solid var(--gold)',
              opacity: i < remaining ? 1 : 0.35,
              transition: 'all 0.5s',
            }} />
          ))}
        </div>
      </motion.div>

      {/* Q&A pairs */}
      {qaPairs.map((qa, idx) => (
        <motion.div key={idx} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} style={{ marginBottom: '48px' }}>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200, letterSpacing: '0.38em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '16px', opacity: 0.6 }}>
            {qa.question}
          </p>
          <p style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 300, color: 'var(--white)', lineHeight: 1.8, borderLeft: '1px solid var(--gold-line)', paddingLeft: '20px' }}>
            {qa.answer}
          </p>
        </motion.div>
      ))}

      {/* Loading */}
      {isLoading && (
        <motion.p animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 2.5, repeat: Infinity }}
          style={{ ...labelStyle, marginBottom: '32px' }}>
          contemplando...
        </motion.p>
      )}

      {error && <p style={{ ...labelStyle, marginBottom: '24px', opacity: 0.5 }}>{error}</p>}

      {/* Paywall — oracle upgrade */}
      {showPaywall && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            margin: '40px 0', padding: '40px 0',
            borderTop: '1px solid var(--gold-line)', borderBottom: '1px solid var(--gold-line)',
            textAlign: 'center',
          }}
        >
          <p style={{ ...labelStyle, marginBottom: '24px' }}>o oráculo continua</p>
          <p style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 300,
            color: 'var(--white)', lineHeight: 1.5, marginBottom: '8px',
          }}>
            Três perguntas.<br />Uma contribuição.
          </p>
          <p style={{
            fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 300,
            fontStyle: 'italic', color: 'var(--white-dim)', marginBottom: '40px',
          }}>
            O oráculo já conhece seu mapa inteiro.
          </p>

          <a
            href={kiwifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { setPolling(true); }}
            style={{
              display: 'inline-block',
              background: 'transparent', border: 'none',
              borderBottom: '1px solid var(--gold)',
              fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 300,
              letterSpacing: '0.38em', color: 'var(--gold)',
              textTransform: 'uppercase', padding: '0 0 8px',
              textDecoration: 'none', marginBottom: '16px',
            }}
          >
            oráculo completo — R$19 →
          </a>

          {polling && (
            <motion.p
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ ...labelStyle, marginTop: '24px', fontSize: '8px' }}
            >
              aguardando confirmação do pagamento...
            </motion.p>
          )}
        </motion.div>
      )}

      {/* Input */}
      {!session.closed && !isLoading && !showPaywall && (
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 0.4 }}>
          <p style={{ ...labelStyle, marginBottom: '16px' }}>
            {['sua primeira pergunta', 'sua segunda pergunta', 'sua terceira pergunta'][session.questionsUsed] ?? 'sua pergunta'}
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px' }}>
            <input
              type="text" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAsk(); }}
              style={{
                flex: 1, background: 'transparent', border: 'none',
                borderBottom: '1px solid rgba(201,168,76,0.25)',
                color: 'var(--white)', fontFamily: 'var(--serif)',
                fontSize: '20px', fontWeight: 300, padding: '0 0 12px',
                outline: 'none', caretColor: 'var(--gold)', transition: 'border-color 0.4s',
              }}
              onFocus={e => (e.target.style.borderBottomColor = 'var(--gold)')}
              onBlur={e => (e.target.style.borderBottomColor = 'rgba(201,168,76,0.25)')}
            />
            <button
              onClick={handleAsk} disabled={!input.trim()}
              style={{
                background: 'transparent', border: 'none',
                borderBottom: '1px solid var(--gold)',
                fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 300,
                letterSpacing: '0.32em', color: 'var(--gold)',
                textTransform: 'uppercase', padding: '0 0 6px',
                opacity: input.trim() ? 1 : 0.3, flexShrink: 0, transition: 'all 0.3s',
              }}
              onMouseEnter={e => { if (input.trim()) (e.target as HTMLElement).style.letterSpacing = '0.42em'; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.letterSpacing = '0.32em'; }}
            >
              perguntar
            </button>
          </div>
        </motion.div>
      )}

      {/* Closed */}
      {session.closed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} style={{ textAlign: 'center', paddingTop: '40px' }}>
          <div style={{ width: '1px', height: '40px', background: 'var(--gold-line)', margin: '0 auto 20px' }} />
          <p style={{ ...labelStyle, opacity: 0.5 }}>o oráculo não fala mais hoje</p>
        </motion.div>
      )}
    </div>
  );
}
