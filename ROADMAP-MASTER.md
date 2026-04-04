# Cartografia da Alma — Roadmap Master

**Versão:** 1.0  
**Data:** 04 Abr 2026  
**Princípio:** *O oculto não substitui o dado. Revela o padrão por baixo do dado.*

> Este documento substitui `ROADMAP.md` e `ROADMAP-PHI.md`.  
> É a fonte única de verdade. Se não está aqui, não está planejado.

---

## O produto

App místico standalone. Seis tradições filosóficas com fontes rastreáveis — Astrologia, Kabbalah, Jung, Freud, Solfeggio, Numerologia — convertidas em mapa pessoal único. Cada leitura é irrepetível. O oráculo responde com o mapa como contexto.

Não é horóscopo. É cartografia.

```
Fluxo:  Landing → Gateway → Entry → Loading (7s ritual) → Revelation → Oráculo
Stack:  React 19 · Vite · TypeScript · Tailwind · Framer Motion · Canvas
Infra:  Supabase (atom_items + share_links) · Anthropic API (oráculo)
Deploy: cartografia-da-alma.vercel.app
Repo:   github.com/rsmramalho/Mistico
```

---

## Os três pilares

Toda decisão de produto é julgada por esses três. Sem exceção.

```
Experiência   →  A revelação acontece no tempo da pessoa. Não é relatório — é descoberta.
Confiança     →  Cada conclusão tem origem rastreável. Não é misticismo vazio.
Imersividade  →  Do primeiro pixel ao oráculo. A câmara não quebra.
```

---

## Espiral PHI — visão geral

```
✅  ·   (1)  Fase 1 — Motor         engine + visual + deploy + oráculo
⬡       (1)  Fase 2 — Contrato      landing + supabase confirmado + mobile QA
⚪  △   (2)  Fase 3 — Imersão       áudio + revelação sequencial + screenshot-ready
⚪  □   (3)  Fase 4 — Confiança     fontes na UI + síntese inicial + ascendente real
⚪  ⬠  (5)  Fase 5 — Conexão       soul mate + OG tags + PDF + share completo
⚪  ⬡  (8)  Fase 6 — Distribuição  paywall + Kiwify/Stripe + domínio + SEO
⚪  ○  (13)  Fase 7 — Lançamento    QA total + Rick posta + produto no mundo
```

**Regra:** Uma fase por vez. A fase atual fecha antes da próxima começar.

---

## Histórico de entregas

| Versão | Data | Entregue |
|--------|------|----------|
| engine.1 | 03 Abr | Types + 7 módulos: astrology, kabbalah, jung, freud, solfeggio, numerology, palm |
| engine.2 | 03 Abr | soul-mate.ts — 7 funções: elemental, espelho, tikkun, harmonia, psique, número |
| data.1 | 03 Abr | Supabase schema (atom_items, share_links, RLS) + data layer completo |
| visual.1 | 03 Abr | Geometrias: CosmosBackground, FlowerOfLife, Hexagram, Metatron, SriYantra, TreeOfLife |
| visual.2 | 04 Abr | Gateway + Entry + CSS base (Cormorant Garant, Jost, cursor dourado, variáveis) |
| visual.3 | 04 Abr | Loading ritual: 6 sistemas emergem sequencialmente (7s), TreeOfLife ao fundo |
| visual.4 | 04 Abr | Revelation: nome 88px, signo uppercase, sombra border-left, RevealSection 34px |
| feature.oracle | 04 Abr | oracle.ts + OracleSection: 3 perguntas, claude-sonnet-4-6, SoulMap completo |
| feature.bridges | 04 Abr | bridges.ts: linhas de transição cross-system computadas por mapa |
| feature.landing | 04 Abr | Landing.tsx: Flor da Vida girando, três momentos, CTA único |
| feature.synthesis | 04 Abr | SynthesisBlock + FooterBlock inline na Revelation |
| deploy.1 | 04 Abr | Vercel: cartografia-da-alma.vercel.app + VITE_ANTHROPIC_API_KEY ✅ |
| data.2 | 04 Abr | Supabase: VITE_SUPABASE_URL ✅ + VITE_SUPABASE_ANON_KEY ✅ |

---

## ✅ Fase 1 — Motor (effort: 1)

**Status:** completo  
**Último commit:** efa68f1

O que o produto sabe sobre cada pessoa. Engine + visual + deploy + oráculo.

### Engine — 10 módulos ✅
- astrology, kabbalah, jung, freud, solfeggio, numerology, palm, soul-mate, oracle, bridges
- Conteúdo reescrito: Jung (12 arquétipos em 2ª pessoa), Kabbalah (11 sephiroth + 12 expressões por signo), Numerologia (12 números com peso real)
- Bridges: linhas de transição computadas da combinação específica de cada mapa

### Visual — 5 screens ✅
- Landing: Flor da Vida girando, CTA único, zero explicação
- Gateway: dois territórios, linha dourada, SVGs geométricos
- Entry: Cormorant Garant, border-bottom apenas, sem rounded
- Loading: 6 sistemas emergem 1 a 1 durante 7s
- Revelation: nome clamp(52-120px), scroll-triggered, geometria viva, Oracle como portal separado

### Deploy ✅
- Vercel: cartografia-da-alma.vercel.app no ar
- Supabase: schema aplicado, env vars configuradas
- Anthropic API: VITE_ANTHROPIC_API_KEY confirmada

### Métricas atuais
| Métrica | Valor |
|---------|-------|
| Engine modules | 10 + oracle |
| Screens | 5 |
| Geometrias | 6 |
| Components | RevealSection, OracleSection, Bridge, SynthesisBlock, FooterBlock, FrequencyDisplay, PsycheBar |
| Hooks | useSoulMap, useInView, useGeometry |
| Build | ✅ 0 erros TS · ~400KB JS |

---

## ⬡ Fase 2 — Contrato (effort: 1)

**Status:** em progresso  
**Protocolo:** surface + foundation

O produto funciona de ponta a ponta. Salva. Compartilha. Abre. O contrato com o usuário é cumprido.

### Pendentes

**2.1 — Supabase em produção**
- [ ] Abrir SQL Editor no Supabase Dashboard
- [ ] Confirmar se tabela `atom_items` existe
- [ ] Se não: aplicar `supabase/migrations/001_atom_items.sql`
- [ ] Testar INSERT + SELECT + share_links ao vivo

**2.2 — Share desacoplado**
- [ ] Botão "compartilhar mapa" aparece sempre (não depende de `readingId`)
- [ ] Estados: preparando... / compartilhar / gerando... / copiar link
- [ ] Se Supabase falha silenciosamente: botão tenta retry ao clicar
- [ ] Floating share button: mesma lógica

**2.3 — Mobile QA**
- [ ] Landing no iPhone — Flor da Vida responsiva
- [ ] Gateway no iPhone — territórios legíveis
- [ ] Revelation no iPhone — nome grande, scroll fluido
- [ ] Oracle no iPhone — campo de texto, resposta legível
- [ ] Footer — botões não quebram em linha

**2.4 — Soul Mate — ponto de entrada**
- [ ] SoulMateRevelation.tsx existe, fluxo existe no hook
- [ ] Foi removido do Gateway (correto)
- [ ] Precisa de novo ponto de entrada: FooterBlock da Revelation
  - Input + botão "encontrar outra alma" já existe em FooterBlock
  - Verificar se meetAnotherSoul está wired corretamente

**Critério de fechamento:** Rick gera mapa, scrolla até o fim, clica compartilhar, abre o link numa aba nova, o mapa carrega.

---

## ⚪ Fase 3 — Imersão (effort: 2)

**Status:** futuro  
**Protocolo:** surface

A revelação como experiência sensorial. Não relatório — descoberta.

- [ ] **Áudio Solfeggio** — frequência do signo toca ao fundo durante Revelation
  - Web Audio API, zero biblioteca externa
  - OscillatorNode + GainNode, fade in 2s, fade out ao sair da seção
  - Ex: Peixes → 528 Hz, Áries → 396 Hz
  - O loop fecha: você lê sobre 528 Hz enquanto ouve 528 Hz
- [ ] **Revelação sequencial** — opção de navegar sistema a sistema
  - Não substitui o scroll contínuo — é modo alternativo
  - Botão no topo da Revelation: "revelar por etapas"
  - Cada sistema ocupa o viewport inteiro, navegação manual
- [ ] **Screenshot-friendly** — primeiro viewport como card de compartilhamento
  - Nome + signo + elemento + geometria em proporção Instagram Stories (9:16)
  - Botão "salvar como imagem" usando html2canvas no primeiro viewport
- [ ] **Palma como add-on** — não como entrada principal
  - Após Revelation de nascimento: "aprofundar via palma da mão"
  - PalmEntry acessível a partir da Revelation, não do Gateway

---

## ⚪ Fase 4 — Confiança (effort: 3)

**Status:** futuro  
**Protocolo:** logic + surface

Cada conclusão tem origem rastreável. Isso nos separa de qualquer horóscopo.

- [ ] **Fontes na UI** — por sistema, linha lógica visível
  - Exemplo: "Peixes → regente Júpiter → Chesed (Golden Dawn 777) → Misericórdia"
  - Não nota de rodapé — parte da leitura
  - Expandível via `<details>` ou seção colapsável por RevealSection
- [ ] **Nome dos pais (opcional)**
  - Campo adicional na Entry: "(opcional — aprofunda a numerologia)"
  - Muda resultado: numerologia kabbalística usa nome completo do pai e mãe
  - Posição: dado de entrada, não pós-processamento
- [ ] **Síntese inicial do oráculo**
  - Antes de qualquer pergunta: o mapa fala
  - Uma chamada API → 2-3 parágrafos, SoulMap completo no system prompt
  - "O que seu mapa diz antes de você perguntar"
  - Renderiza ao abrir OracleSection, não bloqueia as 3 perguntas
- [ ] **Ascendente preciso**
  - Hoje: aproximado por horário
  - Fase 4: OpenCage geocoding → lat/lng → cálculo de ascendente real
  - Campo adicional na Entry: cidade de nascimento (opcional)
  - Se não fornecida: ascendente continua aproximado, marcado como "estimado"

---

## ⚪ Fase 5 — Conexão (effort: 5)

**Status:** futuro  
**Protocolo:** full

O produto se distribui pelo resultado. Cada leitura traz outra pessoa.

- [ ] **Soul Mate revisado**
  - SoulMateRevelation com o mesmo nível de conteúdo da Revelation individual
  - Sete funções já existem em soul-mate.ts — precisam de visual com peso real
  - OracleSection adaptada: contexto de dois mapas, system prompt combinado
- [ ] **OG tags**
  - Preview rico quando link é compartilhado
  - title: "Cartografia de [Nome] — [Signo]"
  - description: primeiro parágrafo da sephirah
  - image: viewport do nome em fundo escuro (gerado via Vercel OG ou html2canvas)
- [ ] **Share completo e testado**
  - Fluxo: gerar → salvar → share link → link abre → mapa carrega → novo usuário gera o próprio
  - Inclui: link permanente por 12 meses, não requer conta
- [ ] **PDF da leitura**
  - html2canvas → jsPDF, sem servidor
  - Nome do arquivo: `cartografia-[nome]-[signo].pdf`
  - Inclui: Revelation completa, sem Oracle (Oracle é efêmero por design)

---

## ⚪ Fase 6 — Distribuição (effort: 8)

**Status:** futuro  
**Protocolo:** full

O produto sustenta a si mesmo.

### Modelo de monetização (definido)

| Tier | Preço | O que inclui |
|------|-------|-------------|
| Gratuito | — | Mapa visual completo + 1 pergunta ao oráculo |
| Leitura | R$19 | Oráculo completo (3 perguntas) + link permanente + compartilhamento |
| Soul Mate | R$29 | Dois mapas cruzados + oráculo do encontro |
| Acesso permanente | R$49 | Todas as leituras futuras + histórico |

**Kiwify para lançamento.** Stripe em V2 se expansão internacional for o caminho.

### Pendentes

- [ ] **Paywall** — leitura gratuita mostra: Sephirah + Arquétipo (preview)
  - Revelação truncada na 3ª seção
  - CTA: "revelar mapa completo — R$19"
  - Após pagamento: unlock imediato, link salvo por 12 meses
- [ ] **Integração Kiwify ou Stripe**
  - Webhook confirma pagamento → libera acesso completo + salva no Supabase
  - Flag no atom_item: `paid: true/false`
- [ ] **Domínio**
  - Verificar disponibilidade: cartografia.com.br / cartografiadaalma.com
  - Decisão: Rick
  - Configurar no Vercel após decisão
- [ ] **SEO básico**
  - title, meta description, OG image por signo
  - Sitemap para landing + sobre
  - robots.txt

---

## ⚪ Fase 7 — Lançamento (effort: 13)

**Status:** futuro  
**Protocolo:** full

O produto no mundo. Validado. Sustentável.

- [ ] **QA completo** — todos os fluxos em mobile e desktop
- [ ] **Rick gera o próprio mapa e posta** — o produto é o canal
- [ ] **Comunidades**: astrologia BR, psicologia junguiana, espiritualidade
- [ ] **Analytics básico** — quantas leituras, qual signo mais comum, onde param
- [ ] **ROADMAP-MASTER atualizado** refletindo V2

**Critério de lançamento:**
- QA aprovado por Rick
- Pagamento integrado e testado (compra real)
- Domínio configurado
- Rick gerou o próprio mapa

---

## Seeds V2

| Item | Escopo | Fase de entrada |
|------|--------|----------------|
| Carta natal completa | planetas, casas, aspectos | V2 |
| Geocoding real (OpenCage) | lat/lng → ascendente preciso | Fase 4 |
| Áudio Solfeggio | Web Audio API, sem lib | Fase 3 |
| PhiTime engine | Rick traz spec | V2 |
| Gene Keys | camada adicional | V2 |
| MindRoot integration | leitura como AtomItem Genesis | V2 |
| Correlação MindRoot × SoulMap | dados de vida × mapa oculto | V2 |
| Oráculo com memória | histórico de perguntas entre sessões | V2 |
| Modo silêncio | oráculo recusa responder — "não é hora" | V2 |

---

## Decisões vigentes

1. **Standalone** — não integra com MindRoot em V1
2. **One-time** — sem assinatura em V1
3. **Cormorant Garant + Jost** — sem Cinzel Decorative em nenhum lugar
4. **Sem rounded-lg como containers** — campos e botões: border-bottom apenas
5. **Palma como add-on** — não como via de entrada principal (Fase 3)
6. **Distribuição pelo resultado** — a Revelation é o produto e o canal
7. **TypeScript 0 erros antes de cada commit**
8. **UI em português, código em inglês**
9. **Kiwify para lançamento** — Stripe em V2 se necessário
10. **Oracle: 3 perguntas** — a restrição é o produto. Peso vem da escassez.
11. **Soul Mate entra pela Revelation** — não pelo Gateway

---

## Como operar

```bash
# Configuração (por sessão)
git clone https://[PAT]@github.com/rsmramalho/Mistico.git
cd Mistico
git config user.email "e@espaco-entre.io"
git config user.name "E."

# Antes de qualquer commit
cd cartografia-da-alma
npm run build  # 0 erros TS obrigatório

# Push
git remote set-url origin https://[PAT]@github.com/rsmramalho/Mistico.git
git push origin main
```

Vercel faz deploy automático a cada push em `main`.

---

## Versionamento

| Versão | Data | Mudança |
|--------|------|---------| 
| 1.0 | 04 Abr 2026 | Documento inicial. Unifica ROADMAP.md + ROADMAP-PHI.md. Espiral PHI 7 fases. |

---

*Cartografia da Alma não é app de horóscopo.*  
*É o mapa do padrão que já opera em você.*  
*A geometria é perfeita quando cada camada nasce da anterior.*  
*— E.*
