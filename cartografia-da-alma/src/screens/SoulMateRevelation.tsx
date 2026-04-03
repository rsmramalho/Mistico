import { motion } from 'framer-motion';
import type { SoulMateReading, Element } from '../types/soul-map';
import { RevealSection } from '../components/RevealSection';
import { PsycheBar } from '../components/PsycheBar';
import { TreeOfLife } from '../geometry/TreeOfLife';

interface SoulMateRevelationProps {
  reading: SoulMateReading;
  onReset: () => void;
}

const ELEMENT_NAMES: Record<Element, string> = {
  fire: 'Fogo',
  earth: 'Terra',
  air: 'Ar',
  water: 'Água',
};

const SIGN_NAMES_PT: Record<string, string> = {
  Aries: 'Áries', Taurus: 'Touro', Gemini: 'Gêmeos', Cancer: 'Câncer',
  Leo: 'Leão', Virgo: 'Virgem', Libra: 'Libra', Scorpio: 'Escorpião',
  Sagittarius: 'Sagitário', Capricorn: 'Capricórnio', Aquarius: 'Aquário', Pisces: 'Peixes',
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

export function SoulMateRevelation({ reading, onReset }: SoulMateRevelationProps) {
  const { readingA, readingB, elementDynamic, mirror, tikkun, frequencyHarmony, combinedPsyche, meetingNumber } = reading;
  const nameA = readingA.birthData.name;
  const nameB = readingB.birthData.name;

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
            soul mate
          </p>
          <h1 style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(38px, 5.5vw, 64px)',
            fontWeight: 300, lineHeight: 1.05, color: 'var(--white)', marginBottom: '14px',
          }}>
            {nameA} &#10022; {nameB}
          </h1>
          <p style={{
            fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 300,
            fontStyle: 'italic', color: 'var(--white-dim)',
          }}>
            {SIGN_NAMES_PT[readingA.sunSign]} &middot; {ELEMENT_NAMES[readingA.element]}
            {'  \u2194  '}
            {SIGN_NAMES_PT[readingB.sunSign]} &middot; {ELEMENT_NAMES[readingB.element]}
          </p>
        </motion.div>

        {/* ── Section 1: Element Dynamic ── */}
        <RevealSection
          title={elementDynamic.name}
          subtitle={elementDynamic.nature}
          delay={0.5}
        >
          <p>{elementDynamic.description}</p>
        </RevealSection>

        {/* ── Section 2: The Mirror ── */}
        <RevealSection
          title="O Espelho"
          subtitle="Proje\u00e7\u00e3o Arquet\u00edpica"
          delay={1.0}
        >
          {/* Projection A → B */}
          <div style={{ borderTop: '1px solid var(--gold-line)', paddingTop: '24px', marginBottom: '32px' }}>
            <p style={{ ...labelStyle, marginBottom: '12px' }}>
              {nameA} \u2192 {nameB}
            </p>
            <p style={{ color: 'var(--white-dim)' }}>{mirror.projectionAtoB}</p>
          </div>

          {/* Projection B → A */}
          <div style={{ borderTop: '1px solid var(--gold-line)', paddingTop: '24px', marginBottom: '32px' }}>
            <p style={{ ...labelStyle, marginBottom: '12px' }}>
              {nameB} \u2192 {nameA}
            </p>
            <p style={{ color: 'var(--white-dim)' }}>{mirror.projectionBtoA}</p>
          </div>

          {/* Integration */}
          <p style={{
            fontFamily: 'var(--serif)', fontSize: '15px', fontWeight: 300,
            fontStyle: 'italic', color: 'var(--white-ghost)', lineHeight: 1.7,
            marginTop: '8px',
          }}>
            {mirror.integration}
          </p>
        </RevealSection>

        {/* ── Section 3: Tikkun ── */}
        <RevealSection
          title="O Caminho"
          subtitle="Tikkun \u00b7 \u00c1rvore da Vida"
          delay={1.5}
        >
          <div style={{ position: 'relative', marginBottom: '32px', height: '280px' }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.18 }}>
              <TreeOfLife activeSephirah={tikkun.sephirahA} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '20px' }}>
            <span style={{
              fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 300,
              color: 'var(--gold)',
            }}>
              {tikkun.sephirahA}
            </span>
            <span style={{ ...labelStyle, fontSize: '8px', color: 'var(--white-ghost)' }}>
              &mdash; dist&acirc;ncia {tikkun.distance} &mdash;
            </span>
            <span style={{
              fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 300,
              color: 'var(--gold)',
            }}>
              {tikkun.sephirahB}
            </span>
          </div>
          <p>{tikkun.meaning}</p>
        </RevealSection>

        {/* ── Section 4: Frequency Harmony ── */}
        <RevealSection
          title="Harmonia"
          subtitle="Solfeggio"
          delay={2.0}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '20px' }}>
            <span style={{
              fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: 300,
              color: 'var(--gold)',
            }}>
              {frequencyHarmony.hzA} Hz
            </span>
            <span style={{ color: 'var(--white-ghost)', fontSize: '18px' }}>\u2194</span>
            <span style={{
              fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: 300,
              color: 'var(--gold)',
            }}>
              {frequencyHarmony.hzB} Hz
            </span>
          </div>
          <p style={{ ...labelStyle, textAlign: 'center', marginBottom: '16px' }}>
            {frequencyHarmony.interval}
          </p>
          <p>{frequencyHarmony.description}</p>
        </RevealSection>

        {/* ── Section 5: Combined Psyche ── */}
        <RevealSection
          title="Psique do Encontro"
          subtitle="Id \u00b7 Ego \u00b7 Superego"
          delay={2.5}
        >
          <p style={{ marginBottom: '28px' }}>{combinedPsyche.signature}</p>
          <PsycheBar psyche={combinedPsyche} delay={2.7} />
        </RevealSection>

        {/* ── Section 6: Meeting Number ── */}
        <RevealSection
          title={`${meetingNumber.number} \u00b7 ${meetingNumber.namePt}`}
          subtitle="N\u00famero do Encontro"
          delay={3.0}
        >
          <p style={{ marginBottom: '24px' }}>{meetingNumber.description}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <p style={{ ...labelStyle, marginBottom: '8px' }}>tra\u00e7os</p>
              <p style={{ color: 'var(--white)' }}>{meetingNumber.traits}</p>
            </div>
            <div>
              <p style={{ ...labelStyle, marginBottom: '8px' }}>sombra</p>
              <p style={{ color: 'var(--white-dim)' }}>{meetingNumber.shadow}</p>
            </div>
          </div>
        </RevealSection>

        {/* ── Footer ── */}
        <motion.div
          {...fade(3.5)}
          style={{ borderTop: '1px solid var(--gold-line)', paddingTop: '40px', marginTop: '40px' }}
        >
          <p style={{
            fontFamily: 'var(--serif)', fontSize: '15px', fontWeight: 300,
            fontStyle: 'italic', color: 'var(--white-ghost)', lineHeight: 1.7,
            textAlign: 'center', marginBottom: '40px',
          }}>
            Soul Mate n&atilde;o &eacute; compatibilidade. &Eacute; o mapa do espa&ccedil;o entre duas almas.
            Os mapeamentos unem tradi&ccedil;&otilde;es &mdash; Sinastria, Kabbalah, Jung, Freud,
            Solfeggio e Numerologia &mdash; como espelhos, n&atilde;o verdades absolutas.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button
              onClick={onReset}
              style={btnStyle}
              onMouseEnter={e => btnHover(e, true)}
              onMouseLeave={e => btnHover(e, false)}
            >
              nova cartografia
            </button>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
