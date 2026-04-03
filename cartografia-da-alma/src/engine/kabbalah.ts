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
  Kether:   { name: 'Kether',   number: 1,  planet: 'Primum Mobile', meaning: 'Coroa', description: 'A fonte primordial, unidade absoluta, o ponto de origem de toda emanação.' },
  Chokmah:  { name: 'Chokmah',  number: 2,  planet: 'Zodiac',        meaning: 'Sabedoria', description: 'A força dinâmica primordial, sabedoria pura, o impulso criativo antes da forma.' },
  Binah:    { name: 'Binah',    number: 3,  planet: 'Saturn',        meaning: 'Entendimento', description: 'A grande mãe que dá forma. Saturno como estrutura, limite e entendimento profundo. O útero do tempo.' },
  Chesed:   { name: 'Chesed',   number: 4,  planet: 'Jupiter',       meaning: 'Misericórdia', description: 'A expansão benevolente. Júpiter como graça, abundância e visão magnânima. O rei generoso.' },
  Geburah:  { name: 'Geburah',  number: 5,  planet: 'Mars',          meaning: 'Severidade', description: 'A força que corta e purifica. Marte como coragem, disciplina e poder concentrado. O guerreiro justo.' },
  Tiphareth: { name: 'Tiphareth', number: 6, planet: 'Sun',           meaning: 'Beleza', description: 'O coração da Árvore. O Sol como centro radiante, harmonia dos opostos, consciência iluminada. O filho.' },
  Netzach:  { name: 'Netzach',  number: 7,  planet: 'Venus',         meaning: 'Vitória', description: 'A vitória do desejo e da beleza. Vênus como arte, paixão, natureza e força criativa emocional.' },
  Hod:      { name: 'Hod',      number: 8,  planet: 'Mercury',       meaning: 'Esplendor', description: 'O esplendor do intelecto. Mercúrio como linguagem, análise, comunicação e magia da palavra.' },
  Yesod:    { name: 'Yesod',    number: 9,  planet: 'Moon',          meaning: 'Fundação', description: 'A fundação que conecta mundos. A Lua como reflexo, sonho, inconsciente e base emocional de toda manifestação.' },
  Malkuth:  { name: 'Malkuth',  number: 10, planet: 'Earth',         meaning: 'Reino', description: 'O reino manifesto. A Terra como corpo, matéria, experiência concreta. Onde a luz se faz carne.' },
  Daath:    { name: 'Daath',    number: 0,  planet: 'Pluto',         meaning: 'Conhecimento', description: 'O abismo oculto. Conhecimento que não é sephirah — o portal entre mundos, transformação radical.' },
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

// Expression descriptions per sign (how the sephirah manifests through this sign)
const EXPRESSION_DESC: Record<Sign, string> = {
  Aries:       'Marte diurno — a força que inicia, coragem como impulso sagrado, a espada que abre caminho.',
  Taurus:      'Vênus noturna — beleza sensual enraizada na terra, abundância como devoção silenciosa.',
  Gemini:      'Mercúrio diurno — a palavra como ponte entre mundos, intelecto ágil, dualidade criativa.',
  Cancer:      'A Lua em seu trono — fundação emocional de todo ser, maré que nutre e protege.',
  Leo:         'O Sol em seu trono — soberania radiante, o coração como centro de toda criação.',
  Virgo:       'Mercúrio noturno — análise como ofício sagrado, discernimento que separa o trigo do joio.',
  Libra:       'Vênus diurna — harmonia como ato de justiça, beleza na relação entre as coisas.',
  Scorpio:     'Marte noturno — poder oculto sob a superfície, transformação que nasce da profundidade.',
  Sagittarius: 'Júpiter diurno — expansão sem fronteiras, sabedoria como fogo que ilumina o horizonte.',
  Capricorn:   'Saturno noturno — maestria forjada pelo tempo, estrutura como expressão de entendimento.',
  Aquarius:    'Saturno diurno — lei cósmica aplicada ao coletivo, arquitetura social como visão.',
  Pisces:      'Júpiter noturno — compaixão que dissolve fronteiras, a misericórdia que tudo abraça.',
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
