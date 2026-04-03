// ═══════════════════════════════════════
// Cartografia da Alma — Core Types
// ═════════════════���═════════════════════

export type Sign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer'
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type Element = 'fire' | 'earth' | 'air' | 'water';

export type Modality = 'cardinal' | 'fixed' | 'mutable';

export type SephirahName =
  | 'Kether' | 'Chokmah' | 'Binah' | 'Chesed'
  | 'Geburah' | 'Tiphareth' | 'Netzach' | 'Hod'
  | 'Yesod' | 'Malkuth' | 'Daath';

export type ArchetypeName =
  | 'Hero' | 'Lover' | 'Jester' | 'Caregiver'
  | 'Ruler' | 'Sage' | 'Diplomat' | 'Magician'
  | 'Explorer' | 'Elder' | 'Rebel' | 'Mystic';

export type PlanetaryExpression = 'diurnal' | 'nocturnal' | 'sole';

// ── Input ──

export interface BirthData {
  name: string;
  date: Date;
  time?: string;           // "HH:MM"
  city?: string;
  lat?: number;
  lng?: number;
  timezoneOffset?: number;
}

// ── Sephirah ──

export interface Sephirah {
  name: SephirahName;
  number: number;
  planet: string;
  expression: PlanetaryExpression;
  meaning: string;
  description: string;
}

// ── Archetype ──

export interface Archetype {
  name: ArchetypeName;
  title: string;
  titlePt: string;
  coreDesire: string;
  coreFear: string;
  description: string;
  shadow: {
    inflated: string;
    deflated: string;
  };
}

// ── Psyche ──

export interface PsycheDistribution {
  id: number;
  ego: number;
  superego: number;
  signature: string;
}

// ── Frequency ──

export interface FrequencyResult {
  hz: number;
  keyword: string;
  keywordPt: string;
  description: string;
}

// ── Numerology ──

export interface NumerologyResult {
  number: number;
  name: string;
  namePt: string;
  description: string;
  traits: string;
  shadow: string;
  isMasterNumber: boolean;
}

// ── Ascendant ──

export interface AscendantResult {
  sign: Sign;
  method: 'approximate' | 'ephemeris';
}

// ── Soul Map (output completo) ──

export interface SoulMap {
  // Input
  birthData: BirthData;

  // Astrologia
  sunSign: Sign;
  element: Element;
  modality: Modality;
  ascendant: AscendantResult | null;

  // Kabbalah
  sephirah: Sephirah;

  // Jung
  archetype: Archetype;

  // Freud
  psyche: PsycheDistribution;

  // Solfeggio
  frequency: FrequencyResult;

  // Numerologia
  numerology: NumerologyResult;
}

// ── Sign metadata ──

export interface SignData {
  sign: Sign;
  element: Element;
  modality: Modality;
  ruler: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
}
