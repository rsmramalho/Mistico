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
// Orchestrates the 6-card sequence
// ═══════════════════════════════════════

interface JourneyProps {
  soulMap: SoulMap;
  onComplete: () => void;
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
    case 'palm':
      return <SriYantra />;
  }
}

// ── Labels (PT) ──

const CARD_LABELS: Record<CardId, string> = {
  astrology: 'astrologia',
  kabbalah: 'kabbalah',
  shadow: 'a sombra',
  frequency: 'frequência',
  numerology: 'numerologia',
  palm: 'palma',
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
    case 'palm':
      return 'As linhas da mão contam o que a data de nascimento não alcança.';
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
    case 'palm':
      return (
        <div style={{
          fontFamily: 'var(--serif)',
          fontSize: '18px',
          color: 'var(--white-dim)',
        }}>
          Leitura da palma em breve.
        </div>
      );
  }
}

// ── Transitions ──

const cardExit = {
  opacity: 0,
  y: -20,
  transition: { duration: 0.6, ease: 'easeIn' as const },
};

const cardEnter = {
  opacity: 0,
  y: 30,
};

const cardVisible = {
  opacity: 1,
  y: 0,
  transition: { duration: 0.8, delay: 0.2, ease: 'easeOut' as const },
};

// ═══════════════════════════════════════

export function Journey({ soulMap, onComplete }: JourneyProps) {
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
    const delay = wordCount * 0.08 + 1.5; // word animation duration + buffer

    const timer = setTimeout(revealBody, delay * 1000);
    return () => clearTimeout(timer);
  }, [currentCard?.id, currentCard?.bodyRevealed, revealBody, soulMap]);

  if (!currentCard) return null;

  const variationText = getVariationText(currentCard.id, soulMap, currentCard.variation);
  const geometry = getGeometry(currentCard.id, soulMap);
  const label = CARD_LABELS[currentCard.id];
  const progress = `${currentIndex + 1} / ${totalCards}`;

  const bodyContent = currentCard.bodyRevealed
    ? getCardContent(currentCard.id, soulMap)
    : null;

  const oracleContent = currentCard.bodyRevealed ? (
    <OracloCarta
      cardId={currentCard.id}
      soulMap={soulMap}
      onResult={setOracleResult}
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
        />
      </motion.div>
    </AnimatePresence>
  );
}
