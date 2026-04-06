import { useState, useCallback, useEffect } from 'react';
import type { BirthData, PalmData, SoulMap, SoulMateReading } from '../types/soul-map';
import type { ReadingTier } from '../types/database';
import { getSoulMap, getPalmSoulMap, getSoulMateReading } from '../engine';
import { saveReading, getReading, getReadingByToken, createShareLink, captureEmail } from '../lib/readings';
import { isSupabaseConfigured } from '../lib/supabase';

export type AppScreen =
  | 'landing' | 'gateway' | 'entry' | 'palmEntry'
  | 'loading' | 'journey' | 'mapaFinal' | 'revelation' | 'viewer'
  | 'meetLoading' | 'soulMate' | 'notFound' | 'about';

export function useSoulMap() {
  const [screen, setScreen]                     = useState<AppScreen>('landing');
  const [soulMap, setSoulMap]                   = useState<SoulMap | null>(null);
  const [viewerMap, setViewerMap]               = useState<SoulMap | null>(null);   // map being viewed (not owned)
  const [viewerReadingId, setViewerReadingId]   = useState<string | null>(null);
  const [soulMateReading, setSoulMateReading]   = useState<SoulMateReading | null>(null);
  const [soulMateShareUrl, setSoulMateShareUrl] = useState<string | null>(null);
  const [readingId, setReadingId]               = useState<string | null>(null);
  const [shareUrl, setShareUrl]                 = useState<string | null>(null);
  const [isSharing, setIsSharing]               = useState(false);
  const [isSaving, setIsSaving]                 = useState(false);
  const [tier, setTier]                         = useState<ReadingTier>('session');
  const [emailCaptured, setEmailCaptured]       = useState(false);
  const [invitedByToken, setInvitedByToken]     = useState<string | null>(null); // ?with= param

  // ── Resolve URL params on mount ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // ?test=mapa — skip to MapaInterativo with mock data (persisted)
    if (params.get('test') === 'mapa') {
      const testMap = getSoulMap({
        name: 'Ana Beatriz Moreira',
        date: new Date(1994, 6, 15), // 15 Jul 1994 → Cancer (water)
      });
      setSoulMap(testMap);
      window.history.replaceState({}, '', window.location.pathname);
      setScreen('mapaFinal');
      persistReading(testMap);
      return;
    }

    // ?test=almas — skip to SoulMateRevelation with two mock maps
    if (params.get('test') === 'almas') {
      try {
        const mapA = getSoulMap({ name: 'Ana Beatriz', date: new Date(1994, 6, 15) });
        const mapB = getSoulMap({ name: 'Lucas Andrade', date: new Date(1991, 2, 22) });
        const reading = getSoulMateReading(mapA, mapB);
        setSoulMap(mapA);
        setSoulMateReading(reading);
        setScreen('soulMate');
        console.log('[test=almas] soul mate computed ok, screen → soulMate');
      } catch (e) {
        console.error('[test=almas] failed:', e);
      }
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    // ?meet=tokenA,tokenB — Soul Mate result
    const meetTokens = params.get('meet');
    if (meetTokens) {
      const [tokenA, tokenB] = meetTokens.split(',');
      if (tokenA && tokenB) {
        setScreen('loading');
        Promise.all([getReadingByToken(tokenA), getReadingByToken(tokenB)])
          .then(([rowA, rowB]) => {
            if (rowA && rowB) {
              setSoulMateReading(getSoulMateReading(rowA.body, rowB.body));
              setSoulMateShareUrl(window.location.href);
              setScreen('soulMate');
            } else {
              setScreen('gateway');
            }
          })
          .catch(() => setScreen('gateway'));
        return;
      }
    }

    // ?with=TOKEN — invited to Soul Mate (go to Entry, auto-compute after generate)
    const withToken = params.get('with');
    if (withToken) {
      setInvitedByToken(withToken);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
      setScreen('entry');
      return;
    }

    // ?token=TOKEN — view someone's map
    const token = params.get('token');
    if (!token) return;

    setScreen('loading');
    getReadingByToken(token)
      .then((row) => {
        if (row) {
          setViewerMap(row.body);
          setViewerReadingId(row.id);
          setScreen('viewer');
        } else {
          setScreen('notFound');
        }
      })
      .catch(() => setScreen('notFound'));
  }, []);

  // ── Persist reading ──
  const persistReading = useCallback(async (map: SoulMap): Promise<string | null> => {
    if (!isSupabaseConfigured) return null;
    setIsSaving(true);
    try {
      const row = await saveReading(map);
      if (row) { setReadingId(row.id); return row.id; }
      return null;
    } catch {
      return null;
    } finally {
      setIsSaving(false);
    }
  }, []);

  // ── Generate from birth data ──
  const generate = useCallback((birthData: BirthData) => {
    setShareUrl(null);
    setReadingId(null);
    setTier('session');
    setEmailCaptured(false);
    const map = getSoulMap(birthData);
    setSoulMap(map);
    setScreen('loading');

    persistReading(map).then(async (id) => {
      // If invited to Soul Mate, auto-compute after saving
      if (invitedByToken) {
        try {
          // Try as share token first, then as reading ID (meetFromViewer passes ID)
          const otherRow = await getReadingByToken(invitedByToken) ?? await getReading(invitedByToken);
          if (otherRow && id) {
            const mateReading = getSoulMateReading(map, otherRow.body);
            setSoulMateReading(mateReading);
            // Build meet URL for sharing
            const meetUrl = `${window.location.origin}${window.location.pathname}?meet=${otherRow.id},${id}`;
            setSoulMateShareUrl(meetUrl);
            setInvitedByToken(null);
            setTimeout(() => setScreen('soulMate'), 7000);
            return;
          }
        } catch { /* fallback to normal revelation */ }
        setInvitedByToken(null);
      }
      setTimeout(() => setScreen('journey'), 7000);
    });
  }, [persistReading, invitedByToken]);

  const generateFromPalm = useCallback((palmData: PalmData) => {
    setShareUrl(null);
    setReadingId(null);
    setTier('session');
    setEmailCaptured(false);
    const map = getPalmSoulMap(palmData);
    setSoulMap(map);
    setScreen('loading');
    persistReading(map);
    setTimeout(() => setScreen('journey'), 7000);
  }, [persistReading]);

  // ── Email capture ──
  const submitEmail = useCallback(async (email: string): Promise<boolean> => {
    if (emailCaptured) return true;
    setEmailCaptured(true);
    setTier('email');

    // Call capture-email API (handles Supabase update + Resend email)
    fetch('/api/capture-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        readingId,
        email,
        name: soulMap?.birthData.name,
        signName: soulMap?.sunSign,
      }),
    }).catch(() => {});

    // Also update local Supabase if available
    if (readingId) await captureEmail(readingId, email);

    return true;
  }, [emailCaptured, readingId, soulMap]);

  // ── Share my map ──
  const [shareError, setShareError] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const share = useCallback(async () => {
    if (isSharing || isSaving) return null;
    setIsSharing(true);
    setShareError(false);
    try {
      let id = readingId;
      if (!id && soulMap && isSupabaseConfigured) id = await persistReading(soulMap);
      if (!id) { setShareError(true); return null; }
      const link = await createShareLink(id);
      if (link) {
        const url = `${window.location.origin}${window.location.pathname}?token=${link.token}`;
        setShareUrl(url);
        navigator.clipboard.writeText(url).then(() => {
          setShareCopied(true);
          setTimeout(() => setShareCopied(false), 2500);
        }).catch(() => {});
        return url;
      }
      setShareError(true);
      return null;
    } catch { setShareError(true); return null; }
    finally { setIsSharing(false); }
  }, [readingId, isSharing, isSaving, soulMap, persistReading]);

  // ── Meet from viewer (viewer clicks "encontrar o espaço entre nós") ──
  const meetFromViewer = useCallback(() => {
    if (!viewerReadingId) return;
    // Send user to Entry with ?with=viewerReadingId in state
    setInvitedByToken(viewerReadingId);
    setViewerMap(null);
    setViewerReadingId(null);
    setScreen('entry');
  }, [viewerReadingId]);

  // ── Meet from Revelation footer (manual token entry) ──
  // Does NOT change screen during lookup — component stays mounted to show errors
  const meetAnotherSoul = useCallback(async (otherToken: string): Promise<string | null> => {
    if (!soulMap) return 'mapa não encontrado';
    if (!isSupabaseConfigured) return 'banco de dados não configurado — compartilhe os mapas primeiro';
    try {
      const otherRow = await getReadingByToken(otherToken) ?? await getReading(otherToken);
      if (!otherRow) return 'token inválido ou mapa não encontrado';
      const mateReading = getSoulMateReading(soulMap, otherRow.body);
      setSoulMateReading(mateReading);
      if (readingId) {
        const meetUrl = `${window.location.origin}${window.location.pathname}?meet=${otherRow.id},${readingId}`;
        setSoulMateShareUrl(meetUrl);
      }
      setScreen('soulMate');
      return null;
    } catch { return 'erro ao buscar o mapa'; }
  }, [soulMap, readingId]);

  // ── Save oracle answer to SoulMap + Supabase ──
  const saveOracleAnswer = useCallback(async (cardId: string, question: string, answer: string) => {
    if (!soulMap) return;
    const updated = {
      ...soulMap,
      oracleAnswers: {
        ...soulMap.oracleAnswers,
        [cardId]: { question, answer },
      },
    };
    setSoulMap(updated);
    // Re-save to Supabase if we have a readingId
    if (readingId && isSupabaseConfigured) {
      try {
        const { supabase } = await import('../lib/supabase');
        if (supabase) {
          await supabase.from('atom_items').update({ body: updated as any }).eq('id', readingId);
        }
      } catch { /* silent fail */ }
    }
  }, [soulMap, readingId]);

  const goToLanding   = useCallback(() => setScreen('landing'), []);
  const goToGateway   = useCallback(() => setScreen('gateway'), []);
  const goToEntry     = useCallback(() => setScreen('entry'), []);
  const goToPalmEntry = useCallback(() => setScreen('palmEntry'), []);
  const goToMapaFinal = useCallback(() => setScreen('mapaFinal'), []);
  const goToAbout     = useCallback(() => setScreen('about'), []);

  const reset = useCallback(() => {
    setSoulMap(null);
    setViewerMap(null);
    setViewerReadingId(null);
    setSoulMateReading(null);
    setSoulMateShareUrl(null);
    setReadingId(null);
    setShareUrl(null);
    setTier('session');
    setEmailCaptured(false);
    setInvitedByToken(null);
    if (window.location.search) window.history.replaceState({}, '', window.location.pathname);
    setScreen('landing');
  }, []);

  return {
    screen, soulMap, viewerMap, viewerReadingId,
    soulMateReading, soulMateShareUrl,
    readingId, shareUrl, isSharing, isSaving,
    shareError, shareCopied,
    tier, emailCaptured, invitedByToken,
    generate, generateFromPalm, share, submitEmail,
    meetAnotherSoul, meetFromViewer, saveOracleAnswer,
    goToLanding, goToGateway, goToEntry, goToPalmEntry, goToMapaFinal, goToAbout, reset,
    canShare: isSupabaseConfigured,
  };
}
