import { useState, useCallback } from 'react';
import type { SoulMap } from '../types/soul-map';
import type { ReadingTier } from '../types/database';
import { getVariation } from '../engine/variations';

// ═══════════════════════════════════════
// Cartografia da Alma — Journey Hook (V2)
// Card-by-card state manager
// Tier-aware: session=2 cards, email=all, oracle=all+3q
// ═══════════════════════════════════════

export type CardId = 'astrology' | 'kabbalah' | 'shadow' | 'frequency' | 'numerology';

// Cards 0-1 (astrology, kabbalah) are always free
// Card 2+ (shadow, frequency, numerology) require email tier
const FREE_CARD_LIMIT = 2;

export interface CardState {
  id: CardId;
  variation: 0 | 1 | 2;          // chosen randomly at journey start
  bodyRevealed: boolean;          // card body has emerged
  oracleUsed: boolean;            // oracle question for this card asked
  oracleQuestion?: string;
  oracleAnswer?: string;
  completed: boolean;             // [continuar →] clicked
}

export interface JourneyState {
  soulMap: SoulMap;
  cards: CardState[];
  currentIndex: number;           // 0-5
  seed: number;                   // random number at start, determines variations
  started: boolean;               // journey has begun
  finished: boolean;              // all cards completed → show mapa final
}

const CARD_ORDER: CardId[] = ['astrology', 'kabbalah', 'shadow', 'frequency', 'numerology'];

export function useJourney(soulMap: SoulMap, tier: ReadingTier = 'session') {
  const [seed] = useState(() => Math.floor(Math.random() * 1000));

  const [cards, setCards] = useState<CardState[]>(() =>
    CARD_ORDER.map((id) => ({
      id,
      variation: getVariation(soulMap.sunSign, seed + CARD_ORDER.indexOf(id)) as 0 | 1 | 2,
      bodyRevealed: false,
      oracleUsed: false,
      completed: false,
    }))
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentCard = cards[currentIndex] ?? null;

  // Mark current card body as revealed
  const revealBody = useCallback(() => {
    setCards(prev => prev.map((c, i) => i === currentIndex ? { ...c, bodyRevealed: true } : c));
  }, [currentIndex]);

  // Save oracle Q&A for current card
  const setOracleResult = useCallback((question: string, answer: string) => {
    setCards(prev => prev.map((c, i) =>
      i === currentIndex ? { ...c, oracleUsed: true, oracleQuestion: question, oracleAnswer: answer } : c
    ));
  }, [currentIndex]);

  // Advance to next card
  const advanceCard = useCallback(() => {
    // Mark current as completed
    setCards(prev => prev.map((c, i) => i === currentIndex ? { ...c, completed: true } : c));

    if (currentIndex < CARD_ORDER.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setFinished(true);
    }
  }, [currentIndex]);

  // Paywall: card is gated if index >= FREE_CARD_LIMIT and tier is 'session'
  const isGated = tier === 'session' && currentIndex >= FREE_CARD_LIMIT;

  return {
    soulMap,
    seed,
    cards,
    currentIndex,
    currentCard,
    finished,
    isGated,
    revealBody,
    setOracleResult,
    advanceCard,
    totalCards: CARD_ORDER.length,
  };
}
