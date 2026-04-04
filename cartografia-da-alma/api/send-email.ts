// ═══════════════════════════════════════
// Cartografia da Alma — Email Sender
// Vercel Function: /api/send-email
// Uses Resend (RESEND_API_KEY env var)
// ═══════════════════════════════════════

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // No Resend key configured — silently succeed (email not sent)
    return res.status(200).json({ sent: false, reason: 'not_configured' });
  }

  const { to, shareUrl, signName, name } = req.body as {
    to: string;
    shareUrl: string;
    signName: string;
    name: string;
  };

  if (!to || !shareUrl) return res.status(400).json({ error: 'Missing fields' });

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Cartografia da Alma <mapa@cartografia.app>',
        to: [to],
        subject: `sua cartografia está pronta, ${name.split(' ')[0]}`,
        html: `
          <div style="background:#07070f;color:#e8e4da;font-family:Georgia,serif;padding:48px 32px;max-width:480px;margin:0 auto;">
            <p style="font-size:11px;letter-spacing:0.3em;color:#C9A84C;text-transform:uppercase;margin-bottom:32px;">
              seis tradições · um mapa
            </p>
            <p style="font-size:22px;font-weight:300;line-height:1.6;margin-bottom:32px;">
              O mapa de ${name} está pronto.<br/>
              ${signName} — o padrão que já operava em você.
            </p>
            <a href="${shareUrl}" style="display:inline-block;border-bottom:1px solid #C9A84C;color:#C9A84C;font-family:sans-serif;font-size:10px;letter-spacing:0.35em;text-transform:uppercase;text-decoration:none;padding-bottom:6px;">
              acessar minha cartografia →
            </a>
            <p style="font-size:9px;color:rgba(232,228,218,0.3);margin-top:48px;letter-spacing:0.2em;text-transform:uppercase;">
              cartografia da alma · não é horóscopo · é cartografia
            </p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Resend error:', err);
      return res.status(200).json({ sent: false, reason: 'resend_error' });
    }

    return res.status(200).json({ sent: true });
  } catch (err) {
    console.error('Email send failed:', err);
    return res.status(200).json({ sent: false, reason: 'network_error' });
  }
}
