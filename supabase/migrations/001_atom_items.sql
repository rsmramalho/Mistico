-- ═══════════════════════════════════════════════════════
-- Cartografia da Alma — Schema Genesis v5.0.1
-- Migration 001: atom_items + share_links
-- ═══════════════════════════════════════════════════════

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── atom_items ──────────────────────────────────────────
-- Genesis v5.0.1 envelope. type 'reading' is an extension
-- justified by D8: the app produces readings, not specs.
-- A reading has its own identity and lifecycle.

CREATE TABLE atom_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type        TEXT NOT NULL DEFAULT 'reading',
  module      TEXT NOT NULL DEFAULT 'cartografia',
  state       TEXT NOT NULL DEFAULT 'structured',
  status      TEXT NOT NULL DEFAULT 'active',
  stage       INTEGER NOT NULL DEFAULT 5,
  tags        TEXT[] NOT NULL DEFAULT ARRAY['#cartografia', '#mystic', '#v6']::TEXT[],
  source      TEXT NOT NULL DEFAULT 'cartografia-app',

  -- Content
  title       TEXT,                    -- e.g. "Cartografia de Maria"
  body        JSONB NOT NULL,          -- SoulMap payload

  -- Ownership (nullable — auth is not required in V2)
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Timestamps
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for user lookups
CREATE INDEX idx_atom_items_user_id ON atom_items(user_id) WHERE user_id IS NOT NULL;
-- Index for type filtering
CREATE INDEX idx_atom_items_type ON atom_items(type);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_atom_items_updated_at
  BEFORE UPDATE ON atom_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── share_links ─────────────────────────────────────────
-- Each reading can have one or more share links.
-- Token is the public-facing identifier (URL-safe string).
-- No auth required to view a shared reading.

CREATE TABLE share_links (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token       TEXT UNIQUE NOT NULL,
  item_id     UUID NOT NULL REFERENCES atom_items(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at  TIMESTAMPTZ            -- NULL = never expires
);

CREATE INDEX idx_share_links_token ON share_links(token);
CREATE INDEX idx_share_links_item_id ON share_links(item_id);

-- ── RLS (Row Level Security) ────────────────────────────
-- Readings are private by default.
-- Public access only through share_links.

ALTER TABLE atom_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;

-- Owner can do everything with their own readings
CREATE POLICY "owner_all" ON atom_items
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Anonymous insert (no auth required to create a reading)
CREATE POLICY "anon_insert" ON atom_items
  FOR INSERT
  WITH CHECK (user_id IS NULL);

-- Anonymous select own reading by id (for session-based access)
CREATE POLICY "anon_select_own" ON atom_items
  FOR SELECT
  USING (user_id IS NULL);

-- Shared readings are readable by anyone with the token
-- (enforced at application level via share_links join)
CREATE POLICY "shared_select" ON atom_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM share_links sl
      WHERE sl.item_id = atom_items.id
        AND (sl.expires_at IS NULL OR sl.expires_at > now())
    )
  );

-- Share links: owner can manage their reading's links
CREATE POLICY "owner_manage_links" ON share_links
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM atom_items ai
      WHERE ai.id = share_links.item_id
        AND ai.user_id = auth.uid()
    )
  );

-- Anyone can read share_links (needed to resolve tokens)
CREATE POLICY "public_read_links" ON share_links
  FOR SELECT
  USING (expires_at IS NULL OR expires_at > now());

-- Anonymous users can create share links for their readings
CREATE POLICY "anon_create_links" ON share_links
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM atom_items ai
      WHERE ai.id = share_links.item_id
        AND ai.user_id IS NULL
    )
  );
