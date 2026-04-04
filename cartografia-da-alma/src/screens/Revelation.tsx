import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { SoulMap, Element, LineName } from '../types/soul-map';
import { RevealSection } from '../components/RevealSection';
import { PsycheBar } from '../components/PsycheBar';
import { FrequencyDisplay } from '../components/FrequencyDisplay';
import { OracleSection } from '../components/OracleSection';
import { FlowerOfLife } from '../geometry/FlowerOfLife';
import { Hexagram } from '../geometry/Hexagram';
import { Metatron } from '../geometry/Metatron';
import { SriYantra } from '../geometry/SriYantra';
import { TreeOfLife } from '../geometry/TreeOfLife';
import { computeBridges } from '../engine/bridges';
import { useInView } from '../hooks/useInView';

interface RevelationProps {
  soulMap: SoulMap;
  onReset: () => void;
  canShare?: boolean;
  shareUrl?: string | null;
  isSharing?: boolean;
  isSaving?: boolean;
  onShare?: () => void;
  onMeet?: (otherToken: string) => void;
}

const ELEMENT_NAMES: Record<Element, string> = {
  fire: 'Fogo', earth: 'Terra', air: 'Ar', water: 'Água',
};

const SIGN_NAMES_PT: Record<string, string> = {
  Aries: 'Áries', Taurus: 'Touro', Gemini: 'Gêmeos', Cancer: 'Câncer',
  Leo: 'Leão', Virgo: 'Virgem', Libra: 'Libra', Scorpio: 'Escorpião',
  Sagittarius: 'Sagitário', Capricorn: 'Capricórnio', Aquarius: 'Aquário', Pisces: 'Peixes',
};

const LINE_NAMES_PT: Record<string, string> = {
  heart: 'Coração', head: 'Cabeça', life: 'Vida', fate: 'Destino',
};

const DOMINANT_LINE_DESCRIPTIONS: Record<LineName, string> = {
  heart: 'A linha do Coração é a mais marcada na sua palma — sua vida emocional e afetiva é o centro gravitacional da sua experiência. Relações, empatia e conexão guiam suas decisões mais do que razão ou ambição.',
  head: 'A linha da Cabeça domina sua palma — o intelecto é seu instrumento primário. Análise, comunicação e pensamento estratégico são as forças que movem seu caminho.',
  life: 'A linha da Vida é a mais profunda na sua palma — vitalidade e resiliência definem sua trajetória. Há uma força vital intensa que sustenta tudo o que você constrói.',
  fate: 'A linha do Destino corta sua palma com clareza — existe um senso de propósito forte, uma direção que vai além de escolhas conscientes. Vocação e missão são forças ativas na sua vida.',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
  letterSpacing: '0.38em', color: 'var(--gold)', textTransform: 'uppercase',
};

function ElementGeometry({ element }: { element: Element }) {
  switch (element) {
    case 'air': return <FlowerOfLife />;
    case 'fire': return <Hexagram />;
    case 'earth': return <Metatron />;
    case 'water': return <SriYantra />;
  }
}

function SynthesisBlock({ text }: { text: string }) {
  const { ref, inView } = useInView(0.15);
  return (
    <div ref={ref} style={{ margin: '0 0 80px', padding: '40px 0', borderTop: '1px solid var(--gold-line)', borderBottom: '1px solid var(--gold-line)' }}>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2 }}
        style={{
          fontFamily: 'var(--serif)', fontSize: '17px', fontWeight: 300,
          fontStyle: 'italic', color: 'var(--white-dim)', lineHeight: 1.7,
          textAlign: 'center',
        }}
      >
        {text}
      </motion.p>
    </div>
  );
}

interface FooterBlockProps {
  isPalm: boolean;
  canShare?: boolean;
  shareUrl?: string | null;
  isSharing?: boolean;
  isSaving?: boolean;
  onShare?: () => void;
  onMeet?: (token: string) => void;
  onReset: () => void;
  meetInput: string;
  setMeetInput: (v: string) => void;
  fieldStyle: React.CSSProperties;
}

function FooterBlock({ isPalm, canShare, shareUrl, isSharing, isSaving, onShare, onMeet, onReset, meetInput, setMeetInput, fieldStyle }: FooterBlockProps) {
  const { ref, inView } = useInView(0.1);
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

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
      >
        <p style={{
          fontFamily: 'var(--serif)', fontSize: '15px', fontWeight: 300,
          fontStyle: 'italic', color: 'var(--white-ghost)', lineHeight: 1.7,
          textAlign: 'center', marginBottom: '40px',
        }}>
          {isPalm
            ? 'Os mapeamentos desta cartografia unem tradições — Quiromancia, Kabbalah, Jung, Freud, Solfeggio e Numerologia — como espelhos, não verdades absolutas.'
            : 'Os mapeamentos desta cartografia unem tradições — Astrologia, Kabbalah, Jung, Freud, Solfeggio e Numerologia — como espelhos, não verdades absolutas. A sombra é tão importante quanto a luz.'
          }
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
          {canShare && onShare && (
            shareUrl ? (
              <button onClick={() => navigator.clipboard.writeText(shareUrl)} style={btnStyle} onMouseEnter={e => btnHover(e, true)} onMouseLeave={e => btnHover(e, false)}>
                copiar link
              </button>
            ) : (
              <button
                onClick={onShare}
                disabled={isSharing || isSaving}
                style={{ ...btnStyle, opacity: (isSharing || isSaving) ? 0.35 : 1 }}
                onMouseEnter={e => { if (!isSharing && !isSaving) btnHover(e, true); }}
                onMouseLeave={e => { if (!isSharing && !isSaving) btnHover(e, false); }}
              >
                {isSaving ? 'preparando...' : isSharing ? 'gerando...' : 'compartilhar'}
              </button>
            )
          )}
          <button onClick={onReset} style={btnStyle} onMouseEnter={e => btnHover(e, true)} onMouseLeave={e => btnHover(e, false)}>
            nova cartografia
          </button>
        </div>

        {shareUrl && (
          <p style={{ fontFamily: 'var(--sans)', fontSize: '9px', color: 'var(--white-ghost)', marginTop: '20px', textAlign: 'center', wordBreak: 'break-all' }}>
            {shareUrl}
          </p>
        )}

        {onMeet && (
          <div style={{ borderTop: '1px solid var(--gold-line)', marginTop: '40px', paddingTop: '32px' }}>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200, letterSpacing: '0.38em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '20px', textAlign: 'center' }}>
              encontrar outra alma
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', maxWidth: '460px', margin: '0 auto' }}>
              <input
                type="text" value={meetInput} onChange={e => setMeetInput(e.target.value)}
                placeholder="cole o link ou token" style={fieldStyle}
                onFocus={e => (e.target.style.borderBottomColor = 'var(--gold)')}
                onBlur={e => (e.target.style.borderBottomColor = 'rgba(201,168,76,0.2)')}
              />
              <button
                onClick={() => {
                  if (!meetInput.trim()) return;
                  let token = meetInput.trim();
                  try { const url = new URL(token); const t = url.searchParams.get('token'); if (t) token = t; } catch { /* raw token */ }
                  onMeet(token);
                }}
                style={{ ...btnStyle, flexShrink: 0 }}
                onMouseEnter={e => btnHover(e, true)} onMouseLeave={e => btnHover(e, false)}
              >
                encontrar
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function Bridge({ text }: { text: string }) {
  const { ref, inView } = useInView(0.2);
  return (
    <div ref={ref} style={{ margin: '-32px 0 64px', paddingLeft: '0' }}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        style={{
          fontFamily: 'var(--serif)', fontSize: '15px', fontWeight: 300,
          fontStyle: 'italic', color: 'var(--gold)', lineHeight: 1.6,
          opacity: 0.65,
        }}
      >
        {text}
      </motion.p>
    </div>
  );
}

export function Revelation({ soulMap, onReset, canShare, shareUrl, isSharing, isSaving, onShare, onMeet }: RevelationProps) {
  const [meetInput, setMeetInput] = useState('');
  const [showFloat, setShowFloat] = useState(false);
  const { sunSign, element, ascendant, sephirah, archetype, psyche, frequency, numerology } = soulMap;
  const isPalm = soulMap.source === 'palm';
  const bridges = computeBridges(soulMap);

  // Show floating share after user scrolls past first viewport
  useEffect(() => {
    const onScroll = () => { if (window.scrollY > window.innerHeight * 0.6) setShowFloat(true); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleShare = async () => {
    if (shareUrl) { navigator.clipboard.writeText(shareUrl); return; }
    onShare?.();
  };

  const fieldStyle: React.CSSProperties = {
    flex: 1, width: '100%', background: 'transparent', border: 'none',
    borderBottom: '1px solid rgba(201,168,76,0.2)',
    color: 'var(--white)', fontFamily: 'var(--serif)', fontSize: '17px',
    fontWeight: 300, padding: '0 0 10px', outline: 'none',
    caretColor: 'var(--gold)', transition: 'border-color 0.4s',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      style={{ minHeight: '100vh' }}
    >
      {/* ── Floating share button ── */}
      {canShare && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={showFloat ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'fixed', bottom: '32px', right: '32px', zIndex: 100,
          }}
        >
          <button
            onClick={handleShare}
            disabled={isSaving || isSharing}
            style={{
              background: 'rgba(4,4,10,0.9)',
              border: '1px solid var(--gold-line)',
              fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
              letterSpacing: '0.35em', color: 'var(--gold)',
              textTransform: 'uppercase', padding: '12px 20px',
              backdropFilter: 'blur(12px)',
              opacity: (isSaving || isSharing) ? 0.45 : 1,
              transition: 'border-color 0.3s, color 0.3s, opacity 0.3s',
            }}
            onMouseEnter={e => { if (!isSaving && !isSharing) (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold-line)'; }}
          >
            {shareUrl ? 'link copiado ✓' : isSaving ? 'preparando...' : isSharing ? 'gerando...' : 'compartilhar mapa'}
          </button>
        </motion.div>
      )}

      {/* ── First viewport: name alone ── */}
      <div style={{
        minHeight: '100svh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', position: 'relative',
      }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
            style={{ width: 'min(600px, 95vw)', height: 'min(600px, 95vw)', opacity: 0.13 }}
          >
            <ElementGeometry element={element} />
          </motion.div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{ ...labelStyle, marginBottom: '28px' }}
          >
            cartografia da alma
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(52px, 9vw, 120px)',
              fontWeight: 300, lineHeight: 1.0,
              color: 'var(--white)', marginBottom: '28px',
              letterSpacing: '-0.01em',
            }}
          >
            {soulMap.birthData.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            style={{
              fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 200,
              letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase',
            }}
          >
            {SIGN_NAMES_PT[sunSign]} · {ELEMENT_NAMES[element]}
            {isPalm ? ' · via palma' : ascendant ? ` · ascendente ${SIGN_NAMES_PT[ascendant.sign]}` : ''}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 2.5, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', bottom: '40px',
            width: '1px', height: '48px',
            background: 'linear-gradient(to bottom, transparent, var(--gold))',
          }}
        />
      </div>

      {/* ── Sections ── */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 24px 64px' }}>

        {/* ── Sacred Geometry ── */}
        <div style={{ position: 'relative', marginBottom: '96px', height: 'min(360px, 48vh)' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.18 }}>
            <TreeOfLife activeSephirah={sephirah.name} />
          </div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'absolute', inset: 0, opacity: 0.85 }}
          >
            <ElementGeometry element={element} />
          </motion.div>
        </div>

        {/* ── Section 1: Sephirah ── */}
        <RevealSection title={sephirah.name} subtitle={`${sephirah.meaning} · ${sephirah.planet}`}>
          <p>{sephirah.description}</p>
          <p style={{ ...labelStyle, marginTop: '16px', fontSize: '8px', color: 'var(--white-ghost)' }}>
            Sephirah {sephirah.number} na Árvore da Vida · Expressão {
              sephirah.expression === 'diurnal' ? 'diurna' :
              sephirah.expression === 'nocturnal' ? 'noturna' : 'singular'
            }
          </p>
          {soulMap.sephirahExpressionPalmDerived && (
            <p style={{ fontFamily: 'var(--serif)', fontSize: '14px', fontStyle: 'italic', color: 'var(--white-ghost)', marginTop: '8px' }}>
              Expressão canônica: singular · Via palma:{' '}
              {soulMap.sephirahExpressionPalmDerived === 'diurnal' ? 'diurna' : 'noturna'}
            </p>
          )}
        </RevealSection>

        <Bridge text={bridges.sephirahToArchetype} />

        {/* ── Section 2: Archetype + Shadow ── */}
        <RevealSection title={archetype.titlePt} subtitle={archetype.title}>
          <p style={{ marginBottom: '28px' }}>{archetype.description}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '36px' }}>
            <div>
              <p style={{ ...labelStyle, marginBottom: '8px' }}>desejo central</p>
              <p style={{ color: 'var(--white)' }}>{archetype.coreDesire}</p>
            </div>
            <div>
              <p style={{ ...labelStyle, marginBottom: '8px' }}>medo central</p>
              <p style={{ color: 'var(--white)' }}>{archetype.coreFear}</p>
            </div>
          </div>

          {/* Shadow */}
          <p style={{ ...labelStyle, marginBottom: '20px', marginTop: '36px' }}>a sombra</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ borderLeft: '1px solid var(--gold-line)', paddingLeft: '16px' }}>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '8px', fontWeight: 200, letterSpacing: '0.3em', color: '#c94c4c', textTransform: 'uppercase', marginBottom: '6px', opacity: 0.7 }}>
                inflada — excesso
              </p>
              <p style={{ color: 'var(--white-dim)' }}>{archetype.shadow.inflated}</p>
            </div>
            <div style={{ borderLeft: '1px solid var(--gold-line)', paddingLeft: '16px' }}>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '8px', fontWeight: 200, letterSpacing: '0.3em', color: '#4c8bc9', textTransform: 'uppercase', marginBottom: '6px', opacity: 0.7 }}>
                deflacionada — falta
              </p>
              <p style={{ color: 'var(--white-dim)' }}>{archetype.shadow.deflated}</p>
            </div>
          </div>
        </RevealSection>

        <Bridge text={bridges.archetypeToFrequency} />

        {/* ── Section 3: Frequency ── */}
        <RevealSection title="Frequência de Ressonância" subtitle="solfeggio">
          <FrequencyDisplay frequency={frequency} delay={0} />
        </RevealSection>

        <Bridge text={bridges.frequencyToNumerology} />

        {/* ── Section 4: Numerology ── */}
        <RevealSection
          title={`${numerology.number} · ${numerology.namePt}`}
          subtitle={`número de expressão${numerology.isMasterNumber ? ' · mestre' : ''}`}
        >
          <p style={{ marginBottom: '24px' }}>{numerology.description}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <p style={{ ...labelStyle, marginBottom: '8px' }}>traços</p>
              <p style={{ color: 'var(--white)' }}>{numerology.traits}</p>
            </div>
            <div>
              <p style={{ ...labelStyle, marginBottom: '8px' }}>sombra</p>
              <p style={{ color: 'var(--white-dim)' }}>{numerology.shadow}</p>
            </div>
          </div>
        </RevealSection>

        <Bridge text={bridges.numerologyToAscendant} />

        {/* ── Section 5: Ascendant or Dominant Line ── */}
        {isPalm && soulMap.dominantLine ? (
          <RevealSection title={LINE_NAMES_PT[soulMap.dominantLine]} subtitle="linha dominante">
            <p>{DOMINANT_LINE_DESCRIPTIONS[soulMap.dominantLine]}</p>
          </RevealSection>
        ) : ascendant ? (
          <RevealSection title={`Ascendente em ${SIGN_NAMES_PT[ascendant.sign]}`} subtitle="signo ascendente — aproximado">
            <p>
              O ascendente representa a máscara que você apresenta ao mundo — a primeira impressão,
              o filtro pelo qual sua essência solar se expressa. Com ascendente em{' '}
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>{SIGN_NAMES_PT[ascendant.sign]}</em>,
              sua presença carrega as qualidades deste signo antes que os outros vejam seu Sol em{' '}
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>{SIGN_NAMES_PT[sunSign]}</em>.
            </p>
            <p style={{ fontFamily: 'var(--serif)', fontSize: '14px', fontStyle: 'italic', color: 'var(--white-ghost)', marginTop: '12px' }}>
              Cálculo aproximado baseado no horário informado.
            </p>
          </RevealSection>
        ) : null}

        {/* ── Section 6: Psyche ── */}
        <RevealSection title="Estrutura Psíquica" subtitle="id · ego · superego">
          <p style={{ marginBottom: '28px' }}>{psyche.signature}</p>
          <PsycheBar psyche={psyche} delay={0} />
        </RevealSection>

        {/* ── Synthesis ── */}
        <SynthesisBlock text={bridges.synthesis} />

        {/* ── Footer ── */}
        <FooterBlock
          isPalm={isPalm}
          canShare={canShare}
          shareUrl={shareUrl}
          isSharing={isSharing}
          isSaving={isSaving}
          onShare={onShare}
          onMeet={onMeet}
          onReset={onReset}
          meetInput={meetInput}
          setMeetInput={setMeetInput}
          fieldStyle={fieldStyle}
        />

        {/* ── Oracle ── */}
        <OracleSection soulMap={soulMap} />

      </div> {/* sections wrapper */}
    </motion.div>
  );
}
