# Research — Soul Mate (Fase 4)
## Cartografia da Alma · GUARDIÃO

**Data:** 04 Abr 2026
**Fase:** GUARDIÃO — Research & Validação
**Status:** Completo

---

## 1. O QUE O CRUZAMENTO REVELA

Soul Mate não é compatibilidade. Não é score. Não é "vocês combinam 87%."

O cruzamento revela **o espaço entre duas cartografias** — o que emerge quando dois mapas se sobrepõem. Três camadas, cada uma com tradição documentada:

### Camada 1: O Espelho (Jung — Projeção)
O que cada pessoa vê no outro é frequentemente o que não integrou em si. O arquétipo de A encontra a sombra de B. A sombra inflada de A encontra o medo central de B. Isso não é defeito — é o mecanismo pelo qual relações catalisam individuação.

> "Tudo o que nos irrita nos outros pode nos levar a um entendimento de nós mesmos."
> — Jung, *Memories, Dreams, Reflections*

### Camada 2: O Complemento (Sinastria Elemental)
Elementos não são "compatíveis" ou "incompatíveis" — eles têm dinâmicas. Fogo+Ar = amplificação (ativo+ativo). Terra+Água = nutrição (receptivo+receptivo). Fogo+Água = tensão transformadora (vapor). Terra+Ar = tensão criativa (erosão que esculpe).

### Camada 3: O Tikkun (Kabbalah — Correção)
Duas almas se encontram para realizar juntas uma correção que nenhuma consegue sozinha. O tikkun não é sobre harmonia — é sobre o trabalho que o encontro exige. A distância entre duas Sephiroth na Árvore da Vida indica o caminho que o encontro percorre.

---

## 2. MOTOR DE CRUZAMENTO

### 2.1 Dinâmica Elemental

| Combinação | Dinâmica | Nome | Natureza |
|------------|----------|------|----------|
| Fogo + Fogo | Combustão — intensidade máxima, risco de consumir | **Chama Dupla** | Amplificação |
| Terra + Terra | Fundação — estabilidade profunda, risco de estagnação | **Rocha Viva** | Sustentação |
| Ar + Ar | Corrente — comunicação fluida, risco de nunca pousar | **Vento Cruzado** | Movimento |
| Água + Água | Oceano — empatia total, risco de dissolução de fronteiras | **Maré Dupla** | Fusão |
| Fogo + Ar | Atiçar — ar alimenta fogo, expansão mútua | **Fole e Chama** | Catálise ativa |
| Terra + Água | Nutrir — água faz terra fértil, crescimento orgânico | **Jardim** | Catálise receptiva |
| Fogo + Terra | Forja — fogo transforma terra em algo novo, lento e poderoso | **Forja** | Tensão criativa |
| Fogo + Água | Vapor — intensidade explosiva, transformação radical | **Caldeirão** | Tensão transformadora |
| Terra + Ar | Erosão — ar esculpe terra, mudança gradual inevitável | **Escultura** | Tensão criativa |
| Ar + Água | Tempestade — intelecto encontra emoção, turbulência fértil | **Tempestade** | Tensão transformadora |

### 2.2 Espelho Arquetípico

Para cada par de arquétipos, o engine identifica:
- **Projeção:** O que A tende a projetar em B (baseado na sombra de A e no arquétipo de B)
- **Catalisador:** Qual aspecto da sombra de cada um o outro ativa
- **Integração:** O que ambos podem integrar através do encontro

Lógica: comparar `archetype.shadow.inflated` de A com `archetype.coreDesire` de B (e vice-versa). Se há ressonância temática, há projeção.

Simplificação para V1: não mapear todos os 144 pares (12x12). Usar a estrutura sombra→desejo como detector de espelhamento.

### 2.3 Caminho na Árvore (Tikkun)

A distância entre duas Sephiroth na Árvore da Vida:

| Relação | Distância | Significado |
|---------|-----------|-------------|
| Mesma Sephirah | 0 | **Ressonância** — mesma casa, mesmo trabalho. Risco de redundância. |
| Adjacentes (1 passo) | 1 | **Vizinhança** — complemento natural, pouca fricção. |
| 2 passos | 2 | **Ponte** — requer esforço consciente, resultado rico. |
| 3+ passos | 3+ | **Peregrinação** — o encontro percorre grande parte da Árvore. Tikkun profundo. |

Adjacências na Árvore (caminhos entre Sephiroth do sistema):
- Binah(3) ↔ Chesed(4) ↔ Geburah(5) ↔ Tiphareth(6) ↔ Netzach(7) ↔ Hod(8) ↔ Yesod(9)

### 2.4 Harmonia de Frequência

Intervalo entre duas frequências Solfeggio:
- **Uníssono** (mesma freq) — ressonância pura
- **Oitava** (2:1) — complemento harmônico perfeito
- **Quinta** (3:2) — harmonia forte
- **Intervalo dissonante** — tensão que exige resolução

Simplificação: calcular a razão entre as duas frequências e classificar como consonante/dissonante.

### 2.5 Psique Combinada

Somar as duas distribuições Freudianas e dividir por 2 → perfil psíquico do encontro. Se ambos são Id-dominante, o encontro é pulsional. Se um é Id e outro é Superego, o encontro tem tensão estrutural.

### 2.6 Numerologia do Encontro

Somar os dois Expression Numbers e reduzir → "Número do Encontro". Mesma lógica pitagórica. Números mestres preservados.

---

## 3. OUTPUT: SoulMateReading

```typescript
interface SoulMateReading {
  // Os dois readings originais
  readingA: SoulMap;
  readingB: SoulMap;

  // Dinâmica elemental
  elementDynamic: {
    name: string;        // "Caldeirão", "Forja", etc.
    nature: string;      // "Tensão transformadora", etc.
    description: string;
  };

  // Espelho arquetípico
  mirror: {
    projectionAtoB: string;  // O que A projeta em B
    projectionBtoA: string;  // O que B projeta em A
    integration: string;     // O que ambos podem integrar
  };

  // Caminho na Árvore
  tikkun: {
    distance: number;
    path: SephirahName[];  // Sephiroth no caminho
    meaning: string;
  };

  // Harmonia de frequência
  frequencyHarmony: {
    interval: string;      // "uníssono", "quinta", etc.
    description: string;
  };

  // Psique do encontro
  combinedPsyche: PsycheDistribution;

  // Número do encontro
  meetingNumber: NumerologyResult;
}
```

---

## 4. UI DO ENCONTRO

### Entrada
URL com dois tokens: `?meet=tokenA,tokenB`
Ou: na tela de revelação de um reading compartilhado, botão "Encontrar outra alma" que pede o segundo token/link.

### Revelação do Encontro
Mesma estética cosmos escuro. 6 seções em fade:
1. **Os Dois Nomes** — lado a lado, com seus signos/elementos
2. **Dinâmica Elemental** — nome da dinâmica + geometria combinada
3. **O Espelho** — projeções cruzadas (o que cada um vê no outro)
4. **O Caminho** — Árvore da Vida com as duas Sephiroth iluminadas e o caminho entre elas
5. **Harmonia** — as duas frequências + intervalo
6. **O Encontro** — psique combinada + número do encontro

---

## 5. DECISÕES DO GUARDIÃO

### D13: Mecânica de entrada do Soul Mate
**Proposta:** Dois caminhos:
- URL com dois tokens (`?meet=tokenA,tokenB`)
- Na revelação de um reading compartilhado, botão para adicionar segundo link

**Rick decide.**

### D14: Projeção arquetípica — simplificação
**Proposta:** Usar sombra→desejo como detector, não mapear 144 pares explicitamente.
**Razão:** Escalável. A lógica é: "a sombra inflada de A ressoa com o desejo central de B?" Se sim, há projeção. Mapeamento interpretativo original.

**Rick decide.**

### D15: Distância na Árvore — simplificação
**Proposta:** Usar distância linear entre números das Sephiroth (|a.number - b.number|), capped a 3+.
**Nota:** Isto é simplificação — a Árvore real tem caminhos não-lineares. Para V1, distância numérica é proxy razoável.

**Rick decide.**

---

## FONTES

- Jung, C.G. — *Aion* (CW 9ii) — Anima/Animus, projeção
- Jung, C.G. — *Memories, Dreams, Reflections* — Relações como espelho
- Zohar — Conceito de almas gêmeas e tikkun
- Ptolomeu — *Tetrabiblos* — Elementos e aspectos
- Sinastria — Tradição astrológica de comparação de cartas

---

*Research compilado em 04 Abr 2026 — GUARDIÃO / Claude Code*
*Soul Mate não é compatibilidade. É o mapa do espaço entre duas almas.*
