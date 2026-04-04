# Sincronias — Spec V1
## O Check-in como Caixa de Surpresa

**Versão:** 1.0
**Data:** 05 Abr 2026
**Status:** concept
**Autores:** Rick + E.
**Princípio:** *Você não precisa acreditar nos sistemas para os padrões serem reais.*

---

## A Ideia Central

Cada check-in no MindRoot acontece num momento específico do espaço-tempo.
Esse momento tem coordenadas: data, hora, local.
Esses mesmos dados — cruzados com o mapa natal da pessoa — revelam o que estava configurado naquele instante segundo seis tradições diferentes.

O check-in vira uma **caixa de surpresa**:
a pessoa registra como está → o sistema revela o que o momento carrega.

Não é previsão. É correlação retroativa.
Não é misticismo. É o mesmo dado lido por seis instrumentos.

A mecânica viciante das loot boxes aplicada a algo que faz bem:
você não sabe o que vai encontrar, mas sabe que vai encontrar algo real sobre você.

---

## O Paralelo com as Loot Boxes

O que torna loot boxes viciantes:
- Recompensa variável e imprevisível (dopamina)
- A recompensa é pessoal ("é meu personagem")
- Você não sabe quando vem a boa
- Há raridade — alguns momentos têm mais do que outros
- Cria habituação: você volta para ver o que tem hoje

O que Sincronias faz com a mesma mecânica:
- Cada check-in revela algo diferente (os ciclos mudam todo dia)
- A revelação é sobre você — não sobre Aquário em geral, sobre você naquele momento
- Alguns momentos têm convergências raras (3 ciclos coincidindo = evento especial)
- Raridade real: uma convergência de 5 sistemas é matematicamente incomum
- Você volta porque quer saber o que o próximo momento carrega

A diferença fundamental: a recompensa aqui é autoconhecimento real, não um skin de personagem.

---

## Como Funciona

### 1. O Mapa Natal (base estática)

Gerado uma vez pelo Cartografia da Alma com dados precisos:
- Data de nascimento (dia, mês, ano)
- Hora de nascimento (opcional mas recomendado)
- Local de nascimento → geocoding → lat/lng

Isso gera o mapa natal completo:
- Carta natal (Sol, Lua, Ascendente, planetas nas casas)
- Sephirah natal + expressão
- Arquétipo + sombra
- Número de expressão (nome) + número do caminho de vida (data)
- Frequência natal
- Distribuição psíquica

O mapa natal é o ponto de referência. **Nunca muda.**

### 2. As Linhas do Tempo (dinâmicas)

Cada sistema tem ciclos que rodam desde o nascimento.
A cada momento, cada linha do tempo está numa posição específica.

```
LINHA 1 — Astrologia
  Ciclos: lunar (29.5 dias), Saturno (29.5 anos), Júpiter (12 anos),
          retornos planetários, trânsitos pessoais
  Dado: qual planeta está transitando qual casa/aspecto natal agora

LINHA 2 — Kabbalah
  Ciclos: baseados nos planetas das sephiroth
  Dado: qual sephirah está "ativa" para esta pessoa hoje
        qual caminho da Árvore está sendo percorrido

LINHA 3 — Numerologia
  Ciclos: Ano Pessoal (1-9, reinicia), Mês Pessoal, Dia Pessoal
  Fórmula: dia + mês + ano atual → reduz → Ano Pessoal
  Dado: qual número governa este dia para esta pessoa

LINHA 4 — Solfeggio
  Ciclos: baseados nos harmônicos das frequências + posição lunar
  Dado: qual frequência está amplificada neste momento

LINHA 5 — Jung (arquétipo)
  Ciclos: ligados aos trânsitos de Plutão e Netuno (transformação profunda)
  Dado: se a sombra está mais ou menos ativa neste período

LINHA 6 — Freud (psique)
  Ciclos: baseados nos ciclos lunares (Id) e solares (Ego/Superego)
  Dado: qual estrutura psíquica tem mais energia hoje
```

### 3. O Check-in com Sincronias

Quando a pessoa faz check-in no MindRoot:

```
[1] Pessoa digita o que está sentindo, fazendo, pensando
    → registro normal do MindRoot

[2] Sistema captura: data + hora + local (GPS ou cidade)

[3] Sistema cruza com o mapa natal:
    → calcula posição de cada linha do tempo neste momento

[4] Revela as Sincronias:
    → o que cada sistema diz sobre este momento específico
    → convergências (quando múltiplos sistemas apontam o mesmo)
    → raridades (momentos em que 3+ sistemas convergem)

[5] A pessoa vê:
    → o que registrou (seu dado real)
    → o que estava configurado (o dado oculto)
```

### 4. Os Níveis de Revelação

Nem todo check-in revela o mesmo. Há três níveis:

**Nível 1 — Dia comum**
1-2 sistemas ativos.
Revelação discreta, sem destaque visual.
Ex: "Lua crescente em trânsito por Yesod — dia de acumular, não de concluir."

**Nível 2 — Convergência**
3-4 sistemas apontando o mesmo padrão.
Revelação destacada, com visual especial.
Ex: "Ano Pessoal 9 + Saturno retornando + Sombra ativa — ciclo de encerramento."

**Nível 3 — Sincronia Rara**
5-6 sistemas convergindo.
Evento visual marcante. Notificação especial.
Matematicamente incomum — acontece poucas vezes no ano.
Ex: "Seis sistemas convergem hoje. Isso não é frequente."

A raridade é real — calculada, não inventada.
Isso cria a mecânica da caixa de surpresa:
você não sabe quando vem a Sincronia Rara, mas sabe que quando vier, é real.

---

## A Interface

### No Check-in (MindRoot)

```
┌─────────────────────────────────────────────┐
│                                             │
│  como você está chegando hoje?              │
│                                             │
│  [campo de texto livre]                     │
│                                             │
│  [registrar]                                │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  SINCRONIAS DESTE MOMENTO                   │  ← só aparece após registrar
│                                             │
│  ♈ Marte em trânsito pela sua 1ª casa       │
│    "período de iniciativa — o impulso       │
│     que você sente agora tem fundamento."   │
│                                             │
│  ① Ano Pessoal 4 · Mês 8                   │
│    "você está construindo fundações.        │
│     o cansaço de agora é material."         │
│                                             │
│  ✡ Chesed ativa — caminho de Binah          │
│    "expansão dentro de estrutura."          │
│                                             │
│  [ver linha do tempo completa →]            │
│                                             │
└─────────────────────────────────────────────┘
```

### A Linha do Tempo (tela dedicada)

```
PASSADO ←─────────────────────────────→ FUTURO

    [nascimento]        [hoje]              →

♈ ──────────────────────●────────────────────
✡ ──────────────────────●────────────────────
☯ ──────────────────────●────────────────────
♪ ──────────────────────●────────────────────
① ──────────────────────●────────────────────
≋ ──────────────────────●────────────────────

                        ↑
               [este momento]
```

- Cada linha tem cor própria
- Hover/tap em qualquer ponto: o que aquele sistema dizia naquele momento
- Marcadores: eventos anteriores do MindRoot (check-ins, tarefas concluídas, marcos)
- Convergências visíveis: quando as linhas se aproximam, aparecem como cluster

### A Notificação da Sincronia Rara

Quando 5+ sistemas convergem:

```
[notificação discreta]

◆ Sincronia Rara · hoje às 14:32

Seis sistemas convergem num padrão
que não acontecia desde [data].

[abrir]
```

Abre a revelação completa — o momento explicado pelos seis instrumentos.
A pessoa pode adicionar o check-in antes ou depois de ler.

---

## Por que Funciona Psicologicamente

### 1. Recompensa variável (dopamina)
Cada check-in é diferente. Você nunca sabe se vai ser nível 1 ou uma Sincronia Rara.
Isso cria o mesmo loop neurológico das loot boxes — mas a recompensa é conhecimento real.

### 2. É pessoal (não genérico)
A revelação é calculada para você, naquele momento, com seu mapa natal.
Não é "Aquário está sob influência de Marte hoje" (genérico para 700 milhões de pessoas).
É "Marte está transitando pela sua 1ª casa" — sua casa, calculada da sua hora e local de nascimento.

### 3. Raridade real
As Sincronias Raras são matematicamente incomuns. Não são fabricadas para parecerem especiais. Quando chegam, são reais. Isso cria antecipação genuína.

### 4. Retroativa (não preditiva)
O sistema não prevê o futuro. Ele revela o que estava configurado.
Isso é psicologicamente mais seguro e mais honesto.
A pessoa não é guiada pelo sistema — é informada por ele.

### 5. Cria consistência sem cobrar
O check-in deixa de ser "tarefa de produtividade" e vira "momento de descoberta".
A pessoa quer fazer porque quer ver o que o momento carrega.
A consistência emerge do desejo, não da disciplina.

---

## A Diferença entre Misticismo e Sincronias

**Misticismo:** "O universo está te dizendo algo."
**Sincronias:** "Seis sistemas distintos, com metodologias diferentes, calculados a partir do mesmo evento físico (seu nascimento), estão apontando o mesmo padrão neste momento."

A pessoa pode não acreditar em nenhum dos seis sistemas.
E ainda assim os padrões emergem dos dados.

É o mesmo que dizer: você não precisa acreditar que o coração bombeia sangue. Ele bombeia de qualquer forma.

---

## Arquitetura Técnica

### Dados necessários

**Do Cartografia (já existem ou planos de existir):**
- Signo solar, elemento, modalidade (existe)
- Sephirah natal (existe)
- Arquétipo natal (existe)
- Número de expressão (existe)
- Frequência natal (existe)
- Ascendente (aproximado — precisa de geocoding para ser preciso)
- Carta natal completa: Sol, Lua, planetas, casas (Seeds V3)

**Novos para Sincronias:**
- Hora de nascimento (opcional, melhora precisão)
- Local de nascimento → lat/lng (OpenCage geocoding)
- Local atual no check-in → lat/lng (GPS ou cidade)
- Hora atual no check-in (timestamp já existe)

### Cálculos por linha

```typescript
// engine/sincronias.ts

interface SincroniaMomento {
  timestamp: Date;
  lat: number;
  lng: number;
  soulMap: SoulMap; // mapa natal da pessoa
}

interface LinhaAtiva {
  sistema: 'astrology' | 'kabbalah' | 'numerology' | 'solfeggio' | 'jung' | 'freud';
  titulo: string;       // nome do evento/ciclo
  descricao: string;    // o que isso significa agora
  intensidade: 1 | 2 | 3; // 1=sutil, 2=moderado, 3=forte
  raro: boolean;        // evento incomum neste sistema
}

interface Sincronia {
  linhas: LinhaAtiva[];
  nivel: 1 | 2 | 3;    // calculado: 1=comum, 2=convergência, 3=raro
  convergencias: string[]; // sistemas que apontam o mesmo padrão
  ultimaVezNivel3?: Date;  // quando foi a última Sincronia Rara
}

function calcularSincronia(momento: SincroniaMomento): Sincronia
```

### Cálculo numerológico (já pode fazer)

```typescript
// Ano Pessoal: soma dia nascimento + mês nascimento + ano atual
// Ex: nasceu 15 Mar, ano atual 2026 → 1+5 + 3 + 2+0+2+6 = 19 → 1+9 = 10 → 1+0 = 1
// Ano Pessoal 1 = início de ciclo

function getAnoPessoal(birthDate: Date, currentYear: number): number
function getMesPessoal(birthDate: Date, currentDate: Date): number
function getDiaPessoal(birthDate: Date, currentDate: Date): number
```

### Cálculo astrológico (precisa de lib)

```typescript
// Recomendação: astronomia-jslibrary (zero dependências externas)
// ou calcular manualmente com efemérides simplificadas

// Para V1: usar posições simplificadas (suficiente para o produto)
// Para V2: efemérides completas (Swiss Ephemeris via WASM)

function getTranstitoAtual(soulMap: SoulMap, date: Date): TransitoAtivo[]
```

---

## Roadmap de Implementação

```
FASE 1 — Motor Numerológico (1 semana)
  Apenas ciclos numerológicos (Ano/Mês/Dia Pessoal)
  Zero dependências externas — matemática pura
  Já funciona sem hora de nascimento ou local
  Entrega: check-in com Sincronia Numerológica

FASE 2 — Motor Kabbalístico (1 semana)
  Ciclos das sephiroth baseados nos planetas (simplificado)
  Usa apenas o signo solar (já existe)
  Entrega: check-in com 2 sistemas

FASE 3 — Motor Astrológico Simplificado (2 semanas)
  Posições lunares (calculáveis com matemática básica)
  Ciclos de Saturno e Júpiter (aproximados)
  Entrega: check-in com 3 sistemas + Sincronias básicas

FASE 4 — Geocoding + Precisão (2 semanas)
  OpenCage para local de nascimento → lat/lng
  Ascendente real + casas astrológicas
  Entrega: carta natal completa como base

FASE 5 — Linha do Tempo Visual (2 semanas)
  Interface de linhas paralelas
  Marcadores dos check-ins do MindRoot
  Hover para ver o contexto de qualquer momento passado
  Entrega: a experiência completa

FASE 6 — Sincronias Raras + Notificações (1 semana)
  Detecção de convergências de 5-6 sistemas
  Notificação push quando Sincronia Rara está chegando
  Entrega: a mecânica da caixa de surpresa completa
```

---

## Conexão com o Ecossistema

```
Cartografia da Alma
  → gera o mapa natal (a base de tudo)
  → exporta como AtomItem type:reading para o MindRoot

MindRoot
  → captura check-ins com timestamps e local
  → exibe Sincronias daquele momento após cada check-in
  → linha do tempo com todas as 6 linhas em paralelo
  → correlaciona: check-ins de alta energia × sistemas ativos

Correlação emergente (V2 MindRoot):
  "Você criou 3 projetos novos em períodos de Ano Pessoal 1.
   Nenhum projeto foi concluído em Ano Pessoal 4."

  "Seus melhores check-ins emocionais acontecem quando
   Júpiter transita sua 1ª casa."

  "A sombra inflada do Visionário aparece nos check-ins
   de Saturno em oposição ao seu Sol natal."
```

---

## O Nome

**Sincronias** — o nome técnico de Jung para coincidências significativas que não têm relação causal mas têm relação de sentido.

Não é misticismo. Jung foi um cientista que levou a sério o que não conseguia explicar pela causalidade.

*"Sincronicidade é a coincidência significativa de dois ou mais eventos onde algo além de chance está envolvido."* — Carl Jung

No nosso caso: não é coincidência. É cálculo. São seis linhas do tempo convergindo num ponto.

---

## A Frase

*"Você não precisa acreditar nos sistemas para os padrões serem reais.*
*O que você sente agora — o sistema já calculou antes de você perguntar."*

---

*Rick + E. — 05 Abr 2026*
*Conceito nascido em sessão. A caixa de surpresa que faz bem.*
