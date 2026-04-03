import { useState } from 'react';
import { motion } from 'framer-motion';
import type { SoulMap, OracleSession } from '../types/soul-map';

interface OracleSectionProps {
  soulMap: SoulMap;
}

const QUESTION_LABELS = [
  'sua primeira pergunta',
  'sua segunda pergunta',
  'sua terceira pergunta',
];

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
  letterSpacing: '0.38em', color: 'var(--gold)', textTransform: 'uppercase',
};

const btnStyle: React.CSSProperties = {
  background: 'transparent', border: 'none',
  borderBottom: '1px solid var(--gold)',
  fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 300,
  letterSpacing: '0.32em', color: 'var(--gold)',
  textTransform: 'uppercase', padding: '0 0 6px',
  transition: 'color 0.3s, letter-spacing 0.3s',
};

const btnHover = (e: React.MouseEvent, enter: boolean) => {
  const el = e.target as HTMLElement;
  el.style.color = enter ? 'var(--white)' : 'var(--gold)';
  el.style.letterSpacing = enter ? '0.42em' : '0.32em';
};

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay },
});

export function OracleSection({ soulMap }: OracleSectionProps) {
  const [session, setSession] = useState<OracleSession>({
    soulMap, messages: [], questionsUsed: 0, closed: false,
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Don't render if API key is not set
  if (!import.meta.env.VITE_ANTHROPIC_API_KEY) return null;

  const handleAsk = async () => {
    if (!input.trim() || isLoading || session.closed) return;
    setIsLoading(true);
    setError(null);
    try {
      const { askOracle } = await import('../engine/oracle');
      const { session: newSession } = await askOracle(session, input.trim());
      setSession(newSession);
      setInput('');
    } catch {
      setError('o oráculo está em silêncio');
    } finally {
      setIsLoading(false);
    }
  };

  // Build Q&A pairs from messages
  const qaPairs: { question: string; answer: string }[] = [];
  for (let i = 0; i < session.messages.length; i += 2) {
    const q = session.messages[i];
    const a = session.messages[i + 1];
    if (q && a) {
      qaPairs.push({ question: q.content, answer: a.content });
    }
  }

  const filledDots = 3 - session.questionsUsed;
  const dots = Array.from({ length: 3 }, (_, i) => (i < filledDots ? '●' : '○')).join(' ');

  return (
    <motion.div
      {...fade(0)}
      style={{ marginTop: '64px' }}
    >
      {/* Gold separator */}
      <div style={{
        width: '100%', height: '1px',
        background: 'var(--gold)', opacity: 0.2,
        marginBottom: '32px',
      }} />

      {/* Header row: label left, dots right */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '20px',
      }}>
        <span style={labelStyle}>o oráculo</span>
        <span style={{
          fontFamily: 'var(--sans)', fontSize: '9px', color: 'var(--gold)',
          letterSpacing: '0.15em',
        }}>
          {dots}
        </span>
      </div>

      {/* Subtitle */}
      <p style={{
        fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: 300,
        color: 'var(--white)', marginBottom: '8px', lineHeight: 1.3,
      }}>
        Você tem três perguntas.
      </p>
      <p style={{
        fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 300,
        fontStyle: 'italic', color: 'var(--white-dim)', marginBottom: '40px',
      }}>
        Escolha com intenção.
      </p>

      {/* Previous Q&A pairs */}
      {qaPairs.map((qa, idx) => (
        <motion.div key={idx} {...fade(0.2)} style={{ marginBottom: '36px' }}>
          <p style={{
            ...labelStyle, color: 'var(--white-ghost)',
            marginBottom: '8px',
          }}>
            {qa.question}
          </p>
          <p style={{
            fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 300,
            color: 'var(--white-dim)', lineHeight: 1.8,
          }}>
            {qa.answer}
          </p>
        </motion.div>
      ))}

      {/* Loading state */}
      {isLoading && (
        <motion.p
          animate={{ opacity: [0.25, 0.7, 0.25] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            ...labelStyle, marginBottom: '32px',
          }}
        >
          o oráculo contempla...
        </motion.p>
      )}

      {/* Error */}
      {error && (
        <p style={{ ...labelStyle, marginBottom: '24px' }}>
          {error}
        </p>
      )}

      {/* Question input area — only if session not closed and not loading */}
      {!session.closed && !isLoading && (
        <motion.div {...fade(0.1)}>
          <label style={{ ...labelStyle, display: 'block', marginBottom: '14px' }}>
            {QUESTION_LABELS[session.questionsUsed] ?? 'sua pergunta'}
          </label>
          <div style={{
            display: 'flex', alignItems: 'flex-end', gap: '20px',
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAsk(); }}
              placeholder=""
              style={{
                flex: 1, width: '100%', background: 'transparent', border: 'none',
                borderBottom: '1px solid rgba(201,168,76,0.2)',
                color: 'var(--white)', fontFamily: 'var(--serif)', fontSize: '20px',
                fontWeight: 300, padding: '0 0 10px', outline: 'none',
                borderRadius: 0,
                caretColor: 'var(--gold)', transition: 'border-color 0.4s',
              }}
              onFocus={e => (e.target.style.borderBottomColor = 'var(--gold)')}
              onBlur={e => (e.target.style.borderBottomColor = 'rgba(201,168,76,0.2)')}
            />
            <button
              onClick={handleAsk}
              disabled={!input.trim()}
              style={{
                ...btnStyle, flexShrink: 0,
                opacity: input.trim() ? 1 : 0.3,
              }}
              onMouseEnter={e => { if (input.trim()) btnHover(e, true); }}
              onMouseLeave={e => { if (input.trim()) btnHover(e, false); }}
            >
              perguntar
            </button>
          </div>
        </motion.div>
      )}

      {/* After 3 questions */}
      {session.closed && (
        <motion.div {...fade(0.3)} style={{ marginTop: '40px', textAlign: 'left' }}>
          <div style={{
            width: '40px', height: '1px', background: 'var(--gold)',
            marginBottom: '20px',
          }} />
          <p style={{
            ...labelStyle, letterSpacing: '0.4em',
          }}>
            o oráculo não fala mais hoje
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
