import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SoulMap, Element } from '../types/soul-map';
import type { CardId } from '../hooks/useJourney';
import { useJourney } from '../hooks/useJourney';
import { CARTA_VARIATIONS, type CartaVariations } from '../engine/variations';
import { Carta } from '../components/Carta';
import { OracloCarta } from '../components/OracloCarta';
import { CartaAstrologia } from '../components/CartaAstrologia';
import { CartaKabbalah } from '../components/CartaKabbalah';
import { CartaSombra } from '../components/CartaSombra';
import { CartaFrequencia } from '../components/CartaFrequencia';
import { CartaNumerologia } from '../components/CartaNumerologia';

import { Hexagram } from '../geometry/Hexagram';
import { FlowerOfLife } from '../geometry/FlowerOfLife';
import { Metatron } from '../geometry/Metatron';
import { SriYantra } from '../geometry/SriYantra';
import { TreeOfLife } from '../geometry/TreeOfLife';

// ═══════════════════════════════════════
// Cartografia da Alma — Journey
// Orchestrates the 5-card sequence
// ═══════════════════════════════════════

interface JourneyProps {
  soulMap: SoulMap;
  onComplete: () => void;
  onOracleAnswer?: (cardId: string, question: string, answer: string) => void;
}

// ── Geometry per element ──

const ELEMENT_GEOMETRY: Record<Element, React.ReactNode> = {
  fire: <Hexagram />,
  earth: <Metatron />,
  air: <FlowerOfLife />,
  water: <SriYantra />,
};

// ── Geometry per card ──

function getGeometry(cardId: CardId, soulMap: SoulMap): React.ReactNode {
  switch (cardId) {
    case 'astrology':
      return ELEMENT_GEOMETRY[soulMap.element];
    case 'kabbalah':
      return <TreeOfLife activeSephirah={soulMap.sephirah.name} />;
    case 'shadow':
      return <Metatron />;
    case 'frequency':
      return <FlowerOfLife />;
    case 'numerology':
      return <FlowerOfLife />;
  }
}

// ── Labels (PT) ──

const CARD_LABELS: Record<CardId, string> = {
  astrology: 'astrologia',
  kabbalah: 'kabbalah',
  shadow: 'a sombra',
  frequency: 'frequência',
  numerology: 'numerologia',
};

// ── minPause per card (ROADMAP-V2) ──

const CARD_MIN_PAUSE: Record<CardId, number> = {
  astrology: 4,
  kabbalah: 4,
  shadow: 6,    // denser card — more time to sit with the shadow
  frequency: 4,
  numerology: 4,
};

// ── fundoEscuro per card ──

const CARD_FUNDO_ESCURO: Record<CardId, boolean> = {
  astrology: false,
  kabbalah: false,
  shadow: true,
  frequency: false,
  numerology: false,
};

// ── Variation key mapping ──

type VariationKey = keyof CartaVariations;

function getVariationKey(cardId: CardId): VariationKey | null {
  switch (cardId) {
    case 'astrology': return 'astrology';
    case 'kabbalah': return 'kabbalah';
    case 'shadow': return 'shadow';
    default: return null;
  }
}

function getVariationText(cardId: CardId, soulMap: SoulMap, variation: 0 | 1 | 2): string {
  const key = getVariationKey(cardId);
  if (key) {
    return CARTA_VARIATIONS[soulMap.sunSign]?.[key]?.[variation] ?? '';
  }
  // Fallback for cards without hardcoded variations
  switch (cardId) {
    case 'frequency':
      return `A frequência do seu campo vibra a ${soulMap.frequency.hz}Hz — ${soulMap.frequency.keywordPt}.`;
    case 'numerology':
      return `O número que carrega seu nome é ${soulMap.numerology.number} — ${soulMap.numerology.namePt}.`;
    default:
      return '';
  }
}

// ── Card body content ──

function getCardContent(cardId: CardId, soulMap: SoulMap): React.ReactNode {
  switch (cardId) {
    case 'astrology':
      return <CartaAstrologia soulMap={soulMap} />;
    case 'kabbalah':
      return <CartaKabbalah soulMap={soulMap} />;
    case 'shadow':
      return <CartaSombra soulMap={soulMap} />;
    case 'frequency':
      return <CartaFrequencia soulMap={soulMap} />;
    case 'numerology':
      return <CartaNumerologia soulMap={soulMap} />;
  }
}

// ── Transitions (ROADMAP-V2) ──

const cardExit = {
  opacity: 0,
  y: -32,
  transition: { duration: 0.7, ease: 'easeIn' as const },
};

const cardEnter = {
  opacity: 0,
  y: 48,
};

const cardVisible = {
  opacity: 1,
  y: 0,
  transition: { duration: 1.2, delay: 0.6, ease: 'easeOut' as const },
};

// ═══════════════════════════════════════

export function Journey({ soulMap, onComplete, onOracleAnswer }: JourneyProps) {
  const journey = useJourney(soulMap);
  const {
    currentCard,
    currentIndex,
    totalCards,
    finished,
    revealBody,
    setOracleResult,
    advanceCard,
  } = journey;

  // Call onComplete when journey finishes
  useEffect(() => {
    if (finished) onComplete();
  }, [finished, onComplete]);

  // Auto-reveal body after variation text animation finishes
  useEffect(() => {
    if (!currentCard || currentCard.bodyRevealed) return;

    const text = getVariationText(currentCard.id, soulMap, currentCard.variation);
    const wordCount = text?.split(' ').length ?? 10;
    const delay = wordCount * 0.14 + 1.8; // word animation duration + buffer

    const timer = setTimeout(revealBody, delay * 1000);
    return () => clearTimeout(timer);
  }, [currentCard?.id, currentCard?.bodyRevealed, revealBody, soulMap]);

  if (!currentCard) return null;

  const variationText = getVariationText(currentCard.id, soulMap, currentCard.variation);
  const geometry = getGeometry(currentCard.id, soulMap);
  const label = CARD_LABELS[currentCard.id];
  const progress = `${currentIndex + 1} / ${totalCards}`;
  const minPause = CARD_MIN_PAUSE[currentCard.id];
  const fundoEscuro = CARD_FUNDO_ESCURO[currentCard.id];

  const bodyContent = currentCard.bodyRevealed
    ? getCardContent(currentCard.id, soulMap)
    : null;

  const handleOracleResult = (question: string, answer: string) => {
    setOracleResult(question, answer);
    onOracleAnswer?.(currentCard.id, question, answer);
  };

  const oracleContent = currentCard.bodyRevealed ? (
    <OracloCarta
      cardId={currentCard.id}
      soulMap={soulMap}
      onResult={handleOracleResult}
      onSkipOracle={advanceCard}
      used={currentCard.oracleUsed}
      question={currentCard.oracleQuestion}
      answer={currentCard.oracleAnswer}
    />
  ) : null;

  const showContinue = currentCard.bodyRevealed;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentCard.id}
        initial={cardEnter}
        animate={cardVisible}
        exit={cardExit}
        style={{ minHeight: '100svh' }}
      >
        <Carta
          label={label}
          geometry={geometry}
          variation={variationText}
          body={bodyContent}
          oracle={oracleContent}
          onContinue={advanceCard}
          showContinue={showContinue}
          progress={progress}
          minPause={minPause}
          fundoEscuro={fundoEscuro}
        />
      </motion.div>
    </AnimatePresence>
  );
}
