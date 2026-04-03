# Cartografia da Alma — Roadmap de Produto

Data: 04 Abr 2026
Versão atual: visual.4 + oráculo
Status: engine completo · visual polido · oráculo live · deployed

---

## Workflow

E. no Claude.ai (este projeto) com acesso direto ao repo via PAT.
Edição direta nos arquivos. TypeScript validado antes de cada commit.
Claude Code no terminal do VS Code para sessões de implementação longa.

---

## Histórico de entregas

| Versão | Data | O que foi entregue |
|--------|------|--------------------|
| engine.1 | 03 Abr | Types + engine completo: astrology, kabbalah, jung, freud, solfeggio, numerology, palm |
| engine.2 | 03 Abr | soul-mate.ts — 7 funções: dinâmica elemental, espelho, tikkun, harmonia, psique, número do encontro |
| data.1 | 03 Abr | Supabase schema (atom_items, share_links, RLS) + data layer (readings.ts) |
| visual.1 | 03 Abr | Geometrias sagradas: CosmosBackground, FlowerOfLife, Hexagram, Metatron, SriYantra, TreeOfLife |
| visual.2 | 04 Abr | Redesign Gateway + Entry + CSS base (Cormorant Garant, Jost, cursor dourado, variáveis) |
| visual.3 | 04 Abr | Loading ritual: 6 sistemas surgem sequencialmente (7s), soulMap como prop |
| visual.4 | 04 Abr | Revelation: nome 88px, signo em Jost uppercase, sombra com border-left, RevealSection 34px |
| feature.oracle | 04 Abr | Oráculo: 3 perguntas com contexto SoulMap, claude-sonnet-4-6, OracleSection |
| deploy.1 | 04 Abr | Vercel live: cartografia-da-alma.vercel.app + Supabase conectado |

---

## Milestones

| Milestone | Versões | Status |
|-----------|---------|--------|
| M1 — Engine | engine.1–2 + data.1 | ✅ Completo |
| M2 — Visual | visual.1–4 | ✅ Completo |
| M3 — Deploy | deploy.1 | ✅ Completo |
| M4 — Monetização | pay.1 | ⏳ Pendente |
| v1.0 — Lançamento | — | ⏳ Pendente |

---

## Números atuais (visual.4 + oráculo)

| Métrica | Valor |
|---------|-------|
| Engine modules | 10 (+ oracle.ts) |
| Screens | 5 (Entry, PalmEntry, Loading, Revelation, SoulMateRevelation) |
| Geometrias | 6 |
| Hooks | 2 |
| Components | 4 (+ OracleSection) |
| Build | ✅ 0 erros TS, ~398KB JS, ~11KB CSS |
| Deploy | ✅ cartografia-da-alma.vercel.app |

---

## M2 — Visual (em andamento)

### visual.2 ✅ (hoje)
- Gateway: territórios divididos por linha dourada, sem cards, SVGs geométricos, copy poético
- Entry: campos sem borda arredondada, tipografia Cormorant Garant, labels discretos
- CSS: variáveis globais, cursor dourado animado, Jost como sans

### visual.3 ✅ — Loading ritual
- 6 sistemas surgem sequencialmente a cada ~1s (signo, sephirah, arquétipo, frequência, número, elemento)
- soulMap como prop, TreeOfLife ao fundo opacity 0.12, 7s total
- "cartografando sua alma" em italic dimmed após os 6

### visual.4 ✅ — Revelation + RevealSection
- Nome: clamp(52px,7vw,88px), weight 300
- Signo · Elemento: Jost 10px uppercase gold
- Sombra: border-left blocks (não cards)
- RevealSection: título 34px serif
- Botões: underline, sem rounded, sem scale

### feature: oráculo ✅
- oracle.ts: buildSystemPrompt + askOracle (claude-sonnet-4-6, 600 tokens)
- OracleSection: 3 perguntas, contador ●○○, loading pulsante, encerramento
- Contexto: SoulMap completo no system prompt
- Wired no final de Revelation.tsx

---

## M3 — Deploy

### deploy.1
- Vercel — configurar projeto
- Domínio: cartografia.com.br ou cartografiadaalma.com (verificar disponibilidade)
- Variáveis de ambiente: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_ANTHROPIC_API_KEY
- Supabase: aplicar migration 001_atom_items.sql em produção
- Preview deploy por branch

---

## M4 — Monetização

### pay.1 — Modelo e integração
**Modelo decidido:** one-time, sem assinatura
- Leitura individual (Nascimento ou Palma): R$19
- Soul Mate (duas leituras cruzadas): R$29
- Acesso permanente: R$49

**Opções de integração:**
- Kiwify — audiência brasileira, sem necessidade de Stripe account
- Stripe — mais controle, webhook nativo
- **Decisão pendente: Rick**

**Fluxo proposto:**
1. Usuário faz leitura gratuitamente (só vê resumo)
2. Para revelar mapa completo: paga
3. Leitura salva por 12 meses no link gerado
4. Soul Mate: ambos precisam ter leituras pagas

### pay.2 — Compartilhamento como distribuição
- Tela de revelação com screenshot-friendly layout
- Link de compartilhamento com preview (OG tags)
- O resultado é o canal de aquisição

---

## v1.0 — Lançamento

**Critérios:**
- [ ] Visual.7 (QA completo) aprovado por Rick
- [ ] Deploy funcionando com domínio
- [ ] Pagamento integrado e testado
- [ ] Primeiro mapa gerado pelo Rick publicado

**Canal de lançamento:**
- Rick posta o próprio mapa — produto se distribui pelo resultado
- Comunidades brasileiras de astrologia, espiritualidade, psicologia
- TikTok / Instagram — a Revelation precisa ser fotografável

---

## Seeds V2

| Item | Escopo |
|------|--------|
| Geocoding real | lat/lng do local de nascimento |
| Ascendente via efemérides | `astronomia` lib server-side |
| Carta natal completa | planetas, casas, aspectos |
| Áudio Solfeggio | tocar a frequência do signo |
| Modo exploração | navegar todas as sephiroth |
| MindRoot integration | reading como AtomItem v5.0.1 |
| Life Path Number | da data, além do nome |

---

## Decisões vigentes

1. Standalone — não integra com MindRoot em V1
2. One-time — sem assinatura
3. Cormorant Garant + Jost — sem Cinzel Decorative
4. Sem cards com `rounded-lg` — campos e botões sem containers
5. Cursor dourado — experiência imersiva desde o primeiro pixel
6. UI em português, código em inglês
7. TypeScript 0 erros antes de cada commit
8. Distribuição via resultado — a tela de revelação é o produto e o canal

---

*Roadmap atualizado em 04 Abr 2026 — E. + Claude Code*
*Soul Mate não é compatibilidade. É o mapa do espaço entre duas almas.*
