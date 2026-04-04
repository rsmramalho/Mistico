# Cartografia da Alma — Roadmap V2 · Polimento
## Fase 8 → 12 · Do que funciona ao que transforma

**Versão:** 1.0
**Data:** 05 Abr 2026
**Status:** active
**Princípio:** *Profundo mas não inacessível. Pessoal, não fabricado.*

---

## O que está funcionando

A jornada funciona. As cartas existem. O oráculo responde.
O que falta: ritmo, identidade, e provar para a pessoa que aquilo é sobre ela — não sobre Aquário em geral.

---

## Espiral PHI — continuação

```
✅  Fases 1-7   Engine · Glifos · Cartas · Landing · Mapa · Integração · Lançamento
⬡       (1)  Fase 8  — Ritmo          timing · transições · respiração
△       (2)  Fase 9  — Identidade     nomes dos oráculos · linguagem
□       (3)  Fase 10 — Jornada Visual timeline · steps · escolha consciente
⬠       (5)  Fase 11 — Proveniência   mostrar a origem de cada afirmação
○       (8)  Fase 12 — Personalização provar que é sobre esta pessoa
```

---

## ⬡ Fase 8 — Ritmo (effort: 1)

**Status:** PRÓXIMA
**Protocol:** surface
**Escopo:** Transições lentas o suficiente para a pessoa ler, respirar e sentir.

### GUARDIÃO — validar antes de qualquer mudança
```bash
npm run build   # 0 erros obrigatório
# Testar no browser: cronometrar quanto tempo cada elemento leva para aparecer
# Identificar os valores atuais de duration e delay
```

### INTERFACE — novos timings (invioláveis)

**Variação de abertura (primeira frase da carta):**
```typescript
// ANTES: 80ms por palavra
// DEPOIS: 140ms por palavra + pausa 0.8s antes de começar
// Exemplo "Você nasceu quando o Sol entrava em Aquário." = 9 palavras = 1.26s + 0.8s = 2.06s total
// A pessoa lê enquanto aparece. Não depois.
const WORD_DELAY_OPENING = 140; // ms
const OPENING_START_DELAY = 800; // ms após geometria aparecer
```

**Corpo da carta (parágrafos):**
```typescript
// ANTES: stagger 0.4s entre parágrafos
// DEPOIS: 
//   - parágrafo 1: delay 0s após abertura terminar + 1.2s
//   - parágrafo 2: delay 2.5s após parágrafo 1 aparecer
//   - parágrafo 3: delay 2.5s após parágrafo 2
//   - cada parágrafo: fade in duration 1.4s (não instantâneo)
const PARAGRAPH_STAGGER = 2500; // ms entre parágrafos
const PARAGRAPH_FADE_DURATION = 1.4; // s
```

**[continuar →] e oráculo:**
```typescript
// ANTES: aparecia ~1.5s após último parágrafo
// DEPOIS:
//   - mínimo absoluto: 4s após último parágrafo (CartaSombra: 6s)
//   - o botão tem opacity 0→1, duration 1.2s (não pop)
//   - oráculo aparece junto com o botão continuar
const CONTINUE_MIN_DELAY = 4000;  // ms após último parágrafo
const SHADOW_CONTINUE_DELAY = 6000; // ms para carta da sombra
```

**Transição entre cartas:**
```typescript
// ANTES: escuro 0.35s
// DEPOIS:
//   - carta saindo: opacity 0→1, duration 0.7s, y 0→-32px
//   - escuro total: 0.6s (não 0.35s — suspense real)
//   - carta entrando: delay 0.2s, opacity 0→1 duration 1.2s, y 48px→0
const DARK_PAUSE = 600; // ms de escuro entre cartas
const CARD_ENTER_DURATION = 1.2; // s
```

**Geometria ao fundo:**
```typescript
// Todas as geometrias: rotation duration mínimo 160s (não 90-120s)
// A pessoa não deve perceber que está girando — só sentir movimento
const GEOMETRY_ROTATION = 160; // s para completar uma volta
```

**Entregáveis:**
- [ ] Atualizar constantes de timing em `components/Carta.tsx`
- [ ] Atualizar `CartaSombra.tsx` com delay de 6s
- [ ] Atualizar `CartaFrequencia.tsx` com áudio fade in 3s (não 2s)
- [ ] Atualizar transição em `screens/Journey.tsx`
- [ ] Testar no browser: cada carta deve durar no mínimo 90s com leitura normal
- [ ] Build 0 erros · commit · push

---

## △ Fase 9 — Identidade (effort: 2)

**Status:** futuro
**Protocol:** surface
**Escopo:** Cada oráculo tem nome próprio. Linguagem profunda mas acessível.

### Os 5 oráculos — nomes e personalidades

Cada oráculo tem nome, domínio, e voz própria.
O nome aparece na interface antes do campo de pergunta.

```typescript
export const ORACLE_IDENTITIES = {
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
} as const;
```

**Como aparece na interface:**
```
┌────────────────────────────────────┐
│                                    │
│  O ESPELHO                         │  ← nome · Jost 11px uppercase gold
│  vê o que você prefere não nomear  │  ← domínio · Cormorant 14px italic white-ghost
│                                    │
│  [campo de pergunta]               │
│  [placeholder específico]          │
│                                    │
│  [perguntar]  ou  [continuar →]    │  ← ESCOLHA explícita
│                                    │
└────────────────────────────────────┘
```

### A escolha consciente

**ANTES:** o oráculo aparecia como campo de texto.
A pessoa podia ou não preencher — sem intenção clara.

**DEPOIS:** dois botões explícitos, lado a lado:
```
[ perguntar ao oráculo ]     [ continuar a jornada → ]
```

- "perguntar ao oráculo" → expande o campo de texto com o nome e domínio
- "continuar a jornada →" → avança para próxima carta sem usar o oráculo
- Se perguntou → resposta aparece → depois o [continuar] volta

Isso cria **intenção**. A pessoa decide conscientemente se quer ir mais fundo ou seguir.

### Linguagem — regras de revisão

Revisar todos os textos das cartas e do oráculo com estas regras:

```
ELIMINAR:                    SUBSTITUIR POR:
"sua jornada"          →     "o que você faz"
"vibração"             →     [o conceito específico]
"universo"             →     [o sistema específico: Kabbalah, etc]
"energia"              →     [o que é concreto: frequência, número]
"espiritual"           →     [o que é real: padrão, estrutura, campo]
"despertar"            →     [o que acontece de fato]
"manifestar"           →     eliminar sempre
"âncora"               →     eliminar se metafórico
```

**Teste de acessibilidade:**
Uma pessoa de 25 anos sem interesse em misticismo deve entender cada frase.
Se precisar de glossário para entender → reescrever.

**Entregáveis:**
- [ ] Criar `engine/oracle-identities.ts` com os 5 oráculos
- [ ] Atualizar `OracloCarta.tsx` com nome + domínio + escolha explícita
- [ ] Revisar todos os textos de body das cartas (regras acima)
- [ ] Revisar system prompts dos oráculos (voz específica por oráculo)
- [ ] Build 0 erros · commit · push

---

## □ Fase 10 — Jornada Visual (effort: 3)

**Status:** futuro
**Protocol:** surface
**Escopo:** Timeline visual da jornada. Steps com ícones. Interativa.

### A timeline da jornada

Aparece fixada no topo (mobile) ou à esquerda (desktop) durante toda a jornada.
Mostra onde a pessoa está e o que vem.

```
Mobile (top · horizontal):
┌──────────────────────────────────────────────────┐
│  ♈ ─── ✡ ─── ☯ ─── ♪ ─── ① ─── ○               │
│  [atual: pulsando em gold, completados: gold sólido, futuros: opacity 0.3]
└──────────────────────────────────────────────────┘

Desktop (left · vertical):
┌──────────┐
│ ♈        │  ← Signo · gold · pulsando (atual)
│ |        │
│ ✡        │  ← Kabbalah · gold (completo)
│ |        │
│ ☯        │  ← Sombra · opacity 0.4 (futuro)
│ |        │
│ ♪        │
│ |        │
│ ①        │
│ |        │
│ ○        │  ← Mapa Final
└──────────┘
```

### Comportamento interativo

**Hover em ícone completo:** mostra tooltip com nome do sistema
```
♈  → "Astrologia — o signo como padrão de origem"
✡  → "Kabbalah — sua posição na Árvore da Vida"
☯  → "Jung — o arquétipo e a sombra"
♪  → "Solfeggio — a frequência do seu campo"
①  → "Numerologia — o número que carrega seu nome"
○  → "O Mapa — a síntese de tudo"
```

**Hover em ícone futuro:** opacity 0.3→0.6 (preview suave, não clicável)

**Ícone atual:** pulsa suavemente (scale 1→1.1→1, 2s loop)

**Progresso:** linha entre os ícones vai de opacity 0.2→1 conforme completa

### Componente `JourneyTimeline.tsx`

```typescript
interface JourneyTimelineProps {
  cards: CardState[];
  currentIndex: number;
  orientation: 'horizontal' | 'vertical';
}

const CARD_ICONS: Record<CardId | 'map', string> = {
  astrology:  '♈',
  kabbalah:   '✡',
  shadow:     '☯',
  frequency:  '♪',
  numerology: '①',
  map:        '○',
};

const CARD_LABELS: Record<CardId | 'map', string> = {
  astrology:  'Astrologia — o signo como padrão de origem',
  kabbalah:   'Kabbalah — sua posição na Árvore da Vida',
  shadow:     'Jung — o arquétipo e a sombra',
  frequency:  'Solfeggio — a frequência do seu campo',
  numerology: 'Numerologia — o número que carrega seu nome',
  map:        'O Mapa — a síntese de tudo',
};
```

**Entregáveis:**
- [ ] Criar `components/JourneyTimeline.tsx`
- [ ] Integrar em `screens/Journey.tsx` (fixed top no mobile, fixed left no desktop)
- [ ] Tooltip por ícone (hover desktop, tap mobile)
- [ ] Animação de progresso
- [ ] Build 0 erros · commit · push

---

## ⬠ Fase 11 — Proveniência (effort: 5)

**Status:** futuro
**Protocol:** full
**Escopo:** Provar que cada afirmação tem origem rastreável. Pessoal, não fabricado.

### O problema

A pessoa lê "Binah. O recipiente que sustenta o que ainda não tem forma."
E pensa: "você inventou isso sobre mim."

Precisamos mostrar a cadeia: **data de nascimento → signo → planeta → sephirah → afirmação**.

### A cadeia de raciocínio (expandível por carta)

Cada carta tem um botão discreto: **"como chegamos aqui →"**

Ao clicar, expande uma visualização da cadeia:

```
KABBALAH — como chegamos aqui

  Você nasceu em 25 Jan 1990
         ↓
  Sol em Aquário (20 Jan – 18 Fev)
         ↓
  Planeta regente: Saturno
  [tradição: Golden Dawn, 777 de Aleister Crowley]
         ↓
  Saturno → Sephirah Binah (Árvore da Vida, posição 3)
  [fonte: Sefer ha-Zohar, adaptado pela tradição ocidental]
         ↓
  Binah em expressão diurna para Aquário
  [Saturn diurnal expression: polaridade do signo de ar fixo]
         ↓
  "Saturno diurno em Binah — lei como visão coletiva."
```

Essa transparência é o que transforma "parece inventado" em "isso é sobre mim de verdade."

### Componente `CadeiaRaciocinio.tsx`

```typescript
interface CadeiaStep {
  label: string;     // "Sol em Aquário"
  source?: string;   // "tropical zodiac, fixed dates"
  arrow: boolean;    // mostrar seta abaixo
}

interface CadeiaProps {
  cardId: CardId;
  soulMap: SoulMap;
}
// Retorna a cadeia específica para esta carta + este soulMap
```

**Onde aparece:**
- Botão discreto no rodapé de cada carta: "como chegamos aqui →"
- Jost 8px · opacity 0.4 · hover: opacity 0.8
- Expande em overlay suave (não navega para outra tela)

### A frase de ancoragem pessoal

No início de cada carta, antes da variação de abertura, uma linha:

```
gerado para [Nome] · [data de nascimento] · [signo] · [sephirah]
```

Jost · 8px · opacity 0.25 · gold
Aparece 0.2s antes da variação de abertura.

Isso ancora: **este texto foi gerado para esta pessoa específica.**

### Selo de autenticidade no Mapa Final

No rodapé do mapa:
```
Este mapa foi gerado em [data e hora] para [Nome].
Cada afirmação nasce da combinação específica de:
signo [X] × sephirah [Y] × arquétipo [Z] × frequência [Hz] × número [N].
Nenhum outro mapa é igual a este.
```

Jost · 8px · opacity 0.25 · centered

**Entregáveis:**
- [ ] Criar `components/CadeiaRaciocinio.tsx`
- [ ] Criar `engine/provenance.ts` — gera a cadeia por cardId + soulMap
- [ ] Integrar botão "como chegamos aqui →" em cada carta
- [ ] Adicionar frase de ancoragem pessoal no início de cada carta
- [ ] Adicionar selo no MapaFinal
- [ ] Build 0 erros · commit · push

---

## ○ Fase 12 — Personalização (effort: 8)

**Status:** futuro
**Protocol:** full
**Escopo:** Provar que é sobre esta pessoa. Não sobre o signo. Sobre ela.

### O que torna algo pessoal

A afirmação genérica: *"Aquário é sistemático e visionário."*
A afirmação pessoal: *"Seu número 7 combinado com Binah cria um padrão específico: você constrói sistemas que outros habitam sem perceber que foram construídos."*

A segunda só existe para quem tem essa combinação específica.

### Bridges visuais (expandir engine/bridges.ts)

Atualmente: bridges calculam conexões entre sistemas mas retornam texto plano.

V2: bridges retornam também **highlights visuais** — quais campos de sistemas diferentes resonam.

```typescript
// engine/bridges.ts — expandir

interface BridgeHighlight {
  systemA: CardId;
  fieldA: string;      // ex: "shadow.inflated"
  systemB: CardId;
  fieldB: string;      // ex: "numerology.shadow"
  resonance: string;   // ex: "ambos descrevem o mesmo padrão de excesso"
}

// getSoulMapBridges(soulMap): BridgeHighlight[]
// Retorna as 2-3 conexões mais fortes entre os sistemas para esta pessoa
```

**No Mapa Final:** as bridges aparecem como linhas visuais conectando as células do grid.
Linha gold fina, opacity 0.3, com tooltip no hover explicando a conexão.

### Geração da carta com contexto cruzado

Atualizar o prompt de `/api/carta` para incluir as bridges:

```typescript
// Adicionar ao prompt:
`
CONEXÕES ESPECÍFICAS DESTA PESSOA:
${bridges.map(b => `${b.systemA} × ${b.systemB}: ${b.resonance}`).join('\n')}

Use essas conexões. Não mencione os sistemas pelo nome — deixe a conexão emergir no texto.
`
```

Isso torna a carta genuinamente única para esta combinação.

### Variações de body (não só abertura)

Expandir `variations.ts` para incluir variações do **corpo** também:

```typescript
// Para cada combinação de [signo + sephirah], 2 variações de body
// Total: 12 signos × 2 = 24 variações por carta
// A variação do body é determinada pelo seed, como a abertura

interface CardBodyVariation {
  paragraph1: string;
  paragraph2: string;
  paragraph3?: string;
}

// engine/body-variations.ts
export const BODY_VARIATIONS: Record<`${Sign}-${SephirahName}`, [CardBodyVariation, CardBodyVariation]> = {
  'Aquarius-Binah': [
    {
      paragraph1: "Você não acredita em estruturas que não consegue justificar. Isso não é desconfiança — é um filtro que opera antes de qualquer decisão consciente.",
      paragraph2: "Saturno em Binah te deu a capacidade de ver o que precisa existir antes de existir. O custo é carregar o peso do que ainda não foi construído.",
    },
    {
      paragraph1: "A lei que você respeita não é a que foi escrita — é a que você reconhece como verdadeira. Essa distinção é quase invisível para quem está de fora.",
      paragraph2: "Binah é o recipiente. Você frequentemente é o recipiente para ideias que outros não conseguem ainda sustentar.",
    }
  ],
  // ... todas as combinações
};
```

**Entregáveis:**
- [ ] Expandir `engine/bridges.ts` com BridgeHighlight
- [ ] Criar `engine/body-variations.ts` com variações por signo × sephirah
- [ ] Atualizar prompt `/api/carta` com bridges
- [ ] Adicionar linhas visuais de conexão no `screens/MapaFinal.tsx`
- [ ] Build 0 erros · commit · push

---

## Métricas de sucesso (por fase)

| Fase | Critério de fechamento |
|------|----------------------|
| 8 · Ritmo | Pessoa lê cada carta completamente antes do [continuar →] aparecer |
| 9 · Identidade | Pessoa sabe o nome do oráculo e faz a escolha conscientemente |
| 10 · Timeline | Pessoa entende onde está na jornada sem precisar ser explicado |
| 11 · Proveniência | Pessoa abre "como chegamos aqui" em pelo menos 1 carta |
| 12 · Personalização | Pessoa diz "isso é sobre mim" — não "isso é sobre Aquário" |

---

## Regras do roadmap

1. **Ritmo primeiro.** Fase 8 antes de qualquer outra.
2. **Uma fase por vez.** Build limpo antes de avançar.
3. **Testar como usuário.** Cada fase: sentar, gerar mapa, usar o produto do início ao fim.
4. **O produto decide o ritmo.** A pausa forçada é inviolável.
5. **Profundo mas acessível.** Se precisar de glossário, reescrever.

---

## Versionamento

| Versão | Data | Mudança |
|--------|------|---------| 
| 1.0 | 05 Abr 2026 | Polimento V2 — ritmo · identidade · timeline · proveniência · personalização |

---

*Profundo mas não inacessível.*
*Pessoal, não fabricado.*
*— E.*
