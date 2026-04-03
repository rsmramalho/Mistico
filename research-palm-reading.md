# Research — Palm Reading (Fase 3.5)
## Cartografia da Alma · GUARDIÃO

**Data:** 04 Abr 2026
**Fase:** GUARDIÃO — Research & Validação
**Status:** Completo

---

## 1. PONTE NATURAL COM O ENGINE EXISTENTE

A quiromancia (chiromancy) compartilha a mesma estrutura planetária clássica do sistema Kabbalístico Golden Dawn/777 já implementado. Os 7 montes da palma = 7 planetas = 7 Sephiroth (Binah→Yesod).

### Montes da Palma → Planetas → Sephiroth

| Monte | Localização | Planeta | Sephirah | Signos associados |
|-------|-------------|---------|----------|-------------------|
| **Júpiter** | Base do indicador | Júpiter | Chesed (4) | Sagitário, Peixes |
| **Saturno** | Base do médio | Saturno | Binah (3) | Capricórnio, Aquário |
| **Apolo (Sol)** | Base do anelar | Sol | Tiphareth (6) | Leão |
| **Mercúrio** | Base do mínimo | Mercúrio | Hod (8) | Gêmeos, Virgem |
| **Vênus** | Base do polegar | Vênus | Netzach (7) | Touro, Libra |
| **Marte** | Centro da palma (2 zonas) | Marte | Geburah (5) | Áries, Escorpião |
| **Lua** | Base lateral (oposta ao polegar) | Lua | Yesod (9) | Câncer |

**Nota:** Mesmos 7 planetas, mesmas 7 Sephiroth, mesma cobertura (Binah→Yesod). A ponte é direta e canônica — não é síntese interpretativa. Quiromancia e Kabbalah compartilham a mesma raiz astrológico-planetária.

---

## 2. FORMA DA MÃO → ELEMENTO

A classificação elemental das mãos é padrão na quiromancia moderna:

| Tipo | Palma | Dedos | Elemento | Perfil |
|------|-------|-------|----------|--------|
| **Fogo** | Retangular (longa) | Curtos | Fogo | Energia, ação, instinto, criatividade impulsiva |
| **Terra** | Quadrada | Curtos | Terra | Prático, estável, confiável, sensorial |
| **Ar** | Quadrada | Longos | Ar | Intelectual, comunicativo, curioso, analítico |
| **Água** | Retangular (longa) | Longos | Água | Intuitivo, emocional, imaginativo, empático |

**Conexão direta:** Este elemento alimenta o mesmo sistema do engine — Freud (psique por elemento), Solfeggio (frequência por faixa elemental).

---

## 3. AS 4 LINHAS PRINCIPAIS

| Linha | Localização | Domínio | Conexão psicológica |
|-------|-------------|---------|---------------------|
| **Coração** | Horizontal superior | Emoção, relações, amor | Id (pulsão), Água |
| **Cabeça** | Horizontal média | Intelecto, razão, comunicação | Ego (mediação), Ar |
| **Vida** | Arco do polegar | Vitalidade, saúde, energia | Superego (estrutura), Terra |
| **Destino** | Vertical central | Propósito, direção, vocação | Self (individuação), Fogo |

### Características das linhas

Cada linha pode ser classificada por:
- **Profundidade:** profunda (forte) / rasa (sutil)
- **Comprimento:** longa / curta
- **Curvatura:** reta / curva / bifurcada

A linha dominante (mais profunda e marcada) indica a força psicológica predominante.

---

## 4. TRADIÇÃO KABBALÍSTICA

A quiromancia tem raízes kabbalísticas documentadas:

- **Zohar:** "As impressões digitais e palmares conectam-se à letra Kaf (כ = palma). As linhas da mão correspondem às estrelas e constelações."
- **Asher b. Saul (c. 1215):** "Através das linhas das mãos, os sábios conheceriam o destino do homem."
- **Método astrológico:** Textos kabbalísticos relacionam as linhas principais e partes da mão aos 7 planetas e suas influências.

A Kabbalah afirma que quando a alma se reveste de corpo, ela se imprime particularmente no rosto e nas mãos — sua natureza pode ser revelada por eles.

**Isto não é síntese interpretativa** — é tradição documentada no Zohar e em textos kabbalísticos medievais.

---

## 5. MÉTODO DE ENTRADA

### D9: Como o usuário fornece dados da palma?

| Opção | Método | Prós | Contras |
|-------|--------|------|---------|
| **A** | Foto + IA (visão computacional) | Preciso, impressionante | API externa, complexidade, custo, privacy |
| **B** | Seleção interativa guiada | O usuário participa na descoberta, alinhado com filosofia do app | Subjetivo, requer educação visual |
| **C** | Questionário sobre características | Simples de implementar | Menos imersivo, pode parecer quiz |

**Recomendação do GUARDIÃO: Opção B.**

O app é sobre auto-descoberta, não sobre análise automatizada. O usuário examina sua própria palma e responde:

1. **Forma da mão** — Escolhe entre 4 silhuetas visuais (Fogo/Terra/Ar/Água)
2. **Monte dominante** — Toca a região mais proeminente da palma num diagrama interativo
3. **Linha dominante** — Indica qual linha é mais profunda/marcada (Coração/Cabeça/Vida/Destino)
4. **Nome** — Para numerologia (mesmo input da porta de nascimento)

4 inputs → reading completo.

---

## 6. DERIVAÇÃO DO READING

A partir dos 4 inputs, o engine produz o mesmo SoulMap:

| Campo SoulMap | Via Nascimento | Via Palma |
|---------------|----------------|-----------|
| `sunSign` | Data → signo solar | Monte dominante → signo principal do planeta |
| `element` | Signo → elemento | Forma da mão → elemento |
| `modality` | Signo → modalidade | Derivada do signo |
| `ascendant` | Hora → aproximação | Não aplicável (null) |
| `sephirah` | Signo → planeta → Sephirah | Monte dominante → planeta → Sephirah |
| `archetype` | Signo → arquétipo | Signo derivado → arquétipo |
| `psyche` | Elemento → distribuição | Elemento da mão → distribuição |
| `frequency` | Signo → frequência | Signo derivado → frequência |
| `numerology` | Nome → Expression Number | Nome → Expression Number (mesmo) |

### Resolução Monte → Signo

Quando um monte tem 2 signos associados (ex: Júpiter → Sagitário/Peixes), a **linha dominante** desempata:

| Linha dominante | Tendência | Resultado |
|-----------------|-----------|-----------|
| Coração (Água) | Receptivo, emocional | Signo noturno/mutável do par |
| Cabeça (Ar) | Racional, analítico | Signo diurno/fixo do par |
| Vida (Terra) | Prático, estruturado | Signo cardinal/terra-adjacente |
| Destino (Fogo) | Propósito, ação | Signo cardinal/fogo-adjacente |

### Montes com signo único
Sol (Leão) e Lua (Câncer) não precisam de desempate.

---

## 7. DECISÕES DO GUARDIÃO

### D9: Método de entrada
**Decisão proposta:** Seleção interativa guiada (Opção B).
**Razão:** Alinhado com a filosofia do app — auto-descoberta participativa. O usuário se observa.
**Rick decide.**

### D10: Desempate monte→signo via linha dominante
**Decisão proposta:** Usar a linha dominante como modificador para resolver pares planetários.
**Nota:** Este é mapeamento interpretativo original — não há tradição canônica que resolva assim.
**Rick decide.**

### D11: Campo de origem no SoulMap
O SoulMap precisa de um campo para indicar se a leitura veio de dados de nascimento ou da palma:
- **Proposta:** `source: 'birth' | 'palm'` no BirthData (renomeado para InputData) ou no SoulMap

### D12: Ascendente na leitura de palma
Não há como derivar ascendente da palma. Campo fica `null`.
**Proposta:** Na revelação, essa seção é substituída por "Linha Dominante" — a força psicológica primária indicada pela palma.

---

## 8. ALINHAMENTO COM SOUL MATE (Fase 4)

Palm reading como segunda porta de entrada cria uma possibilidade interessante para Soul Mate:
- Pessoa A entra por data de nascimento, Pessoa B entra pela palma
- O cruzamento compara dois readings de origens diferentes
- A leitura cruzada revela complementaridade entre destino (nascimento) e natureza (palma)

Isso reforça a ideia de "encontro deliberado" — duas pessoas que se revelam por caminhos diferentes.

---

## FONTES

- Golden Dawn / 777 — correspondências planetárias dos montes
- Zohar — tradição kabbalística de quiromancia
- Asher b. Saul (c. 1215) — registro histórico mais antigo
- Fred Gettings — *The Book of the Hand* (1965)
- Casimir d'Arpentigny — classificação quirognômica
- Classificação elemental moderna — padronizada na quiromancia ocidental

---

*Research compilado em 04 Abr 2026 — GUARDIÃO / Claude Code*
*A ponte quiromancia↔Kabbalah é tradição documentada, não síntese interpretativa.*
