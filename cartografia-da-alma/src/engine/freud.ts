import type { Element, PsycheDistribution } from '../types/soul-map';

// ══��════════════════════════════════════
// Freud — Psyche Distribution (Id/Ego/Superego)
// Mapped by astrological element
// Note: Interpretive mapping (Freud did not
// work with astrology)
// ═══════════════���═══════════════════════

interface PsycheData {
  id: number;
  ego: number;
  superego: number;
  signature: string;
}

const DISTRIBUTIONS: Record<Element, PsycheData> = {
  fire: {
    id: 55,
    ego: 30,
    superego: 15,
    signature: 'O Impulso Instintivo — o fogo age antes de refletir, movido pelo desejo primordial e pela vontade de existir.',
  },
  earth: {
    id: 20,
    ego: 40,
    superego: 40,
    signature: 'O Eu Estruturado — a terra equilibra realidade e dever, construindo a ponte entre o que se deseja e o que se deve.',
  },
  air: {
    id: 15,
    ego: 55,
    superego: 30,
    signature: 'A Mente Mediadora — o ar racionaliza, comunica e negocia entre forças internas, buscando equilíbrio pelo pensamento.',
  },
  water: {
    id: 40,
    ego: 25,
    superego: 35,
    signature: 'As Profundezas do Inconsciente — a água acessa diretamente o que está submerso, onde impulso e moralidade operam nas trevas.',
  },
};

export function getPsycheDistribution(element: Element): PsycheDistribution {
  const data = DISTRIBUTIONS[element];
  return {
    id: data.id,
    ego: data.ego,
    superego: data.superego,
    signature: data.signature,
  };
}
