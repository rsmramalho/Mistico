# Ecossistema — Spec V1

*Escrito por E. — 04 Abr 2026*
*Revisado após conversa com Rick — visão corrigida*

---

## Visão Real

O MindRoot não é onde o Cartografia chega.
O MindRoot já é o sistema.

O Cartografia é a camada que revela o que estava implícito
nos dados que o MindRoot já captura.

---

## O que o MindRoot já tem

Dados reais de uma vida operacional:

- **Ação** — tarefas, projetos, hábitos, o que foi feito e quando
- **Emoção** — check-ins, estados, padrões afetivos ao longo do tempo
- **Tempo** — timestamps de tudo, sequência, ritmo, gaps
- **Alma** — intenção por trás da ação, energia declarada, prioridades

Isso é o Genesis em operação.
Uma pessoa usando o MindRoot por 3 meses tem um dataset rico da própria vida.

---

## O que o Cartografia adiciona

O mapa oculto por baixo dos dados visíveis.

Quando o SoulMap é conectado ao MindRoot, cada evento ganha contexto:

| Dado MindRoot | Contexto Cartografia |
|---------------|---------------------|
| Tarefa criada em 14/Mar | Lua nova em Peixes — seu elemento |
| Check-in emocional baixo em 22/Mar | Lua minguante + Saturno transitando Chesed |
| Projeto que não decolou | Iniciado fora do PhiTime pessoal |
| Semana de alta produtividade | Trânsito de Júpiter no seu elemento |
| Conflito relacional | Sombra inflada ativa — arquétipo em excesso |

---

## A Correlação

O sistema não prevê. Ele revela padrões retroativos.

Depois de dados suficientes, emerge algo como:

*"Você cria com mais força em dias de elemento Água."*
*"Seus picos emocionais coincidem com trânsitos de Júpiter."*
*"Seus bloqueios acontecem quando está na sombra inflada do arquétipo."*
*"Projetos iniciados no seu PhiTime têm 2.3x mais chance de completar."*

Não é misticismo. É análise de dados
com uma camada de contexto que nenhum outro sistema tem.

---

## A Virada Central

A pessoa não precisa acreditar nos sistemas
para os padrões serem reais.

Os dados mostram a correlação.
A interpretação é dela.

Isso é radicalmente diferente de horóscopo.
Horóscopo diz o que vai acontecer.
Isso mostra o que aconteceu — e o padrão por baixo.

---

## As Seis Camadas

O que o MindRoot captura e o Cartografia ilumina:

### 1. Físico
Corpo como dado — não separado do simbólico.

- Chakras como mapa energético do corpo
- Medicina das plantas por signo/elemento (Culpeper, Ayurveda)
- Ritmo circadiano correlacionado com fase lunar
- Corpo como mapa — quiromancia já implementada

### 2. Ação
Como a pessoa se move — já capturado pelo MindRoot.

- I Ching como sistema de timing de decisão
- Modalidade astrológica: cardinal age, fixo sustenta, mutável transforma
- PhiTime: quando agir, quando esperar
- Expression Number como padrão recorrente de como a pessoa age

### 3. Emoção
O mapa afetivo — já capturado pelo MindRoot.

- Arquétipos jungianos (já implementado) — qual está ativo?
- Sombra: inflação ou deflação? O check-in emocional revela
- Estrutura freudiana (já implementada) — qual força domina esse período?
- Correlação: emoção declarada vs trânsito planetário vs fase lunar

### 4. Oculto Simbólico
O que estrutura sem ser visto.

- Kabbalah / Árvore da Vida (já implementado) — caminho ativo no período
- Solfeggio (já implementado) — frequência em harmonia ou dissonância?
- Gene Keys — 64 chaves: sombra/dom/siddhi, paralelo à sombra junguiana
- Tarot — Arcanos Maiores por signo e momento
- Geometria Sagrada (já implementada) — por elemento

### 5. Sincronia
O quando — Jung nomeou, o sistema calcula.

- PhiTime: convergência de φ em múltiplos ciclos simultâneos
  - Ciclo de vida pessoal (data de nascimento + φ)
  - Fase lunar atual vs lua natal
  - Trânsitos em aspectos áureos com o natal
  - Frequência pessoal em harmonia com frequência do momento
  - Crossings: onde dois ciclos se intersectam num ponto phi
- I Ching como oráculo de sincronia
- Correlação retroativa: quando os momentos phi coincidiram com eventos reais

### 6. Natureza
Ciclos externos como espelho do interno.

- Elementos: linguagem base (já implementado)
- Estações: modalidade cardinal = início de estação
- Lua: fase atual, lua natal, progressões
- Planetas: regências clássicas (já implementado), trânsitos ativos
- Fibonacci na natureza: φ como estrutura da espiral da vida

---

## Arquitetura

```
MINDROOT (o sistema)
  ├── Ação         → o que foi feito
  ├── Emoção       → como estava
  ├── Tempo        → quando
  └── Alma         → intenção

        ↕  correlação

CARTOGRAFIA DA ALMA (o contexto)
  ├── SoulMap      → quem você é (fixo)
  ├── PhiTime      → quando convergem (dinâmico)
  ├── Trânsitos    → o que está ativo agora (diário)
  └── Seis Camadas → lentes de interpretação

        ↓  revelação

PADRÃO
  "Você tende a criar com mais força quando..."
  "Seus bloqueios coincidem com..."
  "O projeto que não decolou foi iniciado quando..."

        ↓  oráculo

PERGUNTA
  Com contexto real — dados + mapa + momento.
  Não "me fale sobre Peixes."
  "Por que esse projeto travou em março?"
```

---

## Cruzamentos Prioritários para V2

| Prioridade | Sistema | Impacto |
|-----------|---------|---------|
| 1 | PhiTime engine | Diferencial único — timing com base matemática real |
| 2 | Correlação MindRoot ↔ SoulMap | A virada central do produto |
| 3 | Gene Keys | Paralelo direto com sombra junguiana já implementada |
| 4 | Trânsitos planetários | Requer efemérides reais (já nos seeds) |
| 5 | Chakras | Cruzamento natural com elementos e Sephiroth |
| 6 | I Ching | Sistema de ação + sincronia |
| 7 | Tarot | Arcanos por signo e momento |
| 8 | Medicina das Plantas | Físico + natureza |

---

## O que não é

- Não é previsão do futuro
- Não é superstição empacotada em tecnologia
- Não é verdade absoluta
- Não exige que a pessoa acredite nos sistemas

É análise de dados com contexto que nenhum outro sistema tem.
Os padrões emergem dos dados reais.
A linguagem mística é a lente de interpretação — não a conclusão.

---

## A Frase Central

*"O oculto não substitui o dado. Ele revela o padrão por baixo do dado."*

---

*E. — 04 Abr 2026*
*O MindRoot já é o sistema. O Cartografia é o que ilumina o que estava lá.*
