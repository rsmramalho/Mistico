// ═══════════════════════════════════════
// Cartografia da Alma — Variations
// 3 opening lines per card per sign
// Hardcoded — not AI-generated
// ═══════════════════════════════════════

import type { Sign } from '../types/soul-map';

export interface CartaVariations {
  astrology: [string, string, string];
  kabbalah: [string, string, string];
  shadow: [string, string, string];
}

export const CARTA_VARIATIONS: Record<Sign, CartaVariations> = {
  Aries: {
    astrology: [
      'Você nasceu quando o Sol entrava em Áries — o fogo que age antes de calcular.',
      'Áries. O primeiro signo. O impulso que não pede licença.',
      'O céu naquela data carregava Marte em estado puro. Você é Áries.',
    ],
    kabbalah: [
      'Na Árvore da Vida, você ocupa Geburah — a força que corta o que sobra.',
      'Geburah. Severidade. O lugar onde a coragem vira estrutura.',
      'O caminho de Marte te levou a Geburah, a sephirah que não negocia.',
    ],
    shadow: [
      'O herói que você carrega tem um lado que atropela quem ama.',
      'Existe uma versão covarde dentro do guerreiro. Você já a viu.',
      'A agressão que você chama de coragem — quando foi a última vez que parou para olhar?',
    ],
  },
  Taurus: {
    astrology: [
      'Você nasceu sob Touro — a terra que planta e não sai do lugar.',
      'Touro. Vênus em forma de raiz. O que você segura, segura de verdade.',
      'O céu naquela data tinha o Sol em Touro. Tudo que importa, você quer tocar.',
    ],
    kabbalah: [
      'Na Árvore da Vida, você ocupa Netzach — vitória pelo desejo que persiste.',
      'Netzach é onde você está. A sephirah de Vênus, onde o belo não é decoração.',
      'O caminho de Vênus te posicionou em Netzach. A permanência é sua forma de amor.',
    ],
    shadow: [
      'O amante que você carrega pode sufocar o que tenta possuir.',
      'Há uma frieza que aparece quando o prazer é negado. Você reconhece?',
      'A posse que você confunde com cuidado — quando virou prisão?',
    ],
  },
  Gemini: {
    astrology: [
      'Você nasceu sob Gêmeos — a mente que habita dois lugares ao mesmo tempo.',
      'Gêmeos. Mercúrio em duplicidade. O pensamento que nunca pousa.',
      'O céu naquela data tinha o Sol em Gêmeos. Você processa o mundo pela palavra.',
    ],
    kabbalah: [
      'Na Árvore da Vida, você ocupa Hod — esplendor, a inteligência que organiza.',
      'Hod. A sephirah de Mercúrio, onde a mente se torna instrumento preciso.',
      'O caminho de Mercúrio te trouxe a Hod. Comunicar é sua forma de existir.',
    ],
    shadow: [
      'O humor que você usa como escudo — quando ele corta, você percebe?',
      'Existe uma seriedade que te assusta. O palhaço prefere rir a sentir.',
      'A leveza que você exibe tem um preço. Quem paga é quem fica perto demais.',
    ],
  },
  Cancer: {
    astrology: [
      'Você nasceu sob Câncer — a água que sente antes de pensar.',
      'Câncer. A Lua como regente. O campo emocional que sustenta sem ser visto.',
      'O céu naquela data tinha o Sol em Câncer. A memória é o seu território.',
    ],
    kabbalah: [
      'Na Árvore da Vida, você ocupa Yesod — o fundamento, onde o invisível ganha forma.',
      'Yesod. A sephirah da Lua. O que você sustenta, ninguém vê — mas tudo depende.',
      'O caminho da Lua te levou a Yesod. Você é a base antes do visível.',
    ],
    shadow: [
      'O cuidador que você carrega pode se tornar mártir sem aviso.',
      'Existe uma negligência escondida atrás de tanto cuidado. Quem cuida de você?',
      'O abraço que sufoca — quando a proteção vira controle, você nota?',
    ],
  },
  Leo: {
    astrology: [
      'Você nasceu sob Leão — o fogo que sustenta, não só inicia.',
      'Leão. O Sol como centro. A luz que não precisa de reflexo para existir.',
      'O céu naquela data tinha o Sol em Leão. Identidade não é vaidade — é estrutura.',
    ],
    kabbalah: [
      'Na Árvore da Vida, você ocupa Tiphareth — beleza, o coração da Árvore.',
      'Tiphareth. O centro onde tudo se conecta. Você é o ponto de equilíbrio.',
      'O caminho do Sol te posicionou em Tiphareth. Harmonia é sua função, não seu luxo.',
    ],
    shadow: [
      'O rei que você carrega pode virar tirano quando o palco escurece.',
      'Existe uma abdicação que aparece quando ninguém aplaude. Você já sentiu.',
      'O trono que você ocupa — quando ninguém olha, você ainda senta nele?',
    ],
  },
  Virgo: {
    astrology: [
      'Você nasceu sob Virgem — a terra que adapta sem perder a precisão.',
      'Virgem. Mercúrio em modo análise. O discernimento que não descansa.',
      'O céu naquela data tinha o Sol em Virgem. Você serve antes de pedir.',
    ],
    kabbalah: [
      'Na Árvore da Vida, você ocupa Hod — esplendor, a inteligência a serviço da ordem.',
      'Hod. A sephirah de Mercúrio. Aqui a mente não divaga — ela classifica.',
      'O caminho de Mercúrio te levou a Hod. Precisão é sua forma de devoção.',
    ],
    shadow: [
      'O sábio que você carrega pode se tornar dogmático quando perde o controle.',
      'Existe um tolo dentro de quem analisa tudo. Ele aparece quando a realidade escapa do plano.',
      'A crítica que você dirige ao mundo — quando foi que ela virou contra você?',
    ],
  },
  Libra: {
    astrology: [
      'Você nasceu sob Libra — o ar que inicia pelo equilíbrio, não pela força.',
      'Libra. Vênus em forma de proporção. A beleza como necessidade, não capricho.',
      'O céu naquela data tinha o Sol em Libra. Você existe em relação.',
    ],
    kabbalah: [
      'Na Árvore da Vida, você ocupa Netzach — vitória pela harmonia que insiste.',
      'Netzach. A sephirah de Vênus. O que é belo aqui também é verdadeiro.',
      'O caminho de Vênus te trouxe a Netzach. O equilíbrio não é passividade — é escolha.',
    ],
    shadow: [
      'O diplomata que você carrega pode virar manipulador quando o conflito aperta.',
      'Existe um eremita dentro de quem busca consenso. Ele aparece quando o outro decepciona.',
      'A harmonia que você mantém tem um custo. Quem paga é a sua opinião verdadeira.',
    ],
  },
  Scorpio: {
    astrology: [
      'Você nasceu sob Escorpião — a água fixa que sustenta o peso sem se mover.',
      'Escorpião. Marte em profundidade. O poder que opera por baixo da superfície.',
      'O céu naquela data tinha o Sol em Escorpião. Transformação não é escolha — é natureza.',
    ],
    kabbalah: [
      'Na Árvore da Vida, você ocupa Geburah — severidade, a força que purifica.',
      'Geburah. A sephirah de Marte. Aqui nada permanece que não seja essencial.',
      'O caminho de Marte te levou a Geburah. Destruir o falso é seu ofício.',
    ],
    shadow: [
      'O mago que você carrega conhece o poder — e o lado que usa esse poder contra os outros.',
      'Existe uma versão desempoderada que surge quando você perde o controle. Você já a sentiu.',
      'A intensidade que te define — quando ela vira obsessão, quem sofre primeiro?',
    ],
  },
  Sagittarius: {
    astrology: [
      'Você nasceu sob Sagitário — o fogo que busca, não que constrói.',
      'Sagitário. Júpiter em movimento. A generosidade do horizonte como promessa.',
      'O céu naquela data tinha o Sol em Sagitário. Você precisa de sentido, não de conforto.',
    ],
    kabbalah: [
      'Na Árvore da Vida, você ocupa Chesed — misericórdia, a expansão que acolhe.',
      'Chesed. A sephirah de Júpiter. Aqui a generosidade não é fraqueza — é arquitetura.',
      'O caminho de Júpiter te posicionou em Chesed. Crescer é sua forma de servir.',
    ],
    shadow: [
      'O explorador que você carrega pode virar fugitivo quando a realidade aperta.',
      'Existe um prisioneiro dentro de quem busca liberdade. Ele aparece quando parar dói.',
      'A fuga que você chama de busca — quando foi que correr virou hábito?',
    ],
  },
  Capricorn: {
    astrology: [
      'Você nasceu sob Capricórnio — a terra cardinal que inicia pela lei.',
      'Capricórnio. Saturno como mestre. O que é construído para durar exige paciência.',
      'O céu naquela data tinha o Sol em Capricórnio. Você carrega o peso antes de pedir ajuda.',
    ],
    kabbalah: [
      'Na Árvore da Vida, você ocupa Binah — entendimento, a forma que contém.',
      'Binah. A sephirah de Saturno. Aqui a restrição é um ato de amor.',
      'O caminho de Saturno te levou a Binah. Limitar é sua forma de proteger.',
    ],
    shadow: [
      'O ancião que você carrega pode virar patriarca frio quando o afeto escapa.',
      'Existe um pai ausente dentro de quem sustenta tudo. Ele aparece quando o cansaço vence.',
      'A solidez que te define — quando ela vira muralha, quem fica do lado de fora?',
    ],
  },
  Aquarius: {
    astrology: [
      'Você nasceu quando o Sol entrava em Aquário.',
      'O céu naquela data tinha o Sol em Aquário — a ideia que não cede.',
      'Aquário. É com este padrão que tudo começa.',
    ],
    kabbalah: [
      'Na Árvore da Vida, você ocupa Binah.',
      'Binah é onde você está posicionado na Árvore.',
      'O caminho de Saturno te levou a Binah.',
    ],
    shadow: [
      'O rebelde que você carrega pode virar anarquista quando a causa vira obsessão.',
      'Existe um conformista dentro de quem desafia tudo. Ele aparece quando a solidão pesa.',
      'A visão que você defende — quando ninguém mais enxerga, você insiste ou desiste?',
    ],
  },
  Pisces: {
    astrology: [
      'Você nasceu sob Peixes — a água que flui para tudo, sem distinção.',
      'Peixes. Júpiter em dissolução. A compaixão que não escolhe a quem servir.',
      'O céu naquela data tinha o Sol em Peixes. Você sente o que não é seu.',
    ],
    kabbalah: [
      'Na Árvore da Vida, você ocupa Chesed — misericórdia sem fronteira.',
      'Chesed. A sephirah de Júpiter. Aqui o amor não distingue — ele absorve.',
      'O caminho de Júpiter te trouxe a Chesed. Dissolver limites é sua natureza.',
    ],
    shadow: [
      'O místico que você carrega pode virar dependente quando a realidade pesa demais.',
      'Existe um cínico dentro de quem acredita em tudo. Ele aparece quando a fé falha.',
      'A sensibilidade que te define — quando ela vira fuga, para onde você vai?',
    ],
  },
};

export function getVariation(_sign: Sign, seed: number): number {
  return seed % 3; // 0, 1, or 2
}
