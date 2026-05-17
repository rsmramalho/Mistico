# Prompt de Continuação — Cartografia da Alma
*04 Abr 2026 — estado real pós Claude Code*

---

## ANTES DE QUALQUER COISA

Ler nesta ordem:
1. `ROADMAP.md` — estado atual real
2. `specs/oraculo-v1.md` — o oráculo é o coração
3. `specs/ecossistema-v1.md` — visão completa
4. `specs/arquitetura-produto.md` — dois produtos standalone
5. `sessions/wraps/wrap-sessao-cartografia-04abr.md` — o que aconteceu

---

## ACESSO

```
Repo cartografia: rsmramalho/Mistico (renomear para cartografia-da-alma)
Repo E:           rsmramalho/E
Deploy:           cartografia-da-alma.vercel.app
PAT:              [Rick gera novo ao abrir sessão — fine-grained, Contents R/W]
```

Clone com PAT:
```bash
git clone https://[PAT]@github.com/rsmramalho/Mistico.git
git config user.email "e@espaco-entre.io"
git config user.name "E."
```

---

## ESTADO ATUAL (04 Abr 2026)

### Completo ✅
- **M1 Engine** — 10 módulos: astrology, kabbalah, jung, freud, solfeggio, numerology, palm, soul-mate, oracle, index
- **M2 Visual** — Gateway, Entry, Loading ritual (7s, 6 sistemas), Revelation (sem Cinzel, sem cards), RevealSection
- **M3 Deploy** — cartografia-da-alma.vercel.app no ar, Supabase conectado
- **Oráculo** — oracle.ts + OracleSection.tsx, 3 perguntas, claude-sonnet-4-6, contexto SoulMap completo

### Pendente ⏳
- **M4 Monetização** — única coisa que falta para v1.0
- **QA visual** — Rick ainda não viu Loading + Revelation + Oráculo ao vivo
- **Domínio** — cartografia.com.br ou outro (verificar disponibilidade)
- **PhiTime** — Rick vai trazer a spec original

---

## O PRODUTO

App místico standalone. Seis sistemas filosóficos reais com fontes rastreáveis.
Não enganamos ninguém — cada mapeamento tem documentação em `research-mapeamentos.md`.

**Fluxo:** Gateway → Entry (nascimento ou palma) → Loading ritual → Revelation → Oráculo

**Stack:** React 19 + Vite + TypeScript + Tailwind + Framer Motion + Canvas
**Fontes:** Cormorant Garant + Jost. Sem Cinzel Decorative. Sem rounded-lg como containers.

---

## PRÓXIMAS TAREFAS

### PRIORIDADE 1 — QA visual ao vivo
Rick precisa ver o estado atual:
- Loading com ritual de 7s e 6 sistemas
- Revelation com novo visual (nome grande, sem cards, border-left sombra)
- Oráculo funcionando com VITE_ANTHROPIC_API_KEY configurada

Verificar se VITE_ANTHROPIC_API_KEY está nas env vars do Vercel.
Se não estiver: Vercel Dashboard → Settings → Environment Variables → adicionar.

### PRIORIDADE 2 — M4 Monetização

**Modelo decidido:**
- Leitura individual: R$19
- Soul Mate: R$29

**Decisão pendente (Rick):** Kiwify ou Stripe
- Kiwify: mais simples, audiência BR nativa, sem configuração bancária complexa
- Stripe: mais controle, webhook, expansão internacional

**Fluxo proposto:**
1. Leitura gratuita — mapa visual completo + 1 pergunta ao oráculo
2. Pago — oráculo completo (3 perguntas) + link permanente + compartilhamento

**Quando Rick decidir:** implementar pay.1 no Claude Code.

### PRIORIDADE 3 — v1.0 launch checklist
- [ ] QA visual aprovado
- [ ] Domínio configurado
- [ ] Monetização integrada e testada
- [ ] VITE_ANTHROPIC_API_KEY no Vercel
- [ ] Rick gera o próprio mapa e posta

### HORIZONTE — Seeds V2
Quando v1.0 estiver no ar:
- PhiTime engine (Rick traz spec)
- Geocoding + ascendente real (OpenCage + astronomia lib)
- Gene Keys como camada adicional
- Síntese interpretativa combinatória
- Correlação MindRoot × SoulMap

---

## VISÃO DO ECOSSISTEMA

Dois produtos **standalone** — completos em si mesmos.

**Cartografia da Alma** — quem você é (SoulMap)
**MindRoot** — como você vive (ação, emoção, tempo, alma)

Infraestrutura compartilhada (DB, auth, lei Genesis) sem dependência de produto.
O Cartografia é porta de entrada natural para o MindRoot — mas nenhum precisa do outro.

Quando se encontram: dados reais de vida × camadas ocultas do mapa.
O sistema correlaciona — não prevê.

*"O oculto não substitui o dado. Revela o padrão por baixo do dado."*
*"Nenhum mapa precisa do outro para ser inteiro."*

---

## PRINCÍPIOS

1. Conteúdo com base real — fontes rastreáveis, não misticismo vazio
2. Sem Cinzel Decorative, sem rounded-lg como containers
3. tsc 0 erros antes de qualquer commit
4. O oráculo não aconselha — revela. Curto, denso, preciso.
5. Maturação Permissiva — consolidar antes de adicionar
6. Este é o projeto de E. — Rick faz o manejo

---

*E. — 04 Abr 2026*
