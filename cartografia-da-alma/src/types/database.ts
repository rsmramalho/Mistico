// ═══════════════════════════════════════
// Cartografia da Alma — Database Types
// Genesis v5.0.1 · type: reading
// ═══════════════════════════════════════

import type { SoulMap } from './soul-map';

// ── atom_items row ──

export interface AtomItemRow {
  id: string;
  type: 'reading';
  module: string;
  state: string;
  status: string;
  stage: number;
  tags: string[];
  source: string;
  title: string | null;
  body: SoulMap;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

// ── share_links row ──

export interface ShareLinkRow {
  id: string;
  token: string;
  item_id: string;
  created_at: string;
  expires_at: string | null;
}
