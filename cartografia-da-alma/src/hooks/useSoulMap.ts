import { useState, useCallback, useEffect } from 'react';
import type { BirthData, PalmData, SoulMap, SoulMateReading } from '../types/soul-map';
import { getSoulMap, getPalmSoulMap, getSoulMateReading } from '../engine';
import { saveReading, getReadingByToken, createShareLink } from '../lib/readings';
import { isSupabaseConfigured } from '../lib/supabase';

type AppScreen = 'gateway' | 'entry' | 'palmEntry' | 'loading' | 'revelation' | 'meetLoading' | 'soulMate';

export function useSoulMap() {
  const [screen, setScreen] = useState<AppScreen>('gateway');
  const [soulMap, setSoulMap] = useState<SoulMap | null>(null);
  const [soulMateReading, setSoulMateReading] = useState<SoulMateReading | null>(null);
  const [readingId, setReadingId] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  // ── Resolve ?token=xxx or ?meet=tokenA,tokenB on mount ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Soul Mate via URL
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
        return; // don't process single token
      }
    }

    const token = params.get('token');
    if (!token) return;

    setScreen('loading');
    getReadingByToken(token).then((row) => {
      if (row) {
        setSoulMap(row.body);
        setReadingId(row.id);
        setScreen('revelation');
      } else {
        setScreen('gateway');
      }
    }).catch(() => {
      setScreen('gateway');
    });
  }, []);

  // ── Persist reading to Supabase ──
  const persistReading = useCallback(async (map: SoulMap) => {
    if (!isSupabaseConfigured) return;
    try {
      const row = await saveReading(map);
      if (row) setReadingId(row.id);
    } catch {
      // Supabase save failed — app still works client-side
    }
  }, []);

  const generate = useCallback((birthData: BirthData) => {
    setShareUrl(null);
    setReadingId(null);
    const map = getSoulMap(birthData);
    setSoulMap(map);
    setScreen('loading');
    persistReading(map);
    setTimeout(() => setScreen('revelation'), 7000);
  }, [persistReading]);

  const generateFromPalm = useCallback((palmData: PalmData) => {
    setShareUrl(null);
    setReadingId(null);
    const map = getPalmSoulMap(palmData);
    setSoulMap(map);
    setScreen('loading');
    persistReading(map);
    setTimeout(() => setScreen('revelation'), 7000);
  }, [persistReading]);

  // ── Share ──
  const share = useCallback(async () => {
    if (!readingId || isSharing) return null;
    setIsSharing(true);
    try {
      const link = await createShareLink(readingId);
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
  }, [readingId, isSharing]);

  // ── Meet another soul ──
  const meetAnotherSoul = useCallback(async (otherToken: string) => {
    if (!soulMap) return;
    setScreen('meetLoading');
    try {
      const otherRow = await getReadingByToken(otherToken);
      if (!otherRow) {
        setScreen('revelation'); // go back if token invalid
        return;
      }
      const mateReading = getSoulMateReading(soulMap, otherRow.body);
      setSoulMateReading(mateReading);
      setScreen('soulMate');
    } catch {
      setScreen('revelation');
    }
  }, [soulMap]);

  const goToEntry = useCallback(() => setScreen('entry'), []);
  const goToPalmEntry = useCallback(() => setScreen('palmEntry'), []);

  const reset = useCallback(() => {
    setSoulMap(null);
    setSoulMateReading(null);
    setReadingId(null);
    setShareUrl(null);
    // Clean token from URL
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    setScreen('gateway');
  }, []);

  return {
    screen, soulMap, soulMateReading, readingId, shareUrl, isSharing,
    generate, generateFromPalm, share, meetAnotherSoul,
    goToEntry, goToPalmEntry, reset,
    canShare: isSupabaseConfigured && !!readingId,
  };
}
