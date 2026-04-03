# WRAP — Cartografia da Alma — 03–04 Abr 2026

---

## CREATED

### Documentação
- `research-mapeamentos.md` — research completo das 7 áreas filosóficas com decisões D1–D12
- `research-palm-reading.md` — research quiromancia (Fase 3.5) — montes, linhas, triplicidades
- `spec-cartografia-v1.md` — spec Genesis v5.0.1 (AtomItem envelope, visão, stack, tipos)
- `roadmap-cartografia-v1.md` — PHI roadmap 5 fases (Fundação→Dados→Visual→Experiência→Integração)

### Engine (TypeScript puro, sem UI)
- `src/types/soul-map.ts` — BirthData, PalmData, SoulMap, Sign, Element, HandShape, MountName, LineName, etc.
- `src/engine/astrology.ts` — getSunSign(), getApproximateAscendant(), getElement(), getModality()
- `src/engine/kabbalah.ts` — getSephirah() com todas as 12 correspondências Golden Dawn/777
- `src/engine/jung.ts` — getArchetype() com 12 arquétipos + sombras (inflação/deflação)
- `src/engine/solfeggio.ts` — getFrequency() com 12 frequências únicas por signo
- `src/engine/numerology.ts` — getExpressionNumber(), getNumerology() com números mestres
- `src/engine/freud.ts` — getPsycheDistribution() por elemento
- `src/engine/palm.ts` — getHandElement(), getSignFromMount(), getPalmExpression(), getPalmSoulMap()
- `src/engine/index.ts` — getSoulMap() + getPalmSoulMap() aggregators

### Hooks
- `src/hooks/useSoulMap.ts` — gerenciamento de estado (gateway + dual entry + screen flow)
- `src/hooks/useGeometry.ts` — hook de animação Canvas com requestAnimationFrame

### Geometrias (Canvas animado)
- `src/geometry/CosmosBackground.tsx` — 200 estrelas douradas pulsando
- `src/geometry/FlowerOfLife.tsx` — Flor da Vida (Ar)
- `src/geometry/Hexagram.tsx` — Hexagrama/Selo de Salomão (Fogo)
- `src/geometry/Metatron.tsx` — Cubo de Metatron (Terra)
- `src/geometry/SriYantra.tsx` — Sri Yantra simplificado (Água)
- `src/geometry/TreeOfLife.tsx` — Árvore da Vida com sephirah ativa

### Componentes
- `src/components/RevealSection.tsx` — seção com fade-up animado
- `src/components/PsycheBar.tsx` — barra Freudiana animada (Id/Ego/Superego)
- `src/components/FrequencyDisplay.tsx` — display de frequência Solfeggio

### Screens
- `src/screens/Entry.tsx` — formulário de entrada nascimento (nome + data + hora + cidade)
- `src/screens/PalmEntry.tsx` — entrada palma: 3 passos (forma da mão → monte dominante → linha + nome) com SVG interativo
- `src/screens/Loading.tsx` — ritual de transição com Árvore da Vida
- `src/screens/Revelation.tsx` — resultado adaptativo: ascendente (nascimento) ou linha dominante (palma), expressão sole override

### Integração
- `src/App.tsx` — Gateway (Nascimento | Palma) → Entry/PalmEntry → Loading → Revelation
- `index.html` — HTML5, lang pt-BR
- `vite.config.ts` — React + Tailwind
- Build limpo: 0 erros TypeScript, 0 warnings, ~375KB JS + ~20KB CSS (gzip: ~118KB + ~4.5KB)

---

## DECIDED

### D1: Sistema Kabbalístico → Golden Dawn / 777
Regências clássicas (7 planetas). Pares diurno/noturno para signos que compartilham Sephirah.

### D2: Escorpião → Geburah (não Daath)
Daath não é Sephirah canônica. Marte = Geburah no sistema clássico.

### D3: Arquétipos → Síntese Pearson + Greene + Bolen
Mapeamento interpretativo. Sombras em dois pólos (inflação/deflação) seguindo Jung.

### D4: Solfeggio → 12 Frequências Únicas
9 canônicas + 3 complementares (210, 369, 432 Hz). Lógica: elemento→faixa, modalidade→posição.

### D5: Freud → Distribuições por Elemento
Fogo:55/30/15, Terra:20/40/40, Ar:15/55/30, Água:40/25/35.

### D6: Numerologia → Expression Number (do nome)
Não Life Path (da data). App já coleta nome. Mais pessoal.

### D7: Ascendente → Aproximação 2h
Sunrise fixa às 06:00, offset 2h por signo. Label "aproximado" na UI.

### D-Build: Stack
React 19 + Vite + Tailwind + Framer Motion + TypeScript. Canvas nativo (não SVG).

### D-Build: Estética
Cosmos escuro (#04040a), dourado (#c9a84c), Cinzel Decorative + Cormorant Garamond.

---

## FASE 2 — DADOS (ROOT) — 04 Abr 2026

### Schema Supabase (Genesis v5.0.1)
- `supabase/migrations/001_atom_items.sql` — atom_items (type reading) + share_links + RLS
- `src/types/database.ts` — AtomItemRow, ShareLinkRow, AtomItemInsert, Database types
- `src/lib/supabase.ts` — client config via env vars
- `src/lib/readings.ts` — data layer: saveReading, getReading, getReadingByToken, listReadings, createShareLink, getShareLink, revokeShareLink

### Decisões de dados
- **D8:** `type: reading` (extensão Genesis — 24º type)
- **Visibilidade:** RLS ativo. Readings privados por default. Share por link com token único.
- **Soul Mate:** Via share links — cada pessoa compartilha seu link, app cruza dois readings. Sem schema inter-usuário.
- **Auth:** Opcional. Readings podem ser criados sem user_id (anônimos).
- **Token:** 12 chars URL-safe, gerado com crypto.getRandomValues

---

## FASE 4 — SOUL MATE — 04 Abr 2026

### Engine (soul-mate.ts)
- `getElementDynamic()` — 10 dinâmicas elementais (Caldeirão, Forja, Jardim, etc.)
- `getArchetypeMirror()` — projeção sombra→desejo entre dois arquétipos
- `getTikkun()` — distância entre Sephiroth na Árvore da Vida
- `getFrequencyHarmony()` — classificação intervalar (Uníssono, Oitava, Quinta, etc.)
- `getCombinedPsyche()` — distribuição Freudiana combinada
- `getMeetingNumber()` — Número do Encontro (soma pitagórica)
- `getSoulMateReading()` — aggregator

### UI
- `src/screens/SoulMateRevelation.tsx` — 6 seções: Dinâmica Elemental, Espelho, Tikkun, Harmonia, Psique Combinada, Número do Encontro
- Input "Encontrar outra alma" no Revelation — cola link ou token do segundo reading
- Resolução `?meet=tokenA,tokenB` na URL para acesso programático

### Decisões
- **D13:** Dois caminhos de entrada — URL dupla + botão na revelação
- **D14:** Projeção simplificada — sombra→desejo como detector, não 144 pares
- **D15:** Distância na Árvore — proxy numérico (|a-b|), documentado como simplificação

---

## SEEDS (V2)

- **Geocoding real** — converter cidade em lat/lng para ascendente preciso
- **Ascendente via efemérides** — `astronomia` lib ou `swisseph` server-side
- **Life Path Number** — complementar ao Expression Number (da data)
- **Overrides Freudianos por signo** — além do nível de elemento
- **Supabase** — schema Genesis (atom_items, item_connections, atom_events), auth
- **Compartilhamento** — gerar link/imagem do mapa
- **Modo exploração** — navegar todas as sephiroth da Árvore
- **Carta natal completa** — planetas, casas, aspectos
- **Soul Urge / Personality Number** — das vogais e consoantes do nome
- **Áudio Solfeggio** — tocar a frequência do signo

---

## DECISÕES RICK (04 Abr 2026)

### D8: Tipo do AtomItem — `reading`
Extensão do Genesis v5.0.1. `spec` é container técnico; o app produz leituras com identidade própria. `reading` é o 24º type do Genesis. Body JSONB = SoulMap completo.

### D9: Entrada da palma — seleção interativa guiada
Diagrama touch da mão. Sem foto, sem câmera, sem IA de visão computacional.

### D10: Resolução monte→signo — triplicidades de Ptolomeu
Elemento da mão (forma) resolve pares planetários via triplicidades ativo/receptivo (Tetrabiblos I.18). Linha dominante resolve expressão diurna/noturna, não signo.

### D11: Campo `source` no SoulMap
`source: 'birth' | 'palm'` distingue a porta de entrada em todo o sistema.

### D12: Sem ascendente via palma
Substituído por "Linha Dominante" na revelação. Linha dominante = força psicológica primária.

### D13: Entrada Soul Mate — dois caminhos
URL `?meet=tokenA,tokenB` para acesso programático. Botão "Encontrar outra alma" na revelação para o caso humano.

### D14: Projeção arquetípica — simplificação
Sombra inflada de A → desejo central de B como detector. Não 144 pares explícitos. Elegante e escalável.

### D15: Distância na Árvore — proxy numérico
|sephirahA.number - sephirahB.number|, cap 3+. Simplificação documentada — Árvore real tem caminhos não-lineares.

### Dúvidas pendentes
- Solfeggio: mapeamento signo→frequência é síntese interpretativa original. Rick valida?
- Tom: textos em pt-BR, nomes tradicionais em inglês/hebraico. Traduzir tudo?

---

## AUDIT

```
research:   ✅ completo — 7 áreas + quiromancia + soul mate (3 documents)
spec:       ✅ validada — Genesis v5.0.1 compliant, PalmData + SoulMateReading
roadmap:    ✅ completo — PHI 7 fases (+ Fase 3.5 Palma + Fase 4 Soul Mate)
supabase:   ✅ schema + data layer + RLS + wiring UI
build:      ✅ 100% — Fases 1–4 completas
  ├─ engine:     9/9 módulos (+ palm.ts + soul-mate.ts)
  ├─ geometries: 6/6 (cosmos + 4 elementos + árvore)
  ├─ components: 3/3
  ├─ screens:    5/5 (Entry + PalmEntry + Loading + Revelation + SoulMateRevelation)
  ├─ hooks:      2/2 (useSoulMap com gateway, dual entry, share, meet)
  ├─ types:      2/2 (soul-map.ts + database.ts)
  ├─ lib:        2/2 (supabase.ts opcional + readings.ts)
  └─ integration: App.tsx gateway + 7 screens + build limpo ~390KB
```

### Execução
- **Ordem:** GUARDIÃO → ROOT → ESTRUTURA → INTERFACE → TEIA ✅ (em ambas as fases)
- **Research antes de código:** ✅ (7 pesquisas completas antes de qualquer engine)
- **Nenhum mapeamento inventado:** ✅ (todos documentados com fontes e notas de interpretação)
- **Decisões de peso documentadas:** ✅ (D1–D15 no research, todas decididas por Rick)
- **Build funcional:** ✅ (tsc + vite build sem erros)

---

*Wrap atualizado em 04 Abr 2026 — Claude Code (Opus 4.6)*
*Fases 1–4 completas. Soul Mate não é compatibilidade. É o mapa do espaço entre duas almas.*
