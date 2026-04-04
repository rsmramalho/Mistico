import type { Sign } from '../types/soul-map';

// ═══════════════════════════════════════
// Body Variations — personalização por combinação
// 2 variações por signo para o corpo da carta Kabbalah
// Cada variação fala da combinação específica signo × sephirah,
// não apenas do signo. Isso é o que torna pessoal.
// Escolhida pelo seed (mesmo sistema das aberturas).
// ═══════════════════════════════════════

export interface BodyVariation {
  paragraph1: string;
  paragraph2: string;
}

// Aries → Geburah (Marte diurno)
// Taurus → Netzach (Vênus noturna)
// Gemini → Hod (Mercúrio diurno)
// Cancer → Yesod (Lua)
// Leo → Tiphareth (Sol)
// Virgo → Hod (Mercúrio noturno)
// Libra → Netzach (Vênus diurna)
// Scorpio → Geburah (Marte noturno)
// Sagittarius → Chesed (Júpiter diurno)
// Capricorn → Binah (Saturno noturno)
// Aquarius → Binah (Saturno diurno)
// Pisces → Chesed (Júpiter noturno)

export const KABBALAH_BODY_VARIATIONS: Record<Sign, [BodyVariation, BodyVariation]> = {
  Aries: [
    {
      paragraph1: 'Geburah não é crueldade — é a capacidade de cortar o que precisa ser cortado. Em Áries, essa força não espera permissão. Você age antes de formular a razão, e a razão geralmente confirma depois.',
      paragraph2: 'O perigo específico de Marte diurno em Geburah é confundir necessidade de ação com incapacidade de parar. A espada que nunca descansa corta coisas que deveriam ser mantidas.',
    },
    {
      paragraph1: 'Você carrega a força de Geburah como impulso — não como cálculo. Enquanto outros medem, você já atravessou. Essa velocidade é real e tem custos reais.',
      paragraph2: 'A correção de Geburah para Áries é aprender que a força que não para também destrói o que construiu. O guerreiro precisa saber quando largar a espada — não por fraqueza, mas por precisão.',
    },
  ],
  Taurus: [
    {
      paragraph1: 'Vênus em Netzach de noite — o desejo não como superfície, mas como raiz. Você não quer coisas por impulso. Quer porque sabe, no corpo, que aquilo precisa existir perto de você.',
      paragraph2: 'O custo de Netzach em Touro é a dificuldade de soltar. O que você sustenta cresce, mas o que deveria ter ido embora também fica — porque a mão que segura com tanto cuidado não sabe quando abrir.',
    },
    {
      paragraph1: 'Netzach é vitória — mas no seu caso, vitória é permanência. Você vence ficando. Sustentando. Enquanto outros perseguem o novo, você aprofunda o que já é seu.',
      paragraph2: 'A sombra específica de Vênus noturna é confundir devoção com posse. O amor que não consegue largar não é mais amor — é medo de descobrir o que existe do outro lado da mão aberta.',
    },
  ],
  Gemini: [
    {
      paragraph1: 'Mercúrio diurno em Hod é a mente em seu estado mais ágil — conectando, traduzindo, renomeando. Você não processa o mundo de forma linear. Processa em rede. Cada ideia já nasce conectada a outras três.',
      paragraph2: 'O risco de Hod para Gêmeos é a velocidade que não pousa. A mente que conecta tudo pode perder a capacidade de se comprometer com uma coisa. A profundidade exige o que a agilidade resiste: parar.',
    },
    {
      paragraph1: 'Hod é comunicação como estrutura — não como entretenimento. Em Gêmeos, isso significa que sua fala não é leve por ser superficial. É leve porque carrega coisas pesadas de um jeito que outros conseguem segurar.',
      paragraph2: 'A correção de Hod para você é lembrar que nem toda ponte precisa ser cruzada. Às vezes, o pensamento que conecta dois mundos precisa escolher em qual ficar.',
    },
  ],
  Cancer: [
    {
      paragraph1: 'A Lua em Yesod é o campo emocional em estado puro — sem filtro, sem distância, sem mediação intelectual. Você sente o ambiente antes de entender o que está sentindo. Isso não é fraqueza: é um tipo de inteligência que a razão não alcança.',
      paragraph2: 'O custo de Yesod em Câncer é absorver o que não é seu. O campo que sente tudo não distingue automaticamente entre o que vem de dentro e o que vem de fora. A proteção que você oferece aos outros é a mesma que precisa aprender a oferecer a si.',
    },
    {
      paragraph1: 'Yesod é fundação — e em Câncer, a fundação é emocional. Você sustenta o que importa não com estrutura visível, mas com presença. As pessoas ao seu redor sabem que estão seguras, mesmo sem saber por quê.',
      paragraph2: 'A sombra de Yesod lunar é a memória que não solta. Cada ferida é revisitada, cada perda fica acesa. A maré que sobe para proteger também pode afogar o que deveria ser deixado na praia.',
    },
  ],
  Leo: [
    {
      paragraph1: 'O Sol em Tiphareth é o centro da Árvore — a posição de equilíbrio entre o que está acima e o que está abaixo. Em Leão, isso é natural: você irradia sem esforço porque a luz é constituição, não performance.',
      paragraph2: 'O perigo de Tiphareth em Leão é confundir a luz com a pessoa. Você não é o brilho. O brilho é algo que passa por você. Quando a identidade se funde com a radiação, o eclipse — quando inevitavelmente vem — é devastador.',
    },
    {
      paragraph1: 'Tiphareth é beleza como verdade — não como estética. Em Leão, essa verdade é expressa de corpo inteiro. Você não esconde o que sente, o que quer, o que é. Essa transparência atrai e intimida em igual medida.',
      paragraph2: 'A correção de Tiphareth para Leão é aprender que o centro não precisa ser o único ponto de luz. O Sol mais maduro é o que ilumina sem precisar ser olhado.',
    },
  ],
  Virgo: [
    {
      paragraph1: 'Mercúrio noturno em Hod opera pela análise silenciosa — o tipo de discernimento que trabalha nos detalhes que outros ignoram. Virgem em Hod não comunica para brilhar. Comunica para precisar.',
      paragraph2: 'O risco específico é a análise que não perdoa. A mente que vê cada imperfeição pode virar contra si mesma com a mesma precisão que aplica ao mundo. O serviço real de Virgem não é a perfeição — é saber onde a imperfeição importa e onde não importa.',
    },
    {
      paragraph1: 'Hod noturno é a mente como instrumento de serviço. Você analisa não para ter razão — para tornar as coisas funcionais. A diferença parece pequena. Não é.',
      paragraph2: 'A sombra de Virgem em Hod é o aperfeiçoamento que nunca pousa. Quando "bom o suficiente" não existe, a mente vira prisão. A correção é aceitar que o imperfeito funcionando vale mais que o perfeito planejado.',
    },
  ],
  Libra: [
    {
      paragraph1: 'Vênus diurna em Netzach não busca beleza por prazer — busca proporção como necessidade. Libra em Netzach sente o desequilíbrio como dor física. A harmonia que você persegue não é decorativa. É estrutural.',
      paragraph2: 'O custo é a dificuldade de agir quando o equilíbrio não está claro. A balança que precisa estar nivelada antes de cada decisão paralisa quando os pesos são genuinamente iguais. A correção: agir mesmo na incerteza.',
    },
    {
      paragraph1: 'Netzach para Libra é vitória pela elegância — não pela força. Você vence quando cria algo que funciona para todos, não apenas para você. Essa capacidade é rara e frequentemente invisível.',
      paragraph2: 'A sombra é o sacrifício da própria verdade em nome da harmonia alheia. Quando a balança serve a todos menos a quem a segura, o equilíbrio é falso. A honestidade que arrisca conflito é mais harmônica do que a paz comprada com silêncio.',
    },
  ],
  Scorpio: [
    {
      paragraph1: 'Marte noturno em Geburah — a força que não precisa ser vista para operar. Escorpião não corta em público. Corta no subsolo, no silêncio, onde a transformação real acontece. A precisão é cirúrgica.',
      paragraph2: 'O perigo de Geburah noturna é o poder que se torna controle. A mesma capacidade de ver por baixo da superfície pode virar vigilância — de si e dos outros. O escorpião que pica a si mesmo é o que não encontrou onde pousar a guarda.',
    },
    {
      paragraph1: 'Geburah em Escorpião é purificação pelo fogo interno. Você não teme a destruição — teme a superficialidade. O que não resiste à sua análise não merece ficar. Isso é força. Também é solidão.',
      paragraph2: 'A correção: nem tudo que não sobrevive ao seu escrutínio é fraco. Algumas coisas são frágeis por natureza e ainda assim valem a pena. A espada de Geburah precisa aprender a proteger, não só a cortar.',
    },
  ],
  Sagittarius: [
    {
      paragraph1: 'Júpiter diurno em Chesed — expansão como generosidade. Sagitário vê o horizonte como convite, não como limite. A misericórdia de Chesed no seu caso é a capacidade de incluir o que ainda não chegou.',
      paragraph2: 'O risco de Chesed em Sagitário é a expansão sem fundação. O horizonte que sempre recua pode virar fuga — do presente, do compromisso, do que exige ficar parado. A viagem mais difícil é a que fica.',
    },
    {
      paragraph1: 'Chesed é abundância — e Sagitário a expressa como visão. Você não acumula coisas. Acumula horizontes. Cada certeza encontrada é trampolim para a próxima pergunta.',
      paragraph2: 'A sombra de Chesed sagitariano é prometer mais do que a realidade comporta. A generosidade que não calcula pode criar expectativas que depois não sustenta. O entusiasmo é real — mas a promessa precisa ser medida.',
    },
  ],
  Capricorn: [
    {
      paragraph1: 'Saturno noturno em Binah é entendimento como construção. Capricórnio não aprende por iluminação — aprende por acumulação paciente. Cada experiência é material. Cada erro é dados. O resultado é uma estrutura que outros habitam sem perceber que foi construída.',
      paragraph2: 'O custo de Binah em Capricórnio é o peso do que sabe. O entendimento que vê a longo prazo carrega o presente com o futuro — e a leveza se torna artigo raro. A correção: nem tudo precisa ser construído para durar.',
    },
    {
      paragraph1: 'Binah é o recipiente — e em Capricórnio, o recipiente é feito de tempo. Você constrói devagar, camada por camada, porque sabe que o que é erguido rápido também cai rápido. Essa paciência não é virtude. É natureza.',
      paragraph2: 'A sombra de Saturno noturno é rigidificar o que deveria respirar. Estrutura que não se adapta não é forte — é quebradiça. O construtor mais sábio sabe onde colocar as juntas que permitem movimento.',
    },
  ],
  Aquarius: [
    {
      paragraph1: 'Saturno diurno em Binah — a lei como visão do que ainda não existe. Aquário não constrói para si. Constrói para o sistema. O entendimento de Binah aqui é arquitetônico: você vê o padrão coletivo antes de ele se tornar visível.',
      paragraph2: 'O custo é a distância. Quem vê o sistema inteiro frequentemente perde a conexão com as partes individuais. A correção de Binah para Aquário: o futuro que você enxerga precisa incluir o presente que os outros vivem agora.',
    },
    {
      paragraph1: 'Binah como Saturno diurno é compreensão que precede a forma. Você não segue estruturas — você as redesenha. Esse impulso não é rebeldia: é a percepção de que a estrutura atual não comporta o que deveria comportar.',
      paragraph2: 'A sombra específica é a frieza sistêmica — tratar pessoas como variáveis num modelo que só você vê. O visionário que esquece que cada ponto no sistema é alguém perde a visão que tentava proteger.',
    },
  ],
  Pisces: [
    {
      paragraph1: 'Júpiter noturno em Chesed — misericórdia sem fronteira. Peixes dissolve os limites entre eu e o outro, entre o que dói aqui e o que dói lá. A compaixão de Chesed no seu caso é oceânica: não distingue, não mede, não condiciona.',
      paragraph2: 'O custo de Chesed em Peixes é a dissolução do self. A compaixão que não distingue entre o próprio sofrimento e o do mundo pode afogar quem deveria nadar. A fronteira que Peixes resiste é a mesma que precisa para sobreviver.',
    },
    {
      paragraph1: 'Chesed noturno é abundância que transborda — e em Peixes, o que transborda é a percepção do que está além do visível. Você sabe coisas que não aprendeu. Sente coisas que não pertencem a você. Isso é dom e peso.',
      paragraph2: 'A sombra é a fuga disfarçada de entrega. Perder-se no outro, no sonho, na substância, no ideal — porque estar presente no real é doloroso demais. A correção: a presença mais sagrada é a que inclui o mundo sem abandonar o corpo.',
    },
  ],
};

export function getKabbalahBodyVariation(sign: Sign, seed: number): BodyVariation {
  return KABBALAH_BODY_VARIATIONS[sign][seed % 2];
}
