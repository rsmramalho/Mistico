import type { BirthData, SoulMap } from '../types/soul-map';
import { getSunSign, getElement, getModality, getApproximateAscendant } from './astrology';
import { getSephirah } from './kabbalah';
import { getArchetype } from './jung';
import { getFrequency } from './solfeggio';
import { getNumerology } from './numerology';
import { getPsycheDistribution } from './freud';

// ═══════════════════════════════════════
// getSoulMap — Core aggregator
// BirthData → SoulMap
// ═══════���═══════════════════════════════

export function getSoulMap(birthData: BirthData): SoulMap {
  const month = birthData.date.getMonth() + 1;
  const day = birthData.date.getDate();

  const sunSign = getSunSign(month, day);
  const element = getElement(sunSign);
  const modality = getModality(sunSign);
  const ascendant = getApproximateAscendant(sunSign, birthData.time);

  const sephirah = getSephirah(sunSign);
  const archetype = getArchetype(sunSign);
  const frequency = getFrequency(sunSign);
  const numerology = getNumerology(birthData.name);
  const psyche = getPsycheDistribution(element);

  return {
    birthData,
    source: 'birth' as const,
    sunSign,
    element,
    modality,
    ascendant,
    sephirah,
    archetype,
    psyche,
    frequency,
    numerology,
  };
}

// Re-exports for convenience
export { getSunSign, getElement, getModality, getApproximateAscendant } from './astrology';
export { getSephirah } from './kabbalah';
export { getArchetype } from './jung';
export { getFrequency } from './solfeggio';
export { getNumerology, getExpressionNumber } from './numerology';
export { getPsycheDistribution } from './freud';
export { getHandElement, getSignFromMount, getPalmExpression, getPalmSoulMap } from './palm';
export { getSoulMateReading } from './soul-mate';
export { buildSystemPrompt, askOracle } from './oracle';
export { CARTA_VARIATIONS, getVariation } from './variations';
