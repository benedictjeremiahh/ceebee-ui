'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type SpringPreset = 'snappy' | 'soft' | 'bouncy';
export type DurationToken = 'instant' | 'fast' | 'base' | 'slow' | 'deliberate';

const DURATIONS: Record<DurationToken, number> = {
  instant: 0.08,
  fast: 0.14,
  base: 0.22,
  slow: 0.38,
  deliberate: 0.62,
};

const SPRINGS: Record<SpringPreset, { type: 'spring'; stiffness: number; damping: number; mass: number }> = {
  snappy: { type: 'spring', stiffness: 520, damping: 34, mass: 0.8 },
  soft: { type: 'spring', stiffness: 220, damping: 30, mass: 1 },
  bouncy: { type: 'spring', stiffness: 420, damping: 16, mass: 0.9 },
};

export interface MotionSettings {
  /** False when the app disabled motion or the user asked for reduced motion. */
  enabled: boolean;
  /** Multiplier on every duration. 0 is equivalent to disabled. */
  scale: number;
}

const MotionContext = createContext<MotionSettings>({ enabled: true, scale: 1 });

export interface MotionProviderProps {
  children: ReactNode;
  /** App-level off switch — for a settings toggle, or for tests. */
  enabled?: boolean;
  scale?: number;
}

/**
 * The one place animation is scaled or switched off, and the seam that honours
 * `prefers-reduced-motion` (ADR 0004). Reduced motion means transforms drop and opacity
 * stays; it never means a state change happens invisibly.
 */
export function MotionProvider({ children, enabled = true, scale = 1 }: MotionProviderProps) {
  const [systemReduced, setSystemReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSystemReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setSystemReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const value = useMemo<MotionSettings>(
    () => ({ enabled: enabled && !systemReduced && scale > 0, scale: systemReduced ? 0 : scale }),
    [enabled, scale, systemReduced],
  );

  return (
    <MotionContext.Provider value={value}>
      <div style={{ display: 'contents', ['--cb-motion-scale' as string]: String(value.scale) }}>{children}</div>
    </MotionContext.Provider>
  );
}

export interface MotionHelpers extends MotionSettings {
  /** Seconds for a duration token, already scaled. 0 when motion is off. */
  duration: (token: DurationToken) => number;
  /** A Motion transition for a spring preset, collapsing to an instant one when off. */
  spring: (preset?: SpringPreset) => Record<string, unknown>;
}

export function useMotionSettings(): MotionHelpers {
  const settings = useContext(MotionContext);
  return useMemo(
    () => ({
      ...settings,
      duration: (token) => (settings.enabled ? DURATIONS[token] * settings.scale : 0),
      spring: (preset = 'snappy') => (settings.enabled ? SPRINGS[preset] : { duration: 0 }),
    }),
    [settings],
  );
}
