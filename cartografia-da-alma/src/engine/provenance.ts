import type { SoulMap } from '../types/soul-map';

// ═══════════════════════════════════════
// Provenance — cadeia de raciocínio por carta
// Cada carta expõe de onde veio cada conclusão.
// Confiança = origem rastreável.
// ═══════════════════════════════════════

export interface ProvenanceStep {
  from: string;       // sistema de origem (ex: "data de nascimento")
  to: string;         // conclusão derivada (ex: "Sol em Áries")
  rule: string;       // regra aplicada (ex: "21 Mar – 19 Abr → Áries")
}

export interface CardProvenance {
  cardId: string;
  title: string;
  steps: ProvenanceStep[];
  anchor: string;     // frase-âncora: síntese de uma linha
}

// ── Sign PT ──

const SIGN_PT: Record<string, string> = {
  Aries: 'Áries', Taurus: 'Touro', Gemini: 'Gêmeos', Cancer: 'Câncer',
  Leo: 'Leão', Virgo: 'Virgem', Libra: 'Libra', Scorpio: 'Escorpião',
  Sagittarius: 'Sagitário', Capricorn: 'Capricórnio', Aquarius: 'Aquário', Pisces: 'Peixes',
};

const ELEMENT_PT: Record<string, string> = {
  fire: 'Fogo', earth: 'Terra', air: 'Ar', water: 'Água',
};

const MODALITY_PT: Record<string, string> = {
  cardinal: 'Cardinal', fixed: 'Fixo', mutable: 'Mutável',
};

// ── Date ranges (same logic as astrology.ts) ──

const SIGN_RANGES: Record<string, string> = {
  Aries: '21 Mar – 19 Abr',
  Taurus: '20 Abr – 20 Mai',
  Gemini: '21 Mai – 20 Jun',
  Cancer: '21 Jun – 22 Jul',
  Leo: '23 Jul – 22 Ago',
  Virgo: '23 Ago – 22 Set',
  Libra: '23 Set – 22 Out',
  Scorpio: '23 Out – 21 Nov',
  Sagittarius: '22 Nov – 21 Dez',
  Capricorn: '22 Dez – 19 Jan',
  Aquarius: '20 Jan – 18 Fev',
  Pisces: '19 Fev – 20 Mar',
};

// ── Provenance per card ──

function astrologyProvenance(map: SoulMap): CardProvenance {
  const d = map.birthData.date;
  const dateStr = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  const signPt = SIGN_PT[map.sunSign] ?? map.sunSign;
  const elPt = ELEMENT_PT[map.element] ?? map.element;
  const modPt = MODALITY_PT[map.modality] ?? map.modality;

  const steps: ProvenanceStep[] = [
    {
      from: `data de nascimento: ${dateStr}`,
      to: `Sol em ${signPt}`,
      rule: `${SIGN_RANGES[map.sunSign] ?? '?'} → ${signPt}`,
    },
    {
      from: `signo: ${signPt}`,
      to: `elemento: ${elPt}`,
      rule: `${signPt} pertence ao triângulo de ${elPt}`,
    },
    {
      from: `signo: ${signPt}`,
      to: `modalidade: ${modPt}`,
      rule: `${signPt} opera como ${modPt}`,
    },
  ];

  if (map.ascendant) {
    const ascPt = SIGN_PT[map.ascendant.sign] ?? map.ascendant.sign;
    steps.push({
      from: map.birthData.time ? `hora: ${map.birthData.time}` : 'aproximação sem hora',
      to: `ascendente: ${ascPt}`,
      rule: map.ascendant.method === 'approximate'
        ? 'estimativa baseada em oposição solar'
        : 'cálculo por efeméride',
    });
  }

  return {
    cardId: 'astrology',
    title: 'Astrologia',
    steps,
    anchor: `${signPt} · ${elPt} ${modPt} — derivado da posição solar em ${dateStr}.`,
  };
}

function kabbalahProvenance(map: SoulMap): CardProvenance {
  const signPt = SIGN_PT[map.sunSign] ?? map.sunSign;
  const { sephirah } = map;

  const steps: ProvenanceStep[] = [
    {
      from: `signo: ${signPt}`,
      to: `sephirah: ${sephirah.name}`,
      rule: `mapeamento zodiacal → ${sephirah.name} (${sephirah.planet})`,
    },
    {
      from: `sephirah: ${sephirah.name}`,
      to: `planeta: ${sephirah.planet}`,
      rule: `${sephirah.name} é governada por ${sephirah.planet}`,
    },
    {
      from: `sephirah: ${sephirah.name}`,
      to: `expressão: ${sephirah.expression}`,
      rule: `${sephirah.planet} em ${sephirah.name} opera como ${sephirah.expression}`,
    },
  ];

  if (sephirah.paths?.length) {
    steps.push({
      from: `sephirah: ${sephirah.name}`,
      to: `caminhos: ${sephirah.paths.join(', ')}`,
      rule: 'conexões adjacentes na Árvore (Golden Dawn)',
    });
  }

  if (sephirah.tikkun) {
    steps.push({
      from: `sephirah: ${sephirah.name}`,
      to: `tikkun: ${sephirah.tikkun}`,
      rule: 'a correção específica deste nó na Árvore',
    });
  }

  return {
    cardId: 'kabbalah',
    title: 'Kabbalah',
    steps,
    anchor: `${sephirah.name} · ${sephirah.planet} — posição na Árvore derivada de ${signPt}.`,
  };
}

function shadowProvenance(map: SoulMap): CardProvenance {
  const signPt = SIGN_PT[map.sunSign] ?? map.sunSign;
  const { archetype, psyche } = map;
  const elPt = ELEMENT_PT[map.element] ?? map.element;

  const steps: ProvenanceStep[] = [
    {
      from: `signo: ${signPt}`,
      to: `arquétipo: ${archetype.titlePt}`,
      rule: `mapeamento zodiacal → ${archetype.name} (Jung)`,
    },
    {
      from: `arquétipo: ${archetype.titlePt}`,
      to: `sombra inflada: ${archetype.shadow.inflated}`,
      rule: `excesso do padrão ${archetype.name}`,
    },
    {
      from: `arquétipo: ${archetype.titlePt}`,
      to: `sombra deflacionada: ${archetype.shadow.deflated}`,
      rule: `falta do padrão ${archetype.name}`,
    },
    {
      from: `elemento: ${elPt}`,
      to: `psique: id ${psyche.id}% · ego ${psyche.ego}% · superego ${psyche.superego}%`,
      rule: `distribuição freudiana derivada do elemento ${elPt}`,
    },
  ];

  return {
    cardId: 'shadow',
    title: 'A Sombra',
    steps,
    anchor: `${archetype.titlePt} — sombra e psique derivadas de ${signPt} (${elPt}).`,
  };
}

function frequencyProvenance(map: SoulMap): CardProvenance {
  const signPt = SIGN_PT[map.sunSign] ?? map.sunSign;
  const { frequency } = map;

  const steps: ProvenanceStep[] = [
    {
      from: `signo: ${signPt}`,
      to: `frequência: ${frequency.hz} Hz`,
      rule: `mapeamento zodiacal → escala Solfeggio (${frequency.hz} Hz)`,
    },
    {
      from: `${frequency.hz} Hz`,
      to: `campo: ${frequency.keywordPt}`,
      rule: `${frequency.hz} Hz corresponde a ${frequency.keyword} na escala Solfeggio`,
    },
  ];

  return {
    cardId: 'frequency',
    title: 'Frequência',
    steps,
    anchor: `${frequency.hz} Hz · ${frequency.keywordPt} — frequência derivada de ${signPt}.`,
  };
}

function numerologyProvenance(map: SoulMap): CardProvenance {
  const { numerology, birthData } = map;

  const steps: ProvenanceStep[] = [
    {
      from: `nome: ${birthData.name}`,
      to: `número de expressão: ${numerology.number}`,
      rule: `redução pitagórica das letras do nome → ${numerology.number}${numerology.isMasterNumber ? ' (número mestre)' : ''}`,
    },
    {
      from: `número: ${numerology.number}`,
      to: `arquétipo numérico: ${numerology.namePt}`,
      rule: `${numerology.number} → ${numerology.name} na numerologia pitagórica`,
    },
  ];

  return {
    cardId: 'numerology',
    title: 'Numerologia',
    steps,
    anchor: `Número ${numerology.number} · ${numerology.namePt} — derivado do nome "${birthData.name}".`,
  };
}

// ── Public API ──

const PROVENANCE_BUILDERS: Record<string, (map: SoulMap) => CardProvenance> = {
  astrology: astrologyProvenance,
  kabbalah: kabbalahProvenance,
  shadow: shadowProvenance,
  frequency: frequencyProvenance,
  numerology: numerologyProvenance,
};

export function getCardProvenance(cardId: string, soulMap: SoulMap): CardProvenance | null {
  const builder = PROVENANCE_BUILDERS[cardId];
  return builder ? builder(soulMap) : null;
}

export function getAllProvenance(soulMap: SoulMap): CardProvenance[] {
  return Object.keys(PROVENANCE_BUILDERS).map(id => PROVENANCE_BUILDERS[id](soulMap));
}

export function getMapSeal(soulMap: SoulMap): string {
  const signPt = SIGN_PT[soulMap.sunSign] ?? soulMap.sunSign;
  const { sephirah, archetype, frequency, numerology } = soulMap;
  return `${signPt} · ${sephirah.name} · ${archetype.titlePt} · ${frequency.hz} Hz · ${numerology.number} — cada conclusão rastreável até a origem.`;
}
