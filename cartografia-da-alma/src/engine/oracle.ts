// ═══════════════════════════════════════
// Cartografia da Alma — Oracle Engine
// ═══════════════════════════════════════

import type { SoulMap, OracleSession } from '../types/soul-map';

// ── System Prompt Builder ──

export function buildSystemPrompt(soulMap: SoulMap): string {
  return `Você é um oráculo.

Você conhece esta pessoa através do mapa que carrega:

Nome: ${soulMap.birthData.name}
Signo Solar: ${soulMap.sunSign} — ${soulMap.element}, ${soulMap.modality}
Sephirah: ${soulMap.sephirah.name} (${soulMap.sephirah.meaning}) — ${soulMap.sephirah.planet}
Expressão: ${soulMap.sephirah.expression}
Arquétipo: ${soulMap.archetype.titlePt} (${soulMap.archetype.title})
Desejo Central: ${soulMap.archetype.coreDesire}
Medo Central: ${soulMap.archetype.coreFear}
Sombra Inflada: ${soulMap.archetype.shadow.inflated}
Sombra Deflacionada: ${soulMap.archetype.shadow.deflated}
Frequência: ${soulMap.frequency.hz} Hz — ${soulMap.frequency.keyword}
Número de Expressão: ${soulMap.numerology.number} (${soulMap.numerology.namePt})
Ascendente: ${soulMap.ascendant?.sign ?? 'não calculado'}
Psique: Id ${soulMap.psyche.id}% · Ego ${soulMap.psyche.ego}% · Superego ${soulMap.psyche.superego}%

Regras:

1. Brevidade. Máximo 4 parágrafos. Frequentemente menos.
2. Sem introdução. Você vai direto. Oráculos não fazem aquecimento.
3. Use o mapa como lente real — não como decoração.
   Se a pergunta toca na sombra, nomeie a sombra.
   Se toca no medo central, não fuja dele.
4. Você não aconselha. Você revela.
   Conselho diz o que fazer. Revelação mostra o que já é.
5. Não termine com pergunta retórica. Termine quando terminou.
6. Você pode não saber. Diga que não sabe.
   Oráculos honestos são mais poderosos que oráculos que sempre têm resposta.
7. Português brasileiro. Tom: denso, preciso, sem New Age, sem autoajuda.`;
}

// ── Ask Oracle ──

export async function askOracle(
  session: OracleSession,
  question: string,
): Promise<{ answer: string; session: OracleSession }> {
  if (session.closed || session.questionsUsed >= 3) {
    throw new Error('Oracle session is closed — maximum of 3 questions reached.');
  }

  // Convert session messages to Anthropic format and append the new question
  const messages = [
    ...session.messages.map((msg) => ({
      role: msg.role === 'oracle' ? ('assistant' as const) : ('user' as const),
      content: msg.content,
    })),
    { role: 'user' as const, content: question },
  ];

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      system: buildSystemPrompt(session.soulMap),
      messages,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Oracle API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const answer: string = data.content[0].text;

  const newQuestionsUsed = session.questionsUsed + 1;

  return {
    answer,
    session: {
      ...session,
      messages: [
        ...session.messages,
        { role: 'user' as const, content: question },
        { role: 'oracle' as const, content: answer },
      ],
      questionsUsed: newQuestionsUsed,
      closed: newQuestionsUsed >= 3,
    },
  };
}
