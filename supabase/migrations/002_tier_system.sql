-- ═══════════════════════════════════════════════════════
-- Cartografia da Alma — Migration 002
-- Tier system + email captures
-- ═══════════════════════════════════════════════════════

-- Add tier fields to atom_items
ALTER TABLE atom_items
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS paid BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'session';
-- tier: 'session' | 'email' | 'oracle'

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_atom_items_email ON atom_items(email) WHERE email IS NOT NULL;

-- Email captures table
CREATE TABLE IF NOT EXISTS email_captures (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL,
  reading_id UUID REFERENCES atom_items(id) ON DELETE CASCADE,
  source     TEXT DEFAULT 'revelation',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_captures_email ON email_captures(email);
CREATE INDEX IF NOT EXISTS idx_email_captures_reading_id ON email_captures(reading_id);

-- RLS for email_captures
ALTER TABLE email_captures ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (anonymous capture)
CREATE POLICY "anon_insert_capture" ON email_captures
  FOR INSERT WITH CHECK (true);

-- Grant to anon role
GRANT INSERT ON email_captures TO anon;
GRANT UPDATE(email, paid, tier) ON atom_items TO anon;
