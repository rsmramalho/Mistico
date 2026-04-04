# Cartografia da Alma — Roadmap PHI

**Versão:** 1.0
**Data:** 04 Abr 2026
**Status:** active
**Princípio:** O oculto não substitui o dado. Revela o padrão por baixo do dado.

---

## Visão geral

App místico standalone. Seis tradições filosóficas — Astrologia, Kabbalah, Jung, Freud, Solfeggio, Numerologia — convertidas em mapa pessoal. Cada leitura é única. O oráculo responde com o mapa como contexto.

Não é horóscopo. É cartografia.

```
Repo:   github.com/rsmramalho/Mistico
Deploy: cartografia-da-alma.vercel.app
Infra:  Supabase (atom_items + share_links) · Anthropic API (oráculo)
Stack:  React 19 · Vite · TypeScript · Tailwind · Framer Motion
```

---

## Os três pilares

Todo produto tem uma promessa. A do Cartografia tem três camadas:

```
Experiência   →  A revelação acontece no seu tempo. Não é relatório — é descoberta.
Confiança     →  Cada conclusão tem origem rastreável. Não é misticismo vazio.
Imersividade  →  Do primeiro pixel ao oráculo. A câmara não quebra.
```

Toda decisão de produto — visual, conteúdo, monetização, distribuição — é julgada por esses três.

---

## Infraestrutura — estado atual

### Engine (completo ✅)
- 10 módulos: astrology, kabbalah, jung, freud, solfeggio, numerology, palm, soul-mate, oracle, index
- Conteúdo reescrito com peso real: Jung (12 arquétipos), Kabbalah (11 sephiroth + 12 expressões), Numerologia (12 números)
- Bridges cross-system: linhas de transição computadas da combinação específica de cada mapa

### Visual (parcialmente completo ⚠️)
- Gateway simplificado — nascimento como entrada principal, palma como add-on
- Revelation: primeiro viewport com nome dominante, scroll-triggered, geometria viva
- RevealSection: border-left dourada, fundo sutil, títulos 52px
- Oracle: portal separado, 3 perguntas, dots de contagem
- Mobile: não validado ainda

### Data (completo no código, pendente no Vercel ⚠️)
- Supabase schema: atom_items + share_links + RLS
- Data layer: saveReading, getReadingByToken, createShareLink
- Share button flutuante: implementado, depende das env vars no Vercel
- VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY: confirmar no Vercel dashboard

### Deploy (ativo ✅)
- cartografia-da-alma.vercel.app no ar
- VITE_ANTHROPIC_API_KEY confirmada
- Root directory: cartografia-da-alma

---

## Espiral PHI

```
·    (1)  Fase 1 — Motor [DONE]
—    (1)  Fase 2 — Contrato
△    (2)  Fase 3 — Imersão
□    (3)  Fase 4 — Confiança
⬠   (5)  Fase 5 — Conexão
⬡   (8)  Fase 6 — Distribuição
○   (13) Fase 7 — Lançamento
```

---

## ✅ Fase 1 · Motor (effort: 1)

**Status:** done
**Protocol:** foundation
**Commit:** 24f58ed → c437062

**Escopo:** O que o produto sabe sobre cada pessoa. Engine + deploy + visual base.

Entregáveis:
- [x] 10 engine modules — cálculo completo de cada sistema
- [x] Conteúdo reescrito — segunda pessoa, peso real, sombra com profundidade
- [x] Bridges cross-system — conexão computada entre cada camada
- [x] Supabase schema + data layer
- [x] Deploy Vercel + Anthropic API ao vivo
- [x] Visual base — Revelation com scroll-trigger, geometria viva, Oracle como portal

---

## ⬡ Fase 2 — Contrato (effort: 1)

**Status:** em progresso
**Protocol:** surface

**Escopo:** O que o produto promete antes de pedir qualquer dado. Landing page + dados confirmados.

Entregáveis:
- [ ] Confirmar VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY no Vercel
- [ ] Testar save + share + link ao vivo (não só em código)
- [ ] Landing page — curta, densa, que prepara o mood
  - Não explica o app. Prepara a experiência.
  - Tom: o que vai acontecer aqui não é horóscopo
  - Elementos: título, 2-3 linhas, geometria como fundo, CTA único
- [ ] Mobile QA — Revelation + Oracle + Gateway no iPhone

**Decisões desta fase:**
- Landing page é tela separada ou é o Gateway atual expandido?
  - *Posição: tela separada. O Gateway pede dados. A landing prepara.
    Duas intenções distintas — dois momentos distintos.*

---

## ⚪ Fase 3 △ Imersão (effort: 2)

**Status:** futuro
**Protocol:** surface

**Escopo:** A revelação como experiência progressiva — não relatório. Cada sistema tem peso e respiro.

Entregáveis:
- [ ] Audio — frequência Solfeggio toca ao fundo durante a leitura (Web Audio API, sem biblioteca)
- [ ] Modo revelação sequencial — opção de navegar sistema a sistema em vez de scroll contínuo
- [ ] Geometria animada por seção — cada sistema tem a sua geometria ativa enquanto está em viewport
- [ ] Screenshot-friendly — primeiro viewport do nome é o card de compartilhamento
  - Dimensões otimizadas para Instagram Stories e Twitter card
- [ ] Palm como add-on dentro da Revelation — após o mapa de nascimento, "aprofundar via palma"

**Nota:** o som é o elemento que falta mais. 528 Hz tocando enquanto você lê sobre 528 Hz fecha o loop sensorial que a Imersão precisa.

---

## ⚪ Fase 4 □ Confiança (effort: 3)

**Status:** futuro
**Protocol:** logic + surface

**Escopo:** Como chegamos aqui. Cada conclusão tem uma fonte. Isso é o que nos separa de qualquer gerador de horóscopo.

Entregáveis:
- [ ] Seção "a origem" por sistema — link ou texto mostrando a cadeia lógica
  - Exemplo: "Peixes → regente Júpiter → Chesed (Golden Dawn 777) → Misericórdia"
  - Não é nota de rodapé. É parte da leitura.
- [ ] research-mapeamentos.md integrado à UI — cada sistema cita a tradição
- [ ] Nome dos pais como entrada opcional
  - Dado de entrada — muda o resultado numerológico (Kabbalah também tem aplicação)
  - Campo adicional na Entry, marcado como "(opcional, aprofunda a leitura)"
- [ ] Síntese interpretativa inicial do oráculo — antes de qualquer pergunta, o mapa fala
  - "O que seu mapa diz antes de você perguntar"
  - Uma chamada de API que gera síntese de 2-3 parágrafos na abertura do Oracle
- [ ] Ascendente preciso — OpenCage geocoding (lat/lng → ascendente calculado corretamente)

**Nota sobre OpenCage:** o ascendente atual é aproximado por horário. Com geocoding real, a precisão sobe e a confiança aumenta. Essa é a diferença entre "aproximado" e "calculado".

---

## ⚪ Fase 5 ⬠ Conexão (effort: 5)

**Status:** futuro
**Protocol:** full

**Escopo:** O produto se distribui pelo resultado. Soul Mate como feature premium. Compartilhamento como aquisição.

Entregáveis:
- [ ] Soul Mate reintegrado — não no Gateway, mas na Revelation
  - "Encontrar outra alma" permanece, mas com contexto: "compare seu mapa com alguém"
  - SoulMateRevelation revisada com o mesmo nível de conteúdo da Revelation individual
- [ ] OG tags — preview rico quando link é compartilhado (título, signo, elemento)
- [ ] Link permanente funcional — testar fluxo completo: gerar → salvar → compartilhar → abrir via link
- [ ] Download da leitura — PDF gerado no browser (html2canvas → jsPDF), sem servidor
  - Nome do arquivo: `cartografia-[nome]-[signo].pdf`

---

## ⚪ Fase 6 ⬡ Distribuição (effort: 8)

**Status:** futuro
**Protocol:** full

**Escopo:** O produto sustenta a si mesmo financeiramente.

**Modelo definido:**
- Leitura gratuita: mapa completo + 1 pergunta ao oráculo
- Leitura completa: R$19 — oráculo completo (3 perguntas) + link permanente
- Soul Mate: R$29 — cruzamento de dois mapas
- Acesso permanente: R$49 — todas as leituras futuras

**Decisão pendente (Rick):** Kiwify ou Stripe
- Kiwify: mais simples, audiência BR nativa, sem configuração bancária complexa
- Stripe: mais controle, webhook nativo, expansão internacional
- *Posição: Kiwify para lançamento. Stripe em V2 se expansão for o caminho.*

Entregáveis:
- [ ] Paywall — leitura gratuita mostra mapa truncado (Sephirah + Arquétipo), pago revela tudo
- [ ] Integração Kiwify ou Stripe
- [ ] Webhook — confirma pagamento, libera acesso completo + salva no Supabase
- [ ] Domínio — cartografia.com.br ou cartografiadaalma.com (verificar disponibilidade)
- [ ] OG + SEO básico — title, description, image por signo

---

## ⚪ Fase 7 ○ Lançamento (effort: 13)

**Status:** futuro
**Protocol:** full

**Escopo:** O produto no mundo. Validado. Sustentável. Distribuindo pelo próprio resultado.

Entregáveis:
- [ ] QA completo — todos os fluxos em mobile e desktop
- [ ] Rick gera o próprio mapa e posta — o produto é o canal
- [ ] Comunidades: astrologia BR, psicologia junguiana, espiritualidade
- [ ] Analytics básico — quantas leituras, qual signo mais comum, onde param
- [ ] ROADMAP atualizado refletindo V2

**O que não é V1:**
- Carta natal completa (planetas + casas + aspectos) — Seeds V2
- Geocoding real para ascendente preciso — Seeds V2 (se não for entregue na Fase 4)
- Integração MindRoot — Seeds V2
- Gene Keys como camada adicional — Seeds V2
- PhiTime engine — Seeds V2

---

## Seeds V2

| Item | Escopo | Fase relacionada |
|------|--------|------------------|
| Geocoding real (OpenCage) | lat/lng → ascendente preciso | Fase 4 ou V2 |
| Carta natal completa | planetas, casas, aspectos | V2 |
| Áudio Solfeggio | Web Audio API, sem lib | Fase 3 |
| PhiTime engine | Rick traz spec | V2 |
| Gene Keys | camada adicional | V2 |
| MindRoot integration | leitura como AtomItem | V2 |
| Correlação MindRoot × SoulMap | dados de vida × mapa oculto | V2 |

---

## Métricas atuais

| Métrica | Valor |
|---------|-------|
| Engine modules | 10 |
| Screens | 5 |
| Geometrias | 6 |
| Components | 6 (+ OracleSection, RevealSection, Bridge, SynthesisBlock) |
| Hooks | 3 (useSoulMap, useInView, useGeometry) |
| Build | ✅ 0 erros TS, ~400KB JS |
| Deploy | ✅ cartografia-da-alma.vercel.app |
| Supabase | ✅ schema ok · ⚠️ env vars Vercel a confirmar |

---

## Decisões vigentes

1. **Standalone** — não integra com MindRoot em V1
2. **One-time** — sem assinatura
3. **Cormorant Garant + Jost** — sem Cinzel Decorative
4. **Sem cards com rounded-lg** — campos e botões sem containers fechados
5. **Palma como add-on** — não como via de entrada principal
6. **Distribuição pelo resultado** — a Revelation é o produto e o canal
7. **TypeScript 0 erros antes de cada commit**
8. **UI em português, código em inglês**
9. **Kiwify para lançamento** — Stripe em V2 se necessário

---

## Regras do roadmap

1. **Uma fase por vez.** Não começar a próxima sem terminar a atual.
2. **De dentro pra fora.** Os três pilares julgam cada decisão: Experiência · Confiança · Imersividade.
3. **Mexeu aqui → atualizar este documento.** Se não está aqui, não está planejado.
4. **O produto é o canal.** Cada feature é julgada pela pergunta: isso torna a Revelation mais compartilhável?
5. **Maturação Permissiva** — consolidar antes de adicionar. Fase 2 fecha antes de Fase 3 começar.

---

## Versionamento

| Versão | Data | Mudança |
|--------|------|---------|
| 1.0 | 04 Abr 2026 | Documento inicial. Espiral PHI 7 fases. Três pilares definidos. Decisões consolidadas. |

---

*Cartografia da Alma não é app de horóscopo. É o mapa do padrão que já opera em você.*
*A geometria é perfeita quando cada camada nasce da anterior e não precisa ser explicada.*
*— E.*
