# Roadmap — Cartografia da Alma V1
## PHI Meta-Template v2.0

---

```
·  (1)  FUNDAÇÃO
—  (1)  DADOS
△  (2)  VISUAL
◇  (3)  PALMA
□  (3)  EXPERIÊNCIA
⬠  (5)  INTEGRAÇÃO
```

---

## · (1) FUNDAÇÃO — Research + Spec + Mapeamentos

```
protocol: GUARDIÃO
status:   ✅ completo
output:   research-mapeamentos.md, spec-cartografia-v1.md, roadmap-cartografia-v1.md
```

**Entregas:**
- [x] Research Kabbalah ↔ Astrologia (Golden Dawn / 777)
- [x] Research Arquétipos Jungianos × 12 Signos (Pearson + Greene)
- [x] Research Frequências Solfeggio (9 canônicas + 3 complementares)
- [x] Research Estrutura Freudiana × Elementos (distribuições %)
- [x] Research Numerologia Pitagórica (Expression Number)
- [x] Research Ascendente (aproximação V1 + libs V2)
- [x] Spec Genesis v5.0.1
- [x] Roadmap PHI

**Decisões registradas:** D1–D8 no research (D8 decidido por Rick, 04 Abr 2026). D9–D12 adicionadas para Fase PALMA.

---

## — (1) DADOS — Motor de Cálculo

```
protocol: ROOT
status:   🔄 em progresso
output:   src/types/soul-map.ts, src/engine/*.ts
depends:  FUNDAÇÃO
```

**Entregas:**
- [ ] `types/soul-map.ts` — BirthData, SoulMap, enums (Sign, Element, Sephirah, Archetype)
- [ ] `engine/astrology.ts` — getSunSign(), getApproximateAscendant(), getElement()
- [ ] `engine/kabbalah.ts` — getSephirah(), getSephirahExpression()
- [ ] `engine/jung.ts` — getArchetype(), getShadow()
- [ ] `engine/numerology.ts` — getExpressionNumber(), getNumberMeaning()
- [ ] `engine/solfeggio.ts` — getFrequency(), getFrequencyDesc()
- [ ] `engine/freud.ts` — getPsycheDistribution()
- [ ] `engine/index.ts` — getSoulMap(BirthData): SoulMap

**Regra:** Dados puros. Sem UI. Sem Canvas. Só TypeScript.

---

## △ (2) VISUAL — Geometria Sagrada + UI

```
protocol: ESTRUTURA → INTERFACE
status:   ⏳ pendente
output:   src/geometry/*.tsx, src/components/*.tsx, hooks
depends:  DADOS
```

**Entregas:**
- [ ] `useGeometry.ts` — hook de animação Canvas
- [ ] `useSoulMap.ts` — hook React consumindo engine
- [ ] `FlowerOfLife.tsx` — geometria Ar (Canvas animado)
- [ ] `Hexagram.tsx` — geometria Fogo (Canvas animado)
- [ ] `Metatron.tsx` — geometria Terra (Canvas animado)
- [ ] `SriYantra.tsx` — geometria Água (Canvas animado)
- [ ] `TreeOfLife.tsx` — overlay sempre presente
- [ ] `CosmosBackground.tsx` — estrelas pulsando
- [ ] `RevealSection.tsx` — seção com fade-up
- [ ] `PsycheBar.tsx` — barra Freudiana animada
- [ ] `FrequencyDisplay.tsx` — display de frequência

**Estética:** Cosmos escuro (#04040a), dourado (#c9a84c), Cinzel + Cormorant Garamond.

---

## ◇ (3) PALMA — Leitura de Mão

```
protocol: ESTRUTURA → INTERFACE
status:   🔄 em progresso
output:   src/engine/palm.ts, src/types/palm.ts, src/components/PalmDiagram.tsx, src/screens/PalmEntry.tsx
depends:  VISUAL + DADOS
```

**Entregas:**
- [ ] `engine/palm.ts` — resolveMountToSign(), getDominantLineExpression(), getPalmSoulMap()
- [ ] `types/palm.ts` — PalmData, Mount, HandShape, PalmLine enums
- [ ] `PalmDiagram.tsx` — diagrama interativo da mão com montes selecionáveis (touch)
- [ ] `PalmEntry.tsx` — UI de seleção: forma da mão + monte dominante + linha dominante
- [ ] Adaptação de `Revelation.tsx` — modo palm: sem ascendente, com "Linha Dominante"

**Nota:** Research completo em `research-mapeamentos.md` (seção 7 — Quiromancia). Decisões D9–D12.

---

## □ (3) EXPERIÊNCIA — Fluxo Completo

```
protocol: INTERFACE
status:   ⏳ pendente
output:   src/screens/*.tsx
depends:  VISUAL
```

**Entregas:**
- [ ] `Entry.tsx` — formulário: nome + data + hora (opt) + cidade (opt)
- [ ] `Loading.tsx` — ritual de transição (3s com animação)
- [ ] `Revelation.tsx` — resultado completo com 6 seções em fade sequencial
  - Sephirah + Expressão (diurna/noturna)
  - Arquétipo + Sombra (dois pólos)
  - Frequência + Palavra-chave
  - Numerologia + Significado
  - Ascendente (aproximado)
  - Psique (barra Id/Ego/Superego)

**Princípio:** Revelar progressivamente. Cada seção com delay.

---

## ⬠ (5) INTEGRAÇÃO — Deploy + Wrap

```
protocol: TEIA
status:   ⏳ pendente
output:   App.tsx, WRAP-CARTOGRAFIA.md
depends:  EXPERIÊNCIA
```

**Entregas:**
- [ ] `App.tsx` — roteamento Entry → Loading → Revelation
- [ ] Responsivo mobile-first
- [ ] Cross-check: engine ↔ UI ↔ research
- [ ] Verificar todos os mapeamentos contra research
- [ ] `WRAP-CARTOGRAFIA.md` — documento final
- [ ] Build funcional (Vite)

---

## Seeds V2

```
status: documentados, não implementados
```

- Supabase: schema Genesis (atom_items, item_connections, atom_events)
- Geocoding real (lat/lng do local de nascimento)
- Ascendente via efemérides (`astronomia` lib)
- Life Path Number (da data de nascimento)
- Overrides Freudianos por signo
- Compartilhamento de mapa
- Modo exploração (todas as sephiroth)
- Carta natal completa
- Auth + persistência de mapas
- Soul Mate via shared palm readings

---

*Roadmap escrito em 03 Abr 2026 — GUARDIÃO / Claude Code*
*"O horizonte é mais interessante do que qualquer chegada."*
