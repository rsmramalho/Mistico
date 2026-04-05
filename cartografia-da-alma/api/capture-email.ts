// ═══════════════════════════════════════
// Cartografia da Alma — Email Capture
// POST { readingId, email }
// → Updates tier to 'email'
// → Sends welcome email via Resend
// → Returns { tier: 'email' }
// ═══════════════════════════════════════

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { readingId, email, name, signName } = req.body as {
    readingId?: string;
    email: string;
    name?: string;
    signName?: string;
  };

  if (!email) return res.status(400).json({ error: 'email required' });

  // 1. Update tier in Supabase (if readingId provided)
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (readingId && supabaseUrl && supabaseKey) {
    try {
      await fetch(`${supabaseUrl}/rest/v1/atom_items?id=eq.${readingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ email, tier: 'email' }),
      });
    } catch {
      // Non-blocking — continue even if Supabase fails
    }
  }

  // 2. Send welcome email via Resend
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const shareUrl = readingId
      ? `${req.headers.origin ?? 'https://cartografia-da-alma.vercel.app'}/?token=${readingId}`
      : '';

    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: 'Cartografia da Alma <mapa@cartografia-da-alma.vercel.app>',
          to: email,
          subject: 'sua cartografia está pronta',
          html: buildWelcomeEmail(name ?? 'Alma', signName ?? '', shareUrl),
        }),
      });
    } catch {
      // Non-blocking
    }
  }

  return res.status(200).json({ tier: 'email' });
}

function buildWelcomeEmail(name: string, sign: string, shareUrl: string): string {
  const signLine = sign ? `<p style="color:#c9a84c;font-size:12px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 24px">${sign}</p>` : '';
  const linkLine = shareUrl ? `<p style="margin:24px 0"><a href="${shareUrl}" style="color:#c9a84c;text-decoration:underline">abrir meu mapa →</a></p>` : '';

  return `
    <div style="background:#07070f;color:#e8e4da;font-family:Georgia,serif;padding:48px 24px;text-align:center;max-width:500px;margin:0 auto">
      <p style="color:#c9a84c;font-size:10px;letter-spacing:0.4em;text-transform:uppercase;margin:0 0 24px">cartografia da alma</p>
      <div style="width:60px;height:1px;background:rgba(201,168,76,0.3);margin:0 auto 24px"></div>
      ${signLine}
      <p style="font-size:20px;font-weight:300;line-height:1.6;margin:0 0 16px">${name},</p>
      <p style="font-size:16px;font-weight:300;line-height:1.7;color:rgba(232,228,218,0.7);margin:0 0 24px">
        Seu mapa está pronto. As cartas esperam por você — cada uma revela um padrão que já opera, com ou sem nome.
      </p>
      ${linkLine}
      <div style="width:60px;height:1px;background:rgba(201,168,76,0.3);margin:32px auto 24px"></div>
      <p style="font-size:11px;color:rgba(232,228,218,0.4);margin:0">
        cada conclusão tem origem rastreável · não é misticismo vazio
      </p>
    </div>
  `;
}
