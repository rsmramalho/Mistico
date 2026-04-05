import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FlowerOfLife } from '../geometry/FlowerOfLife';
import { Metatron } from '../geometry/Metatron';

interface LandingProps {
  onEnter: () => void;
  onAbout?: () => void;
}

/* ─── helpers ─── */

function useInView(threshold = 0.45) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function WordByWord({ text, delayStart = 0, msPerWord = 120, style }: {
  text: string; delayStart?: number; msPerWord?: number; style?: React.CSSProperties;
}) {
  const words = text.split(' ');
  return (
    <span style={style}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: delayStart + i * (msPerWord / 1000) }}
          style={{ display: 'inline-block', marginRight: '0.3em' }}
        >
          {w}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── section styles ─── */

const sectionBase: React.CSSProperties = {
  scrollSnapAlign: 'start',
  minHeight: '100svh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  padding: '48px 24px',
};

/* ─── Section 1 — O padrão ─── */

function SectionPadrao() {
  const { ref, visible } = useInView();

  return (
    <div ref={ref} style={sectionBase}>
      {/* cosmos bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)',
      }} />

      {/* geometry */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 160, repeat: Infinity, ease: 'linear' }}
          style={{ width: 'min(800px, 130vw)', height: 'min(800px, 130vw)', opacity: 0.07 }}
        >
          <FlowerOfLife />
        </motion.div>
      </div>

      {/* text */}
      {visible && (
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '580px' }}>
          <p style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(18px, 2.4vw, 22px)',
            fontWeight: 300, lineHeight: 1.7, color: 'var(--white)',
          }}>
            <WordByWord text="Cada pessoa chega ao mundo carregando um padrão." delayStart={0.3} msPerWord={120} />
          </p>
          <p style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(18px, 2.4vw, 22px)',
            fontWeight: 300, lineHeight: 1.7, color: 'var(--white)', marginTop: '12px',
          }}>
            <WordByWord text="Não é destino. É geometria." delayStart={2.3} msPerWord={120} />
          </p>
        </div>
      )}

      {/* scroll indicator */}
      <motion.div
        animate={{ opacity: [0.2, 0.7, 0.2] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          width: '1px', height: '40px', background: 'var(--gold)',
        }}
      />
    </div>
  );
}

/* ─── Section 2 — Os 6 sistemas ─── */

const SYSTEMS = [
  { symbol: '\u2648', name: 'ASTROLOGIA', desc: 'o signo como padr\u00e3o de origem' },
  { symbol: '\u2721', name: 'KABBALAH', desc: 'a posi\u00e7\u00e3o na \u00c1rvore da Vida' },
  { symbol: '\u262f', name: 'JUNG', desc: 'o arqu\u00e9tipo e a sombra' },
  { symbol: '\u266a', name: 'SOLFEGGIO', desc: 'a frequ\u00eancia do seu campo' },
  { symbol: '\u2460', name: 'NUMEROLOGIA', desc: 'o n\u00famero que carrega seu nome' },
  { symbol: '\u270b', name: 'PALMA', desc: 'os mapas da m\u00e3o', optional: true },
] as const;

function SectionSistemas() {
  const { ref, visible } = useInView();

  return (
    <div ref={ref} style={sectionBase}>
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '520px' }}>
        {SYSTEMS.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 16 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: i * 0.6 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '20px',
              marginBottom: '28px', justifyContent: 'flex-start',
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: '24px', width: '32px', textAlign: 'center', flexShrink: 0 }}>
              {s.symbol}
            </span>
            <div>
              <span style={{
                fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 300,
                letterSpacing: '0.35em', color: 'var(--gold)', textTransform: 'uppercase',
              }}>
                {s.name}
                {'optional' in s && (
                  <span style={{ opacity: 0.4, marginLeft: '8px', letterSpacing: '0.15em', textTransform: 'none', fontSize: '9px' }}>
                    (opcional)
                  </span>
                )}
              </span>
              <p style={{
                fontFamily: 'var(--serif)', fontSize: '15px', fontWeight: 300,
                color: 'var(--white-dim)', marginTop: '2px',
              }}>
                {s.desc}
              </p>
            </div>
          </motion.div>
        ))}

        {/* subtexto */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: SYSTEMS.length * 0.6 + 0.4 }}
          style={{
            fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 300,
            fontStyle: 'italic', color: 'var(--white-dim)', marginTop: '40px',
          }}
        >
          Fontes rastre&aacute;veis. N&atilde;o &eacute; misticismo vazio.
        </motion.p>
      </div>
    </div>
  );
}

/* ─── Section 3 — A jornada (card preview) ─── */

const CARD_PHRASES = [
  'Voc\u00ea carrega mais do que entrega.',
  'H\u00e1 uma parte sua que ningu\u00e9m ainda viu.',
  'O que te protege tamb\u00e9m te limita.',
];

function SectionJornada() {
  const { ref, visible } = useInView();
  const [flipped, setFlipped] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const cycleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!visible) return;
    const flipTimer = setTimeout(() => setFlipped(true), 1500);
    return () => clearTimeout(flipTimer);
  }, [visible]);

  useEffect(() => {
    if (!flipped) return;
    // cycle phrases every 2s after flip
    const startCycle = setTimeout(() => {
      let idx = 0;
      cycleRef.current = setInterval(() => {
        idx = (idx + 1) % CARD_PHRASES.length;
        setPhraseIndex(idx);
      }, 2000);
    }, 500);
    return () => {
      clearTimeout(startCycle);
      if (cycleRef.current) clearInterval(cycleRef.current);
    };
  }, [flipped]);

  const cardW = 'min(280px, 70vw)';
  const cardH = 'min(400px, 100vw)';

  return (
    <div ref={ref} style={sectionBase}>
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        {/* card container with perspective */}
        <div style={{
          perspective: '900px',
          width: cardW, height: cardH,
          margin: '0 auto 40px',
        }}>
          <div style={{
            width: '100%', height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.8s ease',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}>
            {/* front */}
            <div style={{
              position: 'absolute', inset: 0,
              backfaceVisibility: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid var(--gold-line)',
              background: 'linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 60%)',
            }}>
              <span style={{
                fontFamily: 'var(--serif)', fontSize: '72px', fontWeight: 300,
                color: 'var(--gold)', opacity: 0.7,
              }}>
                ?
              </span>
            </div>

            {/* back */}
            <div style={{
              position: 'absolute', inset: 0,
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '32px',
              border: '1px solid var(--gold-line)',
              background: 'linear-gradient(135deg, rgba(201,168,76,0.04) 0%, transparent 60%)',
            }}>
              <motion.p
                key={phraseIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                  fontFamily: 'var(--serif)', fontSize: 'clamp(17px, 2.2vw, 20px)',
                  fontWeight: 300, fontStyle: 'italic',
                  color: 'var(--white)', lineHeight: 1.6, textAlign: 'center',
                }}
              >
                {CARD_PHRASES[phraseIndex]}
              </motion.p>
            </div>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 3 }}
          style={{
            fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 300,
            color: 'var(--white-dim)',
          }}
        >
          Uma verdade de cada vez.
        </motion.p>
      </div>
    </div>
  );
}

/* ─── Section 4 — O oráculo ─── */

function SectionOraculo() {
  const { ref, visible } = useInView();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [showDesc, setShowDesc] = useState(false);

  const fullQuestion = 'O que voc\u00ea protege que j\u00e1 pode soltar?';
  const fullAnswer = 'Talvez o controle. Talvez a imagem que constru\u00edu de si. H\u00e1 algo que voc\u00ea segura com tanta for\u00e7a que esqueceu por que come\u00e7ou.';

  const typeQuestion = useCallback(() => {
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setQuestion(fullQuestion.slice(0, i));
      if (i >= fullQuestion.length) {
        clearInterval(iv);
        // after 1s, start answer
        setTimeout(() => {
          const words = fullAnswer.split(' ');
          let w = 0;
          const wiv = setInterval(() => {
            w++;
            setAnswer(words.slice(0, w).join(' '));
            if (w >= words.length) {
              clearInterval(wiv);
              setTimeout(() => setShowDesc(true), 800);
            }
          }, 150);
        }, 1000);
      }
    }, 50);
    return iv;
  }, []);

  useEffect(() => {
    if (!visible) return;
    const delay = setTimeout(() => {
      const iv = typeQuestion();
      return () => clearInterval(iv);
    }, 1500);
    return () => clearTimeout(delay);
  }, [visible, typeQuestion]);

  return (
    <div ref={ref} style={sectionBase}>
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'left', maxWidth: '520px', width: '100%' }}>
        {/* question field */}
        <div style={{
          borderBottom: '1px solid var(--gold-line)', paddingBottom: '12px',
          marginBottom: '32px', minHeight: '36px',
        }}>
          <span style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(17px, 2.2vw, 20px)',
            fontWeight: 300, color: 'var(--white)',
          }}>
            {question}
          </span>
          {visible && question.length < fullQuestion.length && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ color: 'var(--gold)', marginLeft: '2px' }}
            >
              |
            </motion.span>
          )}
        </div>

        {/* answer */}
        {answer && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 300,
              color: 'var(--white-dim)', lineHeight: 1.7, marginBottom: '48px',
            }}
          >
            {answer}
          </motion.p>
        )}

        {/* descriptor */}
        {showDesc && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{
              fontFamily: 'var(--serif)', fontSize: '15px', fontWeight: 300,
              fontStyle: 'italic', color: 'var(--white-dim)',
            }}
          >
            Um or&aacute;culo que conhece seu mapa antes de voc&ecirc; perguntar.
          </motion.p>
        )}
      </div>
    </div>
  );
}

/* ─── Section 5 — CTA ─── */

function SectionCTA({ onEnter }: { onEnter: () => void }) {
  const { ref, visible } = useInView();

  return (
    <div ref={ref} style={sectionBase}>
      {/* metatron bg */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 160, repeat: Infinity, ease: 'linear' }}
          style={{ width: 'min(900px, 140vw)', height: 'min(900px, 140vw)', opacity: 0.14 }}
        >
          <Metatron />
        </motion.div>
      </div>

      {visible && (
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(64px, 10vw, 120px)',
              fontWeight: 300, lineHeight: 1.0,
              color: 'var(--white)', marginBottom: '24px',
              letterSpacing: '-0.01em',
            }}
          >
            Cartografia<br />
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>da Alma</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            style={{
              fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 300,
              letterSpacing: '0.45em', color: 'var(--gold)',
              textTransform: 'uppercase', marginBottom: '48px',
            }}
          >
            N&atilde;o &eacute; hor&oacute;scopo. &Eacute; cartografia.
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 2.0 }}
            style={{ width: '40px', height: '1px', background: 'var(--gold)', margin: '0 auto 48px', transformOrigin: 'center' }}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.5 }}
          >
            <motion.button
              onClick={onEnter}
              whileHover={{ letterSpacing: '0.48em' }}
              style={{
                background: 'transparent', border: 'none',
                fontFamily: 'var(--sans)', fontSize: '11px', fontWeight: 300,
                letterSpacing: '0.38em', color: 'var(--gold)',
                textTransform: 'uppercase', padding: '0 0 8px',
                borderBottom: '1px solid var(--gold)',
                transition: 'letter-spacing 0.4s',
                display: 'inline-block',
              }}
            >
              revelar meu mapa &rarr;
            </motion.button>
          </motion.div>

          {/* Systems footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 3.0 }}
            style={{
              fontFamily: 'var(--sans)', fontSize: '8px', fontWeight: 200,
              letterSpacing: '0.3em', color: 'var(--white-ghost)',
              textTransform: 'uppercase', marginTop: '48px',
            }}
          >
            Astrologia &middot; Kabbalah &middot; Jung &middot; Freud &middot; Solfeggio &middot; Numerologia
          </motion.p>
        </div>
      )}
    </div>
  );
}

/* ─── Landing ─── */

export function Landing({ onEnter, onAbout }: LandingProps) {
  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.4 }}
      style={{
        height: '100svh',
        overflowY: 'auto',
        scrollSnapType: 'y mandatory',
      }}
    >
      <SectionPadrao />
      <SectionSistemas />
      <SectionJornada />
      <SectionOraculo />
      <SectionCTA onEnter={onEnter} />
      {onAbout && (
        <div style={{ textAlign: 'center', padding: '0 0 32px' }}>
          <button
            onClick={onAbout}
            style={{
              background: 'transparent', border: 'none',
              fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
              letterSpacing: '0.3em', color: 'var(--white-ghost)', textTransform: 'uppercase',
              transition: 'color 0.3s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--gold)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--white-ghost)'; }}
          >
            as seis tradições — sobre
          </button>
        </div>
      )}
    </motion.div>
  );
}
