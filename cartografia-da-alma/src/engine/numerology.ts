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
    description: 'Você foi feito para começar. Não continuar o que outros iniciaram — começar de verdade, do zero, antes de existir um caminho. O número 1 não é liderança por posição: é liderança por constituição. Você precisa de autonomia não por arrogância, mas porque a dependência bloqueia algo essencial no seu processo.',
    traits: 'Iniciativa, originalidade, independência, determinação, coragem de começar sozinho',
    shadow: 'Teimosia que rejeita ajuda. Egoísmo que confunde autonomia com isolamento. Agressividade quando o caminho é bloqueado.',
    isMasterNumber: false,
  },
  2: {
    name: 'The Diplomat',
    namePt: 'O Mediador',
    description: 'Você sente o desequilíbrio antes de ver. A sensibilidade do 2 não é fraqueza — é um instrumento de precisão. Você foi feito para a parceria, para o espaço entre pessoas, para o ato de traduzir o que um lado não consegue ouvir do outro. O poder do 2 é quase invisível — e essa invisibilidade é ao mesmo tempo o dom e o custo.',
    traits: 'Diplomacia, empatia, cooperação, paciência, intuição nas relações',
    shadow: 'Hipersensibilidade que paralisa. Dependência emocional. Indecisão quando não há outro para validar.',
    isMasterNumber: false,
  },
  3: {
    name: 'The Creative',
    namePt: 'O Artista',
    description: 'Expressão não é escolha para você — é necessidade. O 3 carrega a força criativa que precisa de saída: palavra, arte, movimento, conversa. Quando esse canal está aberto, você magnetiza. Quando está bloqueado, a energia vira ansiedade ou dispersão. O trabalho do 3 não é disciplinar a criatividade — é encontrar o recipiente certo para ela.',
    traits: 'Criatividade, comunicação, magnetismo social, entusiasmo, capacidade de inspirar',
    shadow: 'Dispersão que impede conclusão. Superficialidade como defesa. Exagero emocional quando a expressão está bloqueada.',
    isMasterNumber: false,
  },
  4: {
    name: 'The Builder',
    namePt: 'O Construtor',
    description: 'Você pensa em estrutura. Não como limitação — como linguagem. O 4 vê o que precisa ser construído e tem a paciência para fazê-lo camada por camada. Confiabilidade não é característica de personalidade aqui: é vocação. As pessoas sabem que podem contar com você porque você também sabe disso, e leva a sério.',
    traits: 'Disciplina, confiabilidade, capacidade construtiva, organização, perseverança',
    shadow: 'Rigidez que rejeita o imprevisto. Obsessão com o método quando o resultado importa mais. Dificuldade de parar.',
    isMasterNumber: false,
  },
  5: {
    name: 'The Free Spirit',
    namePt: 'O Aventureiro',
    description: 'Variedade não é preferência — é oxigênio. O 5 processa o mundo através da experiência direta: você precisa tocar, testar, mover. A adaptabilidade não é inconstância; é inteligência encarnada que aprende pelo contato. O desafio do 5 não é a liberdade — é descobrir o que vale a pena sustentar quando a novidade passa.',
    traits: 'Adaptabilidade, curiosidade, dinamismo, coragem de experimentar, aprendizado por imersão',
    shadow: 'Inquietude que sabota o que foi construído. Impulsividade que escolhe o novo para fugir do difícil.',
    isMasterNumber: false,
  },
  6: {
    name: 'The Nurturer',
    namePt: 'O Guardião',
    description: 'Você carrega senso de responsabilidade que outros não sentem como urgência. O 6 é orientado pelo cuidado — família, comunidade, o que precisa ser protegido. Isso não é fraqueza sentimental: é uma força organizadora. O custo é a dificuldade de colocar seus próprios limites quando alguém precisa de você.',
    traits: 'Responsabilidade, cuidado, presença, capacidade de sustentar o que importa',
    shadow: 'Superproteção que impede o outro de crescer. Martírio silencioso. Controle disfarçado de cuidado.',
    isMasterNumber: false,
  },
  7: {
    name: 'The Seeker',
    namePt: 'O Buscador',
    description: 'A superfície nunca foi suficiente. O 7 precisa saber o que está embaixo — o mecanismo real, a razão verdadeira, o padrão por baixo do padrão. Introspecção não é isolamento aqui: é o modo de processamento. Você precisa de silêncio não para escapar, mas para pensar com profundidade real. A questão do 7 não é encontrar respostas — é aprender a viver com as perguntas que não têm.',
    traits: 'Profundidade analítica, intuição, busca por sentido, capacidade de contemplação',
    shadow: 'Isolamento que se torna padrão. Cinismo como defesa contra a decepção. Distância emocional que fecha o que deveria estar aberto.',
    isMasterNumber: false,
  },
  8: {
    name: 'The Powerhouse',
    namePt: 'O Realizador',
    description: 'Você entende poder — como flui, como se acumula, como se perde. O 8 não é sobre ambição no sentido superficial: é sobre a compreensão de que manifestar algo real no mundo exige força, estratégia e disposição de sustentar o processo até o fim. O equilíbrio que o 8 carrega é cármico: o que se dá com integridade volta com proporção.',
    traits: 'Capacidade de manifestação, autoridade, eficiência, visão estratégica, força de execução',
    shadow: 'Materialismo que perde o fio da razão. Dureza que trata pessoas como recursos. Workaholic como fuga de si mesmo.',
    isMasterNumber: false,
  },
  9: {
    name: 'The Humanitarian',
    namePt: 'O Sábio',
    description: 'Você chegou no final de um ciclo e carrega a memória de tudo que veio antes. O 9 é o número da completude — não como perfeição, mas como a maturidade de quem integrou o suficiente para ver além do próprio interesse. A compaixão do 9 não é ingênua: é o produto de quem já esteve em muitos lugares e entende que cada um tem seu caminho.',
    traits: 'Sabedoria, compaixão universal, capacidade de integração, desprendimento, visão de longo prazo',
    shadow: 'Altivez que julga quem está "menos evoluído". Martírio pelo ideal. Ressentimento quando o sacrifício não é reconhecido.',
    isMasterNumber: false,
  },
  11: {
    name: 'The Illuminator',
    namePt: 'O Iluminado',
    description: 'O 11 é número mestre — e isso não é título, é tensão. Você opera com sensibilidade e capacidade de percepção que excedem o ordinário, o que significa que o mundo comum pode ser genuinamente sobrecarregante. O canal está mais aberto do que em outros números. O trabalho é aprender a usar essa abertura sem ser consumido por ela.',
    traits: 'Intuição profunda, capacidade de inspirar, visão que atravessa aparências, sensibilidade como instrumento',
    shadow: 'Ansiedade quando o canal está sem direção. Autodúvida que paralisa o dom. Sensibilidade avassaladora sem estrutura para sustentá-la.',
    isMasterNumber: true,
  },
  22: {
    name: 'The Master Builder',
    namePt: 'O Grande Construtor',
    description: 'O 22 carrega a visão de 11 com a capacidade de construção de 4. É o número com maior potencial de manifestação concreta — e o maior peso. Você foi feito para trazer algo extraordinário ao mundo material, não como ego, mas como chamado. O desafio não é a visão: é ter coragem de começar quando a escala do que precisa ser construído é clara demais.',
    traits: 'Visão em larga escala, capacidade de manifestar o que outros apenas imaginam, disciplina a serviço de algo maior',
    shadow: 'Paralisia diante do próprio potencial. Perfeccionismo que adia o início. Controle que impede a colaboração necessária.',
    isMasterNumber: true,
  },
  33: {
    name: 'The Master Teacher',
    namePt: 'O Mestre dos Mestres',
    description: 'O número mais raro. O 33 integra a iluminação do 11 e o poder construtivo do 22 em serviço puro — não servitude, mas a orientação genuína para o bem do outro. Você foi feito para ensinar não pelo que sabe, mas pelo que é. O peso aqui é real: carregar esse número sem aterramento pode ser avassalador.',
    traits: 'Compaixão como força estruturante, ensino pelo exemplo, serviço sem agenda, amor incondicional como prática',
    shadow: 'Autonegligência total pelo outro. Dificuldade de receber o que dá. Responsabilidade como prisão em vez de vocação.',
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
