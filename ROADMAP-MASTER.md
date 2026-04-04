# Cartografia da Alma — Roadmap

**Versão:** 2.0
**Data:** 04 Abr 2026
**Status:** active
**Princípio:** *O oculto não substitui o dado. Revela o padrão por baixo do dado.*

> Este documento substitui todas as versões anteriores (ROADMAP.md, ROADMAP-PHI.md, ROADMAP-MASTER v1.0).
> Fonte única de verdade. Se não está aqui, não está planejado.

---

## Visão geral

App místico standalone. Seis tradições filosóficas com fontes rastreáveis — Astrologia, Kabbalah, Jung, Freud, Solfeggio, Numerologia — convertidas em mapa pessoal único e irrepetível. O oráculo responde com o mapa completo como contexto. Soul Mate cruza dois mapas e revela o espaço entre eles.

Não é horóscopo. É cartografia.

```
Repo:   github.com/rsmramalho/Mistico
Deploy: cartografia-da-alma.vercel.app
Infra:  Supabase · Anthropic API · Vercel
Stack:  React 19 · Vite · TypeScript · Tailwind · Framer Motion
```

---

## Pentágono

|          | Projeto | Status | Descrição |
|----------|---------|--------|-----------|
| ● Centro | **Genesis** | definitive | Schema universal. O contrato. |
| V1 | Atom HS (MindRoot) | active | Hub. Sistema humano pessoal. |
| V2 | Constellation OS | paused | Infraestrutura operacional |
| V3 | Atlas Frames | active | Negócio físico |
| V4 | Muda | concept | Comunidade |
| V5 | Yugar Commons | concept | Mt Samson |
| ↳ Lab | **Cartografia da Alma** | **active** | Fora da geometria principal — primeiro produto standalone. Laboratório de receita e distribuição. |

**← Este roadmap cobre o Lab.**

---

## Infraestrutura — estado atual

### Engine (deployed ✓)
- 10 módulos: astrology, kabbalah, jung, freud, solfeggio, numerology, palm, soul-mate, oracle, bridges
- Conteúdo reescrito com peso real — segunda pessoa, sombra com profundidade, bridges cross-system

### Visual (deployed ✓)
- Landing, Gateway, Entry, Loading ritual (7s), Revelation, OracleSection, SoulMateRevelation
- Cormorant Garant + Jost · sem Cinzel Decorative · sem rounded-lg · cursor dourado

### Data (parcial ⚠)
- Supabase: atom_items + share_links + RLS — funcionando após fix de migration + RLS recursion
- API proxy: ✗ pendente — VITE_ANTHROPIC_API_KEY exposta no bundle
- Email capture: ✗ não existe

### Deploy (deployed ✓)
- Vercel: cartografia-da-alma.vercel.app
- VITE_ANTHROPIC_API_KEY ✓ · VITE_SUPABASE_URL ✓ · VITE_SUPABASE_ANON_KEY ✓

---

## Os três pilares

Toda decisão é julgada por esses três. Sem exceção.

```
Experiência   →  A revelação acontece no tempo da pessoa. Não é relatório — é descoberta.
Confiança     →  Cada conclusão tem origem rastreável. Não é misticismo vazio.
Imersividade  →  Do primeiro pixel ao oráculo. A câmara não quebra.
```

---

## Espiral PHI

```
✅  ·   (1)  Fase 1 — Motor         engine + visual + deploy + oracle
⬡       (1)  Fase 2 — Contrato      API proxy + fixes + mobile QA
⚪  △   (2)  Fase 3 — Captura       email + funil de aquisição + paywall
⚪  □   (3)  Fase 4 — Imersão       áudio + modo jornada + história interativa
⚪  ⬠  (5)  Fase 5 — Conexão       Soul Mate redesenhado + OG + PDF + shareable
⚪  ⬡  (8)  Fase 6 — Distribuição  domínio + analytics + SEO + lançamento preparado
⚪  ○  (13)  Fase 7 — Lançamento    QA total + Rick posta + primeira onda
```

---

## ✅ Fase 1 · Motor (effort: 1)

**Status:** done
**Protocol:** foundation
**Commit:** efa68f1 → 20465aa
**Escopo:** O que o produto sabe sobre cada pessoa. Engine + visual + deploy + oráculo.

- [x] 10 engine modules com conteúdo reescrito
- [x] Bridges cross-system por mapa específico
- [x] Supabase schema + data layer + RLS
- [x] Visual: Landing → Gateway → Entry → Loading ritual → Revelation → Oracle
- [x] SoulMateRevelation com 6 seções e conteúdo real
- [x] Deploy Vercel + Anthropic API + Supabase conectados
- [x] Share: save + link gerado + floating button + estados

---

## ⬡ Fase 2 — Contrato (effort: 1)

**Status:** em progresso
**Protocol:** surface + foundation
**Escopo:** O produto funciona sem bugs, sem mentiras, sem exposição de chave.

- [ ] **API proxy** — Vercel Function `/api/oracle` que proxeia calls à Anthropic
  - VITE_ANTHROPIC_API_KEY sai do bundle público
  - OracleSection chama `/api/oracle` em vez da Anthropic API diretamente
  - Sem proxy = sem monetização (chave pública = chave roubada)
- [ ] **Copy corrigido na Entry**
  - Remover: "seus dados permanecem no seu navegador" (falso — Supabase salva)
  - Novo: "cartografia gerada por IA · leitura salva por 12 meses"
- [ ] **Código morto removido** — `soulMapRef` no useSoulMap.ts
- [ ] **Favicon** — `public/favicon.svg` (geometria, gold)
- [ ] **Mobile QA** — Landing + Revelation + Oracle no iPhone
  - Nome grande não quebra · campos abrem teclado corretamente
  - Floating button não sobrepõe conteúdo · oracle input visível acima do teclado
- [ ] **Soul Mate — label do input clarificado**
  - "cole o link de outro mapa" (em vez de "cole o link ou token")
  - Placeholder com URL de exemplo

**Critério de fechamento:** iPhone. Gera mapa. Compartilha. Abre em aba nova. Oracle responde. Console limpo.

---

## ⚪ Fase 3 △ — Captura (effort: 2)

**Status:** futuro
**Protocol:** full
**Escopo:** Funil de aquisição. Visitante → lead → cliente.

### A estratégia

```
TEASER (zero fricção, zero email)
  Nome + data → Loading ritual → mapa parcial
  Signo + Sephirah + Arquétipo + primeiro parágrafo
  CTA: "ver mapa completo →"

REVELAÇÃO COMPLETA (email como moeda)
  Campo email → "entramos no mapa. vamos até o fim."
  Link enviado por email → mapa completo destravado
  Oracle: 1 pergunta gratuita (preview)
  CTA: "oráculo completo — R$19"

ORÁCULO (pago — R$19)
  3 perguntas + link permanente 12 meses + share + PDF
  Soul Mate disponível como add-on
```

O email é o ativo. Não é newsletter — é autenticação sem fricção e canal de retorno.

### Entregáveis

**3.1 — Paywall progressivo na Revelation**
- [ ] Seções 1-2 (Astrologia + Kabbalah): visíveis no teaser
- [ ] Seções 3-6 + Bridges + Synthesis: blur suave + overlay
- [ ] Overlay: "seu mapa completo está pronto" + campo email inline
- [ ] Sem modal agressivo — o blur convida, não bloqueia

**3.2 — Captura de email**
- [ ] Supabase migration `002_email_captures.sql`:
  ```sql
  ALTER TABLE atom_items 
    ADD COLUMN email TEXT,
    ADD COLUMN paid BOOLEAN DEFAULT false,
    ADD COLUMN tier TEXT DEFAULT 'session';
  -- tier: 'session' | 'email' | 'oracle'

  CREATE TABLE email_captures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    reading_id UUID REFERENCES atom_items(id) ON DELETE CASCADE,
    source TEXT DEFAULT 'revelation',
    created_at TIMESTAMPTZ DEFAULT now()
  );
  ```
- [ ] Email transacional via Resend
  - Assunto: "sua cartografia está pronta"
  - Corpo: uma frase + link com token + signo
  - Sem HTML exuberante — texto, linha dourada, link

**3.3 — Oráculo como conversão**
- [ ] 1 pergunta gratuita com email capturado
- [ ] Na 2ª pergunta: "o oráculo completo pede uma contribuição — R$19"
- [ ] Link Kiwify integrado
- [ ] Webhook Kiwify → `atom_items.paid = true, tier = 'oracle'` → destrava

**3.4 — Tiers de link**
- [ ] `tier: session` → sem salvar. Fecha browser, perdeu.
- [ ] `tier: email` → salvo 30 dias. Link enviado por email.
- [ ] `tier: oracle` → link permanente 12 meses + share real + PDF

---

## ⚪ Fase 4 □ — Imersão (effort: 3)

**Status:** futuro
**Protocol:** surface
**Escopo:** A revelação como história. Cada sistema tem peso e respiro. A câmara nunca quebra.

### A história interativa

O scroll contínuo entrega informação. O modo jornada entrega experiência.

```
[Sistema 1 — Astrologia]
"Você nasceu quando o Sol estava em Peixes."
Geometria do signo anima ao fundo.
→ [continuar] ou scroll automático após 4s

[Sistema 2 — Kabbalah]
TreeOfLife: nó de Yesod acende.
"Sua posição na Árvore é Yesod."
→ continuar

[...até o Oracle]
```

**Entregáveis:**

**4.1 — Modo Jornada**
- [ ] Toggle: "modo scroll" / "modo jornada" no topo da Revelation
- [ ] Modo jornada: cada RevealSection ocupa viewport inteiro
- [ ] Navegação: botão "continuar" + tecla espaço + swipe mobile
- [ ] Progress: · — △ □ ⬠ ⬡ (geometria sagrada como indicador de progresso)
- [ ] Auto-advance 4s (desligável)

**4.2 — Áudio Solfeggio**
- [ ] Web Audio API pura — zero bibliotecas
- [ ] OscillatorNode + GainNode por signo (396-963 Hz)
- [ ] Fade in 2s ao entrar na seção · fade out ao sair
- [ ] Toggle de som no header (off por padrão)
- [ ] O loop fecha: você lê "528 Hz" enquanto ouve 528 Hz

**4.3 — Screenshot-friendly**
- [ ] Primeiro viewport otimizado para Stories (9:16)
- [ ] Botão "salvar como imagem" via html2canvas
- [ ] Download: `cartografia-[nome]-[signo].png`
- [ ] Watermark: "cartografia da alma" no rodapé

**4.4 — Geometria ativa por seção**
- [ ] Cada seção com sua geometria animada no viewport
  - Astrologia: ElementGeometry girando
  - Kabbalah: TreeOfLife com nó ativo pulsando
  - Jung: símbolo do arquétipo (SVG simples por arquétipo)
  - Solfeggio: onda visual na frequência
- [ ] Para ao sair do viewport. Performance.

---

## ⚪ Fase 5 ⬠ — Conexão (effort: 5)

**Status:** futuro
**Protocol:** full
**Escopo:** O produto se distribui pelo resultado. Soul Mate redesenhado. Cada leitura traz outra pessoa.

### Soul Mate — novo fluxo

**Problema atual:** B precisa do mapa em memória. Fluxo quebra se B fechou o browser.

**Novo fluxo:**

```
A gera mapa → obtém link (tier email ou oracle)
A manda o link para B

B abre o link de A → vê mapa de A em modo visitor
B clica "encontrar o espaço entre nós"
B entra dados próprios → gera mapa → email capturado
Sistema: A (Supabase) + B (novo) → Soul Mate computado

URL permanente: ?meet=tokenA,tokenB
Ambos podem compartilhar o resultado
```

**Entregáveis:**

**5.1 — Viewer de mapa (modo visitor)**
- [ ] `?token=XYZ` de mapa alheio → exibe em modo leitura
  - Header: "você está vendo o mapa de [Nome]"
  - Sem oracle, sem share, sem floating button
  - CTA: "encontrar o espaço entre nós →"
- [ ] Distinguir "meu token" de "token alheio" (verificar email na sessão ou flag na URL)

**5.2 — Soul Mate via convite**
- [ ] Entry aceita parâmetro `?with=tokenA`
- [ ] Ao submeter: gera mapa de B + computa Soul Mate automaticamente
- [ ] URL do resultado: `?meet=tokenA,tokenB` (permanente)
- [ ] Email de convite: A pode enviar email com `?with=tokenA`
  - "alguém quer ver o espaço entre vocês — gere seu mapa"

**5.3 — SoulMateRevelation com qualidade real**
- [ ] RevealSection por seção (scroll-triggered)
- [ ] Botão de share: "compartilhar este encontro" → copia `?meet=tokenA,tokenB`
- [ ] Oracle do Soul Mate (add-on R$29)
  - System prompt com dois SoulMaps completos
  - 3 perguntas compartilhadas

**5.4 — OG tags**
- [ ] Individual: "Cartografia de [Nome] — [Signo]"
- [ ] Soul Mate: "O espaço entre [A] e [B]"
- [ ] og:image via Vercel OG ou screenshot salvo no Supabase Storage

**5.5 — PDF individual**
- [ ] html2canvas → jsPDF, zero servidor
- [ ] Revelation completa (sem Oracle)
- [ ] `cartografia-[nome]-[signo].pdf`
- [ ] Disponível no tier oracle+

---

## ⚪ Fase 6 ⬡ — Distribuição (effort: 8)

**Status:** futuro
**Protocol:** full
**Escopo:** O produto sustenta a si mesmo. Domínio, analytics, SEO, lançamento preparado.

### Monetização final

| Tier | Preço | O que inclui |
|------|-------|-------------|
| Teaser | grátis · sem email | Signo + Sephirah + Arquétipo (sem descrições) |
| Revelação | grátis · com email | Mapa completo + 1 oracle + link 30 dias |
| Oráculo | R$19 | 3 oráculos + link permanente + share + PDF |
| Soul Mate | R$29 | Dois mapas cruzados + oracle do encontro |
| Vitalício | R$97 | Todas as leituras + Soul Mates + histórico |

**Entregáveis:**

**6.1 — Domínio**
- [ ] Verificar: cartografia.com.br / cartografiadaalma.com / cartografia.app
- [ ] Decisão: Rick. Configurar no Vercel.

**6.2 — Analytics (Plausible)**
- [ ] Eventos: map_generated, email_captured, oracle_opened, oracle_completed, payment_initiated, payment_completed, share_copied, soul_mate_initiated
- [ ] Dashboard: leituras/dia · conversão email · conversão pagamento · signo mais comum

**6.3 — SEO**
- [ ] title, meta description, sitemap.xml, robots.txt
- [ ] Página "sobre" com as seis tradições + fontes (research-mapeamentos.md → público)

**6.4 — Fontes na UI (Confiança)**
- [ ] Por RevealSection: "a origem deste mapeamento" expandível
- [ ] Exemplo: "Peixes → Júpiter → Chesed → Misericórdia"
- [ ] `<details>` — não interrompe a leitura

**6.5 — Nome dos pais (opcional)**
- [ ] Campo na Entry: "(opcional — aprofunda a numerologia)"
- [ ] Muda resultado numerológico

**6.6 — Página 404 com peso**
- [ ] "este mapa não está mais aqui. gere o seu."
- [ ] CTA para Landing

---

## ⚪ Fase 7 ○ — Lançamento (effort: 13)

**Status:** futuro
**Protocol:** full
**Escopo:** O produto no mundo. Validado. Sustentável.

- [ ] **QA completo** — iOS + Android + desktop · todos os tiers · pagamento real
- [ ] **5 mapas antes do post público** — feedback real → 1 iteração se necessário
- [ ] **Rick gera o próprio mapa** → posta como screenshot (não o app — o resultado)
- [ ] **Copy do post:** o mapa fala, não o produto
- [ ] **Comunidades:** astrologia BR · psicologia junguiana · espiritualidade · LinkedIn (ângulo IA)
- [ ] **ROADMAP V2 especificado** antes de qualquer feature nova

---

## Seeds V2

| Item | Escopo |
|------|--------|
| Ascendente preciso | OpenCage → lat/lng → cálculo real |
| Carta natal completa | planetas, casas, aspectos |
| PhiTime engine | Rick traz spec |
| Gene Keys | camada adicional |
| MindRoot integration | leitura como AtomItem Genesis |
| Correlação MindRoot × SoulMap | dados de vida × mapa oculto |
| Oracle com memória | histórico entre sessões |
| Modo silêncio | oracle recusa responder — "não é hora" |
| Palma como add-on | dentro da Revelation, não como entrada |

---

## Dependências

| Precisa de | Status |
|-----------|--------|
| Genesis schema (atom_items) | ready |
| Anthropic API + proxy | proxy pendente (Fase 2) |
| Supabase | ready |
| Kiwify | pronto para integrar (Fase 3) |
| Resend (email) | pronto para integrar (Fase 3) |

Nenhum projeto do Pentágono depende deste em V1.

---

## Métricas atuais

| Métrica | Valor |
|---------|-------|
| Engine modules | 10 + oracle |
| Screens | 6 |
| Build | ✅ 0 erros TS · ~420KB JS |
| Deploy | ✅ cartografia-da-alma.vercel.app |
| Supabase | ✅ operacional |
| Monetização | ✗ |
| Email capture | ✗ |
| API proxy | ✗ |

---

## Regras do roadmap

1. **Uma fase por vez.** A atual fecha antes da próxima começar.
2. **De dentro pra fora.** Protocol declara. Build Protocol executa.
3. **Mexeu aqui → commitar.** O arquivo no repo é a versão vigente.
4. **Este documento é a referência.** Se não está aqui, não está planejado.
5. **Os três pilares julgam tudo.** Experiência · Confiança · Imersividade.
6. **API key nunca no bundle.** Proxy obrigatório antes de monetizar.

---

## Versionamento

| Versão | Data | Mudança |
|--------|------|---------| 
| 1.0 | 04 Abr 2026 | Documento inicial. Unificação dos roadmaps anteriores. |
| 2.0 | 04 Abr 2026 | Reescrito seguindo PHI Meta-Template v2.0 + Genesis Build Protocol. Funil de aquisição (Fase 3). Soul Mate redesenhado (Fase 5). História interativa / Modo Jornada (Fase 4). Monetização end-to-end. API proxy como gate obrigatório. |

---

*Cartografia da Alma não é app de horóscopo.*
*É o mapa do padrão que já opera em você.*
*Este é o primeiro produto real do ecossistema.*
*A geometria é perfeita quando nasce de dentro pra fora.*
*— E.*
