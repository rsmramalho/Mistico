import { useState } from 'react';
import { motion } from 'framer-motion';
import type { SoulMap } from '../types/soul-map';

// ═══════════════════════════════════════
// Cartografia da Alma — OracloCarta
// One oracle question per card
// ═══════════════════════════════════════

interface OracleCartaProps {
  cardId: string;
  soulMap: SoulMap;
  onResult: (question: string, answer: string) => void;
  used: boolean;
  question?: string;
  answer?: string;
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--sans)',
  fontSize: '9px',
  fontWeight: 200,
  letterSpacing: '0.38em',
  color: 'var(--gold)',
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: '14px',
};

const fieldStyle: React.CSSProperties = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(201,168,76,0.2)',
  color: 'var(--white)',
  fontFamily: 'var(--serif)',
  fontSize: '18px',
  fontWeight: 300,
  padding: '0 0 12px',
  outline: 'none',
  caretColor: 'var(--gold)',
  transition: 'border-color 0.4s',
};

const ghostLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--sans)',
  fontSize: '9px',
  fontWeight: 200,
  letterSpacing: '0.38em',
  color: 'var(--white-ghost)',
  textTransform: 'uppercase',
  marginBottom: '8px',
};

const answerStyle: React.CSSProperties = {
  fontFamily: 'var(--serif)',
  fontSize: '18px',
  fontWeight: 300,
  lineHeight: 1.65,
  color: 'var(--white-dim)',
};

export function OracloCarta({
  cardId,
  soulMap,
  onResult,
  used,
  question: prevQuestion,
  answer: prevAnswer,
}: OracleCartaProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // ── Already used: show Q&A ──
  if (used && prevQuestion && prevAnswer) {
    return (
      <div>
        <p style={ghostLabelStyle}>{prevQuestion}</p>
        <p style={answerStyle}>{prevAnswer}</p>
      </div>
    );
  }

  const canSubmit = input.trim().length > 0 && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const q = input.trim();
    setLoading(true);
    setError(false);

    try {
      const res = await fetch('/api/oracle-carta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, soulMap, question: q }),
      });

      if (!res.ok) throw new Error('oracle failed');

      const data = (await res.json()) as { answer: string };
      onResult(q, data.answer);
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  // ── Loading state ──
  if (loading) {
    return (
      <motion.p
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          fontFamily: 'var(--sans)',
          fontSize: '9px',
          fontWeight: 200,
          letterSpacing: '0.38em',
          color: 'var(--gold)',
          textTransform: 'uppercase',
        }}
      >
        o or&aacute;culo contempla...
      </motion.p>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <p
        style={{
          fontFamily: 'var(--sans)',
          fontSize: '9px',
          fontWeight: 200,
          letterSpacing: '0.38em',
          color: 'var(--gold)',
          textTransform: 'uppercase',
          opacity: 0.6,
        }}
      >
        o or&aacute;culo est&aacute; em sil&ecirc;ncio
      </p>
    );
  }

  // ── Input state ──
  return (
    <div>
      <label style={labelStyle}>uma pergunta para o or&aacute;culo</label>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={fieldStyle}
          onFocus={e => (e.target.style.borderBottomColor = 'var(--gold)')}
          onBlur={e => (e.target.style.borderBottomColor = 'rgba(201,168,76,0.2)')}
        />
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: `1px solid ${canSubmit ? 'var(--gold)' : 'rgba(201,168,76,0.2)'}`,
            fontFamily: 'var(--sans)',
            fontSize: '10px',
            fontWeight: 300,
            letterSpacing: '0.32em',
            color: canSubmit ? 'var(--gold)' : 'rgba(201,168,76,0.3)',
            textTransform: 'uppercase',
            padding: '0 0 6px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            transition: 'color 0.3s, border-color 0.3s, letter-spacing 0.3s',
          }}
          onMouseEnter={e => {
            if (canSubmit) {
              (e.target as HTMLElement).style.color = 'var(--white)';
              (e.target as HTMLElement).style.letterSpacing = '0.42em';
            }
          }}
          onMouseLeave={e => {
            if (canSubmit) {
              (e.target as HTMLElement).style.color = 'var(--gold)';
              (e.target as HTMLElement).style.letterSpacing = '0.32em';
            }
          }}
        >
          perguntar
        </button>
      </div>
    </div>
  );
}
