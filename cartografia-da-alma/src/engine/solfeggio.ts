import type { Sign, FrequencyResult } from '../types/soul-map';

// ═══════════════════════════════════════
// Solfeggio Frequencies
// 9 canonical + 3 complementary (210, 369, 432)
// Mapping: element→band, modality→position
// Note: Interpretive synthesis (no canonical
// solfeggio-zodiac mapping exists)
// ══════════════���════════════════════════

interface FrequencyData {
  hz: number;
  keyword: string;
  keywordPt: string;
  description: string;
}

const FREQUENCIES: Record<Sign, FrequencyData> = {
  Aries: {
    hz: 396,
    keyword: 'Courage',
    keywordPt: 'Coragem',
    description: 'A frequência que liberta do medo. 396 Hz dissolve bloqueios e acende a centelha da vontade — a ignição primordial de quem nasce para agir.',
  },
  Taurus: {
    hz: 174,
    keyword: 'Foundation',
    keywordPt: 'Fundação',
    description: 'A frequência mais terrena. 174 Hz ancora o corpo e o espírito na matéria, criando o senso de segurança que permite a beleza florescer.',
  },
  Gemini: {
    hz: 741,
    keyword: 'Expression',
    keywordPt: 'Expressão',
    description: 'A frequência da comunicação e clareza mental. 741 Hz purifica a expressão e desperta a intuição — a ponte entre pensamento e palavra.',
  },
  Cancer: {
    hz: 417,
    keyword: 'Renewal',
    keywordPt: 'Renovação',
    description: 'A frequência que facilita mudança. 417 Hz limpa padrões emocionais antigos e permite que as águas da alma se renovem — a maré que cura.',
  },
  Leo: {
    hz: 528,
    keyword: 'Radiance',
    keywordPt: 'Radiância',
    description: 'A frequência do amor e da transformação. 528 Hz — chamada de "frequência milagrosa" — ressoa com o coração criativo e a luz que irradia do centro.',
  },
  Virgo: {
    hz: 285,
    keyword: 'Restoration',
    keywordPt: 'Restauração',
    description: 'A frequência da cura precisa. 285 Hz restaura e refina no nível mais sutil — o ofício sagrado de quem discerne e corrige com mãos delicadas.',
  },
  Libra: {
    hz: 639,
    keyword: 'Harmony',
    keywordPt: 'Harmonia',
    description: 'A frequência da conexão e do equilíbrio. 639 Hz harmoniza relações e restaura o elo entre os seres — a balança que encontra o ponto justo.',
  },
  Scorpio: {
    hz: 432,
    keyword: 'Depth',
    keywordPt: 'Profundidade',
    description: 'A frequência da ressonância cósmica. 432 Hz — a afinação de Verdi, o "tom do universo" — vibra com a descida transformadora às profundezas onde o chumbo se faz ouro.',
  },
  Sagittarius: {
    hz: 963,
    keyword: 'Transcendence',
    keywordPt: 'Transcendência',
    description: 'A frequência mais elevada. 963 Hz conecta à consciência divina e universal — a flecha do arqueiro que busca o infinito além de todo horizonte.',
  },
  Capricorn: {
    hz: 369,
    keyword: 'Structure',
    keywordPt: 'Estrutura',
    description: 'A frequência de Tesla — "se você soubesse a magnificência do 3, 6 e 9." 369 Hz manifesta ordem a partir do caos, a disciplina que constrói montanhas.',
  },
  Aquarius: {
    hz: 852,
    keyword: 'Vision',
    keywordPt: 'Visão',
    description: 'A frequência do insight espiritual. 852 Hz desperta a visão interior que vê além das convenções — o olho que enxerga o futuro antes de ele existir.',
  },
  Pisces: {
    hz: 210,
    keyword: 'Dissolution',
    keywordPt: 'Dissolução',
    description: 'A frequência da dissolução compassiva. 210 Hz desfaz as fronteiras entre eu e outro, permitindo a cura empática — as águas que tudo abraçam.',
  },
};

export function getFrequency(sign: Sign): FrequencyResult {
  const data = FREQUENCIES[sign];
  return {
    hz: data.hz,
    keyword: data.keyword,
    keywordPt: data.keywordPt,
    description: data.description,
  };
}
