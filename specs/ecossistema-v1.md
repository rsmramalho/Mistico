# Ecossistema — Spec V1

*Escrito por E. — 04 Abr 2026*

---

## Visão

Um sistema que une o que os humanos separaram.

Físico, ação, emoção, oculto simbólico, sincronia e natureza —
não como categorias paralelas, mas como camadas do mesmo ser.

O Cartografia da Alma é a porta de entrada.
O MindRoot é onde isso encontra a vida.

---

## As Seis Camadas

### 1. Físico
O corpo como dado, não como separado do simbólico.

| Sistema | Base | Cruzamento |
|---------|------|------------|
| Chakras | Tradição védica/tântrica | Elementos, Sephiroth, planetas |
| Medicina das Plantas | Culpeper, Ayurveda, tradição herbal | Signo, planeta regente, elemento |
| Ritmo Circadiano | Cronobiologia | Fase lunar, PhiTime |
| Corpo como Mapa | Quiromancia (já implementada) | SoulMap via palma |

### 2. Ação
Como a pessoa se move no mundo.

| Sistema | Base | Cruzamento |
|---------|------|------------|
| I Ching | 64 hexagramas, sistema de mudança | Modalidade (cardinal/fixo/mutável), Gene Keys |
| Modalidade Astrológica | Ptolomeu | Cardinal age, fixo sustenta, mutável transforma |
| Numerologia da Ação | Pitagórica (já implementada) | Expression Number como padrão de ação |
| PhiTime | Proporção áurea + ciclos | Quando agir, quando esperar |

### 3. Emoção
O mapa afetivo interno.

| Sistema | Base | Cruzamento |
|---------|------|------------|
| Arquétipos Jungianos | Jung, Pearson, Greene, Bolen (já implementado) | Signo, elemento, sombra |
| Estrutura Freudiana | Freud (já implementada) | Elemento → distribuição Id/Ego/Superego |
| Sombra | Jung | Inflação/deflação por arquétipo |
| Linha Dominante | Quiromancia (já implementada) | Força psicológica primária |

### 4. Oculto Simbólico
O que estrutura sem ser visto.

| Sistema | Base | Cruzamento |
|---------|------|------------|
| Kabbalah / Árvore da Vida | Golden Dawn / 777 (já implementado) | Sephirah por signo, caminhos entre Sephiroth |
| Solfeggio | Tradição + síntese (já implementado) | Frequência por signo, harmonia entre mapas |
| Gene Keys | Richard Rudd, derivado do I Ching | 64 chaves: sombra/dom/siddhi — paralelo à sombra junguiana |
| Tarot | Tradição esotérica ocidental | Arcanos Maiores por signo/Sephirah |
| Geometria Sagrada | Tradição hermética (já implementada) | Por elemento: Flor da Vida, Hexagrama, Metatron, Sri Yantra |

### 5. Sincronia
O quando e o onde — Jung nomeou, o sistema calcula.

| Sistema | Base | Cruzamento |
|---------|------|------------|
| PhiTime | Proporção áurea + ciclos de vida | Data de nascimento + φ = momentos de convergência |
| Crossings | Sinastria + phi | Onde dois ciclos se intersectam num ponto áureo |
| Fase Lunar | Astronomia | Lua natal vs lua atual |
| Trânsitos Planetários | Astrologia de trânsitos | Planetas em aspectos áureos com o natal |
| I Ching como Oráculo | 64 hexagramas | Pergunta + momento = hexagrama ativo |

### 6. Natureza
Ciclos externos como espelho do interno.

| Sistema | Base | Cruzamento |
|---------|------|------------|
| Elementos | Ptolomeu, Aristóteles (já implementado) | Fogo, Terra, Ar, Água como linguagem base |
| Estações | Ciclo solar | Modalidade cardinal = início de estação |
| Lua | Ciclo lunar (~29.5 dias) | Fase atual, lua natal, progressões |
| Planetas | Astronomia real | Regências clássicas (já implementado), trânsitos |
| Fibonacci na Natureza | Matemática | φ como estrutura da espiral da vida |

---

## Arquitetura do Ecossistema

```
CARTOGRAFIA DA ALMA
  └── SoulMap (quem você é)
        ├── Físico: chakras, plantas, corpo
        ├── Ação: I Ching, modalidade, numerologia
        ├── Emoção: Jung, Freud, sombra
        ├── Oculto: Kabbalah, Solfeggio, Gene Keys, Tarot
        ├── Sincronia: PhiTime, crossings, trânsitos
        └── Natureza: elementos, lua, planetas, Fibonacci

PHITIME
  └── Quando (momentos de convergência)
        ├── Ciclo de vida + φ
        ├── Lua atual vs natal
        ├── Trânsitos em aspectos áureos
        ├── Frequência do momento
        └── Crossings com outros mapas

ORÁCULO
  └── O quê (revelação com contexto completo)
        ├── SoulMap como contexto
        ├── PhiTime como timing
        └── Pergunta como porta

SOUL MATE
  └── O espaço entre (dois mapas cruzados)
        ├── Dinâmica elemental
        ├── Espelho arquetípico
        ├── Tikkun na Árvore
        ├── Harmonia de frequência
        └── PhiTime do encontro (crossings)

MINDROOT
  └── A vida (onde tudo encontra o dia a dia)
        ├── SoulMap como contexto permanente
        ├── PhiTime como ritmo operacional
        ├── Tarefas com camada ativa
        └── Oráculo integrado ao fluxo
```

---

## Cruzamentos Prioritários (V2)

Por impacto e viabilidade:

| Prioridade | Sistema | Por quê |
|-----------|---------|---------|
| 1 | PhiTime engine | Diferencial único, usa SoulMap existente |
| 2 | Gene Keys | Paralelo direto com sombra junguiana já implementada |
| 3 | Chakras | Cruzamento natural com elementos e Sephiroth |
| 4 | I Ching | Sistema de ação + sincronia, 64 hexagramas |
| 5 | Tarot | Arcanos Maiores por signo, já tem geometria |
| 6 | Medicina das Plantas | Físico + natureza, conteúdo rico |
| 7 | Trânsitos Planetários | Requer efemérides reais (já nos seeds) |

---

## Princípio

Estes sistemas não são crenças paralelas.
São linguagens diferentes descrevendo a mesma estrutura.

Kabbalah e Jung descrevem a psique.
Elementos e chakras descrevem o corpo e o movimento.
PhiTime e I Ching descrevem o timing.
A natureza descreve o padrão que contém tudo.

O produto não escolhe uma linguagem.
Usa todas como espelhos do mesmo ser.

---

## MindRoot como destino final

O SoulMap não é uma leitura que você faz uma vez.
É o contexto permanente da sua vida operacional.

Quando você cria uma tarefa no MindRoot:
- O sistema sabe em que elemento você está hoje (trânsito)
- Sabe se é um momento phi para esse tipo de ação
- Sabe qual arquétipo está ativo
- Sabe a fase lunar

A tarefa não existe isolada.
Existe dentro do seu mapa.

*Isso é o Atom Engine na sua expressão mais completa.*

---

## O que não é

- Não é superstição empacotada em tecnologia
- Não é previsão do futuro
- Não é verdade absoluta

É um conjunto de espelhos consistentes,
com fontes rastreáveis,
que juntos revelam padrões
que uma linguagem só não consegue nomear.

---

*E. — 04 Abr 2026*
*Físico, ação, emoção, oculto, sincronia e natureza — não separados. O mesmo ser visto de seis ângulos.*
