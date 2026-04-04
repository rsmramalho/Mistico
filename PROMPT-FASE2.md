# Prompt de Ativação — Fase 2 · Contrato
## Para Claude Code · VS Code Terminal

**Copiar e colar no Claude Code para iniciar a sessão.**

---

Você é E. — co-arquiteto da Cartografia da Alma.

Leia nesta ordem antes de qualquer código:
1. `cartografia-da-alma/CLAUDE.md` — identidade, protocolo, regras
2. `ROADMAP-MASTER.md` — estado do produto e fases
3. Este prompt — o que executar agora

---

## Contexto rápido

Produto: app místico com seis tradições filosóficas → mapa pessoal + oráculo + soul mate.
Deploy: cartografia-da-alma.vercel.app (Vercel + Supabase + Anthropic API)
Fase 1 está completa. Fase 2 é o que você vai executar agora.

**Protocol desta fase:** `surface + foundation`
**Agentes:** GUARDIÃO → ROOT → INTERFACE

---

## GUARDIÃO — validação antes de qualquer código

Antes de escrever uma linha, confirmar:

1. `VITE_ANTHROPIC_API_KEY` está sendo usada diretamente no frontend?
   - Procurar em: `src/engine/oracle.ts` e `src/components/OracleSection.tsx`
   - Se sim: confirmar que o proxy vai substituir completamente esse uso

2. O `soulMapRef` em `src/hooks/useSoulMap.ts` é código morto?
   - Se sim: marcar para remoção

3. O copy "seus dados permanecem no seu navegador" está em `src/screens/Entry.tsx`?
   - Se sim: marcar para substituição

4. `public/favicon.svg` existe?
   - Se não: criar

Reportar o que encontrou. Só então avançar.

---

## ROOT — Vercel Function `/api/oracle`

**Objetivo:** tirar a VITE_ANTHROPIC_API_KEY do bundle público.
Toda call à Anthropic passa pelo servidor — nunca pelo browser.

### 1. Criar `cartografia-da-alma/api/oracle.ts`

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Oracle unavailable' });
  }
}
```

### 2. Adicionar `@vercel/node` se necessário
```bash
cd cartografia-da-alma
npm install --save-dev @vercel/node
```

### 3. Criar/verificar `cartografia-da-alma/vercel.json`
```json
{
  "functions": {
    "api/oracle.ts": {
      "maxDuration": 30
    }
  }
}
```

### 4. No Vercel Dashboard
Adicionar variável de ambiente:
- `ANTHROPIC_API_KEY` = [valor atual de VITE_ANTHROPIC_API_KEY]
- **Sem o prefixo VITE_** — esta é a variável server-side

---

## INTERFACE — 5 fixes no frontend

### Fix 1: OracleSection — usar proxy

Em `src/components/OracleSection.tsx`, substituir o import direto da API:

Procurar onde `VITE_ANTHROPIC_API_KEY` é usada e onde a call à Anthropic acontece.
Substituir pela call ao proxy:

```typescript
// Antes (ou similar — adaptar ao que existir):
// fetch('https://api.anthropic.com/v1/messages', { headers: { 'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY }, ... })

// Depois:
const response = await fetch('/api/oracle', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    system: systemPrompt,
    messages: messages,
  }),
});
```

A lógica de parsear a resposta permanece igual.
Remover qualquer referência a `VITE_ANTHROPIC_API_KEY` do código.
Remover o guard `if (!import.meta.env.VITE_ANTHROPIC_API_KEY) return null;`
— o oracle sempre aparece. Se proxy falhar, mostra erro "o oráculo está em silêncio".

### Fix 2: Entry.tsx — copy falso

Em `src/screens/Entry.tsx`, localizar:
```
"seus dados permanecem no seu navegador"
```

Substituir por:
```
"cartografia gerada por IA · leitura salva por 12 meses"
```

### Fix 3: useSoulMap.ts — código morto

Em `src/hooks/useSoulMap.ts`, remover as linhas:
```typescript
const soulMapRef = useState<SoulMap | null>(null);
void soulMapRef; // used via closure below
```

E remover `soulMapRef` das dependências do `share` useCallback se ainda estiver lá.
Verificar que `soulMap` (o state real) ainda está sendo usado corretamente no retry de share.

### Fix 4: Favicon

Criar `cartografia-da-alma/public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#07070f"/>
  <!-- Hexágono simples em gold -->
  <polygon
    points="16,4 26,10 26,22 16,28 6,22 6,10"
    fill="none"
    stroke="#C9A84C"
    stroke-width="1.5"
  />
  <!-- Ponto central -->
  <circle cx="16" cy="16" r="2" fill="#C9A84C"/>
</svg>
```

Verificar que `index.html` tem `<link rel="icon" href="/favicon.svg">`.

### Fix 5: Soul Mate — label do input

Em `src/screens/Revelation.tsx`, no FooterBlock, localizar o input "encontrar outra alma":

```
placeholder="cole o link ou token"
```

Substituir por:
```
placeholder="cole o link de outro mapa"
```

E o label acima (se existir "encontrar outra alma"):
Adicionar uma linha de instrução discreta abaixo:

```tsx
<p style={{
  fontFamily: 'var(--sans)', fontSize: '8px', fontWeight: 200,
  letterSpacing: '0.25em', color: 'var(--white-ghost)',
  textTransform: 'uppercase', marginTop: '8px',
}}>
  cole o link compartilhado de outro mapa
</p>
```

---

## TEIA — validação final

Antes de commitar:

```bash
cd cartografia-da-alma
npm run build
```

**Zero erros TypeScript é obrigatório. Não commitar com erros.**

Se build passar, verificar:
- [ ] `VITE_ANTHROPIC_API_KEY` não aparece em nenhum arquivo `.ts` ou `.tsx`
- [ ] `api/oracle.ts` existe
- [ ] `vercel.json` existe
- [ ] `public/favicon.svg` existe
- [ ] Copy da Entry foi atualizado
- [ ] soulMapRef removido
- [ ] Soul Mate label atualizado

---

## Commit e push

```bash
cd /path/to/Mistico

git config user.email "e@espaco-entre.io"
git config user.name "E."
git remote set-url origin https://[PAT]@github.com/rsmramalho/Mistico.git

# Commits separados por agente
git add cartografia-da-alma/api/oracle.ts cartografia-da-alma/vercel.json
git commit -m "root: vercel function /api/oracle — anthropic proxy"

git add cartografia-da-alma/src/components/OracleSection.tsx
git commit -m "interface: oracle section usa /api/oracle em vez de anthropic direta"

git add cartografia-da-alma/src/hooks/useSoulMap.ts cartografia-da-alma/src/screens/Entry.tsx cartografia-da-alma/src/screens/Revelation.tsx cartografia-da-alma/public/favicon.svg
git commit -m "interface: copy fix + favicon + soul mate label + remove dead code"

git push origin main
```

---

## Após o push

Vercel deploy automático em ~60s.

Verificar no dashboard Vercel:
- Build passou
- Adicionar `ANTHROPIC_API_KEY` nas Environment Variables (se ainda não feito)
- Re-deploy após adicionar a variável

Testar em produção:
- Oracle responde (sem erro de API key)
- Console sem VITE_ANTHROPIC_API_KEY exposta
- Favicon aparece na aba do browser

---

## Quando Fase 2 fechar

Atualizar `ROADMAP-MASTER.md`:
- Fase 2: mudar status para `done`
- Adicionar commit hash
- Fase 3: mudar status para `em progresso`

```bash
git add ROADMAP-MASTER.md
git commit -m "roadmap: fase 2 completa — fase 3 em progresso"
git push origin main
```

---

*Fase 2 é o contrato. Sem proxy, sem monetização.*
*Sem favicon, sem profissionalismo.*
*Sem copy verdadeiro, sem confiança.*
*Fechar antes de avançar.*
*— E.*
