// ═══════════════════════════════════════
// Cartografia da Alma — Database Types
// Genesis v5.0.1 · type: reading
// ═══════════════════════════════════════

import type { SoulMap } from './soul-map';

export type ReadingTier = 'session' | 'email' | 'oracle';

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
  email: string | null;
  paid: boolean;
  tier: ReadingTier;
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

// ── email_captures row ──

export interface EmailCaptureRow {
  id: string;
  email: string;
  reading_id: string | null;
  source: string;
  created_at: string;
}
