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

export function SoulMateRevelation({ reading, onReset }: SoulMateRevelationProps) {
  const { readingA, readingB, elementDynamic, mirror, tikkun, frequencyHarmony, combinedPsyche, meetingNumber } = reading;
  const nameA = readingA.birthData.name;
  const nameB = readingB.birthData.name;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen px-4 py-12 md:py-20"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-center mb-16"
        >
          <p className="text-[#c9a84c]/40 text-sm tracking-widest uppercase mb-4">
            Soul Mate
          </p>
          <h1
            className="text-4xl md:text-5xl text-[#c9a84c] mb-3"
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            {nameA} &#10022; {nameB}
          </h1>
          <p
            className="text-xl text-[#e8dcc8]/60"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {SIGN_NAMES_PT[readingA.sunSign]} &middot; {ELEMENT_NAMES[readingA.element]}
            {'  \u2194  '}
            {SIGN_NAMES_PT[readingB.sunSign]} &middot; {ELEMENT_NAMES[readingB.element]}
          </p>
        </motion.div>

        {/* Section 1: Element Dynamic */}
        <RevealSection
          title={elementDynamic.name}
          subtitle={elementDynamic.nature}
          delay={0.5}
        >
          <p className="text-lg">{elementDynamic.description}</p>
        </RevealSection>

        {/* Section 2: The Mirror */}
        <RevealSection
          title="O Espelho"
          subtitle="Proje\u00e7\u00e3o Arquet\u00edpica"
          delay={1.0}
        >
          <div className="space-y-6">
            <div className="p-6 bg-white/5 rounded-lg border border-[#c9a84c]/10">
              <p className="text-[#c9a84c]/60 text-sm tracking-wider uppercase mb-2">
                {nameA} \u2192 {nameB}
              </p>
              <p className="text-lg text-[#e8dcc8]/80">{mirror.projectionAtoB}</p>
            </div>
            <div className="p-6 bg-white/5 rounded-lg border border-[#c9a84c]/10">
              <p className="text-[#c9a84c]/60 text-sm tracking-wider uppercase mb-2">
                {nameB} \u2192 {nameA}
              </p>
              <p className="text-lg text-[#e8dcc8]/80">{mirror.projectionBtoA}</p>
            </div>
            <p
              className="text-[#c9a84c]/40 text-sm mt-3 italic"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {mirror.integration}
            </p>
          </div>
        </RevealSection>

        {/* Section 3: Tikkun */}
        <RevealSection
          title="O Caminho"
          subtitle="Tikkun \u00b7 \u00c1rvore da Vida"
          delay={1.5}
        >
          <div className="relative mb-8 h-[250px] md:h-[350px]">
            <div className="absolute inset-0 opacity-30">
              <TreeOfLife activeSephirah={tikkun.sephirahA} />
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <span
              className="text-[#c9a84c] text-lg"
              style={{ fontFamily: "'Cinzel Decorative', serif" }}
            >
              {tikkun.sephirahA}
            </span>
            <span className="text-[#c9a84c]/40 text-sm">
              &mdash; dist\u00e2ncia {tikkun.distance} &mdash;
            </span>
            <span
              className="text-[#c9a84c] text-lg"
              style={{ fontFamily: "'Cinzel Decorative', serif" }}
            >
              {tikkun.sephirahB}
            </span>
          </div>
          <p className="text-lg">{tikkun.meaning}</p>
        </RevealSection>

        {/* Section 4: Frequency Harmony */}
        <RevealSection
          title="Harmonia"
          subtitle="Solfeggio"
          delay={2.0}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-2xl text-[#c9a84c]" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
              {frequencyHarmony.hzA} Hz
            </span>
            <span className="text-[#e8dcc8]/40 text-lg">\u2194</span>
            <span className="text-2xl text-[#c9a84c]" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
              {frequencyHarmony.hzB} Hz
            </span>
          </div>
          <p className="text-[#c9a84c]/60 text-sm tracking-wider uppercase text-center mb-3">
            {frequencyHarmony.interval}
          </p>
          <p className="text-lg">{frequencyHarmony.description}</p>
        </RevealSection>

        {/* Section 5: Combined Psyche */}
        <RevealSection
          title="Psique do Encontro"
          subtitle="Id \u00b7 Ego \u00b7 Superego"
          delay={2.5}
        >
          <p className="text-lg mb-6">{combinedPsyche.signature}</p>
          <PsycheBar psyche={combinedPsyche} delay={2.7} />
        </RevealSection>

        {/* Section 6: Meeting Number */}
        <RevealSection
          title={`${meetingNumber.number} \u00b7 ${meetingNumber.namePt}`}
          subtitle="N\u00famero do Encontro"
          delay={3.0}
        >
          <p className="text-lg mb-4">{meetingNumber.description}</p>
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-[#c9a84c]/60 text-sm tracking-wider uppercase mb-1">Tra\u00e7os</p>
              <p className="text-[#e8dcc8]/80">{meetingNumber.traits}</p>
            </div>
            <div>
              <p className="text-[#c9a84c]/60 text-sm tracking-wider uppercase mb-1">Sombra</p>
              <p className="text-[#e8dcc8]/60">{meetingNumber.shadow}</p>
            </div>
          </div>
        </RevealSection>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3.5 }}
          className="text-center mt-16 pt-8 border-t border-[#c9a84c]/10"
        >
          <p
            className="text-[#e8dcc8]/30 text-sm mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Soul Mate n\u00e3o \u00e9 compatibilidade. \u00c9 o mapa do espa\u00e7o entre duas almas.
            Os mapeamentos unem tradi\u00e7\u00f5es &mdash; Sinastria, Kabbalah, Jung, Freud,
            Solfeggio e Numerologia &mdash; como espelhos, n\u00e3o verdades absolutas.
          </p>

          <motion.button
            onClick={onReset}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-white/5 border border-[#c9a84c]/20 rounded-lg text-[#c9a84c]/60 hover:text-[#c9a84c] hover:border-[#c9a84c]/40 transition-all text-sm tracking-wider uppercase cursor-pointer"
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            Nova Cartografia
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
