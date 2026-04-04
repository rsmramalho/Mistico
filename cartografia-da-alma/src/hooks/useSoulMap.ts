import { useState, useCallback, useEffect } from 'react';
import type { BirthData, PalmData, SoulMap, SoulMateReading } from '../types/soul-map';
import type { ReadingTier } from '../types/database';
import { getSoulMap, getPalmSoulMap, getSoulMateReading } from '../engine';
import { saveReading, getReadingByToken, createShareLink, captureEmail } from '../lib/readings';
import { isSupabaseConfigured } from '../lib/supabase';

type AppScreen = 'landing' | 'gateway' | 'entry' | 'palmEntry' | 'loading' | 'revelation' | 'meetLoading' | 'soulMate';

export function useSoulMap() {
  const [screen, setScreen] = useState<AppScreen>('landing');
  const [soulMap, setSoulMap] = useState<SoulMap | null>(null);
  const [soulMateReading, setSoulMateReading] = useState<SoulMateReading | null>(null);
  const [readingId, setReadingId] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tier, setTier] = useState<ReadingTier>('session');
  const [emailCaptured, setEmailCaptured] = useState(false);

  // ── Resolve ?token=xxx or ?meet=tokenA,tokenB on mount ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const meetTokens = params.get('meet');
    if (meetTokens) {
      const [tokenA, tokenB] = meetTokens.split(',');
      if (tokenA && tokenB) {
        setScreen('loading');
        Promise.all([getReadingByToken(tokenA), getReadingByToken(tokenB)]).then(([rowA, rowB]) => {
          if (rowA && rowB) {
            const mateReading = getSoulMateReading(rowA.body, rowB.body);
            setSoulMateReading(mateReading);
            setScreen('soulMate');
          } else {
            setScreen('gateway');
          }
        }).catch(() => setScreen('gateway'));
        return;
      }
    }

    const token = params.get('token');
    if (!token) return;

    setScreen('loading');
    getReadingByToken(token).then((row) => {
      if (row) {
        setSoulMap(row.body);
        setReadingId(row.id);
        setTier(row.tier ?? 'email'); // shared links are at least email tier
        setScreen('revelation');
      } else {
        setScreen('gateway');
      }
    }).catch(() => setScreen('gateway'));
  }, []);

  // ── Persist reading to Supabase ──
  const persistReading = useCallback(async (map: SoulMap): Promise<string | null> => {
    if (!isSupabaseConfigured) return null;
    setIsSaving(true);
    try {
      const row = await saveReading(map);
      if (row) {
        setReadingId(row.id);
        return row.id;
      }
      return null;
    } catch {
      return null;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const generate = useCallback((birthData: BirthData) => {
    setShareUrl(null);
    setReadingId(null);
    setTier('session');
    setEmailCaptured(false);
    const map = getSoulMap(birthData);
    setSoulMap(map);
    setScreen('loading');
    persistReading(map);
    setTimeout(() => setScreen('revelation'), 7000);
  }, [persistReading]);

  const generateFromPalm = useCallback((palmData: PalmData) => {
    setShareUrl(null);
    setReadingId(null);
    setTier('session');
    setEmailCaptured(false);
    const map = getPalmSoulMap(palmData);
    setSoulMap(map);
    setScreen('loading');
    persistReading(map);
    setTimeout(() => setScreen('revelation'), 7000);
  }, [persistReading]);

  // ── Capture email + upgrade to email tier ──
  const submitEmail = useCallback(async (email: string): Promise<boolean> => {
    if (emailCaptured) return true;
    setEmailCaptured(true);

    // Upgrade tier locally immediately (optimistic)
    setTier('email');

    // Persist to Supabase if we have a readingId
    if (readingId) {
      await captureEmail(readingId, email);
    }

    // Send email with share link (fire and forget)
    if (soulMap) {
      const shareLink = shareUrl ?? `${window.location.origin}${window.location.pathname}${readingId ? `?token=${readingId}` : ''}`;
      const signName = soulMap.sunSign;
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          shareUrl: shareLink,
          signName,
          name: soulMap.birthData.name,
        }),
      }).catch(() => { /* silent */ });
    }

    return true;
  }, [emailCaptured, readingId, shareUrl, soulMap]);

  // ── Share ──
  const share = useCallback(async () => {
    if (isSharing || isSaving) return null;
    setIsSharing(true);
    try {
      let id = readingId;
      if (!id && soulMap && isSupabaseConfigured) {
        id = await persistReading(soulMap);
      }
      if (!id) return null;
      const link = await createShareLink(id);
      if (link) {
        const url = `${window.location.origin}${window.location.pathname}?token=${link.token}`;
        setShareUrl(url);
        return url;
      }
      return null;
    } catch {
      return null;
    } finally {
      setIsSharing(false);
    }
  }, [readingId, isSharing, isSaving, soulMap, persistReading]);

  // ── Meet another soul ──
  const meetAnotherSoul = useCallback(async (otherToken: string) => {
    if (!soulMap) return;
    setScreen('meetLoading');
    try {
      const otherRow = await getReadingByToken(otherToken);
      if (!otherRow) { setScreen('revelation'); return; }
      const mateReading = getSoulMateReading(soulMap, otherRow.body);
      setSoulMateReading(mateReading);
      setScreen('soulMate');
    } catch {
      setScreen('revelation');
    }
  }, [soulMap]);

  const goToLanding = useCallback(() => setScreen('landing'), []);
  const goToGateway = useCallback(() => setScreen('gateway'), []);
  const goToEntry = useCallback(() => setScreen('entry'), []);
  const goToPalmEntry = useCallback(() => setScreen('palmEntry'), []);

  const reset = useCallback(() => {
    setSoulMap(null);
    setSoulMateReading(null);
    setReadingId(null);
    setShareUrl(null);
    setTier('session');
    setEmailCaptured(false);
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    setScreen('landing');
  }, []);

  return {
    screen, soulMap, soulMateReading, readingId, shareUrl, isSharing, isSaving,
    tier, emailCaptured,
    generate, generateFromPalm, share, submitEmail, meetAnotherSoul,
    goToLanding, goToGateway, goToEntry, goToPalmEntry, reset,
    canShare: isSupabaseConfigured,
  };
}
