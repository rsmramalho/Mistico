import { useState } from 'react';
import { motion } from 'framer-motion';
import type { SoulMap, Element, LineName } from '../types/soul-map';
import { RevealSection } from '../components/RevealSection';
import { PsycheBar } from '../components/PsycheBar';
import { FrequencyDisplay } from '../components/FrequencyDisplay';
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

const LINE_NAMES_PT: Record<string, string> = {
  heart: 'Coração', head: 'Cabeça', life: 'Vida', fate: 'Destino',
};

const DOMINANT_LINE_DESCRIPTIONS: Record<LineName, string> = {
  heart: 'A linha do Coração é a mais marcada na sua palma — sua vida emocional e afetiva é o centro gravitacional da sua experiência. Relações, empatia e conexão guiam suas decisões mais do que razão ou ambição.',
  head: 'A linha da Cabeça domina sua palma — o intelecto é seu instrumento primário. Análise, comunicação e pensamento estratégico são as forças que movem seu caminho.',
  life: 'A linha da Vida é a mais profunda na sua palma — vitalidade e resiliência definem sua trajetória. Há uma força vital intensa que sustenta tudo o que você constrói.',
  fate: 'A linha do Destino corta sua palma com clareza — existe um senso de propósito forte, uma direção que vai além de escolhas conscientes. Vocação e missão são forças ativas na sua vida.',
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
            Cartografia da Alma
          </p>
          <h1
            className="text-4xl md:text-5xl text-[#c9a84c] mb-3"
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            {soulMap.birthData.name}
          </h1>
          <p
            className="text-xl text-[#e8dcc8]/60"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {SIGN_NAMES_PT[sunSign]} · {ELEMENT_NAMES[element]}
            {soulMap.source === 'palm'
              ? ' · Via Palma'
              : ascendant ? ` · Ascendente ${SIGN_NAMES_PT[ascendant.sign]}` : ''}
          </p>
        </motion.div>

        {/* Sacred Geometry */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="relative mb-16 h-[300px] md:h-[400px]"
        >
          <div className="absolute inset-0 opacity-30">
            <TreeOfLife activeSephirah={sephirah.name} />
          </div>
          <div className="absolute inset-0">
            <ElementGeometry element={element} />
          </div>
        </motion.div>

        {/* Section 1: Sephirah */}
        <RevealSection
          title={sephirah.name}
          subtitle={`${sephirah.meaning} · ${sephirah.planet}`}
          delay={0.5}
        >
          <p className="text-lg">{sephirah.description}</p>
          <p className="text-[#c9a84c]/40 text-sm mt-3 italic">
            Sephirah {sephirah.number} na Árvore da Vida · Expressão {
              sephirah.expression === 'diurnal' ? 'diurna' :
              sephirah.expression === 'nocturnal' ? 'noturna' : 'singular'
            }
          </p>
          {soulMap.sephirahExpressionPalmDerived && (
            <p className="text-[#c9a84c]/30 text-xs mt-2 italic">
              Expressão canônica: singular · Expressão via palma:{' '}
              {soulMap.sephirahExpressionPalmDerived === 'diurnal' ? 'diurna' : 'noturna'}
            </p>
          )}
        </RevealSection>

        {/* Section 2: Archetype + Shadow */}
        <RevealSection
          title={archetype.titlePt}
          subtitle={archetype.title}
          delay={1.0}
        >
          <p className="text-lg mb-4">{archetype.description}</p>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-[#c9a84c]/60 text-sm tracking-wider uppercase mb-1">Desejo Central</p>
              <p className="text-lg">{archetype.coreDesire}</p>
            </div>
            <div>
              <p className="text-[#c9a84c]/60 text-sm tracking-wider uppercase mb-1">Medo Central</p>
              <p className="text-lg">{archetype.coreFear}</p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-white/5 rounded-lg border border-[#c9a84c]/10">
            <p className="text-[#c9a84c]/70 text-sm tracking-wider uppercase mb-4">A Sombra</p>
            <div className="space-y-3">
              <div>
                <p className="text-[#c94c4c]/70 text-xs tracking-wider uppercase mb-1">Sombra Inflada (excesso)</p>
                <p className="text-[#e8dcc8]/70">{archetype.shadow.inflated}</p>
              </div>
              <div>
                <p className="text-[#4c8bc9]/70 text-xs tracking-wider uppercase mb-1">Sombra Deflacionada (falta)</p>
                <p className="text-[#e8dcc8]/70">{archetype.shadow.deflated}</p>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* Section 3: Frequency */}
        <RevealSection
          title="Frequência de Ressonância"
          subtitle="Solfeggio"
          delay={1.5}
        >
          <FrequencyDisplay frequency={frequency} delay={1.7} />
        </RevealSection>

        {/* Section 4: Numerology */}
        <RevealSection
          title={`${numerology.number} · ${numerology.namePt}`}
          subtitle={`Número de Expressão${numerology.isMasterNumber ? ' · Número Mestre' : ''}`}
          delay={2.0}
        >
          <p className="text-lg mb-4">{numerology.description}</p>
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-[#c9a84c]/60 text-sm tracking-wider uppercase mb-1">Traços</p>
              <p className="text-[#e8dcc8]/80">{numerology.traits}</p>
            </div>
            <div>
              <p className="text-[#c9a84c]/60 text-sm tracking-wider uppercase mb-1">Sombra</p>
              <p className="text-[#e8dcc8]/60">{numerology.shadow}</p>
            </div>
          </div>
        </RevealSection>

        {/* Section 5: Ascendant or Dominant Line */}
        {soulMap.source === 'palm' && soulMap.dominantLine ? (
          <RevealSection
            title={LINE_NAMES_PT[soulMap.dominantLine]}
            subtitle="Linha Dominante"
            delay={2.5}
          >
            <p className="text-lg text-[#e8dcc8]/70">
              {DOMINANT_LINE_DESCRIPTIONS[soulMap.dominantLine]}
            </p>
          </RevealSection>
        ) : ascendant ? (
          <RevealSection
            title={`Ascendente em ${SIGN_NAMES_PT[ascendant.sign]}`}
            subtitle="Signo Ascendente (aproximado)"
            delay={2.5}
          >
            <p className="text-lg text-[#e8dcc8]/70">
              O ascendente representa a máscara que você apresenta ao mundo — a primeira impressão,
              o filtro pelo qual sua essência solar se expressa. Com ascendente em{' '}
              <span className="text-[#c9a84c]">{SIGN_NAMES_PT[ascendant.sign]}</span>,
              sua presença carrega as qualidades deste signo antes que os outros vejam seu Sol em{' '}
              <span className="text-[#c9a84c]">{SIGN_NAMES_PT[sunSign]}</span>.
            </p>
            <p className="text-[#c9a84c]/30 text-xs mt-3 italic">
              Cálculo aproximado baseado no horário informado. Para precisão,
              uma versão futura utilizará efemérides reais e coordenadas geográficas.
            </p>
          </RevealSection>
        ) : null}

        {/* Section 6: Psyche */}
        <RevealSection
          title="Estrutura Psíquica"
          subtitle="Id · Ego · Superego"
          delay={hasSection5 ? 3.0 : 2.5}
        >
          <p className="text-lg mb-6">{psyche.signature}</p>
          <PsycheBar psyche={psyche} delay={hasSection5 ? 3.2 : 2.7} />
        </RevealSection>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: hasSection5 ? 3.5 : 3.0 }}
          className="text-center mt-16 pt-8 border-t border-[#c9a84c]/10"
        >
          <p
            className="text-[#e8dcc8]/30 text-sm mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {isPalm
              ? 'Os mapeamentos desta cartografia unem tradições — Quiromancia, Kabbalah, Jung, Freud, Solfeggio e Numerologia — como espelhos, não verdades absolutas.'
              : 'Os mapeamentos desta cartografia unem tradições — Astrologia, Kabbalah, Jung, Freud, Solfeggio e Numerologia — como espelhos, não verdades absolutas. A sombra é tão importante quanto a luz.'
            }
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {canShare && onShare && (
              shareUrl ? (
                <button
                  onClick={() => navigator.clipboard.writeText(shareUrl)}
                  className="px-8 py-3 bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-lg text-[#c9a84c]/80 hover:text-[#c9a84c] hover:border-[#c9a84c]/50 transition-all text-sm tracking-wider uppercase cursor-pointer"
                  style={{ fontFamily: "'Cinzel Decorative', serif" }}
                >
                  Copiar Link
                </button>
              ) : (
                <motion.button
                  onClick={onShare}
                  disabled={isSharing}
                  whileHover={!isSharing ? { scale: 1.02 } : {}}
                  whileTap={!isSharing ? { scale: 0.98 } : {}}
                  className={`px-8 py-3 border rounded-lg text-sm tracking-wider uppercase transition-all ${
                    isSharing
                      ? 'bg-white/5 border-white/10 text-white/20 cursor-wait'
                      : 'bg-[#c9a84c]/10 border-[#c9a84c]/30 text-[#c9a84c]/80 hover:text-[#c9a84c] hover:border-[#c9a84c]/50 cursor-pointer'
                  }`}
                  style={{ fontFamily: "'Cinzel Decorative', serif" }}
                >
                  {isSharing ? 'Gerando...' : 'Compartilhar'}
                </motion.button>
              )
            )}

            <motion.button
              onClick={onReset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-white/5 border border-[#c9a84c]/20 rounded-lg text-[#c9a84c]/60 hover:text-[#c9a84c] hover:border-[#c9a84c]/40 transition-all text-sm tracking-wider uppercase cursor-pointer"
              style={{ fontFamily: "'Cinzel Decorative', serif" }}
            >
              Nova Cartografia
            </motion.button>
          </div>

          {onMeet && (
            <div className="mt-8 pt-6 border-t border-[#c9a84c]/10">
              <p
                className="text-[#c9a84c]/40 text-sm tracking-widest uppercase mb-4"
                style={{ fontFamily: "'Cinzel Decorative', serif" }}
              >
                Encontrar outra alma
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!meetInput.trim()) return;
                  let token = meetInput.trim();
                  // Extract token from URL if a full URL was pasted
                  try {
                    const url = new URL(token);
                    const urlToken = url.searchParams.get('token');
                    if (urlToken) token = urlToken;
                  } catch {
                    // Not a URL — use raw text as token
                  }
                  onMeet(token);
                }}
                className="flex flex-col sm:flex-row items-center gap-3"
              >
                <input
                  type="text"
                  value={meetInput}
                  onChange={(e) => setMeetInput(e.target.value)}
                  placeholder="Cole o link ou token"
                  className="flex-1 w-full sm:w-auto px-4 py-2 bg-white/5 border border-[#c9a84c]/15 rounded-lg text-[#e8dcc8]/80 placeholder-[#e8dcc8]/20 text-sm focus:outline-none focus:border-[#c9a84c]/40 transition-all"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2 bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-lg text-[#c9a84c]/60 hover:text-[#c9a84c] hover:border-[#c9a84c]/40 transition-all text-sm tracking-wider uppercase cursor-pointer"
                  style={{ fontFamily: "'Cinzel Decorative', serif" }}
                >
                  Encontrar
                </motion.button>
              </form>
            </div>
          )}

          {shareUrl && (
            <p className="text-[#c9a84c]/30 text-xs mt-4 break-all">
              {shareUrl}
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
