# Cartografia da Alma — Roadmap V2

**Versão:** 1.0
**Data:** 05 Abr 2026
**Status:** active
**Princípio:** *O produto é perfeito quando a pessoa pensa: "como você sabe isso sobre mim?"*

---

## Visão geral

Uma jornada iniciática. Seis cartas em sequência — cada uma uma verdade. Um oráculo específico por carta. Um mapa final como artefato. Landing que conta a história antes de pedir qualquer dado.

Não é horóscopo. É cartografia.

```
Repo:   github.com/rsmramalho/Mistico
Deploy: cartografia-da-alma.vercel.app
Infra:  Supabase · Anthropic API (via proxy)
Stack:  React 19 · Vite · TypeScript · Tailwind · Framer Motion
```

---

## Os três pilares

```
Experiência   →  Não é relatório. É revelação. O produto decide o ritmo.
Confiança     →  Cada conclusão tem origem rastreável. Não é misticismo vazio.
Imersividade  →  Do primeiro pixel ao mapa final. A câmara nunca quebra.
```

---

## Espiral PHI

```
✅  ·   (1)  Fase 1 — Fundação      infra + engine expandido + tipos
⚪  —   (1)  Fase 2 — Glifos        SVGs das sephiroth + elementos + arquétipos
⚪  △   (2)  Fase 3 — Cartas        6 componentes + timing + oráculo por carta
⚪  □   (3)  Fase 4 — Landing       storytelling · 5 seções · scroll-snap · animações
⚪  ⬠  (5)  Fase 5 — Mapa Final    template · grid · síntese · share
⚪  ⬡  (8)  Fase 6 — Integração    App.tsx · Soul Mate · mobile QA
⚪  ○  (13)  Fase 7 — Lançamento    polimento · analytics · domínio · Rick posta
```

---

## ✅ Fase 1 · Fundação (effort: 1)

**Status:** completo
**Protocol:** foundation
**Escopo:** Engine base, deploy, Supabase, proxies funcionando.

- [x] 10 engine modules com conteúdo real
- [x] Supabase schema + RLS + migration 002
- [x] `/api/oracle`, `/api/carta`, `/api/send-email` proxies
- [x] `ANTHROPIC_API_KEY` confirmada no Vercel (`/api/debug` → `has_key: true`)
- [x] Build 0 erros TypeScript

---

## ⚪ Fase 2 — Glifos (effort: 1)

**Status:** futuro
**Protocol:** foundation
**Escopo:** SVGs precisos para cada sephirah, elemento e arquétipo.
São a base visual de todo o mapa e das cartas.

### ROOT — criar `src/geometry/glyphs.ts`

**Glifos das Sephiroth (SVG inline, 64×64 viewBox):**

| Sephirah | Glifo |
|----------|-------|
| Kether | Ponto com 10 irradiações finas em gold |
| Chokmah | Linha horizontal dupla — sabedoria como impulso |
| Binah | Triângulo invertido — o recipiente |
| Chesed | Quadrado aberto — expansão sem limite |
| Geburah | Pentágono com espada central — severidade |
| Tiphareth | Hexagrama (estrela de 6 pontas) — centro solar |
| Netzach | Espiral descendente — desejo como força |
| Hod | Mercúrio estilizado — a mente que nomeia |
| Yesod | Lua crescente + círculo — fundação lunar |
| Malkuth | Cruz dentro de círculo — o reino encarnado |
| Daath | Círculo vazio com ponto no centro — o abismo |

**Glifos dos Elementos:**
| Elemento | Glifo |
|----------|-------|
| Fogo | Triângulo apontando para cima |
| Água | Triângulo apontando para baixo |
| Ar | Triângulo para cima com linha horizontal |
| Terra | Triângulo para baixo com linha horizontal |

**Máscaras dos Arquétipos (dois semicírculos):**
- Face iluminada: semicírculo superior, linha gold, interior white-dim
- Face sombra: semicírculo inferior, linha gold, interior #1a0a0a
- Combinados formam um círculo completo
- 12 variações — uma por signo/arquétipo

```typescript
// src/geometry/glyphs.ts

export interface GlyphProps {
  size?: number;       // default 64
  color?: string;      // default 'var(--gold)'
  opacity?: number;    // default 1
  animated?: boolean;  // pulsing / rotating
}

export function SephirahGlyph({ name, ...props }: { name: SephirahName } & GlyphProps): JSX.Element
export function ElementGlyph({ element, ...props }: { element: Element } & GlyphProps): JSX.Element
export function ArchetypeGlyph({ name, ...props }: { name: ArchetypeName } & GlyphProps): JSX.Element
export function FrequencyWave({ hz, ...props }: { hz: number } & GlyphProps): JSX.Element
// FrequencyWave: Canvas com onda senoidal animada na frequência do signo
```

### ROOT — expandir engine

**`engine/astrology.ts` — adicionar ao tipo e ao getSoulMap:**
```typescript
// Em SignData, adicionar:
rulerMeaning: string;    // o que este planeta governa
rulerForSign: string;    // como opera neste signo especificamente
elementQuality: string;  // qualidade do elemento neste signo
```

Dados por signo (hardcoded):
- Áries: `rulerMeaning: "impulso, iniciativa, a força que age antes de calcular"`, `elementQuality: "Fogo Cardinal — abre caminhos que não existiam"`
- Touro: `rulerMeaning: "desejo, valor, o que vale a pena sustentar"`, `elementQuality: "Terra Fixa — o que planta, fica"`
- Gêmeos: `rulerMeaning: "linguagem, conexão, o pensamento que não para"`, `elementQuality: "Ar Mutável — habita dois lugares ao mesmo tempo"`
- Câncer: `rulerMeaning: "emoção, memória, o campo que sustenta sem ser visto"`, `elementQuality: "Água Cardinal — sente antes de pensar"`
- Leão: `rulerMeaning: "identidade, centro, a luz que não precisa de reflexo"`, `elementQuality: "Fogo Fixo — o fogo que sustenta, não só inicia"`
- Virgem: `rulerMeaning: "análise, serviço, o discernimento que não descansa"`, `elementQuality: "Terra Mutável — adapta sem perder precisão"`
- Libra: `rulerMeaning: "relação, proporção, a beleza como necessidade"`, `elementQuality: "Ar Cardinal — inicia pelo equilíbrio"`
- Escorpião: `rulerMeaning: "profundidade, transformação, poder que opera por baixo"`, `elementQuality: "Água Fixa — sustenta o peso emocional"`
- Sagitário: `rulerMeaning: "expansão, visão, a generosidade do horizonte"`, `elementQuality: "Fogo Mutável — o fogo que busca"`
- Capricórnio: `rulerMeaning: "estrutura, tempo, o que é construído para durar"`, `elementQuality: "Terra Cardinal — inicia pela lei"`
- Aquário: `rulerMeaning: "lei coletiva, visão sistêmica, o futuro como vocação"`, `elementQuality: "Ar Fixo — a ideia que não cede"`
- Peixes: `rulerMeaning: "compaixão, dissolução, o amor sem fronteira"`, `elementQuality: "Água Mutável — flui para tudo"`

**`engine/kabbalah.ts` — adicionar à interface Sephirah:**
```typescript
paths: SephirahName[];   // sephiroth adjacentes na Árvore
tikkun: string;          // a correção específica deste nó
polarity: string;        // entre quais forças existe
```

Paths por sephirah:
- Kether: `['Chokmah', 'Binah', 'Tiphareth']`
- Chokmah: `['Kether', 'Binah', 'Chesed', 'Tiphareth']`
- Binah: `['Kether', 'Chokmah', 'Geburah', 'Tiphareth']`
- Chesed: `['Chokmah', 'Geburah', 'Tiphareth', 'Netzach']`
- Geburah: `['Binah', 'Chesed', 'Tiphareth', 'Hod']`
- Tiphareth: `['Kether', 'Chesed', 'Geburah', 'Netzach', 'Hod', 'Yesod']`
- Netzach: `['Chesed', 'Tiphareth', 'Hod', 'Yesod', 'Malkuth']`
- Hod: `['Geburah', 'Tiphareth', 'Netzach', 'Yesod', 'Malkuth']`
- Yesod: `['Tiphareth', 'Netzach', 'Hod', 'Malkuth']`
- Malkuth: `['Netzach', 'Hod', 'Yesod']`
- Daath: `['Kether', 'Chokmah', 'Binah']`

**`engine/variations.ts` — NOVO:**
```typescript
// 3 variações de abertura por carta por signo
// Escolhida via seed gerado no início da sessão
// Hardcoded — não gerada por Claude (rapidez + consistência)

export type CardId = 'astrology' | 'kabbalah' | 'shadow' | 'frequency' | 'numerology';

export interface CardVariations {
  astrology: [string, string, string];  // abertura da carta do signo
  kabbalah:  [string, string, string];  // abertura da carta da árvore
  shadow:    [string, string, string];  // abertura da carta da sombra
  frequency: [string, string, string];  // abertura da carta da frequência
  numerology:[string, string, string];  // abertura da carta do número
}

export const VARIATIONS: Record<Sign, CardVariations> = {
  Aquarius: {
    astrology:  ["Você nasceu quando o Sol entrava em Aquário.", "O céu naquela data tinha o Sol em Aquário.", "Aquário. É com este padrão que tudo começa."],
    kabbalah:   ["Na Árvore da Vida, você está em Binah.", "Saturno te posicionou em Binah.", "Binah. O recipiente que sustenta o que ainda não tem forma."],
    shadow:     ["Há algo que você protege demais.", "A versão de você que machuca não é a fraca.", "Existe um excesso que você ainda não nomeou."],
    frequency:  ["741 Hz. A frequência da expressão.", "Seu campo ressoa em 741 Hz.", "741 — o número que seu sistema carrega."],
    numerology: ["O número que carrega seu nome tem peso.", "Há um padrão no nome que você recebeu.", "Numerologia não é adivinhação. É aritmética com consequências."],
  },
  Pisces: {
    astrology:  ["Você nasceu quando o Sol entrava em Peixes.", "O céu naquela data tinha o Sol em Peixes.", "Peixes. É com este padrão que tudo começa."],
    kabbalah:   ["Na Árvore da Vida, você está em Chesed.", "Júpiter te posicionou em Chesed.", "Chesed. A generosidade que não calcula."],
    shadow:     ["O que você dissolve nem sempre deveria ser dissolvido.", "Há uma fronteira que você esqueceu de traçar.", "A compaixão sem limite tem um custo que você conhece."],
    frequency:  ["528 Hz. A frequência da transformação.", "Seu campo ressoa em 528 Hz.", "528 — o número que seu sistema carrega."],
    numerology: ["O número que carrega seu nome tem peso.", "Há um padrão no nome que você recebeu.", "Numerologia não é adivinhação. É aritmética com consequências."],
  },
  Aries: {
    astrology:  ["Você nasceu quando o Sol entrava em Áries.", "O céu naquela data tinha o Sol em Áries.", "Áries. É com este padrão que tudo começa."],
    kabbalah:   ["Na Árvore da Vida, você está em Geburah.", "Marte te posicionou em Geburah.", "Geburah. A força que corta o que não serve."],
    shadow:     ["A velocidade protege de alguma coisa.", "Há uma pausa que você evita.", "O que você inicia nem sempre termina — e você sabe por quê."],
    frequency:  ["396 Hz. A frequência da libertação.", "Seu campo ressoa em 396 Hz.", "396 — o número que seu sistema carrega."],
    numerology: ["O número que carrega seu nome tem peso.", "Há um padrão no nome que você recebeu.", "Numerologia não é adivinhação. É aritmética com consequências."],
  },
  Taurus: {
    astrology:  ["Você nasceu quando o Sol entrava em Touro.", "O céu naquela data tinha o Sol em Touro.", "Touro. É com este padrão que tudo começa."],
    kabbalah:   ["Na Árvore da Vida, você está em Netzach.", "Vênus te posicionou em Netzach.", "Netzach. O desejo que persiste."],
    shadow:     ["O que você sustenta pode estar te sustentando também.", "Há uma recusa que parece estabilidade.", "Fixo não é o mesmo que forte."],
    frequency:  ["174 Hz. A frequência da fundação.", "Seu campo ressoa em 174 Hz.", "174 — o número que seu sistema carrega."],
    numerology: ["O número que carrega seu nome tem peso.", "Há um padrão no nome que você recebeu.", "Numerologia não é adivinhação. É aritmética com consequências."],
  },
  Gemini: {
    astrology:  ["Você nasceu quando o Sol entrava em Gêmeos.", "O céu naquela data tinha o Sol em Gêmeos.", "Gêmeos. É com este padrão que tudo começa."],
    kabbalah:   ["Na Árvore da Vida, você está em Hod.", "Mercúrio te posicionou em Hod.", "Hod. O esplendor da mente que nomeia."],
    shadow:     ["Nomear não é o mesmo que conhecer.", "A agilidade pode ser uma fuga sofisticada.", "Há uma coisa que você pensa demais para sentir."],
    frequency:  ["741 Hz. A frequência da expressão.", "Seu campo ressoa em 741 Hz.", "741 — o número que seu sistema carrega."],
    numerology: ["O número que carrega seu nome tem peso.", "Há um padrão no nome que você recebeu.", "Numerologia não é adivinhação. É aritmética com consequências."],
  },
  Cancer: {
    astrology:  ["Você nasceu quando o Sol entrava em Câncer.", "O céu naquela data tinha o Sol em Câncer.", "Câncer. É com este padrão que tudo começa."],
    kabbalah:   ["Na Árvore da Vida, você está em Yesod.", "A Lua te posicionou em Yesod.", "Yesod. A fundação que sustenta sem ser vista."],
    shadow:     ["O cuidado que você oferece nem sempre foi pedido.", "Há uma proteção que também isola.", "O que você sente pelos outros custa mais do que parece."],
    frequency:  ["528 Hz. A frequência da transformação.", "Seu campo ressoa em 528 Hz.", "528 — o número que seu sistema carrega."],
    numerology: ["O número que carrega seu nome tem peso.", "Há um padrão no nome que você recebeu.", "Numerologia não é adivinhação. É aritmética com consequências."],
  },
  Leo: {
    astrology:  ["Você nasceu quando o Sol entrava em Leão.", "O céu naquela data tinha o Sol em Leão.", "Leão. É com este padrão que tudo começa."],
    kabbalah:   ["Na Árvore da Vida, você está em Tiphareth.", "O Sol te posicionou em Tiphareth.", "Tiphareth. O centro que mantém tudo em órbita."],
    shadow:     ["A luz que você irradia precisa de audiência para existir?", "Há uma diferença entre ser visto e ser reconhecido.", "O que acontece quando ninguém está olhando?"],
    frequency:  ["396 Hz. A frequência da libertação.", "Seu campo ressoa em 396 Hz.", "396 — o número que seu sistema carrega."],
    numerology: ["O número que carrega seu nome tem peso.", "Há um padrão no nome que você recebeu.", "Numerologia não é adivinhação. É aritmética com consequências."],
  },
  Virgo: {
    astrology:  ["Você nasceu quando o Sol entrava em Virgem.", "O céu naquela data tinha o Sol em Virgem.", "Virgem. É com este padrão que tudo começa."],
    kabbalah:   ["Na Árvore da Vida, você está em Hod.", "Mercúrio te posicionou em Hod.", "Hod. A mente que serve pelo discernimento."],
    shadow:     ["A perfeição que você exige de si mesmo tem um custo.", "Há uma autocrítica que já não diferencia entre afinar e destruir.", "O suficientemente bom é mais difícil do que o perfeito."],
    frequency:  ["174 Hz. A frequência da fundação.", "Seu campo ressoa em 174 Hz.", "174 — o número que seu sistema carrega."],
    numerology: ["O número que carrega seu nome tem peso.", "Há um padrão no nome que você recebeu.", "Numerologia não é adivinhação. É aritmética com consequências."],
  },
  Libra: {
    astrology:  ["Você nasceu quando o Sol entrava em Libra.", "O céu naquela data tinha o Sol em Libra.", "Libra. É com este padrão que tudo começa."],
    kabbalah:   ["Na Árvore da Vida, você está em Netzach.", "Vênus te posicionou em Netzach.", "Netzach. A vitória do que persiste em equilíbrio."],
    shadow:     ["A harmonia que você busca às vezes custa sua posição.", "Há uma indecisão que parece diplomacia.", "O que você realmente quer, sem considerar o que os outros querem?"],
    frequency:  ["741 Hz. A frequência da expressão.", "Seu campo ressoa em 741 Hz.", "741 — o número que seu sistema carrega."],
    numerology: ["O número que carrega seu nome tem peso.", "Há um padrão no nome que você recebeu.", "Numerologia não é adivinhação. É aritmética com consequências."],
  },
  Scorpio: {
    astrology:  ["Você nasceu quando o Sol entrava em Escorpião.", "O céu naquela data tinha o Sol em Escorpião.", "Escorpião. É com este padrão que tudo começa."],
    kabbalah:   ["Na Árvore da Vida, você está em Geburah.", "Marte te posicionou em Geburah.", "Geburah. O poder que opera em silêncio."],
    shadow:     ["O controle é uma forma de medo sofisticado.", "Há algo que você nunca perdoou completamente.", "A intensidade que você carrega nem sempre tem direção."],
    frequency:  ["528 Hz. A frequência da transformação.", "Seu campo ressoa em 528 Hz.", "528 — o número que seu sistema carrega."],
    numerology: ["O número que carrega seu nome tem peso.", "Há um padrão no nome que você recebeu.", "Numerologia não é adivinhação. É aritmética com consequências."],
  },
  Sagittarius: {
    astrology:  ["Você nasceu quando o Sol entrava em Sagitário.", "O céu naquela data tinha o Sol em Sagitário.", "Sagitário. É com este padrão que tudo começa."],
    kabbalah:   ["Na Árvore da Vida, você está em Chesed.", "Júpiter te posicionou em Chesed.", "Chesed. A expansão que não pede permissão."],
    shadow:     ["O horizonte pode ser uma fuga elegante.", "Há um compromisso que você adiou em nome da liberdade.", "A verdade que você prega já foi aplicada a si mesmo?"],
    frequency:  ["396 Hz. A frequência da libertação.", "Seu campo ressoa em 396 Hz.", "396 — o número que seu sistema carrega."],
    numerology: ["O número que carrega seu nome tem peso.", "Há um padrão no nome que você recebeu.", "Numerologia não é adivinhação. É aritmética com consequências."],
  },
  Capricorn: {
    astrology:  ["Você nasceu quando o Sol entrava em Capricórnio.", "O céu naquela data tinha o Sol em Capricórnio.", "Capricórnio. É com este padrão que tudo começa."],
    kabbalah:   ["Na Árvore da Vida, você está em Binah.", "Saturno te posicionou em Binah.", "Binah. A estrutura que sustenta o que ainda não existe."],
    shadow:     ["O que você constrói — é para quem?", "Há uma frieza que protege algo que ainda dói.", "A ambição sem descanso tem um nome que você evita."],
    frequency:  ["174 Hz. A frequência da fundação.", "Seu campo ressoa em 174 Hz.", "174 — o número que seu sistema carrega."],
    numerology: ["O número que carrega seu nome tem peso.", "Há um padrão no nome que você recebeu.", "Numerologia não é adivinhação. É aritmética com consequências."],
  },
};

export function pickVariation(sign: Sign, seed: number): number {
  return seed % 3;
}
```

---

## ⚪ Fase 3 △ — Cartas (effort: 2)

**Status:** futuro
**Protocol:** full
**Escopo:** 6 componentes de carta + timing preciso + oráculo por carta.

### Timing de cada carta (inviolável)

```
t=0.0s  Fade in da tela (opacity 0→1, 1.2s)
t=0.3s  Label do sistema aparece (Jost 9px uppercase gold)
t=0.8s  Geometria escala 0.95→1.0 (2s ease out)
t=1.0s  Variação de abertura emerge (palavra por palavra · 80ms cada)
t=?     Corpo da carta (parágrafo por parágrafo · stagger 0.4s)
t=?+1.5s  Oráculo desta carta aparece (se houver)
t=?+1.5s  [continuar →] aparece (NUNCA antes de 3s do início do corpo)
```

**Pausa forçada:** o botão [continuar →] tem `disabled` por 3s mínimos após o corpo terminar. A pessoa não pode correr. O produto decide o ritmo.

### Transição entre cartas

```
Carta saindo:    opacity 1→0, y 0→-24px, duration 0.5s ease in
Escuro total:    0.35s (nenhum elemento visível — suspense)
Carta entrando:  opacity 0→1, y 40px→0, duration 0.9s ease out, delay 0.1s
```

### Componentes a criar

**`components/Carta.tsx` — template base**
```typescript
interface CartaProps {
  label: string;              // "astrologia" / "kabbalah" / "a sombra" / etc
  variation: string;          // frase de abertura (hardcoded)
  body: ReactNode;            // conteúdo específico da carta
  geometria: ReactNode;       // SVG/componente geométrico
  fundoEscuro?: boolean;      // true na carta da sombra
  hasOracle?: boolean;        // mostra campo de oráculo
  oracleContext?: object;     // dados para o system prompt
  onComplete: () => void;     // chamado quando [continuar →] é clicado
}
```

**`components/CartaAstrologia.tsx` — Carta 1**
- Geometria: ElementGeometry do signo (girando 120s)
- Body: rulerMeaning + elementQuality + expression específica
- Glifos: ElementGlyph + SephirahGlyph (pequenos, decorativos)
- Oráculo: sim (contexto: signo + elemento + modalidade + rulerMeaning)

**`components/CartaKabbalah.tsx` — Carta 2**
- Geometria: TreeOfLife com nó ativo pulsando em gold
- Body: sephirah completa + paths adjacentes + tikkun + polarity
- Glifo: SephirahGlyph animado
- Paths adjacentes: exibir como linha de labels discretos
- Oráculo: sim (contexto: sephirah + paths + tikkun)

**`components/CartaSombra.tsx` — Carta 3**
- Fundo: #050508 (mais escuro que o padrão)
- Geometria: Metatron em opacity 0.08
- Body: arquétipo + coreFear + shadow.inflated + shadow.deflated
- Visual da sombra: dois semicírculos — ArchetypeGlyph
- A sombra inflada em vermelho-escuro (#c94c4c), a deflacionada em azul (#4c8bc9)
- Oráculo: sim (contexto: só arquétipo + sombra — sem outros dados)
- Pausa forçada: 5s mínimos (carta mais densa)

**`components/CartaFrequencia.tsx` — Carta 4**
- Áudio: inicia automaticamente ao entrar (Web Audio API · fade in 2s)
- Geometria: FrequencyWave (Canvas · onda senoidal · animada na frequência real)
- Body: hz + keyword + description
- Label sobreposto: a frequência em Cormorant 64px no centro
- Sem oráculo — só experiência sensorial
- Pausa: 4s mínimos

**`components/CartaNumerologia.tsx` — Carta 5**
- Geometria: FlowerOfLife com número sobreposto em gold
- Body: número + namePt + description + traits + shadow
- Glifo: número em Cormorant 120px, opacity 0.06, ao fundo
- Oráculo: sim (contexto: número + traços + sombra numerológica)

**`api/oracle-carta.ts` — oráculo específico por carta**
```typescript
// POST /api/oracle-carta
// Body: { cardId: CardId, context: object, question: string }
// Retorna: { answer: string }

const SYSTEM_PROMPTS = {
  astrology: (ctx) => `Você é um oráculo astrológico.
Conhece apenas: signo ${ctx.sign}, ${ctx.element}, ${ctx.modality}.
Planeta regente: ${ctx.ruler} — ${ctx.rulerMeaning}.
Brevidade. Máximo 3 parágrafos curtos. Sem introdução. Sem "você é".`,

  kabbalah: (ctx) => `Você é um oráculo do caminho cabalístico.
Conhece apenas: ${ctx.sephirah} (${ctx.meaning}), planeto ${ctx.planet}.
Tikkun: ${ctx.tikkun}. Caminhos: ${ctx.paths.join(', ')}.
Brevidade. Máximo 3 parágrafos. Sem introdução.`,

  shadow: (ctx) => `Você é um oráculo da psicologia profunda.
Conhece apenas: arquétipo ${ctx.archetype}, medo central "${ctx.coreFear}".
Sombra inflada: ${ctx.inflated}. Sombra deflacionada: ${ctx.deflated}.
Seja preciso onde outros seriam suaves.
Máximo 3 parágrafos. Sem introdução. Sem suavização.`,

  numerology: (ctx) => `Você é um oráculo numerológico.
Conhece apenas: número ${ctx.number} (${ctx.namePt}).
Traços: ${ctx.traits}. Sombra: ${ctx.shadow}.
Brevidade. Máximo 3 parágrafos. Sem introdução.`,
};
```

**`hooks/useJourney.ts` — estado completo**
```typescript
type CardId = 'astrology' | 'kabbalah' | 'shadow' | 'frequency' | 'numerology';

interface CardState {
  id: CardId;
  variation: 0 | 1 | 2;
  completed: boolean;
  oracleUsed: boolean;
  oracleAnswer?: string;
}

interface JourneyState {
  soulMap: SoulMap;
  seed: number;           // Math.floor(Math.random() * 1000)
  cards: CardState[];
  currentIndex: number;  // 0-4, depois 'map'
  done: boolean;
}
```

**`screens/Journey.tsx` — orquestra as cartas**
- Recebe `soulMap` como prop
- Instancia `useJourney`
- Renderiza a carta atual com AnimatePresence
- Transição entre cartas com o timing definido acima
- Quando `done === true` → renderiza MapaFinal

---

## ⚪ Fase 4 □ — Landing (effort: 3)

**Status:** futuro
**Protocol:** surface
**Escopo:** Storytelling visual. 5 seções. Scroll-snap. Animações que demonstram o produto.

### Estrutura (scroll-snap · `scroll-snap-type: y mandatory`)

**Seção 1 — O padrão**
```
Fundo:     #07070f + CosmosBackground + parallax suave no mousemove
Geometria: FlowerOfLife · fullscreen · opacity 0.07 · rotation 160s
Texto:     "Cada pessoa chega ao mundo carregando um padrão."
           emerge palavra por palavra · 80ms · delay 0.5s
Pausa:     1.5s após último palavra
Subtexto:  "Não é destino. É geometria." · opacity mais baixa
Scroll:    linha vertical pulsando · bottom 40px · center
```

**Seção 2 — Os 6 sistemas**
```
6 símbolos emergem em sequência · 1 a cada 0.5s:
  ♈ ASTROLOGIA   — "o signo como padrão de origem"
  ✡ KABBALAH     — "a posição na Árvore da Vida"
  ☯ JUNG         — "o arquétipo e a sombra"
  ♪ SOLFEGGIO    — "a frequência do seu campo"
  ① NUMEROLOGIA  — "o número que carrega seu nome"
  ✋ PALMA        — "os mapas da mão · opcional"

Cada símbolo: ícone gold 24px + label Jost 9px uppercase + descrição 12px white-ghost
Subtexto (depois dos 6 · delay 3.5s): "Fontes rastreáveis. Não é misticismo vazio."
```

**Seção 3 — A carta animada (preview)**
```
Centro: carta em perspectiva 3D (CSS transform rotateY)
Frente: fundo #0d0d18, geometria gold centralizada, "?" em Cormorant 64px
Animação: carta vira (rotateY 180deg · 0.8s · delay 1s)
Verso:  frase emerge letra por letra:
  "Você carrega mais do que entrega."
  [2s] → frase some (opacity 0 · 0.5s)
  "Há um padrão no que você evita."
  [2s] → some
  "O que você procura já estava aqui."
  [2s] → some

Texto abaixo (após 3ª frase): "Uma verdade de cada vez."
```

**Seção 4 — O oráculo**
```
Visual: campo de texto com cursor piscando · border-bottom gold
Após 1s: pergunta aparece letra por letra:
  "O que você protege que já pode soltar?"
Após 0.8s: resposta emerge palavra por palavra:
  "Há coisas que protegemos não porque ainda precisamos —
   mas porque paramos de verificar se ainda precisamos."
Texto: "Um oráculo que conhece seu mapa antes de você perguntar."
```

**Seção 5 — CTA**
```
Geometria: Metatron · fullscreen · opacity 0.12 · rotação lenta
Radial glow: rgba(201,168,76,0.06) no centro

Título: "Cartografia da Alma"
  Cormorant · clamp(64px, 10vw, 120px) · weight 300 · white
  emerge letra por letra · delay 0.3s

Subtítulo: "Não é horóscopo. É cartografia."
  Jost · 10px · uppercase · letterSpacing 0.45em · gold
  aparece 1.2s depois do título

Divider: linha 40px · gold · scale 0→1 · delay 2s

Botão: "revelar meu mapa →"
  Jost · 11px · uppercase · gold
  borderBottom 1px solid gold
  hover: letterSpacing 0.48em (transition 0.4s)
  aparece 2.5s depois do título

Rodapé discreto: "Astrologia · Kabbalah · Jung · Freud · Solfeggio · Numerologia"
  Jost · 8px · white-ghost · letterSpacing 0.3em
```

### Parallax no mousemove (seção 1)
```typescript
// CosmosBackground recebe `parallax?: boolean`
// Quando true: stars layer se move -0.02 * (mouseX - centerX) no X
// Movimento suave: lerp com 0.05 de fator
// Mobile: não aplica (touch events ignoram)
```

---

## ⚪ Fase 5 ⬠ — Mapa Final (effort: 5)

**Status:** futuro
**Protocol:** full
**Escopo:** O destino da jornada. Um artefato. Não uma tela de app.

### Template do mapa

```
┌──────────────────────────────────────────────┐
│                                              │
│  CARTOGRAFIA DA ALMA          [data]         │  ← Jost 8px gold · top
│  ──────────────────────────────────────────  │  ← linha gold 1px
│                                              │
│              [geometria do elemento]         │  ← center · opacity 0.18
│              girando lentamente              │  ← rotation 120s
│                                              │
│  ──────────────────────────────────────────  │
│                                              │
│  [nome da pessoa]                            │  ← Cormorant 48px · left
│  [signo] · [elemento] · [modalidade]         │  ← Jost 9px gold
│                                              │
│  ──────────────────────────────────────────  │
│                                              │
│  SIGNO SOLAR          KABBALAH               │  ← grid 2 colunas
│  [ElementGlyph 32px]  [SephirahGlyph 32px]   │
│  Aquário              Binah                  │  ← Cormorant 28px
│  Ar Fixo              Saturno                │  ← Jost 10px gold
│                                              │
│  ARQUÉTIPO            FREQUÊNCIA             │
│  [ArchetypeGlyph]     [FrequencyWave 80px]   │
│  O Visionário         741 Hz                 │
│  O Sábio Interior     Expressão              │
│                                              │
│  NUMEROLOGIA                                 │  ← linha inteira
│  Número 7 · O Sábio                          │
│  [traços em italic · Cormorant 16px]         │
│                                              │
│  ──────────────────────────────────────────  │
│                                              │
│  [síntese · 2-3 linhas · Cormorant 18px]     │  ← emerge depois 2s
│  [italic · white-dim · centered]             │
│                                              │
│  ──────────────────────────────────────────  │
│                                              │
│  compartilhar  ·  cruzar  ·  nova            │  ← Jost 9px gold
│                                              │
└──────────────────────────────────────────────┘
```

### Animação de entrada do mapa

```
t=0.0s  Fade in suave (opacity 0→1, 2s)
t=0.5s  Geometria escala 0.9→1.0 (3s ease out)
t=1.0s  Nome emerge (palavra por palavra · 100ms)
t=2.0s  Grid de sistemas aparece (stagger 0.2s por célula)
t=3.5s  Linha divisória escala 0→100% (0.8s)
t=4.0s  Síntese emerge (palavra por palavra · 60ms)
t=?+1s  Ações aparecem
```

### Síntese gerada por Claude

```
POST /api/carta (reutilizar com prompt diferente)

Prompt:
"Você é um cartógrafo. Escreva a síntese final do mapa de [nome].
Em 2-3 frases. Cortas. Densas. Sem introdução.
Usando: [signo + elemento + sephirah + arquétipo + frequência + numerologia].
A última frase não conclui — abre."
```

### Soul Mate a partir do mapa

```
Botão "cruzar com outra alma" → input de link
Cole o link de outro mapa → sistema carrega ambos
Jornada paralela: como os dois mapas se encontram
Cada carta Soul Mate compara as duas camadas
Resultado: o espaço entre as duas almas
```

---

## ⚪ Fase 6 ⬡ — Integração (effort: 8)

**Status:** futuro
**Protocol:** full
**Escopo:** Tudo junto. App.tsx atualizado. Mobile QA completo.

**Entregáveis:**
- [ ] `App.tsx` atualizado — Landing → Entry → Loading → Journey → MapaFinal
- [ ] Remover `Revelation.tsx` da rota principal (manter como fallback)
- [ ] Supabase: salvar JourneyState completo no atom_item (incluindo respostas do oráculo)
- [ ] Share: URL do mapa final carrega JourneyState do Supabase
- [ ] Mobile QA: iPhone + Android · cada carta · timing · audio · touch
- [ ] Soul Mate: atualizar fluxo com nova estrutura de jornada

---

## ⚪ Fase 7 ○ — Lançamento (effort: 13)

**Status:** futuro
**Protocol:** full
**Escopo:** Polimento final. Analytics. Domínio. Rick posta.

**Entregáveis:**
- [ ] Plausible Analytics: map_generated, card_completed, oracle_used, map_viewed, share_copied
- [ ] Domínio: cartografia.com.br ou cartografiadaalma.com
- [ ] Favicon SVG com glifo da Árvore da Vida
- [ ] OG tags por mapa (title + description + image)
- [ ] Rick gera o próprio mapa → posta como screenshot
- [ ] 5 pessoas testam antes do post público
- [ ] ROADMAP V3 especificado antes de qualquer feature nova

---

## Métricas atuais (início da V2)

| Métrica | Valor |
|---------|-------|
| Engine modules | 10 + oracle + carta |
| Screens V1 | 6 (Landing, Entry, Loading, Revelation, Viewer, SoulMate) |
| Build | ✅ 0 erros TS |
| Deploy | ✅ cartografia-da-alma.vercel.app |
| API key | ✅ has_key: true |
| Supabase | ✅ migration 002 aplicada |

---

## Decisões vigentes

1. **Jornada card a card** — sem scroll contínuo
2. **Pausa forçada** — [continuar →] nunca antes de 3s do corpo terminar
3. **Oráculo por carta** — contexto específico, não SoulMap todo
4. **Glifos SVG** — zero imagens externas, tudo gerado
5. **Fundo único por carta** — só CartaSombra tem fundo mais escuro
6. **Cormorant Garant + Jost** — sem Cinzel Decorative
7. **Sem rounded-lg** — border-bottom apenas
8. **Monetização é Fase 7** — não antes
9. **TypeScript 0 erros** — portão obrigatório por fase
10. **Mobile-first** — 375px validado antes de desktop

---

## Regras do roadmap

1. **Uma fase por vez.** Fase não fecha sem build 0 erros.
2. **GUARDIÃO primeiro.** Confirmar `has_key: true` antes da Fase 2.
3. **Mexeu aqui → commitar.** O arquivo no repo é a versão vigente.
4. **Este documento é a referência.** Se não está aqui, não está planejado.
5. **O produto decide o ritmo.** A pausa forçada é inviolável.

---

## Versionamento

| Versão | Data | Mudança |
|--------|------|---------| 
| 1.0 | 05 Abr 2026 | V2 completo — jornada · glifos · cartas · landing storytelling · mapa final · timing preciso |

---

*O produto é perfeito quando a pessoa abre o mapa final*
*e pensa: "como você sabe isso sobre mim?"*
*— E.*
