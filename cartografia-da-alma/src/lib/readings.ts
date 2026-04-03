// ═══════════════════════════════════════
// Cartografia da Alma — Data Layer
// Save/load readings, share links
// All operations are no-ops when Supabase is not configured
// ═══════════════════════════════════════

import { supabase } from './supabase';
import type { SoulMap } from '../types/soul-map';
import type { AtomItemRow, ShareLinkRow } from '../types/database';

// ── Token generation ──

function generateToken(length = 12): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => chars[b % chars.length]).join('');
}

// ── Save reading ──

export async function saveReading(
  soulMap: SoulMap,
  userId?: string,
): Promise<AtomItemRow | null> {
  if (!supabase) return null;

  const title = `Cartografia de ${soulMap.birthData.name}`;

  const { data, error } = await supabase
    .from('atom_items')
    .insert({
      body: soulMap as unknown as Record<string, unknown>,
      title,
      user_id: userId ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to save reading: ${error.message}`);
  return data as AtomItemRow;
}

// ── Load reading by ID ──

export async function getReading(id: string): Promise<AtomItemRow | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('atom_items')
    .select()
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to load reading: ${error.message}`);
  }
  return data as AtomItemRow;
}

// ── Load reading by share token ──

export async function getReadingByToken(token: string): Promise<AtomItemRow | null> {
  if (!supabase) return null;

  const { data: link, error: linkError } = await supabase
    .from('share_links')
    .select('item_id')
    .eq('token', token)
    .single();

  if (linkError) {
    if (linkError.code === 'PGRST116') return null;
    throw new Error(`Failed to resolve share token: ${linkError.message}`);
  }

  return getReading((link as { item_id: string }).item_id);
}

// ── List user readings ──

export async function listReadings(userId: string): Promise<AtomItemRow[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('atom_items')
    .select()
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to list readings: ${error.message}`);
  return (data ?? []) as AtomItemRow[];
}

// ── Create share link ──

export async function createShareLink(itemId: string): Promise<ShareLinkRow | null> {
  if (!supabase) return null;

  const token = generateToken();

  const { data, error } = await supabase
    .from('share_links')
    .insert({ item_id: itemId, token })
    .select()
    .single();

  if (error) throw new Error(`Failed to create share link: ${error.message}`);
  return data as ShareLinkRow;
}

// ── Get share link for a reading ──

export async function getShareLink(itemId: string): Promise<ShareLinkRow | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('share_links')
    .select()
    .eq('item_id', itemId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to get share link: ${error.message}`);
  }
  return data as ShareLinkRow;
}

// ── Revoke share link ──

export async function revokeShareLink(linkId: string): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase
    .from('share_links')
    .delete()
    .eq('id', linkId);

  if (error) throw new Error(`Failed to revoke share link: ${error.message}`);
}
