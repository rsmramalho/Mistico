import type { Sign, Archetype, ArchetypeName } from '../types/soul-map';

// ═══════════════════════════════════════
// Jung — Archetypes & Shadows
// Synthesis: Pearson + Greene + Bolen
// Note: Interpretive mapping (Jung did not
// map archetypes to zodiac signs directly)
// ══════════════════���════════════════════

interface ArchetypeData {
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

const ARCHETYPES: Record<Sign, ArchetypeData> = {
  Aries: {
    name: 'Hero',
    title: 'The Hero',
    titlePt: 'O Herói',
    coreDesire: 'Provar valor através de ação corajosa',
    coreFear: 'Fraqueza, vulnerabilidade, impotência',
    description: 'O Herói responde ao chamado da aventura, confronta desafios de frente e busca provar seu valor. A energia de fogo cardinal de Áries — iniciativa, coragem, combatividade — é a jornada arquetípica do Herói.',
    shadow: {
      inflated: 'O Valentão — prova seu valor dominando outros, agressão imprudente que destrói sem propósito',
      deflated: 'O Covarde — recusa o chamado, paralisado pelo medo de fracassar',
    },
  },
  Taurus: {
    name: 'Lover',
    title: 'The Lover',
    titlePt: 'O Amante',
    coreDesire: 'Intimidade, experiência sensorial, conexão profunda',
    coreFear: 'Perda, desconexão, privação',
    description: 'O Amante busca beleza, prazer e conexão com os mundos físico e emocional. Touro — regido por Vênus, terra fixa — encarna sensualidade, devoção e o desejo de abraçar e ser abraçado.',
    shadow: {
      inflated: 'O Obsessivo — consumido pelo desejo, possessividade, indulgência hedonista sem limites',
      deflated: 'O Entorpecido — frigidez emocional, corta toda conexão e sentimento',
    },
  },
  Gemini: {
    name: 'Jester',
    title: 'The Jester',
    titlePt: 'O Bobo',
    coreDesire: 'Liberdade, diversão, viver no momento',
    coreFear: 'Tédio, ser preso por convenções',
    description: 'O Bobo usa humor, astúcia e irreverência para revelar verdades e navegar a vida. A dualidade de Gêmeos, a agilidade verbal e a curiosidade inquieta espelham o Trickster — e Mercúrio/Hermes é seu próprio regente.',
    shadow: {
      inflated: 'O Satirista Cruel — crueldade disfarçada de humor, palavras como armas, manipulação',
      deflated: 'O Sério Demais — suprime todo jogo e leveza, seriedade rígida',
    },
  },
  Cancer: {
    name: 'Caregiver',
    title: 'The Caregiver',
    titlePt: 'O Cuidador',
    coreDesire: 'Proteger e cuidar dos outros',
    coreFear: 'Egoísmo, ingratidão, abandono',
    description: 'O Cuidador é movido pela compaixão e pelo desejo de proteger. Câncer — água cardinal, regido pela Lua — é o arquétipo da mãe, do lar, do alimento emocional. A casca protege o interior macio.',
    shadow: {
      inflated: 'O Mártir — dá para controlar, sufoca, manipula através da culpa',
      deflated: 'O Negligente — abandona responsabilidade, frieza emocional',
    },
  },
  Leo: {
    name: 'Ruler',
    title: 'The Ruler',
    titlePt: 'O Soberano',
    coreDesire: 'Criar ordem, prosperidade, um reino',
    coreFear: 'Caos, ser deposto, irrelevância',
    description: 'O Soberano cria ordem, assume responsabilidade e lidera. Leão — fogo fixo, regido pelo Sol — é o signo da soberania, autoexpressão criativa e desejo de estar no centro. O Sol É o soberano do sistema solar.',
    shadow: {
      inflated: 'O Tirano — controle autoritário, narcisismo, exige adoração',
      deflated: 'O Abdicador — evita responsabilidade, fraco e indeciso',
    },
  },
  Virgo: {
    name: 'Sage',
    title: 'The Sage',
    titlePt: 'O Sábio',
    coreDesire: 'Compreensão, verdade, sabedoria',
    coreFear: 'Engano, ignorância, ser enganado',
    description: 'O Sábio busca verdade através da análise, discernimento e observação cuidadosa. Virgem — terra mutável, regido por Mercúrio — processa, categoriza e refina. O signo da colheita: separar o trigo do joio é o ato essencial do Sábio.',
    shadow: {
      inflated: 'O Dogmático — análise fria sem compaixão, paralisia por perfeccionismo, vê só falhas',
      deflated: 'O Tolo — ignorância voluntária, rejeita toda análise',
    },
  },
  Libra: {
    name: 'Diplomat',
    title: 'The Diplomat',
    titlePt: 'O Diplomata',
    coreDesire: 'Harmonia, equilíbrio, justiça, parceria',
    coreFear: 'Conflito, isolamento, injustiça',
    description: 'O Diplomata busca harmonia e relação justa. Libra — ar cardinal, regido por Vênus — pesa, equilibra e negocia. A Balança é literalmente o símbolo de justiça e equilíbrio.',
    shadow: {
      inflated: 'O Manipulador — falsa harmonia, paz a qualquer preço, joga todos os lados',
      deflated: 'O Eremita — retira-se de toda relação, isolamento total',
    },
  },
  Scorpio: {
    name: 'Magician',
    title: 'The Magician',
    titlePt: 'O Mago',
    coreDesire: 'Transformação, entender as leis ocultas da realidade',
    coreFear: 'Perda de controle, superficialidade, impotência',
    description: 'O Mago transforma a realidade pelo entendimento profundo de leis ocultas. Escorpião — água fixa, regido por Marte — governa morte/renascimento, o oculto, profundidade psicológica. Vê sob superfícies e transmuta chumbo em ouro.',
    shadow: {
      inflated: 'O Feiticeiro das Trevas — manipulação, obsessão por poder, insight psicológico como arma',
      deflated: 'O Desempoderado — sente-se impotente, nega a própria capacidade de agir',
    },
  },
  Sagittarius: {
    name: 'Explorer',
    title: 'The Explorer',
    titlePt: 'O Explorador',
    coreDesire: 'Liberdade, descoberta, sentido',
    coreFear: 'Confinamento, vazio interior, falta de sentido',
    description: 'O Explorador busca liberdade e novos horizontes — físicos, intelectuais, espirituais. Sagitário — fogo mutável, regido por Júpiter — é o arqueiro mirando alvos distantes, o filósofo-aventureiro, eterno estudante do sentido.',
    shadow: {
      inflated: 'O Andarilho — escapismo crônico, incapacidade de compromisso, irresponsabilidade',
      deflated: 'O Prisioneiro — preso pelo medo, nunca se aventura para fora',
    },
  },
  Capricorn: {
    name: 'Elder',
    title: 'The Elder',
    titlePt: 'O Ancião',
    coreDesire: 'Estrutura, legado, maestria pela disciplina',
    coreFear: 'Fracasso, perda de status, caos',
    description: 'O Ancião constrói estruturas duradouras e conquista autoridade pelo tempo e disciplina. Capricórnio — terra cardinal, regido por Saturno — encarna o arquétipo do pai, do tempo, da responsabilidade. Distinto do Soberano de Leão: Leão governa por carisma (Sol), Capricórnio por estrutura (Saturno).',
    shadow: {
      inflated: 'O Patriarca Rígido — ambição fria sem alma, exploração em nome da ordem',
      deflated: 'O Pai Ausente — incapaz de prover estrutura, foge da responsabilidade',
    },
  },
  Aquarius: {
    name: 'Rebel',
    title: 'The Rebel',
    titlePt: 'O Rebelde',
    coreDesire: 'Libertação, mudança radical, visão utópica',
    coreFear: 'Conformidade, ineficácia, perda de individualidade',
    description: 'O Rebelde desafia o status quo e imagina um mundo melhor. Aquário — ar fixo, regido por Saturno — é o signo da revolução, visão coletiva e ruptura com convenção. O Aguadeiro derrama conhecimento para todos.',
    shadow: {
      inflated: 'O Anarquista — destruição sem construção, alienação disfarçada de independência',
      deflated: 'O Conformista — entrega toda individualidade, segue cegamente',
    },
  },
  Pisces: {
    name: 'Mystic',
    title: 'The Mystic',
    titlePt: 'O Místico',
    coreDesire: 'Unidade, transcendência, retorno ao paraíso',
    coreFear: 'Sofrimento, separação do divino',
    description: 'O Místico busca retorno à unidade — com o divino, com o cosmos, com a fonte. Peixes — água mutável, regido por Júpiter — dissolve fronteiras, acessa o numinoso, e carrega tanto o êxtase quanto a agonia da abertura espiritual.',
    shadow: {
      inflated: 'O Escapista — vício, martírio, dissolução do eu em fantasia',
      deflated: 'O Cínico — nega todo sentido, desilusão amarga',
    },
  },
};

export function getArchetype(sign: Sign): Archetype {
  const data = ARCHETYPES[sign];
  return {
    name: data.name,
    title: data.title,
    titlePt: data.titlePt,
    coreDesire: data.coreDesire,
    coreFear: data.coreFear,
    description: data.description,
    shadow: data.shadow,
  };
}
