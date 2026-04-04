import type { SoulMap } from '../types/soul-map';

// ═══════════════════════════════════════
// Bridges — cross-system resonance lines
// One sentence connecting each layer to the next.
// Computed from field combinations — feels personal because it is.
// ═══════════════════════════════════════

export type BridgeSystemId = 'astrology' | 'kabbalah' | 'shadow' | 'frequency' | 'numerology';

export interface BridgeHighlight {
  systemA: BridgeSystemId;
  fieldA: string;
  systemB: BridgeSystemId;
  fieldB: string;
  resonance: string;
  strength: number;       // 0-1, higher = stronger resonance
}

export interface Bridges {
  sephirahToArchetype: string;
  archetypeToFrequency: string;
  frequencyToNumerology: string;
  numerologyToAscendant: string;
  synthesis: string;
  highlights: BridgeHighlight[];
}

export function computeBridges(map: SoulMap): Bridges {
  const { sephirah, archetype, frequency, numerology, sunSign, element } = map;

  // ── Sephirah → Archetype ──
  // Connect the planetary energy to the psychological pattern
  const sephirahToArchetype = buildSephirahArchetypeBridge(
    sephirah.name, sephirah.planet, archetype.name
  );

  // ── Archetype → Frequency ──
  // Connect the shadow/desire to the resonance
  const archetypeToFrequency = buildArchetypeFrequencyBridge(
    archetype.name, archetype.coreDesire, frequency.hz, frequency.keywordPt
  );

  // ── Frequency → Numerology ──
  const frequencyToNumerology = buildFrequencyNumerologyBridge(
    frequency.hz, numerology.number, numerology.namePt
  );

  // ── Numerology → Ascendant/Psyche ──
  const numerologyToAscendant = buildNumerologyFinalBridge(
    numerology.number, sunSign, element
  );

  // ── Synthesis ──
  const synthesis = buildSynthesis(map);

  const highlights = computeHighlights(map);

  return { sephirahToArchetype, archetypeToFrequency, frequencyToNumerology, numerologyToAscendant, synthesis, highlights };
}

// ── Bridge builders ──

function buildSephirahArchetypeBridge(sephirah: string, planet: string, archetype: string): string {
  const archetypeMap: Record<string, string> = {
    Hero: 'a força do Herói não nasce do nada — nasce dessa mesma energia que exige ação antes do pensamento',
    Lover: 'esse campo de desejo e beleza alimenta o Amante que vive debaixo de tudo',
    Jester: 'a agilidade mercurial que governa esse campo é o mesmo fio condutor do Mensageiro',
    Caregiver: 'a qualidade lunar desse campo ressoa diretamente com a vocação protetora do Guardião',
    Ruler: 'a energia solar que estrutura esse campo é a mesma que sustenta a soberania do arquétipo',
    Sage: 'o discernimento mercurial desse campo é a fundação do olhar analítico do Sábio',
    Diplomat: 'a tensão entre beleza e justiça nesse campo ecoa na busca do Diplomata por harmonia real',
    Magician: 'a profundidade marciana desse campo alimenta a capacidade de transformação do Mago',
    Explorer: 'a expansão jupiteriana desse campo é o mesmo impulso que leva o Explorador além do horizonte',
    Elder: 'a estrutura saturnina desse campo é o alicerce sobre o qual o Ancião constrói',
    Rebel: 'a ruptura saturnina desse campo — lei reescrita — é o mesmo território onde o Visionário opera',
    Mystic: 'a compaixão jupiteriana que dissolve fronteiras nesse campo ressoa na porosidade do Místico',
  };

  const bridge = archetypeMap[archetype] ?? 'o campo planetário que estrutura esse nível encontra eco direto no arquétipo que opera por baixo';
  return `${planet} governa ${sephirah} — e ${bridge}.`;
}

function buildArchetypeFrequencyBridge(
  _archetype: string, coreDesire: string, hz: number, keyword: string
): string {
  const desireFragment = coreDesire.split('—')[0].trim().toLowerCase();

  const hzContext: Record<number, string> = {
    396: 'libera o que foi carregado sem escolha',
    417: 'desfaz padrões que cristalizaram',
    528: 'reconstrói o que foi danificado',
    639: 'restaura a capacidade de conexão',
    741: 'afia a percepção até o essencial',
    852: 'abre o canal para o que está além da razão',
    963: 'dissolve a separação entre o individual e o todo',
  };

  const hzLine = hzContext[hz] ?? 'ressoa com o que está em movimento interno';
  return `A busca por ${desireFragment} encontra uma frequência que ${hzLine} — ${hz} Hz, o campo de ${keyword}.`;
}

function buildFrequencyNumerologyBridge(hz: number, number: number, namePt: string): string {
  const combinations: Record<string, string> = {
    '528-1': 'a frequência que repara encontra o número que inaugura — dois gestos de começo, modos diferentes',
    '528-7': 'a cura e a introspecção operam no mesmo eixo — o 7 é o número que vai fundo, e 528 Hz é o som que acompanha essa descida',
    '741-7': 'discernimento em dobro — o 7 analisa por dentro, 741 Hz afina a percepção por fora',
    '396-9': 'o que precisa ser liberado e o que carrega a sabedoria de tudo — tensão produtiva entre soltar e integrar',
    '963-11': 'dois campos de abertura ao que é maior — o número mestre e a frequência do divino operam em direção semelhante',
  };

  const key = `${hz}-${number}`;
  const specific = combinations[key];
  if (specific) return specific + '.';

  return `${hz} Hz e o número ${number} — ${namePt} — não são coincidência nessa combinação. A frequência ressoa onde o número já opera.`;
}

function buildNumerologyFinalBridge(number: number, _sign: string, element: string): string {
  const elementPt: Record<string, string> = {
    fire: 'fogo', earth: 'terra', air: 'ar', water: 'água',
  };

  const el = elementPt[element] ?? element;

  const numeroBridges: Record<number, string> = {
    1: 'O Pioneiro e o elemento ' + el + ' — ambos movidos pela força de iniciar',
    2: 'O Mediador e o elemento ' + el + ' — a sensibilidade que conecta',
    3: 'O Artista e o elemento ' + el + ' — expressão como natureza',
    4: 'O Construtor e o elemento ' + el + ' — estrutura como vocação',
    5: 'O Aventureiro e o elemento ' + el + ' — movimento como estado natural',
    6: 'O Guardião e o elemento ' + el + ' — cuidado como fundação',
    7: 'O Místico e o elemento ' + el + ' — profundidade como orientação',
    8: 'O Realizador e o elemento ' + el + ' — manifestação como propósito',
    9: 'O Sábio e o elemento ' + el + ' — integração como destino',
    11: 'O Iluminado e o elemento ' + el + ' — canal aberto',
    22: 'O Grande Construtor e o elemento ' + el + ' — visão que se materializa',
    33: 'O Mestre dos Mestres e o elemento ' + el + ' — serviço como forma de ser',
  };

  return (numeroBridges[number] ?? `Número ${number} e elemento ${el}`) + '. O que vem a seguir é como esses campos se organizam na estrutura psíquica.';
}

// ── Highlight detection ──
// Finds the 2-3 strongest cross-system resonances for THIS person

function computeHighlights(map: SoulMap): BridgeHighlight[] {
  const { archetype, sephirah, frequency, numerology, psyche, element } = map;
  const highlights: BridgeHighlight[] = [];

  // 1. Shadow ↔ Numerology shadow — do they describe the same wound?
  const shadowWords = (archetype.shadow.inflated + ' ' + archetype.shadow.deflated).toLowerCase();
  const numShadow = numerology.shadow.toLowerCase();
  const sharedWoundPatterns: [string, string][] = [
    ['control', 'controle'], ['isol', 'distância'], ['rigidez', 'rígid'],
    ['perfeccion', 'obsess'], ['medo', 'fraqueza'], ['superficial', 'dispers'],
    ['possessiv', 'depend'], ['poder', 'dominâ'], ['martír', 'sacrifíc'],
  ];
  for (const [a, b] of sharedWoundPatterns) {
    if ((shadowWords.includes(a) || shadowWords.includes(b)) &&
        (numShadow.includes(a) || numShadow.includes(b))) {
      highlights.push({
        systemA: 'shadow',
        fieldA: 'shadow.inflated',
        systemB: 'numerology',
        fieldB: 'numerology.shadow',
        resonance: `a sombra do ${archetype.titlePt} e a sombra do número ${numerology.number} descrevem o mesmo padrão`,
        strength: 0.9,
      });
      break;
    }
  }

  // 2. Sephirah planet ↔ Archetype desire — planetary alignment
  const planetArchetypeLinks: Record<string, string[]> = {
    'Marte': ['Hero', 'Magician'],
    'Vênus': ['Lover', 'Diplomat'],
    'Mercúrio': ['Jester', 'Sage'],
    'Lua': ['Caregiver', 'Mystic'],
    'Sol': ['Ruler'],
    'Júpiter': ['Explorer', 'Mystic'],
    'Saturno': ['Elder', 'Rebel'],
  };
  const linked = planetArchetypeLinks[sephirah.planet];
  if (linked?.includes(archetype.name)) {
    highlights.push({
      systemA: 'kabbalah',
      fieldA: 'sephirah.planet',
      systemB: 'shadow',
      fieldB: 'archetype.name',
      resonance: `${sephirah.planet} governa tanto ${sephirah.name} quanto o território do ${archetype.titlePt} — reforço duplo`,
      strength: 0.85,
    });
  }

  // 3. Frequency ↔ Numerology — harmonic resonance
  const freqNumHarmonics: Record<string, string> = {
    '396-9': 'libertação (396 Hz) e completude (9) — ciclo que fecha para abrir',
    '528-6': 'reparação (528 Hz) e cuidado (6) — o que cura e o que protege',
    '639-2': 'conexão (639 Hz) e mediação (2) — dois campos de ponte',
    '741-7': 'discernimento (741 Hz) e busca (7) — precisão duplicada',
    '852-11': 'intuição (852 Hz) e iluminação (11) — canal aberto nos dois registros',
    '963-9': 'unidade (963 Hz) e sabedoria (9) — dissolução e integração',
    '417-5': 'mudança (417 Hz) e liberdade (5) — movimento como vocação',
    '528-3': 'reparação (528 Hz) e criatividade (3) — reconstruir pelo ato criativo',
    '396-1': 'libertação (396 Hz) e início (1) — soltar para começar',
  };
  const fnKey = `${frequency.hz}-${numerology.number}`;
  if (freqNumHarmonics[fnKey]) {
    highlights.push({
      systemA: 'frequency',
      fieldA: 'frequency.hz',
      systemB: 'numerology',
      fieldB: 'numerology.number',
      resonance: freqNumHarmonics[fnKey],
      strength: 0.8,
    });
  }

  // 4. Psyche distribution ↔ Archetype — structural echo
  if (psyche.id >= 40 && ['Hero', 'Rebel', 'Explorer'].includes(archetype.name)) {
    highlights.push({
      systemA: 'shadow',
      fieldA: 'psyche.id',
      systemB: 'shadow',
      fieldB: 'archetype.coreDesire',
      resonance: `id dominante (${psyche.id}%) encontra um arquétipo que opera pelo impulso — a pulsão e o padrão se alimentam`,
      strength: 0.75,
    });
  } else if (psyche.superego >= 40 && ['Elder', 'Sage', 'Caregiver'].includes(archetype.name)) {
    highlights.push({
      systemA: 'shadow',
      fieldA: 'psyche.superego',
      systemB: 'shadow',
      fieldB: 'archetype.coreDesire',
      resonance: `superego forte (${psyche.superego}%) com um arquétipo de responsabilidade — estrutura que sustenta mas pode rigidificar`,
      strength: 0.75,
    });
  }

  // 5. Element ↔ Sephirah polarity — elemental alignment
  const elementSephirahResonance: Record<string, string[]> = {
    fire: ['Geburah', 'Netzach'],
    water: ['Chesed', 'Yesod'],
    air: ['Hod', 'Tiphareth'],
    earth: ['Malkuth', 'Binah'],
  };
  if (elementSephirahResonance[element]?.includes(sephirah.name)) {
    highlights.push({
      systemA: 'astrology',
      fieldA: 'element',
      systemB: 'kabbalah',
      fieldB: 'sephirah.name',
      resonance: `elemento ${element} ressoa naturalmente com ${sephirah.name} — o campo elemental e a posição na Árvore se reforçam`,
      strength: 0.7,
    });
  }

  // Sort by strength, keep top 3
  highlights.sort((a, b) => b.strength - a.strength);
  return highlights.slice(0, 3);
}

function buildSynthesis(map: SoulMap): string {
  const { sephirah, archetype, frequency, numerology, sunSign } = map;

  // A synthesis line that brings the whole map together
  const signPt: Record<string, string> = {
    Aries: 'Áries', Taurus: 'Touro', Gemini: 'Gêmeos', Cancer: 'Câncer',
    Leo: 'Leão', Virgo: 'Virgem', Libra: 'Libra', Scorpio: 'Escorpião',
    Sagittarius: 'Sagitário', Capricorn: 'Capricórnio', Aquarius: 'Aquário', Pisces: 'Peixes',
  };

  return `${signPt[sunSign]} · ${sephirah.name} · ${archetype.titlePt} · ${frequency.hz} Hz · ${numerology.number} — esta combinação específica não se repete. O que essa cartografia revela não é destino. É o padrão que já opera, com ou sem nome.`;
}
