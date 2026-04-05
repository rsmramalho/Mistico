// ═══════════════════════════════════════
// Cartografia da Alma — Stripe Checkout
// POST { readingId, product, locale }
// → Creates Stripe Checkout Session
// → Returns { url }
// For international payments (non-BR uses Stripe, BR uses Kiwify)
// ═══════════════════════════════════════

import type { VercelRequest, VercelResponse } from '@vercel/node';

const PRODUCTS: Record<string, { name: string; priceUsd: number; priceBrl: number }> = {
  oracle: { name: 'Oráculo Completo', priceUsd: 399, priceBrl: 1900 },      // cents
  soulmate: { name: 'Soul Mate', priceUsd: 599, priceBrl: 2900 },
  lifetime: { name: 'Vitalício', priceUsd: 1999, priceBrl: 9700 },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return res.status(500).json({ error: 'Stripe not configured' });

  const { readingId, product = 'oracle', locale = 'pt-BR' } = req.body as {
    readingId?: string;
    product?: string;
    locale?: string;
  };

  const productInfo = PRODUCTS[product];
  if (!productInfo) return res.status(400).json({ error: 'invalid product' });

  const isBrl = locale.startsWith('pt');
  const currency = isBrl ? 'brl' : 'usd';
  const amount = isBrl ? productInfo.priceBrl : productInfo.priceUsd;

  const origin = req.headers.origin ?? 'https://cartografia-da-alma.vercel.app';

  try {
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'payment',
        'line_items[0][price_data][currency]': currency,
        'line_items[0][price_data][product_data][name]': productInfo.name,
        'line_items[0][price_data][unit_amount]': String(amount),
        'line_items[0][quantity]': '1',
        'success_url': `${origin}/?token=${readingId ?? ''}&paid=1`,
        'cancel_url': `${origin}/?token=${readingId ?? ''}`,
        ...(readingId ? { 'client_reference_id': readingId } : {}),
        'metadata[product]': product,
        'metadata[readingId]': readingId ?? '',
      }),
    });

    const session = await response.json() as { url?: string; error?: unknown };
    if (!response.ok) return res.status(response.status).json({ error: session.error });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: msg });
  }
}
