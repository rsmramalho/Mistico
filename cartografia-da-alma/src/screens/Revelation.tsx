import { useState } from 'react';
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

interface RevelationProps {
  soulMap: SoulMap;
  onReset: () => void;
  canShare?: boolean;
  shareUrl?: string | null;
  isSharing?: boolean;
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

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay },
});

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

function ElementGeometry({ element }: { element: Element }) {
  switch (element) {
    case 'air': return <FlowerOfLife />;
    case 'fire': return <Hexagram />;
    case 'earth': return <Metatron />;
    case 'water': return <SriYantra />;
  }
}

export function Revelation({ soulMap, onReset, canShare, shareUrl, isSharing, onShare, onMeet }: RevelationProps) {
  const [meetInput, setMeetInput] = useState('');
  const { sunSign, element, ascendant, sephirah, archetype, psyche, frequency, numerology } = soulMap;
  const isPalm = soulMap.source === 'palm';
  const hasSection5 = isPalm ? !!soulMap.dominantLine : !!ascendant;

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
      transition={{ duration: 1 }}
      style={{ minHeight: '100vh', padding: '80px 24px 64px' }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        {/* ── Header ── */}
        <motion.div {...fade(0.2)} style={{ textAlign: 'center', marginBottom: '80px' }}>
          <p style={{ ...labelStyle, marginBottom: '18px' }}>
            cartografia da alma
          </p>
          <h1 style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(52px, 7vw, 88px)',
            fontWeight: 300, lineHeight: 1.05, color: 'var(--white)', marginBottom: '18px',
          }}>
            {soulMap.birthData.name}
          </h1>
          <p style={{
            fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 200,
            letterSpacing: '0.35em', color: 'var(--gold)', textTransform: 'uppercase',
          }}>
            {SIGN_NAMES_PT[sunSign]} · {ELEMENT_NAMES[element]}
            {isPalm ? ' · via palma' : ascendant ? ` · ascendente ${SIGN_NAMES_PT[ascendant.sign]}` : ''}
          </p>
        </motion.div>

        {/* ── Sacred Geometry ── */}
        <motion.div
          {...fade(0.4)}
          style={{ position: 'relative', marginBottom: '96px', height: 'min(400px, 50vh)' }}
        >
          <div style={{ position: 'absolute', inset: 0, opacity: 0.2 }}>
            <TreeOfLife activeSephirah={sephirah.name} />
          </div>
          <div style={{ position: 'absolute', inset: 0 }}>
            <ElementGeometry element={element} />
          </div>
        </motion.div>

        {/* ── Section 1: Sephirah ── */}
        <RevealSection title={sephirah.name} subtitle={`${sephirah.meaning} · ${sephirah.planet}`} delay={0.6}>
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

        {/* ── Section 2: Archetype + Shadow ── */}
        <RevealSection title={archetype.titlePt} subtitle={archetype.title} delay={1.0}>
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

          {/* Shadow — border-left blocks */}
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

        {/* ── Section 3: Frequency ── */}
        <RevealSection title="Frequência de Ressonância" subtitle="solfeggio" delay={1.5}>
          <FrequencyDisplay frequency={frequency} delay={1.7} />
        </RevealSection>

        {/* ── Section 4: Numerology ── */}
        <RevealSection
          title={`${numerology.number} · ${numerology.namePt}`}
          subtitle={`número de expressão${numerology.isMasterNumber ? ' · mestre' : ''}`}
          delay={2.0}
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

        {/* ── Section 5: Ascendant or Dominant Line ── */}
        {isPalm && soulMap.dominantLine ? (
          <RevealSection title={LINE_NAMES_PT[soulMap.dominantLine]} subtitle="linha dominante" delay={2.5}>
            <p>{DOMINANT_LINE_DESCRIPTIONS[soulMap.dominantLine]}</p>
          </RevealSection>
        ) : ascendant ? (
          <RevealSection title={`Ascendente em ${SIGN_NAMES_PT[ascendant.sign]}`} subtitle="signo ascendente — aproximado" delay={2.5}>
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
        <RevealSection title="Estrutura Psíquica" subtitle="id · ego · superego" delay={hasSection5 ? 3.0 : 2.5}>
          <p style={{ marginBottom: '28px' }}>{psyche.signature}</p>
          <PsycheBar psyche={psyche} delay={hasSection5 ? 3.2 : 2.7} />
        </RevealSection>

        {/* ── Footer ── */}
        <motion.div
          {...fade(hasSection5 ? 3.5 : 3.0)}
          style={{ borderTop: '1px solid var(--gold-line)', paddingTop: '40px', marginTop: '40px' }}
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

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
            {canShare && onShare && (
              shareUrl ? (
                <button
                  onClick={() => navigator.clipboard.writeText(shareUrl)}
                  style={btnStyle}
                  onMouseEnter={e => btnHover(e, true)}
                  onMouseLeave={e => btnHover(e, false)}
                >
                  copiar link
                </button>
              ) : (
                <button
                  onClick={onShare}
                  disabled={isSharing}
                  style={{ ...btnStyle, opacity: isSharing ? 0.3 : 1, borderBottomColor: isSharing ? 'rgba(201,168,76,0.2)' : 'var(--gold)' }}
                  onMouseEnter={e => { if (!isSharing) btnHover(e, true); }}
                  onMouseLeave={e => { if (!isSharing) btnHover(e, false); }}
                >
                  {isSharing ? 'gerando...' : 'compartilhar'}
                </button>
              )
            )}

            <button
              onClick={onReset}
              style={btnStyle}
              onMouseEnter={e => btnHover(e, true)}
              onMouseLeave={e => btnHover(e, false)}
            >
              nova cartografia
            </button>
          </div>

          {shareUrl && (
            <p style={{ fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200, color: 'var(--white-ghost)', marginTop: '20px', textAlign: 'center', wordBreak: 'break-all' }}>
              {shareUrl}
            </p>
          )}

          {/* Meet another soul */}
          {onMeet && (
            <div style={{ borderTop: '1px solid var(--gold-line)', marginTop: '40px', paddingTop: '32px' }}>
              <p style={{ ...labelStyle, marginBottom: '20px', textAlign: 'center' }}>
                encontrar outra alma
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!meetInput.trim()) return;
                  let token = meetInput.trim();
                  try {
                    const url = new URL(token);
                    const urlToken = url.searchParams.get('token');
                    if (urlToken) token = urlToken;
                  } catch {
                    // raw token
                  }
                  onMeet(token);
                }}
                style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', maxWidth: '460px', margin: '0 auto' }}
              >
                <input
                  type="text"
                  value={meetInput}
                  onChange={(e) => setMeetInput(e.target.value)}
                  placeholder="cole o link ou token"
                  style={fieldStyle}
                  onFocus={e => (e.target.style.borderBottomColor = 'var(--gold)')}
                  onBlur={e => (e.target.style.borderBottomColor = 'rgba(201,168,76,0.2)')}
                />
                <button
                  type="submit"
                  style={{ ...btnStyle, flexShrink: 0 }}
                  onMouseEnter={e => btnHover(e, true)}
                  onMouseLeave={e => btnHover(e, false)}
                >
                  encontrar
                </button>
              </form>
            </div>
          )}
        </motion.div>

        {/* ── Oracle ── */}
        <OracleSection soulMap={soulMap} />

      </div>
    </motion.div>
  );
}
