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
    coreDesire: 'Provar valor através da ação — e descobrir que o valor já estava lá',
    coreFear: 'Fraqueza. Não a fraqueza visível — a que ninguém pode ver',
    description: 'Você não descansa enquanto houver algo a provar. O problema é que a lista nunca termina — cada vitória revela a próxima prova, cada obstáculo superado abre espaço para o seguinte. O Herói não tem paz. Tem combustível. A força de Áries não é brutalidade — é a capacidade de começar, de novo, sempre, sem garantia de resultado. O que ninguém conta sobre o Herói é o cansaço que não pode mostrar.',
    shadow: {
      inflated: 'Quando a necessidade de provar vira agressão — a força que deveria abrir caminho começa a destruir o que está ao redor. O valentão não é corajoso. É alguém com medo grande demais para ser visto.',
      deflated: 'A recusa silenciosa. Não a covardia óbvia — mas a mais sutil: desistir antes de começar para que ninguém possa testemunhar o fracasso. É mais seguro não tentar do que tentar e perder.',
    },
  },
  Taurus: {
    name: 'Lover',
    title: 'The Lover',
    titlePt: 'O Amante',
    coreDesire: 'Pertencer — a um lugar, a uma pessoa, a algo que não vai embora',
    coreFear: 'Perder o que foi construído. A mão que abre e descobre que ficou vazia',
    description: 'Você sente o mundo através do corpo — textura, sabor, presença física. Vênus em terra não é leveza romântica: é devoção lenta e intensa, o tipo que constrói e sustenta. O Amante de Touro ama com persistência, não com performance. O perigo específico desse arquétipo não é o excesso — é a confusão entre amar e segurar. Entre conexão e controle. Entre devoção e recusa de deixar ir.',
    shadow: {
      inflated: 'A possessividade que se disfarça de cuidado. "Faço isso por você" como forma de garantir que você não vai embora. O amor que sufoca porque o abandono é insuportável demais para arriscar.',
      deflated: 'O entorpecimento como defesa. Cortar a conexão antes que ela corte você. A frieza não é falta de sentimento — é sentimento demais que aprendeu a se esconder.',
    },
  },
  Gemini: {
    name: 'Jester',
    title: 'The Jester',
    titlePt: 'O Mensageiro',
    coreDesire: 'Entender tudo — e encontrar a face que é genuinamente sua',
    coreFear: 'Tédio. E, mais fundo: a pergunta sobre qual das vozes é de fato você',
    description: 'Você nunca pousa completamente em um lugar — há sempre outro ângulo, outra possibilidade, outra conversa que ilumina algo novo. Mercúrio como regente não é só inteligência: é a capacidade de habitar perspectivas múltiplas ao mesmo tempo. O Mensageiro conecta mundos. O custo é que você conhece tantos mundos que às vezes perde o fio de onde começou. A dualidade de Gêmeos não é fraqueza de caráter. É a capacidade de ver dos dois lados — que só se torna problema quando é impossível parar.',
    shadow: {
      inflated: 'A palavra como arma. O humor que expõe sem curar. A inteligência que analisa e dissseca mas nunca se permite ser afetada. Quando a agilidade mental vira distância de tudo que importa.',
      deflated: 'A seriedade rígida como reação — suprimir toda leveza, todo jogo, toda curiosidade porque a superficialidade dói mais do que o tédio. A versão que parou de explorar.',
    },
  },
  Cancer: {
    name: 'Caregiver',
    title: 'The Caregiver',
    titlePt: 'O Guardião',
    coreDesire: 'Criar um lugar seguro — para os outros, e em algum momento, para si',
    coreFear: 'Ser abandonado por quem você protegeu. Ou pior: precisar de proteção e não receber',
    description: 'Você sente antes de pensar. A casca de Câncer não é frieza — é proteção de algo muito sensível no interior. O Guardião nutre não porque é fraco, mas porque entende intuitivamente que sem cuidado, nada cresce. A Lua como regente significa que você carrega ciclos: há momentos de abertura total e momentos de recolhimento absoluto, e ambos são necessários. O que raramente se examina é a inversão — quanto do cuidado que você oferece é também uma forma de garantir que as pessoas fiquem, e que você nunca precise pedir.',
    shadow: {
      inflated: 'O martírio que controla. Dar sem parar como forma de criar dívida emocional. O cuidado que não permite que o outro cresça porque crescer significa partir. Amor como posse suave.',
      deflated: 'O fechamento total. Depois de cuidar demais e receber pouco, a Lua desaparece. Frieza como autoprot proteção tão completa que ninguém consegue entrar — incluindo quem genuinamente quer cuidar de você.',
    },
  },
  Leo: {
    name: 'Ruler',
    title: 'The Ruler',
    titlePt: 'O Soberano',
    coreDesire: 'Ser visto — realmente visto — e reconhecido pelo que é, não pelo que faz',
    coreFear: 'Invisibilidade. Passar pelo mundo sem deixar marca',
    description: 'O Sol não pede permissão para brilhar — e você também não deveria. Leão carrega o arquétipo da soberania não como domínio sobre os outros, mas como domínio de si mesmo. A autoexpressão criativa é um imperativo, não uma vaidade. O que diferencia o Soberano do Tirano é a consciência: o primeiro ilumina o que está ao redor, o segundo extrai. A fome específica de Leão não é poder — é reconhecimento genuíno. Ser visto sem precisar diminuir para caber.',
    shadow: {
      inflated: 'Quando o brilho precisa de audiência constante para existir. O narcisismo não é amor-próprio — é a ausência dele tentando ser preenchida de fora. O tirano exige adoração porque, sozinho, duvida da própria luz.',
      deflated: 'A abdicação. Esconder o brilho para não ser alvo. Reduzir-se ao que os outros conseguem suportar. Quando o medo de parecer arrogante produz alguém que se apaga voluntariamente.',
    },
  },
  Virgo: {
    name: 'Sage',
    title: 'The Sage',
    titlePt: 'O Sábio',
    coreDesire: 'Entender o suficiente para ser útil — e encontrar paz no que é imperfeito',
    coreFear: 'O erro não detectado. A falha que passou e causou dano',
    description: 'Sua mente não para. Ela processa, refina, categoriza — não por ansiedade, mas porque o discernimento é genuinamente sua forma de amar. O Sábio de Virgem não busca perfeição por vaidade: busca porque acredita que o cuidado está nos detalhes, que a precisão é uma forma de respeito. Mercúrio em terra transforma a capacidade intelectual em utilidade concreta. O problema não é a análise — é quando a análise vira o crítico interno que nunca assina embora satisfeito.',
    shadow: {
      inflated: 'O perfeccionismo que paralisa. A análise que encontra a falha em tudo e não consegue pousar no que é bom. Quando o padrão elevado se volta contra você mesmo com uma crueldade que você nunca aplicaria a outra pessoa.',
      deflated: 'A ignorância voluntária — desligar o discernimento completamente porque ele dói. Aceitar qualquer coisa para não ter que analisar mais. A versão que desistiu de distinguir.',
    },
  },
  Libra: {
    name: 'Diplomat',
    title: 'The Diplomat',
    titlePt: 'O Diplomata',
    coreDesire: 'Harmonia real — não a superficial, mas a que resiste ao conflito',
    coreFear: 'Conflito que destrói a relação. E a pergunta que ninguém faz: o que você quer?',
    description: 'Você é calibrado para o outro. Sente o desequilíbrio antes que ele se torne visível, antecipa o que a situação precisa, navega tensões com uma habilidade que parece natural mas é trabalho constante. Vênus em ar é beleza como relação — não posse, mas conexão justa. O Diplomata não evita conflito por covardia: evita porque sente o dano que ele causa antes de qualquer um. O custo específico é que, sintonizado sempre com o outro, a pergunta "o que você quer?" pode soar genuinamente difícil de responder.',
    shadow: {
      inflated: 'A paz a qualquer preço. Concordar, ceder, dobrar — não porque o outro está certo, mas porque o conflito é insuportável. Harmonia falsa que guarda ressentimento em camadas, até que algo rompe.',
      deflated: 'O isolamento total como resposta — se toda relação exige negociação constante, às vezes é mais simples não ter nenhuma. Retirada que parece independência mas é exaustão.',
    },
  },
  Scorpio: {
    name: 'Magician',
    title: 'The Magician',
    titlePt: 'O Mago',
    coreDesire: 'Transformação real — não superficial, não cosmética, mas a que muda o que está embaixo',
    coreFear: 'Ser visto completamente — e ser abandonado depois',
    description: 'Você não faz superfície. Quando entra em algo — uma relação, um projeto, uma ideia — vai fundo e não tem muito interesse no que é raso. Escorpião governa morte e renascimento não como metáfora, mas como processo real: você sabe como morrer para uma versão de si mesmo e emergir diferente. O Mago vê sob aparências, detecta o que está oculto, e tem uma capacidade de transformação que intimida. O preço é a intensidade: nem todo mundo consegue sustentar a profundidade que você oferece — ou exige.',
    shadow: {
      inflated: 'O conhecimento psicológico como arma. Ver os pontos frágeis do outro e usar isso — não para ferir, necessariamente, mas para controlar. Quando a profundidade vira poder sobre, não poder com.',
      deflated: 'A impotência performática — negar a própria capacidade de agir, paralisar diante da transformação necessária. Às vezes é mais fácil sentir que não há saída do que tentar e confirmar o medo.',
    },
  },
  Sagittarius: {
    name: 'Explorer',
    title: 'The Explorer',
    titlePt: 'O Explorador',
    coreDesire: 'Sentido. A compreensão de por que estamos aqui — e liberdade para buscar',
    coreFear: 'Confinamento. Qualquer coisa que limite o horizonte',
    description: 'Você precisa de horizonte. Não necessariamente espaço físico — pode ser horizonte intelectual, espiritual, filosófico — mas precisa de algo além do que já sabe. Júpiter como regente dá essa fome expansiva que é genuinamente difícil de saciar. O Explorador é o arqueiro: a satisfação está no voo da flecha, no arco, na direção — não só no alvo. O que raramente se examina é quanto dessa busca constante também é fuga — do que está parado, do que exige permanência, do que não tem resposta ainda.',
    shadow: {
      inflated: 'O andarilho que nunca pousa. Compromisso como prisão. Quando a liberdade vira incapacidade de ficar — e cada vez que algo pede profundidade, há um novo horizonte apontando.',
      deflated: 'O aprisionamento voluntário pelo medo. Nunca partir para não arriscar se perder. A versão que trocou o arco por uma cadeira e passou a chamar isso de maturidade.',
    },
  },
  Capricorn: {
    name: 'Elder',
    title: 'The Elder',
    titlePt: 'O Ancião',
    coreDesire: 'Construir algo que dure — e ser reconhecido não pela performance, mas pela substância',
    coreFear: 'O fracasso que prova que o esforço não era suficiente',
    description: 'Você carrega o peso que outros não carregam. Não porque ninguém pediu — mas porque parece óbvio que alguém precisa, e você está lá. Saturno como regente não é punição: é a compreensão de que estrutura é o que sustenta a vida. O Ancião de Capricórnio conquista autoridade não pelo cargo, mas pela substância — anos de trabalho silencioso que geram o tipo de confiança que não se compra. A pergunta que o Ancião raramente faz: quem sustenta quem sustenta tudo?',
    shadow: {
      inflated: 'A ambição que perdeu a alma. Construir estruturas sem se perguntar mais para quê. Quando a disciplina se transforma em controle frio, e as pessoas ao redor viram engrenagens no plano.',
      deflated: 'A fuga da responsabilidade. A versão que viu o peso e escolheu invisibilidade. Incapacidade de sustentar qualquer estrutura — nem a própria.',
    },
  },
  Aquarius: {
    name: 'Rebel',
    title: 'The Rebel',
    titlePt: 'O Visionário',
    coreDesire: 'Um mundo diferente — e a liberdade de ser diferente dentro dele',
    coreFear: 'Conformidade. Dissolver-se no que todos esperam',
    description: 'Você vê o que poderia ser diferente antes de ver o que é. Aquário não desafia o status quo por rebeldia adolescente — desafia porque enxerga genuinamente a distância entre o que existe e o que é possível. Saturno como regente traz estrutura para a visão: não é só sonho utópico, é arquitetura de algo que ainda não existe. O paradoxo específico de Aquário é esse: tão focado na humanidade coletiva que os humanos individuais às vezes são difíceis de sustentar de perto.',
    shadow: {
      inflated: 'A destruição sem construção. Quando a ruptura com o convencional vira identidade em si mesma — ser diferente como fim, não como meio. Alienação disfarçada de originalidade.',
      deflated: 'A entrega total à conformidade — decidir que a visão é ingênua, que o mundo não muda, e seguir o script. A versão que trocou o horizonte pelo conforto do esperado.',
    },
  },
  Pisces: {
    name: 'Mystic',
    title: 'The Mystic',
    titlePt: 'O Místico',
    coreDesire: 'Unidade — a dissolução da separação entre você e o que é maior',
    coreFear: 'O sofrimento sem sentido. O vazio depois que a maré vai embora',
    description: 'Você sente o que não foi dito. Atravessa a sala e já sabe o estado emocional de cada pessoa — não porque analisou, mas porque absorveu. Peixes dissolve fronteiras não por fraqueza mas por porosidade natural: você acessa o que está sob a superfície das coisas. Júpiter em água dá compaixão que é genuína e vasta, mas o custo é real — quando tudo passa por você, precisa de tempo para lembrar o que é seu e o que é dos outros. A necessidade de desaparecer às vezes não é fuga. É higiene.',
    shadow: {
      inflated: 'A dissolução total. Quando a compaixão não tem limite e você some dentro do outro, da substância, da fantasia. Martírio como forma de pertencer. O escapismo que começa como alívio e termina como prisão.',
      deflated: 'O cinismo como armadura. Depois de sentir demais e ser consumido, fechar tudo — negar toda transcendência, toda espiritualidade, todo sentido. A desilusão amarga de quem acreditou muito e se perdeu nisso.',
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
