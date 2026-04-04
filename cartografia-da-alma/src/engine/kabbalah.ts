import type { Sign, Sephirah, SephirahName, PlanetaryExpression } from '../types/soul-map';

// ═══════════════════════════════════════
// Kabbalah — Tree of Life Correspondences
// System: Golden Dawn / 777
// Chain: Sign → Classical Ruler → Sephirah
// ════���══════════════════════════════════

interface SephirahData {
  name: SephirahName;
  number: number;
  planet: string;
  meaning: string;
  description: string;
}

const SEPHIROTH: Record<SephirahName, SephirahData> = {
  Kether:   { name: 'Kether',   number: 1,  planet: 'Primum Mobile', meaning: 'Coroa', description: 'O ponto antes da forma. Kether não é um lugar na Árvore — é o limite do que pode ser descrito. Unidade absoluta, anterior a toda dualidade. O que está aqui não pode ser apreendido, apenas apontado.' },
  Chokmah:  { name: 'Chokmah',  number: 2,  planet: 'Zodiac',        meaning: 'Sabedoria', description: 'O primeiro movimento. Antes do pensamento, antes da análise — o impulso puro que precede qualquer forma. Chokmah é sabedoria como força primordial, não como conhecimento acumulado. O relâmpago antes do trovão.' },
  Binah:    { name: 'Binah',    number: 3,  planet: 'Saturn',        meaning: 'Entendimento', description: 'A forma que contém. Saturno não é limitação — é o recipiente sem o qual nada manifesta. Binah é o entendimento que nasce de sustentar algo pelo tempo necessário. A grande mãe não nutre por bondade abstrata — nutre porque sabe que sem estrutura, a semente não germina.' },
  Chesed:   { name: 'Chesed',   number: 4,  planet: 'Jupiter',       meaning: 'Misericórdia', description: 'A expansão que não exige retorno. Júpiter como graça — não como recompensa, mas como transbordamento natural de quem tem mais do que precisa. Chesed é a generosidade que não calcula, a visão que inclui em vez de separar. O perigo é a expansão sem discernimento.' },
  Geburah:  { name: 'Geburah',  number: 5,  planet: 'Mars',          meaning: 'Severidade', description: 'A força que corta o que não serve. Geburah não é crueldade — é a precisão do cirurgião. Marte aqui não é agressão; é a capacidade de agir quando agir é necessário, de dizer não quando o não protege o que importa. Severidade como ato de amor radical.' },
  Tiphareth: { name: 'Tiphareth', number: 6, planet: 'Sun',           meaning: 'Beleza', description: 'O centro que mantém tudo em órbita. Tiphareth é onde os opostos encontram equilíbrio — não neutralidade, mas harmonia viva. O Sol não apaga as sombras: ilumina o suficiente para que possam ser vistas. Beleza aqui não é estética — é a proporção justa entre todas as forças.' },
  Netzach:  { name: 'Netzach',  number: 7,  planet: 'Venus',         meaning: 'Vitória', description: 'A vitória do desejo que persiste. Vênus em Netzach não é amor romântico — é a força criativa que sustenta toda arte, toda paixão, toda conexão. O que Netzach guarda é o fogo emocional antes de ser domesticado pela razão. Perigoso e necessário.' },
  Hod:      { name: 'Hod',      number: 8,  planet: 'Mercury',       meaning: 'Esplendor', description: 'O esplendor da mente que nomeia. Mercúrio em Hod é a linguagem como força mágica — a capacidade de tornar real o que é dito com precisão. Análise, comunicação, o dom de ver padrões onde outros veem caos. O intelecto como instrumento, não como fim.' },
  Yesod:    { name: 'Yesod',    number: 9,  planet: 'Moon',          meaning: 'Fundação', description: 'O substrato de tudo que se manifesta. Yesod é onde o inconsciente e o consciente se tocam — o campo de sonhos, instintos e reflexos que sustenta toda ação visível. A Lua não cria luz própria: reflete. E é nesse reflexo que a maioria das decisões reais acontece, antes de qualquer deliberação.' },
  Malkuth:  { name: 'Malkuth',  number: 10, planet: 'Earth',         meaning: 'Reino', description: 'O lugar onde tudo finalmente acontece. Malkuth é o corpo, a matéria, o concreto — não como plano inferior, mas como destino de toda emanação. A luz que desceu por toda a Árvore chega aqui e se faz experiência. Não há nada mais espiritual do que o que é completamente encarnado.' },
  Daath:    { name: 'Daath',    number: 0,  planet: 'Pluto',         meaning: 'Conhecimento', description: 'O abismo que não é sephirah. Daath existe entre Binah e Chesed como o vazio que precisa ser atravessado — o ponto de ruptura onde o conhecimento velho não serve mais e o novo ainda não chegou. Plutão como transformação radical: não se passa por Daath sem mudar o que era.' },
};

// Sign → Sephirah mapping via classical planetary rulership
const SIGN_SEPHIRAH: Record<Sign, { sephirah: SephirahName; expression: PlanetaryExpression }> = {
  Aries:       { sephirah: 'Geburah',  expression: 'diurnal' },
  Taurus:      { sephirah: 'Netzach',  expression: 'nocturnal' },
  Gemini:      { sephirah: 'Hod',      expression: 'diurnal' },
  Cancer:      { sephirah: 'Yesod',    expression: 'sole' },
  Leo:         { sephirah: 'Tiphareth', expression: 'sole' },
  Virgo:       { sephirah: 'Hod',      expression: 'nocturnal' },
  Libra:       { sephirah: 'Netzach',  expression: 'diurnal' },
  Scorpio:     { sephirah: 'Geburah',  expression: 'nocturnal' },
  Sagittarius: { sephirah: 'Chesed',   expression: 'diurnal' },
  Capricorn:   { sephirah: 'Binah',    expression: 'nocturnal' },
  Aquarius:    { sephirah: 'Binah',    expression: 'diurnal' },
  Pisces:      { sephirah: 'Chesed',   expression: 'nocturnal' },
};

// Expression descriptions — how the sephirah manifests through this specific sign
const EXPRESSION_DESC: Record<Sign, string> = {
  Aries:       'Marte diurno em Geburah — a força que age antes de calcular. Não agressão: iniciativa sagrada. A espada que abre o caminho não porque quer cortar, mas porque o caminho não existe ainda.',
  Taurus:      'Vênus noturna em Netzach — desejo como enraizamento. A beleza que você carrega não é decorativa — é estrutural. O que você ama, você sustenta. O que você sustenta, cresce.',
  Gemini:      'Mercúrio diurno em Hod — a mente como instrumento de ponte. Você não pensa para concluir; pensa para conectar. A dualidade não é fraqueza — é a capacidade de habitar dois mundos ao mesmo tempo.',
  Cancer:      'A Lua em seu trono em Yesod — você não precisa de intermediário para acessar o campo emocional. Vive no nível da fundação: o que os outros sentem depois de pensar, você já sentiu antes de saber por quê.',
  Leo:         'O Sol em seu trono em Tiphareth — centro natural, não por arrogância, mas por constituição. A luz que você irradia não é esforço — é natureza. O trabalho é aprender a sustentá-la sem precisar de reflexo constante.',
  Virgo:       'Mercúrio noturno em Hod — análise como serviço. A mente que processa não descansa porque não consegue ignorar o que está impreciso. O discernimento é real. O custo é a dificuldade de pousar no suficientemente bom.',
  Libra:       'Vênus diurna em Netzach — beleza como relação, não como objeto. Você não quer possuir — quer que as coisas estejam em proporção justa. O desequilíbrio dói fisicamente. A harmonia não é preferência estética: é necessidade.',
  Scorpio:     'Marte noturno em Geburah — poder que opera por baixo da superfície. A força que você carrega não precisa ser exibida para ser real. Você corta o que não serve com precisão silenciosa — e sabe exatamente onde cortar.',
  Sagittarius: 'Júpiter diurno em Chesed — expansão como vocação. A misericórdia aqui não é suavidade: é a capacidade de ver longe o suficiente para incluir o que ainda não chegou. A generosidade de Chesed é a do horizonte que recua conforme você avança.',
  Capricorn:   'Saturno noturno em Binah — estrutura como entendimento profundo. Você não constrói por ambição: constrói porque sem forma, nada persiste. O tempo não é inimigo — é o material com que você trabalha. O que você ergue, dura.',
  Aquarius:    'Saturno diurno em Binah — lei como visão coletiva. A estrutura que você carrega não é para você — é para o que ainda não existe. Binah como arquitetura do futuro: o entendimento que vê o padrão antes de todos.',
  Pisces:      'Júpiter noturno em Chesed — misericórdia sem fronteira. A compaixão que você carrega não distingue quem merece — e isso é força e vulnerabilidade ao mesmo tempo. O que transborda de Chesed em Peixes é amor como dissolução.',
};

export function getSephirah(sign: Sign): Sephirah {
  const mapping = SIGN_SEPHIRAH[sign];
  const data = SEPHIROTH[mapping.sephirah];

  return {
    name: data.name,
    number: data.number,
    planet: data.planet,
    expression: mapping.expression,
    meaning: data.meaning,
    description: EXPRESSION_DESC[sign],
  };
}
