// ═══════════════════════════════════════
// DEBUG ONLY — remove after fixing
// GET /api/debug
// ═══════════════════════════════════════

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const key = process.env.ANTHROPIC_API_KEY;
  return res.status(200).json({
    has_key: !!key,
    key_prefix: key ? key.slice(0, 8) + '...' : null,
    node_version: process.version,
  });
}
