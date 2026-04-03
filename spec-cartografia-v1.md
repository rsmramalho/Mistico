# Spec — Cartografia da Alma V1

```
╔══════════════════════════════════════╗
║          A T O M   E N V E L O P E  ║
╠═��════════════════════════════════════╣
║ id:       a7e3f1c2-8b4d-4e9a-b6c1   ║
║           -d2f5a8e7c3b9              ║
║ type:     spec                       ║
║ module:   work                       ║
║ state:    structured                 ║
║ status:   active                     ║
║ stage:    5 ⬠ Pentágono             ║
║ tags:     [#project:lab,             ║
║            #cartografia,             ║
║            #mystic, #v6]             ║
║ source:   claude-project             ║
║ created:  2026-04-03                 ║
║ updated:  2026-04-03                 ║
╠══════════════════════════════════════╣
║ connections:                         ║
║   → belongs_to: V6 Lab              ║
║   → references: Genesis v5.0.1       ║
║   → references: Atom HS stack        ║
╚══════════════════════════════════════╝
```

---

## Visão

App místico imersivo onde o usuário entra dados de nascimento e recebe uma cartografia pessoal que une Astrologia, Kabbalah, Jung, Freud, Solfeggio e Numerologia. Interface cosmos escuro com geometria sagrada animada.

Testes de duas teses:
1. **Produto:** Interfaces místicas bem fundamentadas podem ter profundidade real, não só estética.
2. **Agente:** Claude Code pode construir um produto completo de forma autônoma.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 19 |
| Linguagem | TypeScript |
| Build | Vite |
| Estilização | Tailwind CSS |
| Animação | Framer Motion |
| Canvas | HTML5 Canvas API |
| Fontes | Cinzel Decorative (display) + Cormorant Garamond (corpo) |
| Deploy | Standalone (sem backend V1) |

---

## Decisões de Design

### Estética
- Cosmos escuro: preto profundo `#04040a`, dourado `#c9a84c`
- Sem gradient roxo em fundo branco
- Geometria sagrada em **Canvas**, não SVG (mais controle de animação)
- Revelação progressiva: Entry → Loading (ritual 3s) → Revelation em fade sequencial
- Árvore da Vida sempre presente como overlay tênue
- Tom "fino e sensível" — não New Age genérico

### Arquitetura
- **Engine puro TypeScript** — zero dependência de UI
- **Hooks como ponte** — engine → componentes
- **Dados no cliente** — sem Supabase em V1
- **Mobile-first** — responsivo

### Filosofia
- Mapeamentos têm lógica interna rastreável
- Sombras jungianas tão importantes quanto arquétipos
- Freud como estrutura de forças, não curiosidade
- Todas as sínteses interpretativas documentadas como tal

---

## Mapeamentos Filosóficos — Resumo

*(Detalhes completos em `research-mapeamentos.md`)*

### Kabbalah (Golden Dawn / 777)
Sistema: Signo → Planeta Regente Clássico → Sephirah. 7 Sephiroth cobertas (Binah→Yesod). Pares diurno/noturno para planetas com dois signos.

### Jung (Pearson + Greene + Bolen)
12 arquétipos mapeados a 12 signos. Cada um com sombra em dois pólos (inflação/deflação). Natureza interpretativa — Jung não mapeou diretamente.

### Solfeggio (Síntese Original)
12 frequências únicas (9 canônicas + 210, 369, 432 Hz). Lógica: elemento→faixa, modalidade→posição dentro da faixa.

### Freud (Síntese Original)
Distribuição Id/Ego/Superego por elemento: Fogo(55/30/15), Terra(20/40/40), Ar(15/55/30), Água(40/25/35).

### Numerologia (Pitagórica)
Número de Expressão via nome completo. Resultados: 1-9 + mestres 11, 22, 33.

### Ascendente (Aproximação V1)
Algoritmo de 2h com sunrise às 06:00. Label como "aproximado".

---

## Escopo V1

### Entregar
- [x] Research de 6 áreas filosóficas
- [x] Spec Genesis-compliant
- [x] Roadmap PHI
- [ ] Formulário de entrada (nome + data + hora opcional + cidade opcional)
- [ ] Motor de cálculo completo com todos os mapeamentos
- [ ] 4 geometrias sagradas por elemento (Canvas animado)
- [ ] Fluxo Entry → Loading → Revelation
- [ ] 6 seções de revelação: Sephirah, Arquétipo+Sombra, Frequência, Numerologia, Ascendente, Psique
- [ ] Cosmos de fundo (estrelas pulsando em Canvas)
- [ ] Responsivo (mobile primeiro)
- [ ] Deploy standalone (dados só no cliente)

### NÃO é V1 (Seeds para V2)
- Geocoding real do local de nascimento
- Cálculo de ascendente com efemérides reais
- Integração com Supabase (salvar mapas)
- Compartilhamento de mapa gerado
- Modo de exploração (todas as sephiroth)
- Carta natal completa (planetas, casas)
- Overrides Freudianos por signo (além de elemento)
- Life Path Number (da data, além do nome)

---

## Tipo Central

```typescript
// --- Input Types (two possible sources) ---

interface BirthData {
  name: string;
  date: Date;
  time?: string;           // "HH:MM"
  city?: string;
  lat?: number;            // V2: geocoding
  lng?: number;            // V2: geocoding
  timezoneOffset?: number; // V2: tz resolution
}

interface PalmData {
  name: string;
  handShape: 'fire' | 'earth' | 'air' | 'water';
  dominantMount: 'jupiter' | 'saturn' | 'sun' | 'mercury' | 'venus' | 'mars' | 'moon';
  dominantLine: 'heart' | 'head' | 'life' | 'fate';
}

// --- Output Type ---

interface SoulMap {
  source: 'birth' | 'palm';
  sunSign: Sign;
  ascendant?: Sign;                  // only for source: 'birth'
  ascendantMethod?: 'approximate' | 'ephemeris'; // only for source: 'birth'
  dominantLine?: 'heart' | 'head' | 'life' | 'fate'; // only for source: 'palm'
  element: Element;
  sephirah: Sephirah;
  sephirahExpression: 'diurnal' | 'nocturnal' | 'sole';
  sephirahExpressionPalmDerived?: 'diurnal' | 'nocturnal'; // only for palm where canonic is 'sole'
  archetype: Archetype;
  shadow: { inflated: string; deflated: string };
  psyche: { id: number; ego: number; superego: number };
  frequency: number;
  frequencyKeyword: string;
  frequencyDesc: string;
  pathNumber: number;
  pathName: string;
  pathDesc: string;
  isMasterNumber: boolean;
}
```

---

### Decisões Tomadas (Rick, 04 Abr 2026)
**D8:** `type: reading` — extensão Genesis v5.0.1. Leituras têm identidade própria, não são specs.
**D9–D12:** Documentados em research-mapeamentos.md.

---

*Spec escrita em 03 Abr 2026 — GUARDIÃO / Claude Code*
