import type {
  Element,
  ElementDynamic,
  Archetype,
  ArchetypeMirror,
  Sephirah,
  TikkunPath,
  FrequencyHarmony,
  PsycheDistribution,
  NumerologyResult,
  SoulMap,
  SoulMateReading,
} from '../types/soul-map';
import { getNumberMeaning } from './numerology';

// ═══════════════════════════════════════
// Soul Mate Engine
// Two SoulMaps → SoulMateReading
// ═══════════════════════════════════════

// ── Element Dynamic ──

type ElementPairKey = string;

const ELEMENT_DYNAMICS: Record<ElementPairKey, Omit<ElementDynamic, 'namePt'>> = {
  // Same elements
  'fire+fire': {
    name: 'Chama Dupla',
    nature: 'Amplificação',
    description: 'Intensidade máxima. Duas forças de ignição que se alimentam mutuamente — inspiração explosiva, mas risco de consumir o que tentam criar.',
  },
  'earth+earth': {
    name: 'Rocha Viva',
    nature: 'Sustentação',
    description: 'Estabilidade profunda. Dois alicerces que se reforçam — construção sólida, mas risco de estagnação quando nenhum dos dois inicia movimento.',
  },
  'air+air': {
    name: 'Vento Cruzado',
    nature: 'Movimento',
    description: 'Comunicação fluida. Duas mentes que se estimulam — ideias infinitas, mas risco de nunca pousar em terra firme.',
  },
  'water+water': {
    name: 'Maré Dupla',
    nature: 'Fusão',
    description: 'Empatia total. Duas profundidades que se reconhecem — compreensão sem palavras, mas risco de dissolução de fronteiras.',
  },
  // Cross elements
  'air+fire': {
    name: 'Fole e Chama',
    nature: 'Catálise ativa',
    description: 'Ar alimenta fogo. Expansão mútua — ideias ganham força, ação ganha direção. A centelha encontra o oxigênio.',
  },
  'earth+water': {
    name: 'Jardim',
    nature: 'Catálise receptiva',
    description: 'Água faz terra fértil. Crescimento orgânico — emoção encontra estrutura, sensibilidade encontra raiz.',
  },
  'earth+fire': {
    name: 'Forja',
    nature: 'Tensão criativa',
    description: 'Fogo transforma terra. Processo lento e poderoso — impulso encontra paciência, visão encontra matéria.',
  },
  'fire+water': {
    name: 'Caldeirão',
    nature: 'Tensão transformadora',
    description: 'Intensidade explosiva. Transformação radical — paixão encontra profundidade, mas o vapor pode escaldar.',
  },
  'air+earth': {
    name: 'Escultura',
    nature: 'Tensão criativa',
    description: 'Ar esculpe terra. Mudança gradual inevitável — intelecto molda substância, razão areja tradição.',
  },
  'air+water': {
    name: 'Tempestade',
    nature: 'Tensão transformadora',
    description: 'Intelecto encontra emoção. Turbulência fértil — a mente quer entender o que o coração simplesmente sabe.',
  },
};

function normalizeElementPair(a: Element, b: Element): ElementPairKey {
  const sorted = [a, b].sort() as [Element, Element];
  return `${sorted[0]}+${sorted[1]}`;
}

export function getElementDynamic(elementA: Element, elementB: Element): ElementDynamic {
  const key = normalizeElementPair(elementA, elementB);
  const entry = ELEMENT_DYNAMICS[key];
  return { ...entry, namePt: entry.name };
}

// ── Archetype Mirror ──

export function getArchetypeMirror(archetypeA: Archetype, archetypeB: Archetype): ArchetypeMirror {
  const projectionAtoB =
    `${archetypeA.titlePt} tende a projetar em ${archetypeB.titlePt} aquilo que não integrou: ${archetypeA.shadow.inflated}. ` +
    `O que vê no outro como ${archetypeB.coreDesire} é, em parte, reflexo do próprio excesso.`;

  const projectionBtoA =
    `${archetypeB.titlePt} tende a projetar em ${archetypeA.titlePt} aquilo que não integrou: ${archetypeB.shadow.inflated}. ` +
    `O que vê no outro como ${archetypeA.coreDesire} é, em parte, reflexo do próprio excesso.`;

  const integration =
    `O encontro entre ${archetypeA.titlePt} e ${archetypeB.titlePt} convida ambos a integrar suas sombras. ` +
    `${archetypeA.titlePt} precisa reconhecer ${archetypeA.shadow.deflated} em si. ` +
    `${archetypeB.titlePt} precisa reconhecer ${archetypeB.shadow.deflated} em si. ` +
    `O outro é espelho, não solução.`;

  return { projectionAtoB, projectionBtoA, integration };
}

// ── Tikkun Path ──

export function getTikkun(sephirahA: Sephirah, sephirahB: Sephirah): TikkunPath {
  const distance = Math.abs(sephirahA.number - sephirahB.number);

  let meaning: string;
  if (distance === 0) {
    meaning =
      'Ressonância — mesma Sephirah, mesmo trabalho interior. O encontro amplifica o que já existe. ' +
      'O risco é a redundância: dois espelhos frente a frente refletem infinito, mas não se movem.';
  } else if (distance === 1) {
    meaning =
      'Vizinhança — Sephiroth adjacentes. Complemento natural com pouca fricção. ' +
      'O trabalho é sutil: reconhecer que o próximo não é o mesmo.';
  } else if (distance === 2) {
    meaning =
      'Ponte — o encontro requer esforço consciente para atravessar a distância. ' +
      'O resultado é rico: cada um traz o que o outro não alcança sozinho.';
  } else {
    meaning =
      'Peregrinação — o encontro percorre grande parte da Árvore da Vida. ' +
      'Tikkun profundo: o trabalho que este encontro exige é proporcional à distância que conecta.';
  }

  return {
    distance,
    sephirahA: sephirahA.name,
    sephirahB: sephirahB.name,
    meaning,
  };
}

// ── Frequency Harmony ──

export function getFrequencyHarmony(hzA: number, hzB: number): FrequencyHarmony {
  const maxHz = Math.max(hzA, hzB);
  const minHz = Math.min(hzA, hzB);
  const ratio = minHz === 0 ? Infinity : maxHz / minHz;

  let interval: string;
  let description: string;

  if (ratio === 1) {
    interval = 'Uníssono';
    description = 'Mesma frequência. Ressonância pura — vibração idêntica, amplificação mútua.';
  } else if (ratio >= 1.9 && ratio <= 2.1) {
    interval = 'Oitava';
    description = 'Complemento harmônico perfeito — a mesma nota em alturas diferentes.';
  } else if (ratio >= 1.4 && ratio <= 1.6) {
    interval = 'Quinta';
    description = 'Harmonia forte — o intervalo mais estável depois do uníssono. Consonância natural.';
  } else if (ratio > 1.25 && ratio < 1.4) {
    interval = 'Quarta';
    description = 'Harmonia aberta — estabilidade com espaço para movimento.';
  } else if (ratio >= 1.15 && ratio <= 1.25) {
    interval = 'Terça';
    description = 'Harmonia suave — doçura na diferença, complemento gentil.';
  } else {
    interval = 'Intervalo livre';
    description = 'Tensão harmônica — as frequências não se encaixam em consonância simples. A resolução exige escuta.';
  }

  return { hzA, hzB, interval, description };
}

// ── Combined Psyche ──

export function getCombinedPsyche(psycheA: PsycheDistribution, psycheB: PsycheDistribution): PsycheDistribution {
  const id = Math.round((psycheA.id + psycheB.id) / 2);
  const ego = Math.round((psycheA.ego + psycheB.ego) / 2);
  const superego = 100 - id - ego;

  let signature: string;
  if (id >= ego && id >= superego) {
    signature = 'O encontro pulsa pelo instinto — desejo e impulso dominam o espaço entre vocês.';
  } else if (ego >= id && ego >= superego) {
    signature = 'O encontro opera pela razão — mediação e estratégia organizam o espaço entre vocês.';
  } else {
    signature = 'O encontro é guiado pelo dever — estrutura e princípio definem o espaço entre vocês.';
  }

  return { id, ego, superego, signature };
}

// ── Meeting Number ──

function reduceToSingleOrMaster(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    let sum = 0;
    while (n > 0) {
      sum += n % 10;
      n = Math.floor(n / 10);
    }
    n = sum;
  }
  return n;
}

export function getMeetingNumber(numA: NumerologyResult, numB: NumerologyResult): NumerologyResult {
  const sum = numA.number + numB.number;
  const reduced = reduceToSingleOrMaster(sum);
  return getNumberMeaning(reduced);
}

// ── Soul Mate Reading (main aggregator) ──

export function getSoulMateReading(readingA: SoulMap, readingB: SoulMap): SoulMateReading {
  const elementDynamic = getElementDynamic(readingA.element, readingB.element);
  const mirror = getArchetypeMirror(readingA.archetype, readingB.archetype);
  const tikkun = getTikkun(readingA.sephirah, readingB.sephirah);
  const frequencyHarmony = getFrequencyHarmony(readingA.frequency.hz, readingB.frequency.hz);
  const combinedPsyche = getCombinedPsyche(readingA.psyche, readingB.psyche);
  const meetingNumber = getMeetingNumber(readingA.numerology, readingB.numerology);

  return {
    readingA,
    readingB,
    elementDynamic,
    mirror,
    tikkun,
    frequencyHarmony,
    combinedPsyche,
    meetingNumber,
  };
}
