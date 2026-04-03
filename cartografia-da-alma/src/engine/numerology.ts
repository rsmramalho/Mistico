import type { NumerologyResult } from '../types/soul-map';

// ═══════════════════════════════════════
// Numerology — Pythagorean System
// Expression Number (from full name)
// ═══════════════════════════════════════

const LETTER_VALUES: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

// Remove accents: É→E, Ç→C, etc.
function normalizeChar(char: string): string {
  return char.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
}

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

function calculateNameValue(name: string): number {
  let sum = 0;
  for (const char of name) {
    const normalized = normalizeChar(char);
    const value = LETTER_VALUES[normalized];
    if (value) sum += value;
  }
  return reduceToSingleOrMaster(sum);
}

export function getExpressionNumber(fullName: string): number {
  const names = fullName.trim().split(/\s+/);
  const reducedNames = names.map(calculateNameValue);
  const total = reducedNames.reduce((a, b) => a + b, 0);
  return reduceToSingleOrMaster(total);
}

// ── Number Meanings ──

interface NumberMeaning {
  name: string;
  namePt: string;
  description: string;
  traits: string;
  shadow: string;
  isMasterNumber: boolean;
}

const MEANINGS: Record<number, NumberMeaning> = {
  1: {
    name: 'The Pioneer',
    namePt: 'O Pioneiro',
    description: 'Energia de novos começos, independência e originalidade. O indivíduo que forja seu próprio caminho e lidera pelo exemplo. A centelha da criação e a vontade de começar.',
    traits: 'Liderança, ambição, independência, determinação, coragem, autossuficiência',
    shadow: 'Teimosia, egoísmo, agressividade, isolamento',
    isMasterNumber: false,
  },
  2: {
    name: 'The Diplomat',
    namePt: 'O Mediador',
    description: 'Energia de parceria, sensibilidade e equilíbrio. Busca harmonia e conexão, excele em cooperação e compreensão do outro. O poder da receptividade e intuição.',
    traits: 'Diplomacia, cooperação, sensibilidade, paciência, empatia',
    shadow: 'Hipersensibilidade, indecisão, dependência, passividade',
    isMasterNumber: false,
  },
  3: {
    name: 'The Creative',
    namePt: 'O Artista',
    description: 'Energia de expressão, criatividade e alegria. O comunicador e artista que dá vida a ideias através de palavras, arte ou performance. Irradia otimismo e magnetismo social.',
    traits: 'Criatividade, autoexpressão, comunicação, entusiasmo, charme',
    shadow: 'Energia dispersa, superficialidade, exagero, instabilidade emocional',
    isMasterNumber: false,
  },
  4: {
    name: 'The Builder',
    namePt: 'O Construtor',
    description: 'Energia de estrutura, disciplina e trabalho duro. Constrói fundações duradouras pelo esforço metódico e confiabilidade. Ordem, dedicação e o plano material.',
    traits: 'Estabilidade, disciplina, praticidade, organização, lealdade, perseverança',
    shadow: 'Rigidez, teimosia, mentalidade estreita, workaholic',
    isMasterNumber: false,
  },
  5: {
    name: 'The Free Spirit',
    namePt: 'O Aventureiro',
    description: 'Energia de liberdade, mudança e aventura. Anseia por variedade e novas experiências, prospera em movimento e adaptabilidade. O número dos cinco sentidos e da exploração mundana.',
    traits: 'Liberdade, versatilidade, curiosidade, adaptabilidade, dinamismo',
    shadow: 'Inquietude, impulsividade, irresponsabilidade, excesso',
    isMasterNumber: false,
  },
  6: {
    name: 'The Nurturer',
    namePt: 'O Guardião',
    description: 'Energia de amor, responsabilidade e cura. O cuidador que encontra propósito servindo família e comunidade. Harmonia doméstica, beleza e compaixão incondicional.',
    traits: 'Responsabilidade, amor, compaixão, proteção, harmonia, serviço, cura',
    shadow: 'Superproteção, autossacrifício, comportamento controlador, martírio',
    isMasterNumber: false,
  },
  7: {
    name: 'The Seeker',
    namePt: 'O Místico',
    description: 'Energia de introspecção, sabedoria e profundidade espiritual. Atraído pelo mundo interior, buscando verdade além da superfície. O filósofo e o místico que valoriza solidão e contempla��ão.',
    traits: 'Sabedoria, introspecção, análise, espiritualidade, intuição, discernimento',
    shadow: 'Isolamento, cinismo, secretismo, distanciamento emocional',
    isMasterNumber: false,
  },
  8: {
    name: 'The Powerhouse',
    namePt: 'O Realizador',
    description: 'Energia de abundância, autoridade e maestria material. Entende o fluxo de poder e recursos, buscando conquistas no mundo tangível. Equilíbrio cármico — o que se dá, se recebe.',
    traits: 'Ambição, autoridade, abundância, força, eficiência, manifestação',
    shadow: 'Materialismo, dominância, workaholic, frieza',
    isMasterNumber: false,
  },
  9: {
    name: 'The Humanitarian',
    namePt: 'O Sábio',
    description: 'Energia de completude, compaixão e amor universal. Carrega a sabedoria de todos os números anteriores e busca servir a humanidade. Altruísmo, finais que levam a novos começos, maturidade espiritual.',
    traits: 'Compaixão, sabedoria, generosidade, idealismo, humanitarismo',
    shadow: 'Altivez, martírio, ressentimento, volatilidade emocional',
    isMasterNumber: false,
  },
  11: {
    name: 'The Illuminator',
    namePt: 'O Iluminado',
    description: 'Oitava superior de 2. Intuição profunda, insight espiritual e capacidade de inspirar outros. Canal entre consciente e inconsciente, frequentemente associado a habilidades visionárias e sensibilidade elevada.',
    traits: 'Intuição, insight espiritual, inspiração, pensamento visionário, carisma',
    shadow: 'Ansiedade, energia nervosa, autodúvida, impraticabilidade, sensibilidade avassaladora',
    isMasterNumber: true,
  },
  22: {
    name: 'The Master Builder',
    namePt: 'O Grande Construtor',
    description: 'Oitava superior de 4. Combina a visão espiritual de 11 com a disciplina prática de 4, criando potencial para manifestar coisas extraordinárias no mundo material. O número mais poderoso em termos de conquista tangível.',
    traits: 'Visão, maestria, conquista em larga escala, disciplina, idealismo prático, legado',
    shadow: 'Sobrecarga pelo potencial, pressão autoimposta, controle, incapacidade de começar',
    isMasterNumber: true,
  },
  33: {
    name: 'The Master Teacher',
    namePt: 'O Mestre dos Mestres',
    description: 'Oitava superior de 6. O número mestre mais raro. Serviço desinteressado, elevação espiritual e o professor que lidera pelo exemplo compassivo. Combina a iluminação de 11 e o poder construtor de 22 em puro serviço devotado.',
    traits: 'Compaixão, ensino espiritual, serviço desinteressado, cura, devoção, amor incondicional',
    shadow: 'Sobrecarga de responsabilidade, autonegligência, dificuldade de estabelecer limites',
    isMasterNumber: true,
  },
};

export function getNumberMeaning(n: number): NumerologyResult {
  const meaning = MEANINGS[n];
  if (!meaning) {
    // Fallback (should not happen with proper reduction)
    return getNumberMeaning(reduceToSingleOrMaster(n));
  }
  return {
    number: n,
    name: meaning.name,
    namePt: meaning.namePt,
    description: meaning.description,
    traits: meaning.traits,
    shadow: meaning.shadow,
    isMasterNumber: meaning.isMasterNumber,
  };
}

export function getNumerology(fullName: string): NumerologyResult {
  const number = getExpressionNumber(fullName);
  return getNumberMeaning(number);
}
