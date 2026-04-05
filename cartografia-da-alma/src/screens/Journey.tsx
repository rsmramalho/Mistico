import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SoulMap, Element } from '../types/soul-map';
import type { CardId } from '../hooks/useJourney';
import { useJourney } from '../hooks/useJourney';
import { useAudio } from '../hooks/useAudio';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { CARTA_VARIATIONS, type CartaVariations } from '../engine/variations';
import { Carta } from '../components/Carta';
import { CartaReveal } from '../components/CartaReveal';
import { JourneyTimeline } from '../components/JourneyTimeline';
import { OracloCarta } from '../components/OracloCarta';
import { CartaAstrologia } from '../components/CartaAstrologia';
import { CartaKabbalah } from '../components/CartaKabbalah';
import { CartaSombra } from '../components/CartaSombra';
import { CartaFrequencia } from '../components/CartaFrequencia';
import { CartaNumerologia } from '../components/CartaNumerologia';
import { CadeiaRaciocinio } from '../components/CadeiaRaciocinio';
import { PaywallOverlay } from '../components/PaywallOverlay';
import { getCardProvenance } from '../engine/provenance';

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
  tier?: import('../types/database').ReadingTier;
  onEmailSubmit?: (email: string) => Promise<boolean>;
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

const CARD_ICONS: Record<CardId, string> = {
  astrology: '♈',
  kabbalah: '✡',
  shadow: '☯',
  frequency: '♪',
  numerology: '①',
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

function getCardContent(cardId: CardId, soulMap: SoulMap, seed: number): React.ReactNode {
  const provenance = getCardProvenance(cardId, soulMap);

  let body: React.ReactNode;
  switch (cardId) {
    case 'astrology':
      body = <CartaAstrologia soulMap={soulMap} />;
      break;
    case 'kabbalah':
      body = <CartaKabbalah soulMap={soulMap} seed={seed} />;
      break;
    case 'shadow':
      body = <CartaSombra soulMap={soulMap} />;
      break;
    case 'frequency':
      body = <CartaFrequencia soulMap={soulMap} />;
      break;
    case 'numerology':
      body = <CartaNumerologia soulMap={soulMap} />;
      break;
  }

  return (
    <>
      {body}
      {provenance && <CadeiaRaciocinio provenance={provenance} />}
    </>
  );
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

export function Journey({ soulMap, onComplete, onOracleAnswer, tier = 'session', onEmailSubmit }: JourneyProps) {
  const journey = useJourney(soulMap, tier);
  const {
    seed,
    cards,
    currentCard,
    currentIndex,
    totalCards,
    finished,
    isGated,
    revealBody,
    setOracleResult,
    advanceCard,
  } = journey;

  // Audio — plays the frequency for this person
  const audio = useAudio(soulMap.frequency.hz);
  const sfx = useSoundEffects();

  // Card reveal ceremony state
  const [revealing, setRevealing] = useState(true); // starts with first card reveal
  const [revealedCards, setRevealedCards] = useState<Set<CardId>>(new Set());

  const handleRevealComplete = useCallback(() => {
    if (currentCard) {
      setRevealedCards(prev => new Set(prev).add(currentCard.id));
    }
    setRevealing(false);
  }, [currentCard]);

  // Trigger reveal ceremony when card changes
  useEffect(() => {
    if (!currentCard) return;
    if (revealedCards.has(currentCard.id)) return;
    setRevealing(true);
    sfx.enable(); // enable sfx after first interaction
  }, [currentCard?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Stop audio when journey finishes
  useEffect(() => {
    if (finished) { audio.stop(); onComplete(); }
  }, [finished, onComplete, audio]);

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

  // If gated, show paywall instead of body
  const microReveal = isGated && currentCard.id === 'shadow'
    ? soulMap.archetype.shadow.inflated.split('.')[0] + '.'
    : '';

  const bodyContent = isGated
    ? (
      <PaywallOverlay
        microReveal={microReveal || `${soulMap.archetype.titlePt} carrega algo que ainda não foi nomeado.`}
        onEmailSubmit={async (email) => { if (onEmailSubmit) await onEmailSubmit(email); }}
      />
    )
    : currentCard.bodyRevealed
      ? getCardContent(currentCard.id, soulMap, seed)
      : null;

  const handleOracleResult = (question: string, answer: string) => {
    setOracleResult(question, answer);
    onOracleAnswer?.(currentCard.id, question, answer);
  };

  const oracleContent = (isGated || !currentCard.bodyRevealed) ? null : (
    <OracloCarta
      cardId={currentCard.id}
      soulMap={soulMap}
      onResult={handleOracleResult}
      onSkipOracle={advanceCard}
      used={currentCard.oracleUsed}
      question={currentCard.oracleQuestion}
      answer={currentCard.oracleAnswer}
    />
  );

  const showContinue = currentCard.bodyRevealed && !isGated;

  return (
    <>
      {/* ── Card opening ceremony ── */}
      {revealing && currentCard && !revealedCards.has(currentCard.id) && (
        <CartaReveal
          label={CARD_LABELS[currentCard.id]}
          icon={CARD_ICONS[currentCard.id]}
          onComplete={handleRevealComplete}
          onFlip={sfx.flip}
          onReveal={sfx.reveal}
          frequencyHz={soulMap.frequency.hz}
        />
      )}

      <JourneyTimeline cards={cards} currentIndex={currentIndex} />
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
            audioPlaying={audio.playing}
            onAudioToggle={audio.toggle}
          />
        </motion.div>
      </AnimatePresence>
    </>
  );
}
