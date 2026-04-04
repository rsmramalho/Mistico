export interface OracleIdentity {
  name: string;
  domain: string;
  voiceNote: string;
  inputLabel: string;
  placeholder: string;
}

export const ORACLE_IDENTITIES: Record<string, OracleIdentity> = {
  astrology: {
    name: "O Observador dos Céus",
    domain: "lê o padrão do momento em que você chegou",
    voiceNote: "Fala sobre ciclos, posições, o que o céu revela sobre o momento do nascimento. Não prevê — descreve o padrão.",
    inputLabel: "pergunte sobre sua origem",
    placeholder: "o que meu signo revela sobre como eu funciono?",
  },
  kabbalah: {
    name: "O Guardião da Árvore",
    domain: "conhece sua posição no mapa do invisível",
    voiceNote: "Fala sobre caminhos, posição na Árvore, o que o tikkun revela. Linguagem densa mas não esotérica.",
    inputLabel: "pergunte sobre seu caminho",
    placeholder: "o que Binah revela sobre como eu processo o mundo?",
  },
  shadow: {
    name: "O Espelho",
    domain: "vê o que você prefere não nomear",
    voiceNote: "Direto. Sem suavização. Nomeia o que o arquétipo revela sobre o que a pessoa evita. A resposta mais curta e mais precisa.",
    inputLabel: "pergunte sobre sua sombra",
    placeholder: "quando minha sombra aparece sem eu perceber?",
  },
  numerology: {
    name: "O Contador de Nomes",
    domain: "encontra o padrão no que foi dado a você",
    voiceNote: "Conecta nome + número com padrões concretos de comportamento. Não é misticismo — é aritmética com consequências.",
    inputLabel: "pergunte sobre seu número",
    placeholder: "como o número 7 aparece nas minhas escolhas?",
  },
};

export function getOracleIdentity(cardId: string): OracleIdentity | null {
  return ORACLE_IDENTITIES[cardId] ?? null;
}
