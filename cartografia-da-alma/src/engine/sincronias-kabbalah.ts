// ═══════════════════════════════════════
// Sincronias — Motor Kabbalístico
// Ciclos das Sephiroth por período planetário
// Baseado na sephirah natal + posição aproximada dos planetas
// Zero dependências externas
// ═══════════════════════════════════════
//
// COMO FUNCIONA:
// Cada sephirah é governada por um planeta.
// Cada planeta tem um ciclo orbital aproximado.
// A partir da data de nascimento, calculamos em qual fase
// do ciclo planetário a pessoa está agora.
// Isso determina qual sephirah está "ativa" — resonando
// com o momento atual.
//
// FONTE: tradição Golden Dawn, correspondências planetárias
// NOTA: estes são ciclos aproximados, não posições astronômicas precisas.
// Para precisão real: Swiss Ephemeris (Seeds V3)

import type { SephirahName } from '../types/soul-map';

// ── Ciclos orbitais aproximados (em dias) ──

const CICLOS_PLANETARIOS: Record<string, number> = {
  Moon:          29.5,    // Lua: 29.5 dias
  Mercury:       88,      // Mercúrio: 88 dias
  Venus:         225,     // Vênus: 225 dias
  Sun:           365.25,  // Sol: 1 ano
  Mars:          687,     // Marte: ~687 dias
  Jupiter:       4333,    // Júpiter: ~12 anos
  Saturn:        10759,   // Saturno: ~29.5 anos
  'Primum Mobile': 365.25, // Kether: ciclo solar
  Zodiac:        365.25,  // Chokmah: ciclo zodiacal
  Pluto:         90520,   // Plutão: ~248 anos
  Earth:         365.25,  // Malkuth: ciclo terrestre
};

// ── Sephirah → planeta ──

const SEPHIRAH_PLANETA: Record<SephirahName, string> = {
  Kether:    'Primum Mobile',
  Chokmah:   'Zodiac',
  Binah:     'Saturn',
  Chesed:    'Jupiter',
  Geburah:   'Mars',
  Tiphareth: 'Sun',
  Netzach:   'Venus',
  Hod:       'Mercury',
  Yesod:     'Moon',
  Malkuth:   'Earth',
  Daath:     'Pluto',
};

// ── Fases do ciclo (0-1) → fase nomeada ──

function getFaseCiclo(proporcao: number): {
  fase: string;
  descricao: string;
  intensidade: 1 | 2 | 3;
} {
  // 0.0 - 0.1: início (nascimento do ciclo)
  if (proporcao < 0.10) return {
    fase: 'nascimento',
    descricao: 'Início de um novo ciclo nesta sephirah. O que começa agora tem raiz.',
    intensidade: 3,
  };
  // 0.1 - 0.25: crescimento
  if (proporcao < 0.25) return {
    fase: 'crescimento',
    descricao: 'Período de construção. O que foi plantado ganha forma.',
    intensidade: 2,
  };
  // 0.25 - 0.45: expansão
  if (proporcao < 0.45) return {
    fase: 'expansão',
    descricao: 'Pico de expressão desta sephirah. O padrão está visível.',
    intensidade: 2,
  };
  // 0.45 - 0.55: cúpula (meio do ciclo)
  if (proporcao < 0.55) return {
    fase: 'cúpula',
    descricao: 'Meio do ciclo. O que foi construído está no auge.',
    intensidade: 3,
  };
  // 0.55 - 0.75: declinação
  if (proporcao < 0.75) return {
    fase: 'declinação',
    descricao: 'O ciclo começa a ceder. Integrar o que foi aprendido.',
    intensidade: 2,
  };
  // 0.75 - 0.90: recolhimento
  if (proporcao < 0.90) return {
    fase: 'recolhimento',
    descricao: 'Preparação para o próximo ciclo. Soltar o que não serve.',
    intensidade: 2,
  };
  // 0.90 - 1.0: encerramento
  return {
    fase: 'encerramento',
    descricao: 'Final de ciclo. O que precisa ser completado está urgente.',
    intensidade: 3,
  };
}

// ── Calcular posição no ciclo ──

function calcularPosicaoCiclo(
  birthDate: Date,
  currentDate: Date,
  cicloEmDias: number,
): number {
  const diasDesdeNascimento = Math.floor(
    (currentDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  // Posição no ciclo: 0-1
  return (diasDesdeNascimento % cicloEmDias) / cicloEmDias;
}

// ── Sephiroth adjacentes (da spec) ──

const CAMINHOS: Record<SephirahName, SephirahName[]> = {
  Kether:    ['Chokmah', 'Binah', 'Tiphareth'],
  Chokmah:   ['Kether', 'Binah', 'Chesed', 'Tiphareth'],
  Binah:     ['Kether', 'Chokmah', 'Geburah', 'Tiphareth'],
  Chesed:    ['Chokmah', 'Geburah', 'Tiphareth', 'Netzach'],
  Geburah:   ['Binah', 'Chesed', 'Tiphareth', 'Hod'],
  Tiphareth: ['Kether', 'Chesed', 'Geburah', 'Netzach', 'Hod', 'Yesod'],
  Netzach:   ['Chesed', 'Tiphareth', 'Hod', 'Yesod', 'Malkuth'],
  Hod:       ['Geburah', 'Tiphareth', 'Netzach', 'Yesod', 'Malkuth'],
  Yesod:     ['Tiphareth', 'Netzach', 'Hod', 'Malkuth'],
  Malkuth:   ['Netzach', 'Hod', 'Yesod'],
  Daath:     ['Kether', 'Chokmah', 'Binah'],
};

// ── Interface de output ──

export interface SincroniaKabbalistica {
  sephirahNatal: SephirahName;
  planeta: string;
  fase: string;
  descricao: string;
  intensidade: 1 | 2 | 3;
  proporcaoCiclo: number;     // 0-1, posição no ciclo
  diasRestantes: number;      // até o próximo início de ciclo
  caminhoAtivo: SephirahName; // sephirah adjacente mais ativa agora
  textoResumo: string;
}

// ── Função principal ──

export function getSincroniaKabbalistica(
  birthDate: Date,
  sephirahNatal: SephirahName,
  currentDate: Date = new Date(),
): SincroniaKabbalistica {
  const planeta = SEPHIRAH_PLANETA[sephirahNatal];
  const cicloEmDias = CICLOS_PLANETARIOS[planeta] ?? 365.25;

  const proporcao = calcularPosicaoCiclo(birthDate, currentDate, cicloEmDias);
  const { fase, descricao, intensidade } = getFaseCiclo(proporcao);

  const diasRestantes = Math.floor((1 - proporcao) * cicloEmDias);

  // Caminho ativo: a sephirah adjacente cujo planeta está numa fase mais intensa
  const caminhos = CAMINHOS[sephirahNatal];
  let caminhoAtivo = caminhos[0];
  let maiorIntensidade = 0;

  for (const vizinha of caminhos) {
    const planetaVizinha = SEPHIRAH_PLANETA[vizinha];
    const cicloVizinha = CICLOS_PLANETARIOS[planetaVizinha] ?? 365.25;
    const propVizinha = calcularPosicaoCiclo(birthDate, currentDate, cicloVizinha);
    const { intensidade: intVizinha } = getFaseCiclo(propVizinha);
    if (intVizinha > maiorIntensidade) {
      maiorIntensidade = intVizinha;
      caminhoAtivo = vizinha;
    }
  }

  // Texto resumo
  let textoResumo = '';
  if (intensidade === 3 && fase === 'nascimento') {
    textoResumo = `Novo ciclo de ${sephirahNatal} começa. O que você iniciar neste período tem raiz profunda.`;
  } else if (intensidade === 3 && fase === 'cúpula') {
    textoResumo = `${sephirahNatal} no auge do ciclo. O padrão de ${SEPHIRAH_PLANETA[sephirahNatal]} está mais visível agora.`;
  } else if (intensidade === 3 && fase === 'encerramento') {
    textoResumo = `Ciclo de ${sephirahNatal} fechando em ${diasRestantes} dias. O que precisa ser concluído está urgente.`;
  } else {
    textoResumo = `${fase.charAt(0).toUpperCase() + fase.slice(1)} do ciclo de ${sephirahNatal}. ${descricao}`;
  }

  return {
    sephirahNatal,
    planeta,
    fase,
    descricao,
    intensidade,
    proporcaoCiclo: proporcao,
    diasRestantes,
    caminhoAtivo,
    textoResumo,
  };
}

// ── Ciclo Lunar (linha própria — Yesod é a Lua mas todos têm ciclo lunar) ──
// A Lua afeta todo mundo, independente da sephirah natal

export interface CicloLunar {
  fase: 'nova' | 'crescente' | 'cheia' | 'minguante';
  diaNoFase: number;     // dia dentro desta fase
  descricao: string;
  intensidade: 1 | 2 | 3;
}

export function getCicloLunar(currentDate: Date): CicloLunar {
  // Lua nova de referência conhecida: 3 Jan 2022 (Julian Day)
  const luaNovRef = new Date('2022-01-03');
  const diasDesde = Math.floor(
    (currentDate.getTime() - luaNovRef.getTime()) / (1000 * 60 * 60 * 24)
  );

  const ciclo = 29.5;
  const posicao = ((diasDesde % ciclo) + ciclo) % ciclo; // 0-29.5

  if (posicao < 1.5) return {
    fase: 'nova', diaNoFase: Math.floor(posicao) + 1,
    descricao: 'Lua Nova — momento de intenção. O que você decide agora tem força de semente.',
    intensidade: 3,
  };
  if (posicao < 7.4) return {
    fase: 'crescente', diaNoFase: Math.floor(posicao - 1.5) + 1,
    descricao: 'Lua Crescente — momentum. Construir, iniciar, expandir.',
    intensidade: 2,
  };
  if (posicao < 15.5) return {
    fase: 'cheia', diaNoFase: Math.floor(posicao - 7.4) + 1,
    descricao: 'Lua Cheia — tudo está visível. Colher, compartilhar, concluir.',
    intensidade: posicao > 13.5 && posicao < 16 ? 3 : 2,
  };
  if (posicao < 22.1) return {
    fase: 'minguante', diaNoFase: Math.floor(posicao - 15.5) + 1,
    descricao: 'Lua Minguante — integração. Liberar, encerrar, descansar.',
    intensidade: 2,
  };
  return {
    fase: 'nova', diaNoFase: Math.floor(posicao - 22.1) + 1,
    descricao: 'Bálsamo lunar — silêncio antes do próximo ciclo.',
    intensidade: posicao > 28 ? 3 : 1,
  };
}
