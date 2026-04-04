// ═══════════════════════════════════════
// Cartografia da Alma — A Carta
// Vercel Function: /api/carta
// Streams a letter written directly to the person
// using their complete SoulMap as context
// ═══════════════════════════════════════

import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { SoulMap } from '../src/types/soul-map';

function buildCartaPrompt(soulMap: SoulMap, bridges: { synthesis: string }): string {
  const { birthData, sunSign, element, modality, sephirah, archetype, psyche, frequency, numerology, ascendant } = soulMap;

  return `Você é um cartógrafo da alma.

Você recebeu o mapa completo de ${birthData.name}. Escreva uma carta diretamente para ela.

O MAPA:
Nome: ${birthData.name}
Signo Solar: ${sunSign} — ${element}, ${modality}
Sephirah: ${sephirah.name} (${sephirah.meaning}) — planeta ${sephirah.planet}
${sephirah.description}
Arquétipo: ${archetype.titlePt} (${archetype.title})
${archetype.description}
Desejo Central: ${archetype.coreDesire}
Medo Central: ${archetype.coreFear}
Sombra Inflada (excesso): ${archetype.shadow.inflated}
Sombra Deflacionada (falta): ${archetype.shadow.deflated}
Frequência: ${frequency.hz} Hz — ${frequency.keyword}
${frequency.description}
Número de Expressão: ${numerology.number} (${numerology.namePt})
${numerology.description}
Traços: ${numerology.traits}
Sombra Numerológica: ${numerology.shadow}
Ascendente: ${ascendant?.sign ?? 'não calculado'}
Estrutura Psíquica: Id ${psyche.id}% · Ego ${psyche.ego}% · Superego ${psyche.superego}%
${psyche.signature}
Síntese dos sistemas: ${bridges.synthesis}

REGRAS DA CARTA:
1. Segunda pessoa. Começa direto — sem "Olá", sem nome, sem introdução.
2. Começa com o padrão mais forte desta pessoa específica — não com o signo. O signo é contexto, não abertura.
3. Sem títulos. Sem seções. Sem listas. Sem asteriscos. Prosa fluida.
4. A sombra tem peso real. A versão inflada do arquétipo destrói — nomeie isso com precisão, não com suavização.
5. Frequência e numerologia aparecem entrelaçadas no texto, não como parágrafos separados.
6. 500-700 palavras. Parágrafos curtos — máximo 4 frases por parágrafo.
7. O último parágrafo não conclui. Uma frase que abre, não fecha.
8. Português brasileiro. Sem "jornada", "despertar", "vibração", "universo conspira". Sem new age. Sem autoajuda.
9. Denso mas respirável. Cada frase ganha o espaço que ocupa.
10. A carta é para esta pessoa específica — não é descrição genérica de ${sunSign}.`;
}

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'not configured' });

  const { soulMap, bridges } = req.body as { soulMap: SoulMap; bridges: { synthesis: string } };
  if (!soulMap) return res.status(400).json({ error: 'soulMap required' });

  // Set up streaming response
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Accel-Buffering', 'no');

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        stream: true,
        messages: [
          {
            role: 'user',
            content: buildCartaPrompt(soulMap, bridges),
          },
        ],
      }),
    });

    if (!anthropicRes.ok || !anthropicRes.body) {
      return res.status(500).json({ error: 'upstream error' });
    }

    const reader = anthropicRes.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6);
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data) as {
            type: string;
            delta?: { type: string; text?: string };
          };
          if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
            res.write(parsed.delta.text);
          }
        } catch { /* skip malformed chunks */ }
      }
    }

    res.end();
  } catch (err) {
    console.error('Carta error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'carta unavailable' });
    } else {
      res.end();
    }
  }
}
