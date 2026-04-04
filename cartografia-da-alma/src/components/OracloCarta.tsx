import { useState } from 'react';
import { motion } from 'framer-motion';
import { getOracleIdentity } from '../engine/oracle-identities';
import type { SoulMap } from '../types/soul-map';

// ═══════════════════════════════════════
// Cartografia da Alma — OracloCarta
// One oracle question per card
// ═══════════════════════════════════════

interface OracleCartaProps {
  cardId: string;
  soulMap: SoulMap;
  onResult: (question: string, answer: string) => void;
  onSkipOracle?: () => void;
  used: boolean;
  question?: string;
  answer?: string;
}

type OracleMode = 'choice' | 'asking' | 'loading' | 'answered' | 'error';

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

const choiceButtonStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid var(--gold)',
  fontFamily: 'var(--sans)',
  fontSize: '10px',
  fontWeight: 300,
  letterSpacing: '0.32em',
  color: 'var(--gold)',
  textTransform: 'uppercase',
  padding: '0 0 6px',
  whiteSpace: 'nowrap',
  transition: 'color 0.3s, letter-spacing 0.3s',
};

function applyButtonHover(e: React.MouseEvent) {
  const el = e.target as HTMLElement;
  el.style.color = 'var(--white)';
  el.style.letterSpacing = '0.42em';
}

function removeButtonHover(e: React.MouseEvent) {
  const el = e.target as HTMLElement;
  el.style.color = 'var(--gold)';
  el.style.letterSpacing = '0.32em';
}

export function OracloCarta({
  cardId,
  soulMap,
  onResult,
  onSkipOracle,
  used,
  question: prevQuestion,
  answer: prevAnswer,
}: OracleCartaProps) {
  const [mode, setMode] = useState<OracleMode>('choice');
  const [input, setInput] = useState('');
  const [localAnswer, setLocalAnswer] = useState('');
  const [localQuestion, setLocalQuestion] = useState('');

  const identity = getOracleIdentity(cardId);

  // Cards without oracle (e.g. frequency) render nothing
  if (!identity) return null;

  // ── Already used: show Q&A ──
  if (used && prevQuestion && prevAnswer) {
    return (
      <div>
        <p style={ghostLabelStyle}>{prevQuestion}</p>
        <p style={answerStyle}>{prevAnswer}</p>
      </div>
    );
  }

  const canSubmit = input.trim().length > 0 && mode === 'asking';

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const q = input.trim();
    setLocalQuestion(q);
    setMode('loading');

    try {
      const res = await fetch('/api/oracle-carta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, soulMap, question: q }),
      });

      if (!res.ok) throw new Error('oracle failed');

      const data = (await res.json()) as { answer: string };
      setLocalAnswer(data.answer);
      setMode('answered');
      onResult(q, data.answer);
    } catch {
      setMode('error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  // ── Oracle identity header (only in non-used states) ──
  const identityHeader = (
    <div style={{ marginBottom: '20px' }}>
      <p
        style={{
          fontFamily: 'var(--sans)',
          fontSize: '11px',
          fontWeight: 300,
          letterSpacing: '0.35em',
          color: 'var(--gold)',
          textTransform: 'uppercase',
          margin: '0 0 6px',
        }}
      >
        {identity.name}
      </p>
      <p
        style={{
          fontFamily: 'var(--serif)',
          fontSize: '14px',
          fontWeight: 300,
          fontStyle: 'italic',
          color: 'var(--white-ghost)',
          margin: 0,
        }}
      >
        {identity.domain}
      </p>
    </div>
  );

  // ── Loading state ──
  if (mode === 'loading') {
    return (
      <div>
        {identityHeader}
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
      </div>
    );
  }

  // ── Error state ──
  if (mode === 'error') {
    return (
      <div>
        {identityHeader}
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
      </div>
    );
  }

  // ── Answered state ──
  if (mode === 'answered') {
    return (
      <div>
        {identityHeader}
        <p style={ghostLabelStyle}>{localQuestion}</p>
        <p style={{ ...answerStyle, marginBottom: '28px' }}>{localAnswer}</p>
        {onSkipOracle && (
          <button
            onClick={onSkipOracle}
            style={choiceButtonStyle}
            onMouseEnter={applyButtonHover}
            onMouseLeave={removeButtonHover}
          >
            continuar a jornada &rarr;
          </button>
        )}
      </div>
    );
  }

  // ── Choice state (initial) ──
  if (mode === 'choice') {
    return (
      <div>
        {identityHeader}
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setMode('asking')}
            style={choiceButtonStyle}
            onMouseEnter={applyButtonHover}
            onMouseLeave={removeButtonHover}
          >
            perguntar ao or&aacute;culo
          </button>
          {onSkipOracle && (
            <button
              onClick={onSkipOracle}
              style={choiceButtonStyle}
              onMouseEnter={applyButtonHover}
              onMouseLeave={removeButtonHover}
            >
              continuar a jornada &rarr;
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Asking state (input visible) ──
  return (
    <div>
      {identityHeader}
      <label
        style={{
          fontFamily: 'var(--sans)',
          fontSize: '9px',
          fontWeight: 200,
          letterSpacing: '0.38em',
          color: 'var(--gold)',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '14px',
        }}
      >
        {identity.inputLabel}
      </label>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={identity.placeholder}
          style={fieldStyle}
          onFocus={e => (e.target.style.borderBottomColor = 'var(--gold)')}
          onBlur={e =>
            (e.target.style.borderBottomColor = 'rgba(201,168,76,0.2)')
          }
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
            if (canSubmit) applyButtonHover(e);
          }}
          onMouseLeave={e => {
            if (canSubmit) removeButtonHover(e);
          }}
        >
          perguntar
        </button>
      </div>
    </div>
  );
}
