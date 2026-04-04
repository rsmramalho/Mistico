// ═══════════════════════════════════════
// Cartografia da Alma — Tier Check
// Vercel Function: /api/check-tier
// Polled by frontend after payment redirect
// ═══════════════════════════════════════

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const { readingId } = req.query;
  if (!readingId || typeof readingId !== 'string') {
    return res.status(400).json({ error: 'readingId required' });
  }

  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return res.status(500).end();

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('atom_items')
    .select('tier, paid')
    .eq('id', readingId)
    .single();

  if (error || !data) return res.status(404).json({ tier: 'session' });

  return res.status(200).json({ tier: data.tier, paid: data.paid });
}
