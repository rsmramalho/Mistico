import { useState } from 'react';
import { motion } from 'framer-motion';
import type { SoulMap, OracleSession } from '../types/soul-map';
import { useInView } from '../hooks/useInView';

interface OracleSectionProps {
  soulMap: SoulMap;
}

export function OracleSection({ soulMap }: OracleSectionProps) {
  const [session, setSession] = useState<OracleSession>({
    soulMap, messages: [], questionsUsed: 0, closed: false,
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { ref, inView } = useInView(0.1);

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

  const qaPairs: { question: string; answer: string }[] = [];
  for (let i = 0; i < session.messages.length; i += 2) {
    const q = session.messages[i];
    const a = session.messages[i + 1];
    if (q && a) qaPairs.push({ question: q.content, answer: a.content });
  }

  const remaining = 3 - session.questionsUsed;

  return (
    <div
      ref={ref}
      style={{
        borderTop: '1px solid var(--gold-line)',
        marginTop: '80px',
        paddingTop: '96px',
        paddingBottom: '80px',
      }}
    >
      {/* Portal header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ textAlign: 'center', marginBottom: '64px' }}
      >
        <p style={{
          fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
          letterSpacing: '0.42em', color: 'var(--gold)',
          textTransform: 'uppercase', marginBottom: '20px',
        }}>
          o oráculo
        </p>
        <h2 style={{
          fontFamily: 'var(--serif)', fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 300, color: 'var(--white)', lineHeight: 1.1,
          marginBottom: '20px', margin: '0 0 20px',
        }}>
          Você tem três perguntas.
        </h2>
        <p style={{
          fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 300,
          fontStyle: 'italic', color: 'var(--white-dim)', marginBottom: '32px',
        }}>
          Escolha com intenção.
        </p>

        {/* Remaining dots */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {Array.from({ length: 3 }, (_, i) => (
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
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          style={{ marginBottom: '48px' }}
        >
          <p style={{
            fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
            letterSpacing: '0.38em', color: 'var(--gold)', textTransform: 'uppercase',
            marginBottom: '16px', opacity: 0.6,
          }}>
            {qa.question}
          </p>
          <p style={{
            fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 300,
            color: 'var(--white)', lineHeight: 1.8,
            borderLeft: '1px solid var(--gold-line)', paddingLeft: '20px',
          }}>
            {qa.answer}
          </p>
        </motion.div>
      ))}

      {/* Loading */}
      {isLoading && (
        <motion.p
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{
            fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
            letterSpacing: '0.42em', color: 'var(--gold)',
            textTransform: 'uppercase', marginBottom: '32px',
          }}
        >
          contemplando...
        </motion.p>
      )}

      {error && (
        <p style={{
          fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
          letterSpacing: '0.38em', color: 'var(--gold)',
          textTransform: 'uppercase', marginBottom: '24px', opacity: 0.5,
        }}>
          {error}
        </p>
      )}

      {/* Input */}
      {!session.closed && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <p style={{
            fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
            letterSpacing: '0.42em', color: 'var(--gold)',
            textTransform: 'uppercase', marginBottom: '16px',
          }}>
            {['sua primeira pergunta', 'sua segunda pergunta', 'sua terceira pergunta'][session.questionsUsed] ?? 'sua pergunta'}
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAsk(); }}
              style={{
                flex: 1, background: 'transparent', border: 'none',
                borderBottom: '1px solid rgba(201,168,76,0.25)',
                color: 'var(--white)', fontFamily: 'var(--serif)',
                fontSize: '20px', fontWeight: 300, padding: '0 0 12px',
                outline: 'none', caretColor: 'var(--gold)',
                transition: 'border-color 0.4s',
              }}
              onFocus={e => (e.target.style.borderBottomColor = 'var(--gold)')}
              onBlur={e => (e.target.style.borderBottomColor = 'rgba(201,168,76,0.25)')}
            />
            <button
              onClick={handleAsk}
              disabled={!input.trim()}
              style={{
                background: 'transparent', border: 'none',
                borderBottom: '1px solid var(--gold)',
                fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 300,
                letterSpacing: '0.32em', color: 'var(--gold)',
                textTransform: 'uppercase', padding: '0 0 6px',
                opacity: input.trim() ? 1 : 0.3, flexShrink: 0,
                transition: 'color 0.3s, letter-spacing 0.3s',
              }}
              onMouseEnter={e => { if (input.trim()) { (e.target as HTMLElement).style.letterSpacing = '0.42em'; } }}
              onMouseLeave={e => { (e.target as HTMLElement).style.letterSpacing = '0.32em'; }}
            >
              perguntar
            </button>
          </div>
        </motion.div>
      )}

      {session.closed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ textAlign: 'center', paddingTop: '40px' }}
        >
          <div style={{ width: '1px', height: '40px', background: 'var(--gold-line)', margin: '0 auto 20px' }} />
          <p style={{
            fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
            letterSpacing: '0.42em', color: 'var(--gold)', textTransform: 'uppercase',
            opacity: 0.5,
          }}>
            o oráculo não fala mais hoje
          </p>
        </motion.div>
      )}
    </div>
  );
}
