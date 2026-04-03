import { useState, useCallback } from 'react';
import type { BirthData, SoulMap } from '../types/soul-map';
import { getSoulMap } from '../engine';

type AppScreen = 'entry' | 'loading' | 'revelation';

export function useSoulMap() {
  const [screen, setScreen] = useState<AppScreen>('entry');
  const [soulMap, setSoulMap] = useState<SoulMap | null>(null);

  const generate = useCallback((birthData: BirthData) => {
    setScreen('loading');
    // Simulate ritual delay, then compute
    setTimeout(() => {
      const map = getSoulMap(birthData);
      setSoulMap(map);
      setScreen('revelation');
    }, 3000);
  }, []);

  const reset = useCallback(() => {
    setSoulMap(null);
    setScreen('entry');
  }, []);

  return { screen, soulMap, generate, reset };
}
