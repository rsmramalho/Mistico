// ═══════════════════════════════════════
// Cartografia da Alma — Kiwify Webhook
// Vercel Function: /api/webhook-kiwify
// Called by Kiwify after confirmed payment
// ═══════════════════════════════════════

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase not configured in webhook');
    return res.status(500).json({ error: 'DB not configured' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const body = req.body as Record<string, unknown>;

    // Kiwify sends payment status in different fields depending on event type
    // status: 'paid' | 'refunded' | 'chargedback' | 'waiting_payment'
    const status = (body.order_status ?? body.status) as string;
    if (status !== 'paid') {
      return res.status(200).json({ ignored: true, status });
    }

    // reading_id is passed as custom field when building the Kiwify URL
    // Format: https://pay.kiwify.com.br/PRODUCT_ID?custom_field_1=READING_ID
    const readingId = (body.custom_field_1 ?? body.tracking_source) as string | undefined;

    if (!readingId) {
      console.warn('Kiwify webhook: no reading_id in payload', body);
      return res.status(200).json({ warning: 'no reading_id' });
    }

    // Upgrade tier to oracle
    const { error } = await supabase
      .from('atom_items')
      .update({ paid: true, tier: 'oracle' })
      .eq('id', readingId);

    if (error) {
      console.error('Failed to upgrade tier:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log(`Reading ${readingId} upgraded to oracle tier`);
    return res.status(200).json({ success: true, readingId });

  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
