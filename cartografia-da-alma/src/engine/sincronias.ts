// ═══════════════════════════════════════
// Sincronias — Agregador Principal
// Combina todas as linhas do tempo
// Calcula nível de convergência
// ═══════════════════════════════════════

import type { SoulMap } from '../types/soul-map';
import { getSincroniaNumerologica, type SincroniaNumeriologica } from './sincronias-numerologia';
import { getSincroniaKabbalistica, getCicloLunar, type SincroniaKabbalistica, type CicloLunar } from './sincronias-kabbalah';

// ── Interface de output principal ──

export interface Sincronia {
  timestamp: Date;

  // Linhas individuais
  numerologia: SincroniaNumeriologica;
  kabbalah: SincroniaKabbalistica;
  lunar: CicloLunar;

  // Análise de convergência
  nivel: 1 | 2 | 3;                    // 1=dia comum, 2=convergência, 3=sincronia rara
  convergencias: string[];             // padrões que coincidem entre sistemas
  raro: boolean;                        // true se nivel === 3

  // Texto principal (sem Claude — local)
  titulo: string;
  resumo: string;
  orientacao: string;                  // o que fazer com este momento

  // Metadados
  proximaSincroniaRara?: string;       // descrição da próxima data notável
}

// ── Detectar convergências entre sistemas ──

function detectarConvergencias(
  num: SincroniaNumeriologica,
  kab: SincroniaKabbalistica,
  lunar: CicloLunar,
): string[] {
  const convergencias: string[] = [];

  // Numerologia + Lua Nova = início amplificado
  if (num.diaPessoal.numero === 1 && lunar.fase === 'nova') {
    convergencias.push('início duplo — Dia 1 pessoal + Lua Nova');
  }

  // Numerologia + Lua Cheia = conclusão amplificada
  if (num.diaPessoal.numero === 9 && lunar.fase === 'cheia') {
    convergencias.push('encerramento duplo — Dia 9 pessoal + Lua Cheia');
  }

  // Kabbalah no nascimento/cúpula + Lua Nova
  if (['nascimento', 'cúpula'].includes(kab.fase) && lunar.fase === 'nova') {
    convergencias.push(`marco kabbalístico (${kab.fase} de ${kab.sephirahNatal}) + Lua Nova`);
  }

  // Tripla convergência numerológica
  if (num.diaPessoal.numero === num.mesPessoal.numero && num.mesPessoal.numero === num.anoPessoal.numero) {
    convergencias.push(`tripla convergência numerológica — tudo em ${num.diaPessoal.numero}`);
  }

  // Dia pessoal = número da sephirah natal
  const sephirahNumeros: Record<string, number> = {
    Kether: 1, Chokmah: 2, Binah: 3, Chesed: 4,
    Geburah: 5, Tiphareth: 6, Netzach: 7, Hod: 8,
    Yesod: 9, Malkuth: 10,
  };
  const numSephirah = sephirahNumeros[kab.sephirahNatal];
  if (numSephirah && num.diaPessoal.numero === (numSephirah > 9 ? 1 : numSephirah)) {
    convergencias.push(`Dia Pessoal ressoa com ${kab.sephirahNatal} (número ${numSephirah})`);
  }

  // Kabbalah + Numerologia ambos em fase intensa
  if (kab.intensidade === 3 && num.diaPessoal.intensidade === 3) {
    convergencias.push('dois sistemas em pico simultâneo');
  }

  return convergencias;
}

// ── Calcular nível ──

function calcularNivel(
  num: SincroniaNumeriologica,
  kab: SincroniaKabbalistica,
  lunar: CicloLunar,
  convergencias: string[],
): 1 | 2 | 3 {
  // Nível 3: múltiplas convergências ou eventos raros em 2+ sistemas
  if (convergencias.length >= 2) return 3;
  if (num.raro && kab.intensidade === 3) return 3;
  if (num.raro && lunar.intensidade === 3) return 3;

  // Nível 2: uma convergência ou evento raro em 1 sistema
  if (convergencias.length === 1) return 2;
  if (num.diaPessoal.intensidade === 3) return 2;
  if (kab.intensidade === 3) return 2;
  if (lunar.intensidade === 3) return 2;

  return 1;
}

// ── Gerar texto local (sem Claude) ──

function gerarTextoLocal(
  nivel: 1 | 2 | 3,
  convergencias: string[],
  num: SincroniaNumeriologica,
  kab: SincroniaKabbalistica,
  lunar: CicloLunar,
): { titulo: string; resumo: string; orientacao: string } {
  if (nivel === 3 && convergencias.length > 0) {
    return {
      titulo: 'Sincronia Rara',
      resumo: `${convergencias[0].charAt(0).toUpperCase() + convergencias[0].slice(1)}. ${num.textoResumo}`,
      orientacao: 'Este momento tem peso incomum. O que você registrar aqui tem significado além do cotidiano.',
    };
  }

  if (nivel === 2) {
    return {
      titulo: 'Convergência',
      resumo: `${num.textoResumo} ${kab.fase === 'nascimento' || kab.fase === 'cúpula' ? kab.textoResumo : ''}`.trim(),
      orientacao: `${num.diaPessoal.energiaDoDia}`,
    };
  }

  // Nível 1 — texto simples do dia
  const faseLunarTexto = {
    nova: 'intenção',
    crescente: 'construção',
    cheia: 'colheita',
    minguante: 'integração',
  }[lunar.fase];

  return {
    titulo: num.diaPessoal.nome,
    resumo: `${num.diaPessoal.tema} Lua em ${faseLunarTexto}.`,
    orientacao: num.diaPessoal.energiaDoDia,
  };
}

// ── Função principal ──

export function getSincronia(
  soulMap: SoulMap,
  currentDate: Date = new Date(),
): Sincronia {
  const numerologia = getSincroniaNumerologica(
    soulMap.birthData.date,
    soulMap.numerology.number,
    currentDate,
  );

  const kabbalah = getSincroniaKabbalistica(
    soulMap.birthData.date,
    soulMap.sephirah.name,
    currentDate,
  );

  const lunar = getCicloLunar(currentDate);

  const convergencias = detectarConvergencias(numerologia, kabbalah, lunar);
  const nivel = calcularNivel(numerologia, kabbalah, lunar, convergencias);
  const raro = nivel === 3;
  const { titulo, resumo, orientacao } = gerarTextoLocal(nivel, convergencias, numerologia, kabbalah, lunar);

  return {
    timestamp: currentDate,
    numerologia,
    kabbalah,
    lunar,
    nivel,
    convergencias,
    raro,
    titulo,
    resumo,
    orientacao,
  };
}

// Re-exports
export type { SincroniaNumeriologica, SincroniaKabbalistica, CicloLunar };
