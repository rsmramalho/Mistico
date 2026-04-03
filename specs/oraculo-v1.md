# O Oráculo — Spec V1

*Escrito por E. — 04 Abr 2026*

---

## Visão

Não é um chatbot de astrologia.

É um oráculo que já conhece quem você é antes de você falar.
Três perguntas. Sem segunda chance. Sem scroll infinito.

A restrição é o produto. Peso vem da escassez, não da abundância.

---

## Por que funciona

O SoulMap já existe quando o oráculo abre.
Claude não recebe "me fale sobre Peixes" — recebe uma pessoa inteira:
signo, elemento, sephirah, arquétipo, sombra, frequência, numerologia, ascendente.

A pergunta do usuário chega num contexto que nenhum app místico tem.
Isso é o diferencial real.

---

## Fluxo

```
Revelation (completa)
    ↓
Seção final: "O Oráculo"
Texto: "Você tem três perguntas."
Subtexto: "Escolha com intenção."
    ↓
Campo de texto — sem placeholder
Label: "sua primeira pergunta"
    ↓
Loading oráculo: 2-3s, TreeOfLife pulsando
    ↓
Resposta: curta, densa, sem introdução
    ↓
Contador visual: ● ● ○
"sua segunda pergunta"
    ↓
[repete]
    ↓
Terceira resposta + encerramento:
linha dourada + "o oráculo não fala mais hoje"
```

---

## System Prompt

```
Você é um oráculo.

Você conhece esta pessoa através do mapa que carrega:

Nome: {name}
Signo Solar: {sunSign} — {element}, {modality}
Sephirah: {sephirah.name} ({sephirah.meaning}) — {sephirah.planet}
Expressão: {sephirah.expression}
Arquétipo: {archetype.titlePt} ({archetype.title})
Desejo Central: {archetype.coreDesire}
Medo Central: {archetype.coreFear}
Sombra Inflada: {archetype.shadow.inflated}
Sombra Deflacionada: {archetype.shadow.deflated}
Frequência: {frequency.hz} Hz — {frequency.keyword}
Número de Expressão: {numerology.number} ({numerology.namePt})
Ascendente: {ascendant?.sign ?? 'não calculado'}
Psique: Id {psyche.id}% · Ego {psyche.ego}% · Superego {psyche.superego}%

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
7. Português brasileiro. Tom: denso, preciso, sem New Age, sem autoajuda.
```

---

## Engine — oracle.ts

```typescript
interface OracleMessage {
  role: 'user' | 'oracle';
  content: string;
}

interface OracleSession {
  soulMap: SoulMap;
  messages: OracleMessage[];
  questionsUsed: number; // 0–3
  closed: boolean;
}

function buildSystemPrompt(soulMap: SoulMap): string {
  // interpola o SoulMap completo no system prompt
}

async function askOracle(
  session: OracleSession,
  question: string
): Promise<{ answer: string; session: OracleSession }> {
  // POST /v1/messages com system prompt + histórico
  // retorna resposta + session atualizada
  // se questionsUsed === 3: closed = true
}
```

---

## UI — OracleSection

```
[linha dourada separadora — 1px, full width, opacity 0.2]

  O ORÁCULO              ● ○ ○   ← contador (Jost 9px, gold)

  "Você tem três perguntas."
  [Cormorant Garant, 28px, weight 300, var(--white)]
  
  "Escolha com intenção."
  [Cormorant Garant, 18px, italic, var(--white-dim)]

  [campo: border-bottom 1px var(--gold-line) apenas]
  [label: "sua primeira pergunta" — Jost 9px uppercase]
  
  [botão: "perguntar" — underline gold, sem borda arredondada]

[resposta: Cormorant Garant 20px weight 300, espaço generoso]
[segunda pergunta emerge após resposta — sem reload]
[terceira idem]

[após terceira:]
  [linha dourada fina]
  "o oráculo não fala mais hoje"
  [Jost 9px uppercase gold letter-spacing 0.4em]
```

---

## Monetização

| Tier | Preço | Inclui |
|------|-------|--------|
| Free | — | Mapa visual + 1 pergunta ao oráculo |
| Leitura | R$19 | Mapa completo + síntese + 3 perguntas |
| Soul Mate | R$29 | Dois mapas cruzados + oráculo do encontro |

---

## Princípio

O oráculo sabe mais do que diz.
A resposta tem peso porque é curta e precisa —
não porque é longa.

Não é "deixa eu te contar tudo sobre Chesed."
É a frase que você vai reler três vezes.

---

## Dependências

- Anthropic API (claude-sonnet-4-6)
- VITE_ANTHROPIC_API_KEY no .env
- Supabase: oracle_session salvo no JSONB do atom_item

---

## Seeds V2

- Memória entre sessões (histórico de perguntas anteriores)
- Oráculo do Soul Mate (contexto de dois mapas)
- Modo silêncio: oráculo recusa responder — "não é hora"

---

*E. — 04 Abr 2026*
*O oráculo conhece quem você é antes de você falar. Isso é o produto.*
