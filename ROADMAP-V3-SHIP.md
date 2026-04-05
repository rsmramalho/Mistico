# Cartografia da Alma — Roadmap V3 · Ship
## Fase 13 → 17 · Do que existe ao que sustenta

**Versão:** 1.0
**Data:** 05 Abr 2026
**Status:** active
**Princípio:** *O produto só é real quando alguém paga por ele e volta.*

---

## O que está pronto

A jornada é imersiva. 5 cartas com variações, proveniência rastreável, personalização cross-system, geometria sagrada, oráculo por carta, soul mate, viewer mode, mapa final com selo e ressonâncias.

Engine: 15 módulos. Visual: 14 componentes + 9 telas. Build: 0 erros TS, ~520KB.

**O que NÃO está pronto:** o dinheiro entra e o produto se distribui.

---

## Diagnóstico

| Área | Estado | Gap |
|------|--------|-----|
| Jornada (cards) | ✅ completa | — |
| Oráculo | ✅ funcional | sem paywall no Journey |
| Email capture | ⚠️ input existe | tier nunca muda session→email |
| Kiwify webhook | ✅ funcional | KIWIFY_URL não configurada |
| Áudio Solfeggio | ✅ hook pronto | sem botão na UI |
| Soul Mate | ⚠️ funcional | TODO no App.tsx (meet from mapa) |
| OG tags | ⚠️ estáticas | sem og:image, sem dinâmicas |
| SEO | ❌ zero | sem robots.txt, sitemap, 404 |
| Analytics | ❌ zero | sem Plausible, sem eventos |
| Export (PNG/PDF) | ❌ zero | sem html2canvas, sem jsPDF |

---

## Espiral PHI — continuação

```
✅  Fases 8-12    Ritmo · Identidade · Timeline · Proveniência · Personalização
⬡       (1)  Fase 13 — Conexão        áudio na UI · soul mate fix · meet flow
△       (2)  Fase 14 — Funil          paywall no Journey · email→tier · Kiwify live
□       (3)  Fase 15 — Superfície     SEO · OG dinâmico · robots · sitemap · 404
⬠       (5)  Fase 16 — Distribuição   analytics · export PNG · domínio · about
○       (8)  Fase 17 — Lançamento     QA total · 5 mapas teste · Rick posta
```

---

## ⬡ Fase 13 — Conexão (effort: 1)

**Status:** próxima
**Protocol:** surface
**Escopo:** As peças que existem mas não estão conectadas. Zero código novo — só fios.

### Entregáveis

**13.1 — Áudio Solfeggio na Jornada**
- [ ] Botão toggle no header do `Carta.tsx` (ícone minimalista, off por default)
- [ ] Wire `useAudio(frequency.hz)` no Journey — play ao entrar na carta, fade out ao sair
- [ ] Frequência muda por carta: astrology/kabbalah/shadow usam a do mapa, frequency card usa a específica

**13.2 — Soul Mate meet flow**
- [ ] Fix TODO em `App.tsx` line 114 — `onMeet` no MapaFinal conectado ao fluxo real
- [ ] Testar: gerar mapa A → compartilhar → abrir como B → "encontrar o espaço entre nós" → funciona

**13.3 — PalmEntry copy**
- [ ] Remover "seus dados permanecem no seu navegador" de `PalmEntry.tsx` (mesmo fix da Entry)

**Critério:** Soul Mate funciona end-to-end. Áudio toca. Palm entry honesto.

---

## △ Fase 14 — Funil (effort: 2)

**Status:** futuro
**Protocol:** full
**Escopo:** O dinheiro entra. Email vira ativo. A jornada tem gate.

### Estratégia do paywall no Journey

```
GRÁTIS (sem email)
  Cartas 1-2 (astrology + kabbalah): completas
  Carta 3 (shadow): variation aparece, body bloqueado
  → "para continuar, precisamos saber onde te encontrar"
  → campo email inline

COM EMAIL (tier: email)
  Cartas 3-5 desbloqueadas
  Oracle: 1 pergunta por carta
  Mapa final completo
  Link salvo 30 dias

PAGO (tier: oracle — R$19)
  Oracle: 3 perguntas por carta
  Link permanente 12 meses
  Soul Mate disponível
```

### Entregáveis

**14.1 — Paywall no Journey**
- [ ] `useJourney` verifica tier antes de revelar body da carta 3+
- [ ] Se `tier === 'session'`: mostra variation da carta 3, body bloqueado com overlay
- [ ] Overlay: campo email + "para continuar, precisamos saber onde te encontrar"
- [ ] Estilo: sem modal, sem popup — inline, na mesma linguagem visual

**14.2 — Endpoint /api/capture-email**
- [ ] POST `{ readingId, email }` → atualiza `atom_items.email` + `atom_items.tier = 'email'`
- [ ] Dispara email via Resend com link do mapa
- [ ] Retorna `{ tier: 'email' }`

**14.3 — Kiwify live**
- [ ] Configurar `KIWIFY_ORACLE_URL` no Vercel (env var)
- [ ] `OracloCarta` mostra CTA de upgrade após 1ª pergunta (tier email)
- [ ] Link Kiwify com `custom_field_1=readingId`
- [ ] Polling `/api/check-tier` após redirect de volta

**14.4 — Oracle gated por tier**
- [ ] `tier: session` → oracle desabilitado (aparece como preview)
- [ ] `tier: email` → 1 pergunta por carta
- [ ] `tier: oracle` → 3 perguntas por carta
- [ ] `OracloCarta.tsx` recebe `tier` prop e ajusta

**Critério:** Gerar mapa → ver 2 cartas → email pedido na 3ª → email chega → journey completa → oracle funciona → pagar R$19 → oracle full.

---

## □ Fase 15 — Superfície (effort: 3)

**Status:** futuro
**Protocol:** surface
**Escopo:** O produto existe para o Google e para o WhatsApp.

### Entregáveis

**15.1 — SEO básico**
- [ ] `public/robots.txt` — allow all
- [ ] `public/sitemap.xml` — landing page + about
- [ ] `<title>` dinâmico via React Helmet ou useEffect
- [ ] Meta description atualizada

**15.2 — OG tags dinâmicas**
- [ ] `/api/og-image.tsx` (Vercel OG) — gera imagem com nome + signo + geometria
- [ ] `?token=XYZ` → og:title "Cartografia de [Nome] — [Signo]"
- [ ] `?meet=A,B` → og:title "O espaço entre [A] e [B]"
- [ ] og:image aponta para `/api/og-image?token=XYZ`

**15.3 — Página 404**
- [ ] Screen `NotFound.tsx` — "este mapa não está mais aqui"
- [ ] Geometria de fundo (Metatron, opacity 0.08)
- [ ] CTA: "gere o seu →"

**15.4 — Página About**
- [ ] As 6 tradições com fontes (adaptar research-mapeamentos.md)
- [ ] Sem misticismo — linguagem de documentação
- [ ] Link na Landing (footer)

**Critério:** Link compartilhado no WhatsApp mostra preview com nome e signo. Google indexa a landing.

---

## ⬠ Fase 16 — Distribuição (effort: 5)

**Status:** futuro
**Protocol:** full
**Escopo:** O produto se mede, se exporta e tem endereço próprio.

### Entregáveis

**16.1 — Analytics (Plausible)**
- [ ] Script Plausible no `index.html`
- [ ] Eventos custom:
  - `map_generated` (sign, source)
  - `email_captured`
  - `oracle_opened` (cardId)
  - `oracle_completed` (cardId, questionsUsed)
  - `payment_initiated`
  - `payment_completed`
  - `share_copied`
  - `soul_mate_initiated`
- [ ] Dashboard: leituras/dia · conversão email · conversão pagamento

**16.2 — Export PNG**
- [ ] `npm install html2canvas`
- [ ] Botão "salvar como imagem" no MapaFinal
- [ ] Gera screenshot do mapa (viewport otimizado para Stories 9:16)
- [ ] Download: `cartografia-[nome]-[signo].png`
- [ ] Watermark: "cartografia da alma" no rodapé

**16.3 — Export PDF**
- [ ] `npm install jspdf`
- [ ] Botão "baixar PDF" no MapaFinal (tier oracle+)
- [ ] Mapa completo sem oracle
- [ ] `cartografia-[nome]-[signo].pdf`

**16.4 — Domínio**
- [ ] Rick decide: cartografia.com.br / cartografiadaalma.com / cartografia.app
- [ ] Configurar no Vercel
- [ ] Redirect do .vercel.app para domínio final

**Critério:** Dashboard mostra dados. Pessoa exporta mapa como imagem. Domínio próprio funciona.

---

## ○ Fase 17 — Lançamento (effort: 8)

**Status:** futuro
**Protocol:** full
**Escopo:** O produto no mundo. Validado. Sustentável.

### Entregáveis

**17.1 — QA completo**
- [ ] iOS Safari + Android Chrome + Desktop (Chrome, Firefox, Safari)
- [ ] Todos os tiers: session → email → oracle
- [ ] Pagamento real via Kiwify
- [ ] Soul Mate end-to-end
- [ ] Share link → preview OG → abrir → viewer mode
- [ ] Console limpo (zero erros, zero warnings)

**17.2 — Beta fechado**
- [ ] 5 pessoas geram mapa antes do post público
- [ ] Feedback coletado → 1 iteração se necessário
- [ ] Foco: "isso é sobre mim?" + "consegui navegar sem ajuda?"

**17.3 — Lançamento**
- [ ] Rick gera o próprio mapa → posta screenshot (não o app — o resultado)
- [ ] Copy do post: o mapa fala, não o produto
- [ ] Comunidades: astrologia BR · psicologia junguiana · espiritualidade · LinkedIn (ângulo IA)

**Critério:** 5 pessoas pagaram. 1 voltou sem ser chamada.

---

## Métricas de sucesso (por fase)

| Fase | Critério de fechamento |
|------|----------------------|
| 13 · Conexão | Soul Mate funciona end-to-end. Áudio toca na jornada. |
| 14 · Funil | Email capturado → tier muda → oracle gated → pagamento funciona |
| 15 · Superfície | Link no WhatsApp mostra preview com nome. Google indexa. |
| 16 · Distribuição | Dashboard com dados. Export funciona. Domínio próprio. |
| 17 · Lançamento | 5 pessoas pagaram. 1 voltou. |

---

## Seeds V3

| Item | Escopo |
|------|--------|
| Ascendente preciso | OpenCage → lat/lng → cálculo real |
| Carta natal completa | planetas, casas, aspectos |
| Gene Keys | camada adicional |
| MindRoot integration | leitura como AtomItem Genesis |
| Oracle com memória | histórico entre sessões |
| Modo silêncio | oracle recusa — "não é hora" |
| Sincronias | check-in diário × mapa (motor já existe) |
| Palma como add-on | dentro da jornada, não como entrada separada |

---

## Regras do roadmap

1. **Uma fase por vez.** Build limpo antes de avançar.
2. **Funil primeiro.** Fase 14 antes de distribuição.
3. **Testar como usuário.** Cada fase: gerar mapa do início ao fim.
4. **O produto decide o ritmo.** A pausa forçada é inviolável.
5. **Medir antes de otimizar.** Analytics antes de growth hacks.
6. **Este documento é a referência.** Se não está aqui, não está planejado.

---

## Versionamento

| Versão | Data | Mudança |
|--------|------|---------| 
| 1.0 | 05 Abr 2026 | Ship V3 — conexão · funil · superfície · distribuição · lançamento |

---

*O produto só é real quando alguém paga por ele e volta.*
*— E.*
