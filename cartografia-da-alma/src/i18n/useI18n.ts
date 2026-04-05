import { useState, useCallback, useMemo } from 'react';
import ptBR from './pt-BR.json';
import enUS from './en-US.json';

// ═══════════════════════════════════════
// i18n Hook — locale detection + translation
// Detects browser language, defaults to pt-BR
// ═══════════════════════════════════════

export type Locale = 'pt-BR' | 'en-US';

const MESSAGES: Record<Locale, Record<string, string>> = {
  'pt-BR': ptBR,
  'en-US': enUS,
};

function detectLocale(): Locale {
  if (typeof navigator === 'undefined') return 'pt-BR';
  const lang = navigator.language || '';
  if (lang.startsWith('en')) return 'en-US';
  return 'pt-BR';
}

export function useI18n() {
  const [locale, setLocale] = useState<Locale>(detectLocale);

  const t = useCallback((key: string, fallback?: string): string => {
    return MESSAGES[locale]?.[key] ?? MESSAGES['pt-BR']?.[key] ?? fallback ?? key;
  }, [locale]);

  const isBR = locale === 'pt-BR';

  const currency = useMemo(() => isBR ? 'BRL' : 'USD', [isBR]);

  const formatPrice = useCallback((brl: number, usd: number) => {
    return isBR ? `R$${brl}` : `$${(usd / 100).toFixed(2)}`;
  }, [isBR]);

  return { locale, setLocale, t, isBR, currency, formatPrice };
}
