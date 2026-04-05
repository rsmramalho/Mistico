import { useEffect, useCallback } from 'react';

// ═══════════════════════════════════════
// Tracking Hook — Plausible custom events
// Tracks: page views, scroll depth, card views, conversions
// Zero external deps — uses Plausible's built-in event API
// ═══════════════════════════════════════

// Plausible event helper
function track(event: string, props?: Record<string, string | number>) {
  try {
    const w = window as unknown as { plausible?: (event: string, opts?: { props: Record<string, string | number> }) => void };
    if (w.plausible) {
      w.plausible(event, props ? { props } : undefined);
    }
  } catch {
    // silent — analytics should never break the app
  }
}

export function useTracking() {
  // Track scroll depth on the current page
  useEffect(() => {
    let maxDepth = 0;
    const handleScroll = () => {
      const depth = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      if (depth > maxDepth) maxDepth = depth;
    };

    // Report max scroll depth when leaving the page
    const handleBeforeUnload = () => {
      if (maxDepth > 0) {
        track('scroll_depth', { depth: maxDepth });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const trackEvent = useCallback((event: string, props?: Record<string, string | number>) => {
    track(event, props);
  }, []);

  return {
    trackMapGenerated: (sign: string, source: string) => trackEvent('map_generated', { sign, source }),
    trackEmailCaptured: () => trackEvent('email_captured'),
    trackCardViewed: (cardId: string) => trackEvent('card_viewed', { card: cardId }),
    trackOracleOpened: (cardId: string) => trackEvent('oracle_opened', { card: cardId }),
    trackOracleCompleted: (cardId: string) => trackEvent('oracle_completed', { card: cardId }),
    trackShareCopied: () => trackEvent('share_copied'),
    trackSoulMateInitiated: () => trackEvent('soul_mate_initiated'),
    trackPaymentInitiated: (product: string) => trackEvent('payment_initiated', { product }),
    trackCeremonyViewed: (cardId: string) => trackEvent('ceremony_viewed', { card: cardId }),
    trackEvent,
  };
}
