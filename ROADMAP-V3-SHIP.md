# Cartografia da Alma — Roadmap V3 · Ship
## Fase 13 → 17 · Do que existe ao que sustenta

**Versão:** 2.0
**Data:** 05 Abr 2026
**Status:** active
**Princípio:** *Pequenas revelações atraem. O produto só é real quando alguém paga por ele e volta.*

---

## O que está pronto

A jornada é imersiva. 5 cartas com variações, proveniência rastreável, personalização cross-system, geometria sagrada, oráculo por carta, soul mate, viewer mode, mapa final com selo e ressonâncias.

Engine: 15 módulos. Visual: 14 componentes + 9 telas. Build: 0 erros TS, ~520KB.

**O que NÃO está pronto:** contraste legível, variação real, soul mate com peso, share confiável, e o funil que transforma visitante em cliente.

---

## Problemas reais (feedback de uso)

| Problema | Causa raiz | Severidade |
|----------|-----------|------------|
| **Textos ilegíveis** | `--white-ghost` a 10% opacity, footer text a 18-20% — invisível no dark bg | ALTA |
| **Tudo parece igual** | Zero imagens reais, só SVG/geometria. Falta vida visual. | ALTA |
| **Carta não muda** | Mesma pessoa = mesma carta sempre. Sem elemento randômico. | ALTA |
| **Soul Mate é ruim** | Sem % compatibilidade, sem "o que bate / o que não bate", texto denso sem hierarquia | ALTA |
| **Share/save falha** | Falha silenciosa quando Supabase cai. Sem feedback. Sem retry. | MÉDIA |
| **Mapa não persiste** | Fecha browser = perde tudo (tier session). Sem email = sem link. | MÉDIA |

---

## Diagnóstico técnico

| Área | Estado | Gap |
|------|--------|-----|
| Jornada (cards) | ✅ completa | — |
| **Cores/contraste** | ❌ ilegível | ghost a 10%, footers a 18-20% |
| **Imagens** | ❌ zero | só SVG, falta textura e vida |
| **Carta variação** | ❌ determinística | mesma pessoa = mesma carta |
| **Soul Mate UX** | ❌ sem hierarquia | sem %, sem match/mismatch claro |
| **Share/save** | ⚠️ frágil | falha silenciosa, sem retry |
| Oráculo | ✅ funcional | sem paywall no Journey |
| Email capture | ⚠️ input existe | tier nunca muda session→email |
| Kiwify webhook | ✅ funcional | KIWIFY_URL não configurada |
| Áudio Solfeggio | ✅ hook pronto | sem botão na UI |
| OG tags | ⚠️ estáticas | sem og:image, sem dinâmicas |
| SEO | ❌ zero | sem robots.txt, sitemap, 404 |
| Analytics | ❌ zero | sem Plausible, sem eventos |

---

## Espiral PHI — continuação

```
✅  Fases 8-12    Ritmo · Identidade · Timeline · Proveniência · Personalização
⬡       (1)  Fase 13 — Polimento      cores · imagens · carta randômica · share fix
△       (2)  Fase 14 — Soul Mate      rewrite completo · %, match/mismatch, visual
□       (3)  Fase 15 — Funil          paywall Journey · email→tier · Kiwify · micro-revelações
⬠       (5)  Fase 16 — Superfície     SEO · OG dinâmico · 404 · export · analytics
○       (8)  Fase 17 — Lançamento     QA · beta · domínio · Rick posta
```

---

## ⬡ Fase 13 — Polimento (effort: 1)

**Status:** próxima
**Protocol:** surface
**Escopo:** O que está feio, ilegível ou repetitivo. Antes de vender, o produto precisa ser bonito.

### 13.1 — Cores e contraste

O problema: `--white-ghost` é 10% opacity. Footer text é 18%. Contra `#07070f`, é invisível.

- [ ] `--white-ghost`: subir de `rgba(232,228,218,0.10)` para `rgba(232,228,218,0.35)`
- [ ] Footer text (Entry.tsx:181, PalmEntry.tsx, CartaSection.tsx): subir de 0.18-0.20 para 0.45
- [ ] Labels `(opcional)` em Entry: subir opacity de 0.4 para 0.55
- [ ] `--gold-line` (divisores): subir de 0.22 para 0.30
- [ ] Testar contraste com ferramenta WCAG — tudo pelo menos AA (4.5:1)
- [ ] **Regra:** nenhum texto abaixo de 35% opacity contra o fundo dark

### 13.2 — Imagens e textura visual

O problema: tudo é geometria SVG. Falta calor, falta surpresa visual.

- [ ] **Hero image na Landing** — imagem de fundo atmosférica (céu noturno, nebulosa, textura abstrata)
  - Opacity 0.15-0.25, blend mode overlay ou soft-light
  - Atrás da geometria, não substitui — complementa
- [ ] **Texturas por carta** — cada carta tem uma imagem de fundo sutil diferente
  - Astrology: céu estrelado · Kabbalah: pergaminho/dourado · Shadow: escuridão texturizada
  - Frequency: ondas abstratas · Numerology: pattern geométrico
  - Mesma regra: opacity baixa (0.08-0.15), não compete com texto
- [ ] **MapaFinal** — textura de papel antigo ou cosmos como fundo do grid
- [ ] Assets em `/public/textures/` — webp comprimido, <100KB cada
- [ ] Lazy load com `loading="lazy"` ou dynamic import

### 13.3 — Carta randômica a cada abertura

O problema: mesma pessoa = mesma carta. Sem surpresa. Sem razão para voltar.

- [ ] Adicionar `temperature: 0.8` na chamada à API em `/api/carta.ts`
  (atualmente usa default do Claude, que já tem variação — mas vamos garantir)
- [ ] Adicionar seed randômico no prompt: `"Seed de variação: ${Date.now() % 10000}. Use este seed para variar a ênfase — mantenha a precisão, varie o ângulo de entrada."`
- [ ] Client-side: não cachear a carta — buscar nova a cada abertura do MapaFinal
- [ ] **Resultado:** mesmo mapa, ângulo diferente a cada vez. Razão para voltar.

### 13.4 — Share e save confiáveis

O problema: share falha silenciosamente quando Supabase está fora.

- [ ] **Feedback visual:** se `persistReading()` falha → toast "não foi possível salvar — tente novamente"
- [ ] **Retry:** botão "tentar novamente" quando share falha (não esconder o erro)
- [ ] **Copy feedback:** ao copiar link, flash verde "link copiado" por 2s
- [ ] **Persistência automática:** salvar reading assim que journey completa, não esperar share
- [ ] **Loading state:** "gerando..." vira spinner dourado, não texto estático

### 13.5 — Pequenos fixes

- [ ] PalmEntry.tsx: remover "seus dados permanecem no seu navegador"
- [ ] Áudio toggle no `Carta.tsx` header (useAudio hook já pronto)
- [ ] Fix TODO `App.tsx` line 114 — `onMeet` no MapaFinal conectado ao fluxo real

**Critério:** Tudo legível. Imagens dão vida. Carta surpreende. Share funciona. Pessoa volta e vê algo novo.

---

## △ Fase 14 — Soul Mate (effort: 2)

**Status:** futuro
**Protocol:** full
**Escopo:** Soul Mate é a feature de distribuição — tem que ser tão boa que a pessoa manda para alguém. Hoje está ruim. Rewrite completo.

### O que está errado

1. **Sem número claro** — pessoa quer saber: "quanto combina?"
2. **Sem hierarquia** — tudo é texto corrido, não distingue match de mismatch
3. **Sem visual** — dois mapas lado a lado deviam brilhar, não ser parágrafo
4. **Sem ação** — leu, e daí? Não compartilha, não salva, não gera conversa

### O que precisa existir

```
┌──────────────────────────────────────┐
│  Maria × João                        │
│  78% ressonância                     │
│                                      │
│  ✦ O QUE RESSOA                      │
│  Elemento: Fogo × Fogo — amplificação│
│  Frequência: 528 Hz × 528 Hz — uníss │
│  Psique: id dominante nos dois       │
│                                      │
│  ✧ O QUE TENSIONA                    │
│  Sombra: herói × amante — projeções  │
│  Tikkun: Geburah → Netzach — 3 nós   │
│  Número: 1 × 6 — impulso vs cuidado  │
│                                      │
│  ─── síntese ───                     │
│  "A distância entre vocês é..."      │
│                                      │
│  [compartilhar] [nova leitura]       │
└──────────────────────────────────────┘
```

### Entregáveis

**14.1 — Engine: compatibilidade numérica**
- [ ] `engine/soul-mate.ts` → nova função `getCompatibilityScore(readingA, readingB): CompatibilityResult`
- [ ] Score 0-100% baseado em:
  - Elemento: mesmo=25, complementar=15, neutro=10, tensão=5
  - Frequência: uníssono=25, quinta=20, quarta=15, terça=10, outro=5
  - Arquétipo: complementar=20, mesmo=15, tensão=5
  - Tikkun distance: 0=15, 1=12, 2=8, 3+=4
  - Número: harmonia=15, neutro=10, tensão=5
- [ ] `matches: string[]` — lista do que ressoa (max 4)
- [ ] `tensions: string[]` — lista do que tensiona (max 4)
- [ ] Score não é destino — é mapa da dinâmica. Frase: "ressonância não é garantia. tensão não é fracasso."

**14.2 — UI: SoulMateRevelation rewrite**
- [ ] **Header grande:** nomes lado a lado + % ressonância (número animado, contagem)
- [ ] **Seção "O que ressoa"** — cards verdes/gold com os matches
  - Cada match: ícone do sistema + frase curta + detalhe expansível
- [ ] **Seção "O que tensiona"** — cards vermelhos/copper com as tensões
  - Cada tensão: ícone + frase curta + detalhe expansível
- [ ] **Visual comparativo:** dois mini-mapas lado a lado (signo, sephirah, arquétipo, freq, número)
  - Linhas douradas conectam o que ressoa
  - Linhas vermelhas pontilhadas no que tensiona
- [ ] **Síntese:** uma frase sobre o espaço entre os dois (vinda de `/api/carta` com prompt soul-mate)
- [ ] **Ações:** compartilhar resultado + gerar nova leitura + "convidar outra alma"

**14.3 — Share do Soul Mate**
- [ ] URL persistente: `?meet=tokenA,tokenB`
- [ ] Salvar Soul Mate reading no Supabase (novo tipo ou campo em atom_items)
- [ ] Botão "compartilhar este encontro" → copia link
- [ ] Preview OG: "O espaço entre [A] e [B] — 78% ressonância"

**Critério:** Pessoa recebe resultado → primeira reação é mandar para a outra pessoa. Score + match/mismatch claros.

---

## □ Fase 15 — Funil (effort: 3)

**Status:** futuro
**Protocol:** full
**Escopo:** O dinheiro entra. Pequenas revelações atraem — o teaser gratuito vende o completo.

### Princípio: micro-revelações como isca

A pessoa não paga para ver o mapa. Paga porque o teaser revelou algo que reconhece — e quer mais.

```
TEASER (zero fricção)
  Nome + data → Loading ritual → Journey
  Cartas 1-2 completas (astrology + kabbalah)
  Carta 3 (shadow): abertura aparece, corpo bloqueado
  → micro-revelação: "sua sombra inflada é [X]" (1 frase visível)
  → "para continuar, precisamos saber onde te encontrar"
  → campo email inline
  Mapa final: versão resumida (signo + sephirah + arquétipo, sem síntese)

COM EMAIL (tier: email)
  Cartas 3-5 desbloqueadas
  Oracle: 1 pergunta por carta
  Mapa final completo com síntese
  Carta pessoal gerada
  Link salvo 30 dias

PAGO (tier: oracle — R$19)
  Oracle: 3 perguntas por carta
  Soul Mate disponível
  Link permanente 12 meses
  Export PNG/PDF
```

### Entregáveis

**15.1 — Paywall no Journey**
- [ ] `useJourney` recebe `tier` prop
- [ ] Cartas 1-2: sempre completas (o teaser)
- [ ] Carta 3 (shadow): variation aparece + micro-revelação (1 frase da sombra inflada)
  - Body bloqueado com blur suave + overlay inline
  - "sua sombra já apareceu. para ver o que ela revela, precisamos saber onde te encontrar."
- [ ] Campo email inline no overlay (sem modal, sem popup)
- [ ] Após email: cartas 3-5 desbloqueiam com animação

**15.2 — Micro-revelações (growth engine)**
- [ ] **Na landing:** "descubra sua sombra" como CTA (não "gere seu mapa")
- [ ] **No teaser do mapa:** signo + sephirah + nome do arquétipo visíveis, descrição bloqueada
- [ ] **Share de teaser:** link compartilhável mostra mini-mapa (3 campos) + "ver mapa completo →"
- [ ] **Princípio:** cada micro-revelação é precisa o suficiente para a pessoa se reconhecer

**15.3 — Endpoint /api/capture-email**
- [ ] POST `{ readingId, email }` → atualiza `atom_items.email` + `atom_items.tier = 'email'`
- [ ] Dispara email via Resend com link do mapa
- [ ] Retorna `{ tier: 'email' }`

**15.4 — Kiwify live**
- [ ] Configurar `KIWIFY_ORACLE_URL` no Vercel
- [ ] `OracloCarta` mostra CTA upgrade após 1ª pergunta (tier email)
- [ ] Polling `/api/check-tier` após redirect

**15.5 — Oracle gated por tier**
- [ ] `tier: session` → oracle invisível
- [ ] `tier: email` → 1 pergunta por carta
- [ ] `tier: oracle` → 3 perguntas por carta

**Critério:** Pessoa vê 2 cartas + micro-revelação da sombra → dá email → journey completa → oráculo funciona → paga R$19 → oracle full. A micro-revelação é o que convence.

---

## ⬠ Fase 16 — Superfície (effort: 5)

**Status:** futuro
**Protocol:** full
**Escopo:** O produto existe para o Google, para o WhatsApp, e se exporta.

### Entregáveis

**16.1 — SEO básico**
- [ ] `public/robots.txt` — allow all
- [ ] `public/sitemap.xml` — landing + about
- [ ] `<title>` dinâmico via useEffect
- [ ] Meta description atualizada

**16.2 — OG tags dinâmicas**
- [ ] `/api/og-image.tsx` (Vercel OG) — imagem com nome + signo + geometria
- [ ] `?token=XYZ` → og:title "Cartografia de [Nome] — [Signo]"
- [ ] `?meet=A,B` → og:title "O espaço entre [A] e [B] — X% ressonância"
- [ ] og:image aponta para `/api/og-image?token=XYZ`

**16.3 — Export**
- [ ] `npm install html2canvas jspdf`
- [ ] Botão "salvar como imagem" no MapaFinal → PNG otimizado Stories (9:16)
- [ ] Botão "baixar PDF" (tier oracle+) → mapa completo sem oracle
- [ ] Watermark: "cartografia da alma" no rodapé
- [ ] Download: `cartografia-[nome]-[signo].png/pdf`

**16.4 — Analytics (Plausible)**
- [ ] Script Plausible no `index.html`
- [ ] Eventos: map_generated, email_captured, oracle_opened, payment_completed, share_copied, soul_mate_initiated
- [ ] Dashboard: leituras/dia · conversão email · conversão pagamento

**16.5 — Página 404**
- [ ] "este mapa não está mais aqui" + geometria + CTA "gere o seu →"

**16.6 — Página About**
- [ ] 6 tradições com fontes, linguagem de documentação
- [ ] Link na Landing (footer)

**Critério:** Link no WhatsApp mostra preview com nome e signo. PNG compartilhável. Google indexa.

---

## ○ Fase 17 — Lançamento (effort: 8)

**Status:** futuro
**Protocol:** full
**Escopo:** O produto no mundo. Validado. Sustentável.

### Entregáveis

**17.1 — Domínio**
- [ ] Rick decide: cartografia.com.br / cartografiadaalma.com / cartografia.app
- [ ] Configurar no Vercel
- [ ] Redirect .vercel.app → domínio final

**17.2 — QA completo**
- [ ] iOS Safari + Android Chrome + Desktop (Chrome, Firefox, Safari)
- [ ] Todos os tiers: session → email → oracle
- [ ] Pagamento real via Kiwify
- [ ] Soul Mate end-to-end (gerar, compartilhar, abrir, ver score)
- [ ] Share link → preview OG → abrir → viewer mode
- [ ] Console limpo (zero erros, zero warnings)

**17.3 — Beta fechado**
- [ ] 5 pessoas geram mapa antes do post público
- [ ] Feedback: "isso é sobre mim?" + "consegui navegar sem ajuda?" + "mandaria para alguém?"
- [ ] 1 iteração se necessário

**17.4 — Lançamento**
- [ ] Rick gera o próprio mapa → posta screenshot (não o app — o resultado)
- [ ] Copy do post: uma micro-revelação do próprio mapa como gancho
- [ ] Comunidades: astrologia BR · psicologia junguiana · espiritualidade · LinkedIn (ângulo IA)

**Critério:** 5 pessoas pagaram. 1 voltou sem ser chamada. 1 mandou para alguém.

---

## Métricas de sucesso (por fase)

| Fase | Critério de fechamento |
|------|----------------------|
| 13 · Polimento | Tudo legível. Imagens dão vida. Carta surpreende. Share funciona. |
| 14 · Soul Mate | Score + match/mismatch claros. Pessoa manda resultado para alguém. |
| 15 · Funil | Micro-revelação convence → email → journey completa → pagamento funciona. |
| 16 · Superfície | WhatsApp preview com nome. PNG compartilhável. Google indexa. |
| 17 · Lançamento | 5 pagaram. 1 voltou. 1 indicou. |

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
2. **Polimento primeiro.** Fase 13 antes de vender — o produto precisa ser bonito.
3. **Pequenas revelações atraem.** O teaser gratuito vende o completo.
4. **Testar como usuário.** Cada fase: gerar mapa do início ao fim.
5. **O produto decide o ritmo.** A pausa forçada é inviolável.
6. **Medir antes de otimizar.** Analytics antes de growth hacks.
7. **Este documento é a referência.** Se não está aqui, não está planejado.

---

## Versionamento

| Versão | Data | Mudança |
|--------|------|---------| 
| 1.0 | 05 Abr 2026 | Ship V3 — conexão · funil · superfície · distribuição · lançamento |
| 2.0 | 05 Abr 2026 | Rewrite com feedback de uso: cores, imagens, carta randômica, soul mate rewrite, share fix, micro-revelações |

---

*Pequenas revelações atraem.*
*O produto só é real quando alguém paga por ele e volta.*
*— E.*
