import type { Sign, Element, Modality, SignData, AscendantResult } from '../types/soul-map';

// ═══════════════════════════════════════
// Zodiac Data — Tropical, Fixed Dates
// ═���══════════════��══════════════════════

export const SIGN_ORDER: Sign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

export const SIGNS: SignData[] = [
  { sign: 'Aries',       element: 'fire',  modality: 'cardinal', ruler: 'Mars',    startMonth: 3,  startDay: 21, endMonth: 4,  endDay: 19 },
  { sign: 'Taurus',      element: 'earth', modality: 'fixed',    ruler: 'Venus',   startMonth: 4,  startDay: 20, endMonth: 5,  endDay: 20 },
  { sign: 'Gemini',      element: 'air',   modality: 'mutable',  ruler: 'Mercury', startMonth: 5,  startDay: 21, endMonth: 6,  endDay: 20 },
  { sign: 'Cancer',      element: 'water', modality: 'cardinal', ruler: 'Moon',    startMonth: 6,  startDay: 21, endMonth: 7,  endDay: 22 },
  { sign: 'Leo',         element: 'fire',  modality: 'fixed',    ruler: 'Sun',     startMonth: 7,  startDay: 23, endMonth: 8,  endDay: 22 },
  { sign: 'Virgo',       element: 'earth', modality: 'mutable',  ruler: 'Mercury', startMonth: 8,  startDay: 23, endMonth: 9,  endDay: 22 },
  { sign: 'Libra',       element: 'air',   modality: 'cardinal', ruler: 'Venus',   startMonth: 9,  startDay: 23, endMonth: 10, endDay: 22 },
  { sign: 'Scorpio',     element: 'water', modality: 'fixed',    ruler: 'Mars',    startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
  { sign: 'Sagittarius', element: 'fire',  modality: 'mutable',  ruler: 'Jupiter', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
  { sign: 'Capricorn',   element: 'earth', modality: 'cardinal', ruler: 'Saturn',  startMonth: 12, startDay: 22, endMonth: 1,  endDay: 19 },
  { sign: 'Aquarius',    element: 'air',   modality: 'fixed',    ruler: 'Saturn',  startMonth: 1,  startDay: 20, endMonth: 2,  endDay: 18 },
  { sign: 'Pisces',      element: 'water', modality: 'mutable',  ruler: 'Jupiter', startMonth: 2,  startDay: 19, endMonth: 3,  endDay: 20 },
];

// ── Sun Sign ──

export function getSunSign(month: number, day: number): Sign {
  for (const s of SIGNS) {
    if (s.startMonth <= s.endMonth) {
      // Normal range (e.g., Aries: Mar 21 – Apr 19)
      if (
        (month === s.startMonth && day >= s.startDay) ||
        (month === s.endMonth && day <= s.endDay) ||
        (month > s.startMonth && month < s.endMonth)
      ) {
        return s.sign;
      }
    } else {
      // Wrapping range (Capricorn: Dec 22 – Jan 19)
      if (
        (month === s.startMonth && day >= s.startDay) ||
        (month === s.endMonth && day <= s.endDay) ||
        (month > s.startMonth || month < s.endMonth)
      ) {
        return s.sign;
      }
    }
  }
  return 'Capricorn'; // fallback: early January
}

// ── Sign Data ──

export function getSignData(sign: Sign): SignData {
  return SIGNS.find(s => s.sign === sign)!;
}

export function getElement(sign: Sign): Element {
  return getSignData(sign).element;
}

export function getModality(sign: Sign): Modality {
  return getSignData(sign).modality;
}

export function getRuler(sign: Sign): string {
  return getSignData(sign).ruler;
}

// ── Approximate Ascendant ──

export function getApproximateAscendant(
  sunSign: Sign,
  time?: string
): AscendantResult | null {
  if (!time) return null;

  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (isNaN(hour) || isNaN(minute)) return null;

  const sunSignIndex = SIGN_ORDER.indexOf(sunSign);
  const birthTimeDecimal = hour + minute / 60;

  // Assume sunrise at ~06:00 local
  const hoursSinceSunrise = birthTimeDecimal - 6;

  // Each sign rises for ~2 hours
  let signOffset = Math.floor(hoursSinceSunrise / 2);
  signOffset = ((signOffset % 12) + 12) % 12;

  const ascendantIndex = (sunSignIndex + signOffset) % 12;

  return {
    sign: SIGN_ORDER[ascendantIndex],
    method: 'approximate',
  };
}
