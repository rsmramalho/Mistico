// ═══════════════════════════════════════
// Cartografia da Alma — OG Image Generator
// GET /api/og-image?token=XYZ
// Returns SVG image for social sharing
// No external dependencies — pure SVG
// ═══════════════════════════════════════

import type { VercelRequest, VercelResponse } from '@vercel/node';

const SIGN_PT: Record<string, string> = {
  Aries: 'Áries', Taurus: 'Touro', Gemini: 'Gêmeos', Cancer: 'Câncer',
  Leo: 'Leão', Virgo: 'Virgem', Libra: 'Libra', Scorpio: 'Escorpião',
  Sagittarius: 'Sagitário', Capricorn: 'Capricórnio', Aquarius: 'Aquário', Pisces: 'Peixes',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = req.query.token as string | undefined;
  const meetTokens = req.query.meet as string | undefined;

  let name = 'Alma';
  let sign = '';
  let subtitle = 'Seis tradições. Um mapa.';

  // Try to fetch reading data from Supabase
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (token && supabaseUrl && supabaseKey) {
    try {
      const resp = await fetch(
        `${supabaseUrl}/rest/v1/atom_items?id=eq.${token}&select=body`,
        { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
      );
      const rows = await resp.json() as Array<{ body: { birthData: { name: string }; sunSign: string; archetype: { titlePt: string } } }>;
      if (rows[0]) {
        name = rows[0].body.birthData.name.split(' ')[0];
        sign = SIGN_PT[rows[0].body.sunSign] ?? rows[0].body.sunSign;
        subtitle = `${sign} · ${rows[0].body.archetype.titlePt}`;
      }
    } catch { /* fallback to defaults */ }
  }

  if (meetTokens) {
    subtitle = 'O espaço entre duas almas';
  }

  const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#07070f"/>
  <rect x="0" y="0" width="1200" height="630" fill="url(#glow)" opacity="0.4"/>
  <defs>
    <radialGradient id="glow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#c9a84c" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#07070f" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <!-- Gold line -->
  <rect x="500" y="180" width="200" height="1" fill="#c9a84c" opacity="0.4"/>
  <!-- Title -->
  <text x="600" y="260" text-anchor="middle" fill="#c9a84c" font-family="Georgia,serif" font-size="16" letter-spacing="6" opacity="0.8">
    CARTOGRAFIA DA ALMA
  </text>
  <!-- Name -->
  <text x="600" y="340" text-anchor="middle" fill="#e8e4da" font-family="Georgia,serif" font-size="64" font-weight="300" opacity="0.92">
    ${escapeXml(name)}
  </text>
  <!-- Subtitle -->
  <text x="600" y="400" text-anchor="middle" fill="#c9a84c" font-family="sans-serif" font-size="18" letter-spacing="4" opacity="0.7">
    ${escapeXml(subtitle.toUpperCase())}
  </text>
  <!-- Bottom line -->
  <rect x="500" y="450" width="200" height="1" fill="#c9a84c" opacity="0.4"/>
  <!-- Footer -->
  <text x="600" y="530" text-anchor="middle" fill="#e8e4da" font-family="Georgia,serif" font-size="14" font-style="italic" opacity="0.4">
    o padrão que já opera em você, com ou sem nome
  </text>
</svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, s-maxage=3600');
  return res.status(200).send(svg);
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
