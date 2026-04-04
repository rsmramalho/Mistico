// ═══════════════════════════════════════
// Cartografia da Alma — A Carta
// Vercel Function: /api/carta
// Returns complete letter as JSON
// Client handles word-by-word reveal
// ═══════════════════════════════════════

import type { VercelRequest, VercelResponse } from '@vercel/node';

interface SoulMapPayload {
  birthData: { name: string };
  sunSign: string;
  element: string;
  modality: string;
  sephirah: { name: string; meaning: string; planet: string; description: string; number: number; expression: string };
  archetype: { titlePt: string; title: string; description: string; coreDesire: string; coreFear: string; shadow: { inflated: string; deflated: string } };
  psyche: { id: number; ego: number; superego: number; signature: string };
  frequency: { hz: number; keyword: string; description: string };
  numerology: { number: number; namePt: string; description: string; traits: string; shadow: string };
  ascendant?: { sign: string } | null;
}

interface BridgePayload {
  systemA: string;
  systemB: string;
  resonance: string;
}

function buildPrompt(s: SoulMapPayload, synthesis: string, bridges?: BridgePayload[]): string {
  const bridgeBlock = bridges?.length
    ? `\nCONEXÕES ESPECÍFICAS DESTA PESSOA (use-as — não mencione sistemas pelo nome, deixe a conexão emergir no texto):
${bridges.map(b => `${b.systemA} × ${b.systemB}: ${b.resonance}`).join('\n')}\n`
    : '';

  return `Você é um cartógrafo da alma.

Você recebeu o mapa completo de ${s.birthData.name}. Escreva uma carta diretamente para ela.

O MAPA:
Nome: ${s.birthData.name}
Signo Solar: ${s.sunSign} — ${s.element}, ${s.modality}
Sephirah: ${s.sephirah.name} (${s.sephirah.meaning}) — planeta ${s.sephirah.planet}
${s.sephirah.description}
Arquétipo: ${s.archetype.titlePt} (${s.archetype.title})
${s.archetype.description}
Desejo Central: ${s.archetype.coreDesire}
Medo Central: ${s.archetype.coreFear}
Sombra Inflada (excesso): ${s.archetype.shadow.inflated}
Sombra Deflacionada (falta): ${s.archetype.shadow.deflated}
Frequência: ${s.frequency.hz} Hz — ${s.frequency.keyword}
${s.frequency.description}
Número de Expressão: ${s.numerology.number} (${s.numerology.namePt})
${s.numerology.description}
Traços: ${s.numerology.traits}
Sombra Numerológica: ${s.numerology.shadow}
Ascendente: ${s.ascendant?.sign ?? 'não calculado'}
Estrutura Psíquica: Id ${s.psyche.id}% · Ego ${s.psyche.ego}% · Superego ${s.psyche.superego}%
${s.psyche.signature}
Síntese: ${synthesis}
${bridgeBlock}
REGRAS DA CARTA:
1. Segunda pessoa. Começa direto — sem "Olá", sem nome, sem introdução.
2. Começa com o padrão mais forte desta pessoa — não com o signo. O signo é contexto, não abertura.
3. Sem títulos. Sem seções. Sem listas. Sem asteriscos. Prosa fluida.
4. A sombra tem peso real. A versão inflada do arquétipo destrói — nomeie com precisão, não com suavização.
5. Frequência e numerologia aparecem entrelaçadas, não separadas.
6. Se há conexões específicas, use-as para criar frases que só existem para esta combinação.
7. 500-700 palavras. Parágrafos curtos — máximo 4 frases cada.
8. O último parágrafo não conclui. Uma frase que abre, não fecha.
9. Português brasileiro. Sem "jornada", "despertar", "vibração", "universo conspira".
10. Denso mas respirável. Cada frase ganha o espaço que ocupa.
11. Esta carta é para ${s.birthData.name} especificamente — não é descrição genérica de ${s.sunSign}.`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'not configured' });

  const { soulMap, synthesis, bridges } = req.body as {
    soulMap: SoulMapPayload;
    synthesis: string;
    bridges?: BridgePayload[];
  };
  if (!soulMap) return res.status(400).json({ error: 'soulMap required' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1200,
        messages: [{ role: 'user', content: buildPrompt(soulMap, synthesis, bridges) }],
      }),
    });

    const data = await response.json() as { content?: Array<{ type: string; text?: string }>; error?: unknown };
    if (!response.ok) return res.status(response.status).json({ upstream_error: data });
    const carta = data.content?.find(b => b.type === 'text')?.text ?? '';
    return res.status(200).json({ carta });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Carta error:', msg);
    return res.status(500).json({ error: msg, has_key: !!process.env.ANTHROPIC_API_KEY });
  }
}
