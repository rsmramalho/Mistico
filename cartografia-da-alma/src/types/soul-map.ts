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

// ── Palm types ──

export type HandShape = 'fire' | 'earth' | 'air' | 'water';
export type MountName = 'jupiter' | 'saturn' | 'apollo' | 'mercury' | 'venus' | 'mars' | 'moon';
export type LineName = 'heart' | 'head' | 'life' | 'fate';
export type ReadingSource = 'birth' | 'palm';

export interface PalmData {
  handShape: HandShape;
  dominantMount: MountName;
  dominantLine: LineName;
  name: string;
}

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

  // Source
  source: ReadingSource;

  // Palm-specific (only when source === 'palm')
  palmData?: PalmData;
  dominantLine?: LineName;
  sephirahExpressionCanonic?: PlanetaryExpression;
  sephirahExpressionPalmDerived?: 'diurnal' | 'nocturnal';

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

// ── Soul Mate ──

export interface ElementDynamic {
  name: string;        // "Caldeirão", "Forja", etc.
  namePt: string;      // Same in this case (already PT)
  nature: string;      // "Tensão transformadora", etc.
  description: string;
}

export interface ArchetypeMirror {
  projectionAtoB: string;
  projectionBtoA: string;
  integration: string;
}

export interface TikkunPath {
  distance: number;
  sephirahA: SephirahName;
  sephirahB: SephirahName;
  meaning: string;
}

export interface FrequencyHarmony {
  hzA: number;
  hzB: number;
  interval: string;
  description: string;
}

export interface SoulMateReading {
  readingA: SoulMap;
  readingB: SoulMap;
  elementDynamic: ElementDynamic;
  mirror: ArchetypeMirror;
  tikkun: TikkunPath;
  frequencyHarmony: FrequencyHarmony;
  combinedPsyche: PsycheDistribution;
  meetingNumber: NumerologyResult;
}

// ── Oracle ──

export interface OracleMessage {
  role: 'user' | 'oracle';
  content: string;
}

export interface OracleSession {
  soulMap: SoulMap;
  messages: OracleMessage[];
  questionsUsed: number;
  closed: boolean;
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
