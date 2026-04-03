import type {
  Element, Sign, SoulMap,
  HandShape, MountName, LineName, PalmData,
} from '../types/soul-map';
import { getElement, getModality } from './astrology';
import { getSephirah } from './kabbalah';
import { getArchetype } from './jung';
import { getFrequency } from './solfeggio';
import { getNumerology } from './numerology';
import { getPsycheDistribution } from './freud';

// ═══════════════════════════════════════
// Palm Reading Engine
// PalmData → SoulMap
// Chain: HandShape → Element, Mount + Element → Sign
// ═══════════════════════════════════════

// ── Hand Element ──

export function getHandElement(handShape: HandShape): Element {
  return handShape; // direct mapping: HandShape values are Element values
}

// ── Mount → Sign (triplicity resolution) ──

interface MountSignPair {
  active: Sign;      // diurnal — fire, air
  receptive: Sign;   // nocturnal — earth, water
}

const MOUNT_SIGNS: Record<MountName, MountSignPair | { sole: Sign }> = {
  jupiter: { active: 'Sagittarius', receptive: 'Pisces' },
  saturn:  { active: 'Aquarius',    receptive: 'Capricorn' },
  mercury: { active: 'Gemini',      receptive: 'Virgo' },
  venus:   { active: 'Libra',       receptive: 'Taurus' },
  mars:    { active: 'Aries',       receptive: 'Scorpio' },
  apollo:  { sole: 'Leo' },
  moon:    { sole: 'Cancer' },
};

function isActiveElement(element: Element): boolean {
  return element === 'fire' || element === 'air';
}

export function getSignFromMount(mount: MountName, handElement: Element): Sign {
  const entry = MOUNT_SIGNS[mount];

  if ('sole' in entry) {
    return entry.sole;
  }

  return isActiveElement(handElement) ? entry.active : entry.receptive;
}

// ── Palm Expression ──

export function getPalmExpression(dominantLine: LineName): 'diurnal' | 'nocturnal' {
  return (dominantLine === 'fate' || dominantLine === 'head')
    ? 'diurnal'
    : 'nocturnal';
}

// ═══════════════════════════════════════
// getPalmSoulMap — Palm aggregator
// PalmData → SoulMap
// ═══════════════════════════════════════

export function getPalmSoulMap(palmData: PalmData): SoulMap {
  // 1. Hand element
  const handElement = getHandElement(palmData.handShape);

  // 2. Sign from mount + hand element
  const sign = getSignFromMount(palmData.dominantMount, handElement);

  // 3. Sign-derived element & modality (may differ from handElement)
  const element = getElement(sign);
  const modality = getModality(sign);

  // 4. Reuse existing engine modules
  const sephirah = getSephirah(sign);
  const archetype = getArchetype(sign);
  const psyche = getPsycheDistribution(element);
  const frequency = getFrequency(sign);
  const numerology = getNumerology(palmData.name);

  // 5. Palm expression & sole-expression override
  const palmExpression = getPalmExpression(palmData.dominantLine);
  const isSole = sephirah.expression === 'sole';

  // 6. Synthetic BirthData (name only; date is required by the type)
  const birthData = {
    name: palmData.name,
    date: new Date(),
  };

  return {
    birthData,
    source: 'palm',
    palmData,
    dominantLine: palmData.dominantLine,
    ...(isSole && {
      sephirahExpressionCanonic: 'sole' as const,
      sephirahExpressionPalmDerived: palmExpression,
    }),
    sunSign: sign,
    element,
    modality,
    ascendant: null,
    sephirah,
    archetype,
    psyche,
    frequency,
    numerology,
  };
}
