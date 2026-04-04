// ═══════════════════════════════════════
// Cartografia da Alma — Viewer Screen
// Shows someone else's map read-only
// CTA: "encontrar o espaço entre nós"
// ═══════════════════════════════════════

import { motion } from 'framer-motion';
import type { SoulMap, Element } from '../types/soul-map';
import { RevealSection } from '../components/RevealSection';
import { FlowerOfLife } from '../geometry/FlowerOfLife';
import { Hexagram } from '../geometry/Hexagram';
import { Metatron } from '../geometry/Metatron';
import { SriYantra } from '../geometry/SriYantra';
import { TreeOfLife } from '../geometry/TreeOfLife';
import { computeBridges } from '../engine/bridges';
import { FrequencyDisplay } from '../components/FrequencyDisplay';
import { PsycheBar } from '../components/PsycheBar';

interface ViewerProps {
  soulMap: SoulMap;
  onMeet: () => void;
  onReset: () => void;
}

const ELEMENT_NAMES: Record<Element, string> = {
  fire: 'Fogo', earth: 'Terra', air: 'Ar', water: 'Água',
};

const SIGN_NAMES_PT: Record<string, string> = {
  Aries: 'Áries', Taurus: 'Touro', Gemini: 'Gêmeos', Cancer: 'Câncer',
  Leo: 'Leão', Virgo: 'Virgem', Libra: 'Libra', Scorpio: 'Escorpião',
  Sagittarius: 'Sagitário', Capricorn: 'Capricórnio', Aquarius: 'Aquário', Pisces: 'Peixes',
};

function ElementGeometry({ element }: { element: Element }) {
  switch (element) {
    case 'air':   return <FlowerOfLife />;
    case 'fire':  return <Hexagram />;
    case 'earth': return <Metatron />;
    case 'water': return <SriYantra />;
  }
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
  letterSpacing: '0.38em', color: 'var(--gold)', textTransform: 'uppercase',
};

export function Viewer({ soulMap, onMeet, onReset }: ViewerProps) {
  const { sunSign, element, sephirah, archetype, psyche, frequency, numerology } = soulMap;
  const bridges = computeBridges(soulMap);

  const btnStyle: React.CSSProperties = {
    background: 'transparent', border: 'none',
    borderBottom: '1px solid var(--gold)',
    fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 300,
    letterSpacing: '0.32em', color: 'var(--gold)',
    textTransform: 'uppercase', padding: '0 0 6px',
    transition: 'color 0.3s, letter-spacing 0.3s',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      style={{ minHeight: '100vh' }}
    >
      {/* ── Viewer banner ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: 'rgba(4,4,10,0.92)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--gold-line)',
          padding: '12px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <p style={{ ...labelStyle, fontSize: '8px' }}>
          mapa de {soulMap.birthData.name}
        </p>
        <button
          onClick={onMeet}
          style={{
            ...btnStyle, fontSize: '8px', letterSpacing: '0.28em',
            color: 'var(--gold)',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.letterSpacing = '0.38em'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.letterSpacing = '0.28em'; }}
        >
          encontrar o espaço entre nós →
        </button>
      </motion.div>

      {/* ── First viewport ── */}
      <div style={{
        minHeight: '100svh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px 40px', position: 'relative',
      }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 160, repeat: Infinity, ease: 'linear' }}
            style={{ width: 'min(600px, 95vw)', height: 'min(600px, 95vw)', opacity: 0.1 }}
          >
            <ElementGeometry element={element} />
          </motion.div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}
            style={{ ...labelStyle, marginBottom: '20px' }}
          >
            {SIGN_NAMES_PT[sunSign] ?? sunSign} · {ELEMENT_NAMES[element]}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4, delay: 0.5 }}
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(52px, 9vw, 100px)',
              fontWeight: 300, lineHeight: 1, letterSpacing: '-0.01em',
              color: 'var(--white)', margin: '0 0 32px',
            }}
          >
            {soulMap.birthData.name}
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 2.5, delay: 2, repeat: Infinity }}
          style={{ position: 'absolute', bottom: '40px', width: '1px', height: '48px', background: 'linear-gradient(to bottom, transparent, var(--gold))' }}
        />
      </div>

      {/* ── Sections (read-only) ── */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 24px 64px' }}>

        <div style={{ position: 'relative', marginBottom: '96px', height: 'min(360px, 48vh)' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.18 }}>
            <TreeOfLife activeSephirah={sephirah.name} />
          </div>
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 160, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'absolute', inset: 0, opacity: 0.85 }}>
            <ElementGeometry element={element} />
          </motion.div>
        </div>

        <RevealSection title={sephirah.name} subtitle={`${sephirah.meaning} · ${sephirah.planet}`}>
          <p>{sephirah.description}</p>
        </RevealSection>

        <RevealSection title={archetype.titlePt} subtitle={archetype.title}>
          <p style={{ marginBottom: '28px' }}>{archetype.description}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <p style={{ ...labelStyle, marginBottom: '8px' }}>desejo central</p>
              <p style={{ color: 'var(--white)' }}>{archetype.coreDesire}</p>
            </div>
            <div>
              <p style={{ ...labelStyle, marginBottom: '8px' }}>medo central</p>
              <p style={{ color: 'var(--white)' }}>{archetype.coreFear}</p>
            </div>
          </div>
        </RevealSection>

        <RevealSection title="Frequência de Ressonância" subtitle="solfeggio">
          <FrequencyDisplay frequency={frequency} delay={0} />
        </RevealSection>

        <RevealSection title={numerology.namePt} subtitle={`número ${numerology.number}`}>
          <p style={{ marginBottom: '20px' }}>{numerology.description}</p>
        </RevealSection>

        <RevealSection title="Estrutura Psíquica" subtitle="id · ego · superego">
          <p style={{ marginBottom: '28px' }}>{psyche.signature}</p>
          <PsycheBar psyche={psyche} delay={0} />
        </RevealSection>

        {/* ── Bridge synthesis ── */}
        <div style={{ margin: '0 0 80px', padding: '40px 0', borderTop: '1px solid var(--gold-line)', borderBottom: '1px solid var(--gold-line)' }}>
          <p style={{ fontFamily: 'var(--serif)', fontSize: '17px', fontWeight: 300, fontStyle: 'italic', color: 'var(--white-dim)', lineHeight: 1.7, textAlign: 'center' }}>
            {bridges.synthesis}
          </p>
        </div>

        {/* ── Soul Mate CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ textAlign: 'center', padding: '64px 0' }}
        >
          <p style={{ ...labelStyle, marginBottom: '24px' }}>o espaço entre</p>
          <p style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 300,
            color: 'var(--white)', lineHeight: 1.3, marginBottom: '12px',
          }}>
            Como é o espaço entre você<br />e {soulMap.birthData.name}?
          </p>
          <p style={{
            fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 300,
            fontStyle: 'italic', color: 'var(--white-dim)', marginBottom: '48px',
          }}>
            Gere seu mapa. O sistema faz o cruzamento.
          </p>
          <button
            onClick={onMeet}
            style={{
              ...btnStyle, fontSize: '11px', letterSpacing: '0.38em',
              display: 'inline-block',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--white)';
              (e.currentTarget as HTMLElement).style.letterSpacing = '0.48em';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--gold)';
              (e.currentTarget as HTMLElement).style.letterSpacing = '0.38em';
            }}
          >
            encontrar o espaço entre nós →
          </button>
        </motion.div>

        {/* ── Footer ── */}
        <div style={{ borderTop: '1px solid var(--gold-line)', paddingTop: '40px', textAlign: 'center' }}>
          <p style={{
            fontFamily: 'var(--serif)', fontSize: '14px', fontWeight: 300,
            fontStyle: 'italic', color: 'var(--white-ghost)', lineHeight: 1.7, marginBottom: '32px',
          }}>
            Soul Mate não é compatibilidade. É o mapa do espaço entre duas almas.
          </p>
          <button
            onClick={onReset}
            style={{ ...btnStyle, fontSize: '9px' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--white)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--gold)'; }}
          >
            gerar meu mapa
          </button>
        </div>

      </div>
    </motion.div>
  );
}
