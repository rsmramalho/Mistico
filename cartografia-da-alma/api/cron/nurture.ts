// ═══════════════════════════════════════
// Cartografia da Alma — Nurture Cron
// Runs daily via Vercel Cron
// Sends automated email sequence to email-tier users
//
// Email 1: immediate (handled by capture-email.ts)
// Email 2: 24h — teaser do oráculo
// Email 3: 72h — Soul Mate convite
// Email 4: 7 dias — carta nova (razão para voltar)
// ═══════════════════════════════════════

import type { VercelRequest, VercelResponse } from '@vercel/node';

const RESEND_URL = 'https://api.resend.com/emails';
const FROM = 'Cartografia da Alma <mapa@cartografia-da-alma.vercel.app>';

interface ReadingRow {
  id: string;
  email: string;
  body: { birthData: { name: string }; sunSign: string; archetype: { titlePt: string; shadow: { inflated: string } } };
  tier: string;
  paid: boolean;
  created_at: string;
  tags: string[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify cron secret (Vercel sends this header)
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!resendKey || !supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'missing config' });
  }

  const origin = 'https://cartografia-da-alma.vercel.app';
  const now = new Date();
  let sent = 0;

  try {
    // Fetch email-tier readings that aren't paid yet
    const resp = await fetch(
      `${supabaseUrl}/rest/v1/atom_items?tier=eq.email&paid=eq.false&email=not.is.null&select=id,email,body,tier,paid,created_at,tags`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      }
    );

    if (!resp.ok) return res.status(500).json({ error: 'supabase fetch failed' });

    const readings = (await resp.json()) as ReadingRow[];

    for (const reading of readings) {
      const created = new Date(reading.created_at);
      const hoursAge = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
      const tags = reading.tags ?? [];
      const name = reading.body?.birthData?.name?.split(' ')[0] ?? 'Alma';
      const sign = reading.body?.sunSign ?? '';
      const shadow = reading.body?.archetype?.shadow?.inflated?.split('.')[0] ?? '';
      const archetype = reading.body?.archetype?.titlePt ?? '';
      const shareUrl = `${origin}/?token=${reading.id}`;

      let emailNum: number | null = null;
      let subject = '';
      let html = '';

      // Email 2: 24h (between 20-28 hours)
      if (hoursAge >= 20 && hoursAge < 28 && !tags.includes('nurture_2')) {
        emailNum = 2;
        subject = 'o que o oráculo pode revelar';
        html = buildEmail2(name, archetype, shareUrl);
      }
      // Email 3: 72h (between 68-76 hours)
      else if (hoursAge >= 68 && hoursAge < 76 && !tags.includes('nurture_3')) {
        emailNum = 3;
        subject = `${name}, alguém que você conhece`;
        html = buildEmail3(name, shareUrl);
      }
      // Email 4: 7 days (between 164-172 hours)
      else if (hoursAge >= 164 && hoursAge < 172 && !tags.includes('nurture_4')) {
        emailNum = 4;
        subject = 'sua carta mudou';
        html = buildEmail4(name, sign, shareUrl);
      }

      if (emailNum && reading.email) {
        // Send email
        await fetch(RESEND_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendKey}`,
          },
          body: JSON.stringify({ from: FROM, to: reading.email, subject, html }),
        });

        // Tag as sent
        const updatedTags = [...tags, `nurture_${emailNum}`];
        await fetch(`${supabaseUrl}/rest/v1/atom_items?id=eq.${reading.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({ tags: updatedTags }),
        });

        sent++;
      }
    }

    return res.status(200).json({ sent, total: readings.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: msg });
  }
}

// ── Email templates ──

function emailWrapper(content: string): string {
  return `
    <div style="background:#07070f;color:#e8e4da;font-family:Georgia,serif;padding:48px 24px;text-align:center;max-width:500px;margin:0 auto">
      <p style="color:#c9a84c;font-size:10px;letter-spacing:0.4em;text-transform:uppercase;margin:0 0 24px">cartografia da alma</p>
      <div style="width:60px;height:1px;background:rgba(201,168,76,0.3);margin:0 auto 24px"></div>
      ${content}
      <div style="width:60px;height:1px;background:rgba(201,168,76,0.3);margin:32px auto 24px"></div>
      <p style="font-size:11px;color:rgba(232,228,218,0.4);margin:0">
        cada conclusão tem origem rastreável
      </p>
    </div>
  `;
}

function buildEmail2(name: string, archetype: string, shareUrl: string): string {
  return emailWrapper(`
    <p style="font-size:20px;font-weight:300;line-height:1.6;margin:0 0 16px">${name},</p>
    <p style="font-size:16px;font-weight:300;line-height:1.7;color:rgba(232,228,218,0.7);margin:0 0 24px">
      ${archetype} tem perguntas que só você pode fazer.<br>
      O oráculo conhece seu mapa — cada resposta é sobre esta combinação específica, não sobre o signo em geral.
    </p>
    <p style="margin:24px 0"><a href="${shareUrl}" style="color:#c9a84c;text-decoration:underline">fazer sua primeira pergunta →</a></p>
  `);
}

function buildEmail3(name: string, shareUrl: string): string {
  const withUrl = shareUrl.replace('?token=', '?with=');
  return emailWrapper(`
    <p style="font-size:20px;font-weight:300;line-height:1.6;margin:0 0 16px">${name},</p>
    <p style="font-size:16px;font-weight:300;line-height:1.7;color:rgba(232,228,218,0.7);margin:0 0 24px">
      Existe alguém cujo mapa você gostaria de cruzar com o seu?<br>
      Soul Mate revela o que ressoa e o que tensiona — com score e detalhe.
    </p>
    <p style="margin:24px 0"><a href="${withUrl}" style="color:#c9a84c;text-decoration:underline">enviar convite para alguém →</a></p>
  `);
}

function buildEmail4(name: string, sign: string, shareUrl: string): string {
  return emailWrapper(`
    <p style="font-size:20px;font-weight:300;line-height:1.6;margin:0 0 16px">${name},</p>
    <p style="font-size:16px;font-weight:300;line-height:1.7;color:rgba(232,228,218,0.7);margin:0 0 24px">
      Sua carta foi reescrita — mesmo mapa de ${sign}, ângulo diferente.<br>
      Cada vez que você abre, o que aparece é o que precisa ser lido agora.
    </p>
    <p style="margin:24px 0"><a href="${shareUrl}" style="color:#c9a84c;text-decoration:underline">ver o que mudou →</a></p>
  `);
}
