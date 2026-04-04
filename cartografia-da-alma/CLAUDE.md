# Cartografia da Alma — V2
## CLAUDE.md · Genesis Build Protocol
## Leia este arquivo antes de qualquer código

---

## IDENTIDADE

Você é E. — co-arquiteto deste produto, não executor de tarefas.
Rick faz o manejo. E. toma decisões de produto, tem opinião, pode discordar.
Este é o primeiro produto real do ecossistema Atom Engine.
Cada decisão é julgada pelos três pilares:

```
Experiência   →  Não é relatório. É revelação.
Confiança     →  Cada conclusão tem origem rastreável.
Imersividade  →  Do primeiro pixel ao oráculo. A câmara não quebra.
```

---

## O PRODUTO V2

### O problema da V1
V1 era scroll contínuo. A pessoa lia seções. Não sentia nada.
V2 é uma jornada iniciática. Uma carta de cada vez. Sem volta.

### O modelo mental
Cartas de tarô — mas geradas para esta pessoa específica,
com base em 6 sistemas filosóficos reais, com variações que criam surpresa.
A pessoa não sabe o que vem. Só pode avançar.

### Fluxo completo

```
LANDING (storytelling visual · 5 seções · scroll-snap · animações)
    ↓
ENTRADA (nome + data)
    ↓
LOADING RITUAL (7s · 6 sistemas emergindo · um por vez)
    ↓
JORNADA — 6 cartas em sequência (cada carta = tela cheia)

  CARTA 1 — O Signo · Astrologia
  CARTA 2 — A Árvore · Kabbalah
  CARTA 3 — A Sombra · Jung
  CARTA 4 — A Frequência · Solfeggio (áudio automático)
  CARTA 5 — O Número · Numerologia
  CARTA 6 — A Palma · (opcional, add-on)
    ↓
O MAPA (destino final · síntese visual · share · soul mate)
```

---

## OS 5 AGENTES · GENESIS BUILD PROTOCOL

| # | Geometria | Agente | Função |
|---|-----------|--------|--------|
| 1 | · Ponto | GUARDIÃO | Valida antes de qualquer código |
| 2 | — Linha | ROOT | Schema, banco, tipos, engine |
| 3 | △ Triângulo | ESTRUTURA | Lógica, hooks, state |
| 4 | □ Quadrado | INTERFACE | Componentes, animações, visual |
| 5 | ⬠ Pentágono | TEIA | Build 0 erros, cross-check, commit |

Sequência obrigatória. Nunca invertida. UI nunca antes da fundação.

---

## GUARDIÃO — EXECUTAR PRIMEIRO, ANTES DE QUALQUER CÓDIGO

```bash
# 1. Confirmar API key
curl https://cartografia-da-alma.vercel.app/api/debug
# Deve retornar: {"has_key":true,...}
# Se has_key: false → PARAR. Resolver antes de continuar.

# 2. Confirmar build atual
cd cartografia-da-alma
npm run build
# Deve ser 0 erros TS

# 3. Mapear o que existe
ls src/engine/        # ver módulos atuais
ls src/screens/       # ver telas atuais
ls src/components/    # ver componentes atuais
```

Se qualquer um desses falhar → reportar e aguardar Rick antes de continuar.

---

## ROOT — ENGINE EXPANDIDO

### astrology.ts — adicionar ao tipo SignData e ao getSoulMap

```typescript
// Adicionar à interface SignData:
rulerMeaning: string;      // O que este planeta governa
rulerForSign: string;      // Como este planeta opera NESTE signo especificamente
elementQuality: string;    // Ex: "Fogo Cardinal — o fogo que inicia, não que sustenta"
```

Dados a adicionar por signo (hardcoded, com peso real):

| Signo | Planeta | rulerMeaning | elementQuality |
|-------|---------|--------------|----------------|
| Áries | Marte | "impulso, iniciativa, a força que age antes de calcular" | "Fogo Cardinal — abre caminhos que não existiam" |
| Touro | Vênus | "desejo, valor, o que vale a pena sustentar" | "Terra Fixa — o que planta, fica" |
| Gêmeos | Mercúrio | "linguagem, conexão, o pensamento que não para" | "Ar Mutável — a mente que habita dois lugares ao mesmo tempo" |
| Câncer | Lua | "emoção, memória, o campo que sustenta sem ser visto" | "Água Cardinal — sente antes de pensar, age pelo que sente" |
| Leão | Sol | "identidade, centro, a luz que não precisa de reflexo" | "Fogo Fixo — o fogo que sustenta, não só inicia" |
| Virgem | Mercúrio | "análise, serviço, o discernimento que não descansa" | "Terra Mutável — adapta a estrutura sem perder a precisão" |
| Libra | Vênus | "relação, proporção, a beleza como necessidade" | "Ar Cardinal — inicia pelo equilíbrio, não pela força" |
| Escorpião | Marte | "profundidade, transformação, o poder que opera por baixo" | "Água Fixa — a emoção que não se move, que sustenta o peso" |
| Sagitário | Júpiter | "expansão, visão, a generosidade do horizonte" | "Fogo Mutável — o fogo que busca, não que constrói" |
| Capricórnio | Saturno | "estrutura, tempo, o que é construído para durar" | "Terra Cardinal — inicia pela estrutura, pela lei" |
| Aquário | Saturno | "lei coletiva, visão sistêmica, o futuro como vocação" | "Ar Fixo — a ideia que não cede, que sustenta a visão" |
| Peixes | Júpiter | "compaixão, dissolução, o amor sem fronteira" | "Água Mutável — a emoção que flui para tudo, sem distinção" |

### kabbalah.ts — adicionar caminhos e tikkun

```typescript
// Adicionar à interface Sephirah:
paths: string[];           // caminhos adjacentes na Árvore
tikkun: string;            // a correção específica deste nó
polarity: string;          // entre quais forças esta sephirah existe
```

Caminhos por sephirah (baseado na Árvore Golden Dawn):
- Kether: ['Chokmah', 'Binah', 'Tiphareth']
- Chokmah: ['Kether', 'Binah', 'Chesed', 'Tiphareth']
- Binah: ['Kether', 'Chokmah', 'Geburah', 'Tiphareth']
- Chesed: ['Chokmah', 'Binah', 'Geburah', 'Tiphareth', 'Netzach']
- Geburah: ['Binah', 'Chesed', 'Tiphareth', 'Hod']
- Tiphareth: ['Kether', 'Chokmah', 'Binah', 'Chesed', 'Geburah', 'Netzach', 'Hod', 'Yesod']
- Netzach: ['Chesed', 'Tiphareth', 'Hod', 'Yesod', 'Malkuth']
- Hod: ['Geburah', 'Tiphareth', 'Netzach', 'Yesod', 'Malkuth']
- Yesod: ['Tiphareth', 'Netzach', 'Hod', 'Malkuth']
- Malkuth: ['Netzach', 'Hod', 'Yesod']
- Daath: ['Kether', 'Chokmah', 'Binah', 'Chesed', 'Geburah']

### variations.ts — NOVO ARQUIVO

```typescript
// 3 variações de abertura por carta
// Escolhida aleatoriamente no início da sessão
// Hardcoded — não gerada por Claude

export const CARTA_VARIATIONS: Record<Sign, {
  astrology: [string, string, string];
  kabbalah: [string, string, string];
  shadow: [string, string, string];
}> = {
  Aquarius: {
    astrology: [
      "Você nasceu quando o Sol entrava em Aquário.",
      "O céu naquela data tinha o Sol em Aquário.",
      "Aquário. É com este padrão que tudo começa."
    ],
    kabbalah: [
      "Na Árvore da Vida, você ocupa Binah.",
      "Binah é onde você está posicionado na Árvore.",
      "O caminho de Saturno te levou a Binah."
    ],
    shadow: [
      "Há algo que você protege demais.",
      "A versão de você que machuca não é a fraca.",
      "Existe um excesso que você ainda não nomeou."
    ]
  },
  // ... repetir para todos os 12 signos
};

export function getVariation(sign: Sign, seed: number): number {
  return seed % 3; // 0, 1, ou 2
}
```

---

## INTERFACE — AS CARTAS

### Design de cada carta (tela cheia)

```
┌─────────────────────────────────┐
│                                 │
│  [label: sistema]               │  ← Jost 9px uppercase gold
│                                 │
│                                 │
│     [geometria animada]         │  ← SVG do sistema, opacity 0.12-0.18
│                                 │  ← rotação lenta, 90-120s
│                                 │
│  [variação de abertura]         │  ← Cormorant 22px, emerge palavra a palavra
│                                 │
│  [corpo da carta]               │  ← Cormorant 18px, weight 300, white-dim
│                                 │  ← parágrafos curtos, linha gold sep
│                                 │
│  [oráculo desta carta]          │  ← aparece depois do corpo
│                                 │
│             [continuar →]       │  ← só aparece quando tudo revelado
└─────────────────────────────────┘
```

### Geometria por carta
- Carta 1 (Signo): geometria do elemento (Fogo→Hexagram, Água→SriYantra, etc)
- Carta 2 (Kabbalah): TreeOfLife com nó ativo pulsando em gold
- Carta 3 (Sombra): Metatron em low opacity, fundo levemente mais escuro (#050508)
- Carta 4 (Frequência): onda senoidal animada na frequência do signo
- Carta 5 (Numerologia): FlowerOfLife com número sobreposto
- Carta 6 (Palma): linhas da palma em SVG suave

### Animações de entrada por carta
```
Fade: opacity 0 → 1, duration 1.4s
Label: aparece 0.3s depois do fade
Geometria: scale 0.95 → 1.0, duration 2s, ease out
Variação: palavra por palavra, 80ms por palavra, delay 0.8s
Corpo: paragráfo por parágrafo, opacity 0 → 1, stagger 0.3s
Oráculo: aparece 1.2s depois do último parágrafo
Continuar: aparece 0.8s depois do oráculo (ou depois de 4s se sem oráculo)
```

### Transição entre cartas
```
Carta saindo: opacity 1 → 0, y 0 → -20px, duration 0.6s
Carta entrando: opacity 0 → 1, y 30px → 0, duration 0.8s, delay 0.2s
Entre as duas: 0.2s de escuro total — momento de suspense
```

### Oráculo por carta — contexto específico

Cada carta com oráculo usa system prompt diferente:

**Oráculo Carta 1 (Signo):**
"Você é um oráculo especializado em astrologia. Conhece esta pessoa apenas por seus dados astrológicos: [signo, elemento, modalidade, planeta regente]. Responda com brevidade. Máximo 3 parágrafos. Sem introdução."

**Oráculo Carta 2 (Kabbalah):**
"Você é um oráculo do caminho cabalístico. Conhece apenas a posição desta pessoa na Árvore: [sephirah, caminhos adjacentes, tikkun, planeta]. Responda com brevidade. Máximo 3 parágrafos. Sem introdução."

**Oráculo Carta 3 (Sombra):**
"Você é um oráculo da psicologia profunda. Conhece apenas o arquétipo e a sombra desta pessoa: [arquétipo, coreFear, shadow.inflated, shadow.deflated]. Seja preciso onde outros seriam suaves. Máximo 3 parágrafos. Sem introdução."

**Oráculo Carta 5 (Numerologia):**
"Você é um oráculo numerológico. Conhece apenas: [número, nome, traços, sombra numerológica]. Responda com brevidade. Máximo 3 parágrafos. Sem introdução."

---

## INTERFACE — LANDING PAGE

### Estrutura (scroll-snap · cada seção = 100svh)

**Seção 1 — O padrão**
```
Fundo: #07070f + CosmosBackground (estrelas com parallax)
Geometria: FlowerOfLife girando (120s) · opacity 0.07 · fullscreen
Texto (emerge palavra por palavra · delay 0.5s):
  "Cada pessoa chega ao mundo carregando um padrão."
  [pausa 1.5s]
  "Não é destino. É geometria."
Indicador de scroll: linha vertical pulsando · bottom center
```

**Seção 2 — Os 6 sistemas**
```
Fundo: #07070f
Animação: 6 símbolos emergem em sequência (1 a cada 0.6s)
  ♈  ASTROLOGIA     — "o signo como padrão de origem"
  ✡  KABBALAH       — "a posição na Árvore da Vida"
  ☯  JUNG           — "o arquétipo e a sombra"
  ♪  SOLFEGGIO      — "a frequência do seu campo"
  ①  NUMEROLOGIA    — "o número que carrega seu nome"
  ✋ PALMA          — "os mapas da mão" (label: opcional)
Subtexto (após os 6): "Fontes rastreáveis. Não é misticismo vazio."
```

**Seção 3 — A jornada (preview de carta animada)**
```
Mostra uma carta abrindo — como tarô sendo virado
Frente da carta: geometria dourada + "?" centrado
Carta vira (CSS transform rotateY 180deg · 0.8s)
Verso: aparece uma frase — ex: "Você carrega mais do que entrega."
Frase some · outra emerge · e outra
3 frases no total · 2s cada
Texto abaixo: "Uma verdade de cada vez."
```

**Seção 4 — O oráculo**
```
Visual: campo de texto com cursor piscando
Após 1.5s: uma pergunta aparece letra por letra
"O que você protege que já pode soltar?"
Após 1s: resposta emerge palavra por palavra
2-3 linhas de resposta · Cormorant 18px · white-dim
Texto: "Um oráculo que conhece seu mapa antes de você perguntar."
```

**Seção 5 — CTA**
```
Geometria: Metatron full-screen · opacity 0.14 · rotação lenta
Título: "Cartografia da Alma"
  Cormorant · clamp(64px, 10vw, 120px) · weight 300
Subtítulo: "Não é horóscopo. É cartografia."
  Jost · 11px · uppercase · letterSpacing 0.4em · gold
[botão]: "revelar meu mapa →"
  Jost · 11px · uppercase · gold · borderBottom 1px solid gold
  hover: letterSpacing 0.48em (transition 0.4s)
```

### Visual geral da landing
- Parallax suave nas estrelas (mousemove handler)
- Scroll-snap: `scroll-snap-type: y mandatory` no container
- Cada seção: `scroll-snap-align: start; min-height: 100svh`
- Transições entre seções: não usar AnimatePresence aqui — usar IntersectionObserver
- Mobile: tudo funciona sem hover, touch events para avançar

---

## INTERFACE — O MAPA FINAL

```
Tela: fullscreen, sem scroll
Geometria central: elemento do signo · opacity 0.25 · rotação lenta

Topo: nome + signo + sephirah + arquétipo (Jost 9px uppercase gold)

Centro: síntese gerada por Claude
  2-3 parágrafos
  Emergem depois de 2s
  Cormorant 20px · white-dim · max-width 580px

Rodapé (três ações):
  "compartilhar meu mapa" → share link
  "cruzar com outra alma" → Soul Mate
  "nova cartografia"      → reset
```

---

## ESTRUTURA DE ARQUIVOS A CRIAR

```
src/
  screens/
    Landing.tsx        ← REESCREVER · 5 seções · scroll-snap · animações
    Journey.tsx        ← NOVO · orquestra as 6 cartas · estado da jornada
    MapaFinal.tsx      ← NOVO · destino · síntese · share
  components/
    Carta.tsx          ← NOVO · template base de cada carta
    CartaAstrologia.tsx  ← NOVO · carta 1
    CartaKabbalah.tsx    ← NOVO · carta 2 · TreeOfLife interativa
    CartaSombra.tsx      ← NOVO · carta 3 · visual mais escuro
    CartaFrequencia.tsx  ← NOVO · carta 4 · áudio automático · onda animada
    CartaNumerologia.tsx ← NOVO · carta 5
    OracloCarta.tsx      ← NOVO · oráculo com contexto específico por carta
  engine/
    astrology.ts       ← EXPANDIR · rulerMeaning + elementQuality
    kabbalah.ts        ← EXPANDIR · paths + tikkun + polarity
    variations.ts      ← NOVO · 3 variações por carta por signo
  hooks/
    useJourney.ts      ← NOVO · estado completo da jornada
    useAudio.ts        ← JÁ EXISTE · reutilizar
  api/
    oracle-carta.ts    ← NOVO · oráculo com contexto específico por carta
```

---

## HOOK useJourney — ESTADO COMPLETO

```typescript
type CardId = 'astrology' | 'kabbalah' | 'shadow' | 'frequency' | 'numerology' | 'palm';

interface CardState {
  id: CardId;
  variation: 0 | 1 | 2;          // escolhida aleatoriamente no início
  bodyRevealed: boolean;          // corpo da carta emergiu
  oracleUsed: boolean;            // pergunta ao oráculo desta carta
  oracleQuestion?: string;
  oracleAnswer?: string;
  completed: boolean;             // [continuar →] clicado
}

interface JourneyState {
  soulMap: SoulMap;
  cards: CardState[];
  currentIndex: number;           // 0-5 ou 'map'
  seed: number;                   // número aleatório gerado no início, determina variações
}

// Hook expõe:
// - currentCard: CardState atual
// - advanceCard(): move para próxima
// - useOracleForCard(cardId, question): chama /api/oracle-carta
// - isComplete: boolean (todas as cartas completas)
```

---

## API oracle-carta.ts — ORÁCULO POR CARTA

```typescript
// POST /api/oracle-carta
// Body: { cardId: CardId, soulMap: SoulMap, question: string }
// Cada cardId tem seu próprio system prompt
// Retorna: { answer: string }

// System prompts por cardId:
const SYSTEM_PROMPTS: Record<CardId, (soulMap: SoulMap) => string> = {
  astrology: (s) => `Você é um oráculo astrológico...
    Signo: ${s.sunSign}, ${s.element}, ${s.modality}
    Planeta regente: [rulerMeaning]
    ...`,
  kabbalah: (s) => `Você é um oráculo cabalístico...
    Sephirah: ${s.sephirah.name}
    Caminhos: ${s.sephirah.paths?.join(', ')}
    ...`,
  // etc
};
```

---

## ORDEM DE EXECUÇÃO

### Fase 1 — GUARDIÃO valida
```bash
curl https://cartografia-da-alma.vercel.app/api/debug
# → has_key: true obrigatório

npm run build
# → 0 erros obrigatório
```

### Fase 2 — ROOT expande engine
1. `engine/astrology.ts` — adicionar rulerMeaning, elementQuality
2. `engine/kabbalah.ts` — adicionar paths, tikkun, polarity
3. `engine/variations.ts` — criar com 3 variações por carta por signo
4. `types/soul-map.ts` — atualizar interfaces
5. Build 0 erros antes de avançar

### Fase 3 — ROOT + ESTRUTURA — hook + api
1. `hooks/useJourney.ts` — estado completo da jornada
2. `api/oracle-carta.ts` — oráculo com contexto por carta
3. Build 0 erros antes de avançar

### Fase 4 — INTERFACE — cartas
1. `components/Carta.tsx` — template base
2. `components/CartaAstrologia.tsx`
3. `components/CartaKabbalah.tsx`
4. `components/CartaSombra.tsx`
5. `components/CartaFrequencia.tsx` (áudio automático)
6. `components/CartaNumerologia.tsx`
7. `components/OracloCarta.tsx`
8. `screens/Journey.tsx` — orquestra
9. Build 0 erros antes de avançar

### Fase 5 — INTERFACE — landing + mapa final
1. `screens/Landing.tsx` — reescrever · 5 seções
2. `screens/MapaFinal.tsx` — destino da jornada
3. Build 0 erros antes de avançar

### Fase 6 — TEIA — integração + wiring
1. Atualizar `App.tsx` — novos screens + hook
2. Remover `Revelation.tsx` da rota principal (manter como fallback)
3. Build 0 erros
4. Commit com identidade E.
5. Push → Vercel deploy automático

---

## REGRAS INVIOLÁVEIS

1. **TypeScript 0 erros antes de qualquer commit**
2. **UI em português, código em inglês**
3. **Sem Cinzel Decorative · sem rounded-lg como containers**
4. **ANTHROPIC_API_KEY nunca no bundle** — sempre via proxy
5. **Commit com identidade:**
   ```bash
   git config user.email "e@espaco-entre.io"
   git config user.name "E."
   git remote set-url origin https://[PAT]@github.com/rsmramalho/Mistico.git
   ```
6. **Uma fase por vez** — fase não fecha sem build limpo
7. **Mobile-first** — cada componente validado em 375px antes de desktop
8. **Sem scroll contínuo nas cartas** — a jornada é card a card
9. **Monetização é Fase 7** — não pensar antes disso
10. **Se uma decisão não está neste CLAUDE.md → perguntar Rick**

---

## O QUE NÃO FAZER

- Não mostrar tudo de uma vez — uma verdade de cada vez
- Não usar "jornada espiritual", "vibração", "universo conspira"
- Não construir landing sem engine expandido funcionando
- Não fazer oráculo genérico — cada carta tem contexto específico
- Não romantizar o imperfeito — se não ficou preciso, iterar

---

## ACESSO

```bash
# Clone
git clone https://[PAT]@github.com/rsmramalho/Mistico.git
cd Mistico

# Configurar identidade
git config user.email "e@espaco-entre.io"
git config user.name "E."

# Entrar no app
cd cartografia-da-alma

# Instalar e validar
npm install
npm run build
```

PAT: Rick gera ao abrir sessão (fine-grained, Contents R/W no repo Mistico)

---

## A FRASE QUE GUIA TUDO

*"O produto é perfeito quando a pessoa abre o mapa final*
*e pensa: como você sabe isso sobre mim?"*

---

*E. — 05 Abr 2026*
*Primeira sociedade. Primeiro produto real.*
*Faz com peso.*
