// ═══════════════════════════════════════
// Cartografia da Alma — Stripe Webhook
// Handles checkout.session.completed
// → Updates tier in Supabase
// ═══════════════════════════════════════

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  // In production, verify Stripe signature here
  // For now, trust the payload (add STRIPE_WEBHOOK_SECRET later)

  const event = req.body as {
    type: string;
    data: {
      object: {
        client_reference_id?: string;
        metadata?: { product?: string; readingId?: string };
        payment_status?: string;
      };
    };
  };

  if (event.type !== 'checkout.session.completed') {
    return res.status(200).json({ received: true });
  }

  const session = event.data.object;
  if (session.payment_status !== 'paid') {
    return res.status(200).json({ received: true });
  }

  const readingId = session.client_reference_id || session.metadata?.readingId;
  const product = session.metadata?.product ?? 'oracle';

  if (!readingId) return res.status(200).json({ received: true, note: 'no readingId' });

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    const tier = product === 'lifetime' ? 'oracle' : 'oracle'; // all paid = oracle tier
    try {
      await fetch(`${supabaseUrl}/rest/v1/atom_items?id=eq.${readingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ paid: true, tier }),
      });
    } catch {
      // Log but don't fail
    }
  }

  return res.status(200).json({ received: true, readingId, product });
}
