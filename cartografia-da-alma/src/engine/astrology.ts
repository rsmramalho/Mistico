import type { Sign, Element, Modality, SignData, AscendantResult } from '../types/soul-map';

// ═══════════════════════════════════════
// Zodiac Data — Tropical, Fixed Dates
// ═���══════════════��══════════════════════

export const SIGN_ORDER: Sign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

export const SIGNS: SignData[] = [
  {
    sign: 'Aries', element: 'fire', modality: 'cardinal', ruler: 'Mars',
    rulerMeaning: 'impulso, iniciativa, a força que age antes de calcular',
    rulerForSign: 'Marte em Áries é impulso puro — a ação que antecede o pensamento.',
    elementQuality: 'Fogo Cardinal — abre caminhos que não existiam',
    startMonth: 3, startDay: 21, endMonth: 4, endDay: 19,
  },
  {
    sign: 'Taurus', element: 'earth', modality: 'fixed', ruler: 'Venus',
    rulerMeaning: 'desejo, valor, o que vale a pena sustentar',
    rulerForSign: 'Vênus em Touro é prazer enraizado — o desejo que não tem pressa porque sabe que o que é seu não escapa.',
    elementQuality: 'Terra Fixa — o que planta, fica',
    startMonth: 4, startDay: 20, endMonth: 5, endDay: 20,
  },
  {
    sign: 'Gemini', element: 'air', modality: 'mutable', ruler: 'Mercury',
    rulerMeaning: 'linguagem, conexão, o pensamento que não para',
    rulerForSign: 'Mercúrio em Gêmeos é a mente em estado puro — traduz o mundo em palavras antes mesmo de sentir.',
    elementQuality: 'Ar Mutável — a mente que habita dois lugares ao mesmo tempo',
    startMonth: 5, startDay: 21, endMonth: 6, endDay: 20,
  },
  {
    sign: 'Cancer', element: 'water', modality: 'cardinal', ruler: 'Moon',
    rulerMeaning: 'emoção, memória, o campo que sustenta sem ser visto',
    rulerForSign: 'A Lua em Câncer é memória viva — o campo emocional opera antes de qualquer filtro racional.',
    elementQuality: 'Água Cardinal — sente antes de pensar, age pelo que sente',
    startMonth: 6, startDay: 21, endMonth: 7, endDay: 22,
  },
  {
    sign: 'Leo', element: 'fire', modality: 'fixed', ruler: 'Sun',
    rulerMeaning: 'identidade, centro, a luz que não precisa de reflexo',
    rulerForSign: 'O Sol em Leão é presença total — a identidade que não pede permissão para brilhar.',
    elementQuality: 'Fogo Fixo — o fogo que sustenta, não só inicia',
    startMonth: 7, startDay: 23, endMonth: 8, endDay: 22,
  },
  {
    sign: 'Virgo', element: 'earth', modality: 'mutable', ruler: 'Mercury',
    rulerMeaning: 'análise, serviço, o discernimento que não descansa',
    rulerForSign: 'Mercúrio em Virgem é precisão encarnada — a mente que separa o essencial do ruído sem hesitar.',
    elementQuality: 'Terra Mutável — adapta a estrutura sem perder a precisão',
    startMonth: 8, startDay: 23, endMonth: 9, endDay: 22,
  },
  {
    sign: 'Libra', element: 'air', modality: 'cardinal', ruler: 'Venus',
    rulerMeaning: 'relação, proporção, a beleza como necessidade',
    rulerForSign: 'Vênus em Libra é harmonia como instinto — busca o equilíbrio não por cálculo, mas porque o desequilíbrio dói.',
    elementQuality: 'Ar Cardinal — inicia pelo equilíbrio, não pela força',
    startMonth: 9, startDay: 23, endMonth: 10, endDay: 22,
  },
  {
    sign: 'Scorpio', element: 'water', modality: 'fixed', ruler: 'Mars',
    rulerMeaning: 'profundidade, transformação, o poder que opera por baixo',
    rulerForSign: 'Marte em Escorpião é força subterrânea — a ação que não se mostra, mas que transforma tudo o que toca.',
    elementQuality: 'Água Fixa — a emoção que não se move, que sustenta o peso',
    startMonth: 10, startDay: 23, endMonth: 11, endDay: 21,
  },
  {
    sign: 'Sagittarius', element: 'fire', modality: 'mutable', ruler: 'Jupiter',
    rulerMeaning: 'expansão, visão, a generosidade do horizonte',
    rulerForSign: 'Júpiter em Sagitário é fé em movimento — a expansão que não precisa de mapa porque confia no caminho.',
    elementQuality: 'Fogo Mutável — o fogo que busca, não que constrói',
    startMonth: 11, startDay: 22, endMonth: 12, endDay: 21,
  },
  {
    sign: 'Capricorn', element: 'earth', modality: 'cardinal', ruler: 'Saturn',
    rulerMeaning: 'estrutura, tempo, o que é construído para durar',
    rulerForSign: 'Saturno em Capricórnio é tempo como aliado — a disciplina que não castiga, mas que constrói o que ninguém derruba.',
    elementQuality: 'Terra Cardinal — inicia pela estrutura, pela lei',
    startMonth: 12, startDay: 22, endMonth: 1, endDay: 19,
  },
  {
    sign: 'Aquarius', element: 'air', modality: 'fixed', ruler: 'Saturn',
    rulerMeaning: 'lei coletiva, visão sistêmica, o futuro como vocação',
    rulerForSign: 'Saturno em Aquário é estrutura a serviço da visão — a lei que não prende, mas que organiza o futuro.',
    elementQuality: 'Ar Fixo — a ideia que não cede, que sustenta a visão',
    startMonth: 1, startDay: 20, endMonth: 2, endDay: 18,
  },
  {
    sign: 'Pisces', element: 'water', modality: 'mutable', ruler: 'Jupiter',
    rulerMeaning: 'compaixão, dissolução, o amor sem fronteira',
    rulerForSign: 'Júpiter em Peixes é expansão sem contorno — a generosidade que dissolve limites e sente tudo como próprio.',
    elementQuality: 'Água Mutável — a emoção que flui para tudo, sem distinção',
    startMonth: 2, startDay: 19, endMonth: 3, endDay: 20,
  },
];

// ── Sun Sign ──

export function getSunSign(month: number, day: number): Sign {
  for (const s of SIGNS) {
    if (s.startMonth <= s.endMonth) {
      // Normal range (e.g., Aries: Mar 21 – Apr 19)
      if (
        (month === s.startMonth && day >= s.startDay) ||
        (month === s.endMonth && day <= s.endDay) ||
        (month > s.startMonth && month < s.endMonth)
      ) {
        return s.sign;
      }
    } else {
      // Wrapping range (Capricorn: Dec 22 – Jan 19)
      if (
        (month === s.startMonth && day >= s.startDay) ||
        (month === s.endMonth && day <= s.endDay) ||
        (month > s.startMonth || month < s.endMonth)
      ) {
        return s.sign;
      }
    }
  }
  return 'Capricorn'; // fallback: early January
}

// ── Sign Data ──

export function getSignData(sign: Sign): SignData {
  return SIGNS.find(s => s.sign === sign)!;
}

export function getElement(sign: Sign): Element {
  return getSignData(sign).element;
}

export function getModality(sign: Sign): Modality {
  return getSignData(sign).modality;
}

export function getRuler(sign: Sign): string {
  return getSignData(sign).ruler;
}

// ── Approximate Ascendant ──

export function getApproximateAscendant(
  sunSign: Sign,
  time?: string
): AscendantResult | null {
  if (!time) return null;

  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (isNaN(hour) || isNaN(minute)) return null;

  const sunSignIndex = SIGN_ORDER.indexOf(sunSign);
  const birthTimeDecimal = hour + minute / 60;

  // Assume sunrise at ~06:00 local
  const hoursSinceSunrise = birthTimeDecimal - 6;

  // Each sign rises for ~2 hours
  let signOffset = Math.floor(hoursSinceSunrise / 2);
  signOffset = ((signOffset % 12) + 12) % 12;

  const ascendantIndex = (sunSignIndex + signOffset) % 12;

  return {
    sign: SIGN_ORDER[ascendantIndex],
    method: 'approximate',
  };
}
