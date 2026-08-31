'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { ThemeConfig } from 'antd';
import { ThemeBridge } from './theme-bridge.js';
import {
  serializeThemeModeCookie,
  type CeebeeSkin,
  type ThemeContrast,
  type ThemeMode,
} from './server-theme.js';

export type ThemeChoice = 'light' | 'dark' | 'system';

export interface ThemeProviderProps {
  children: ReactNode;
  defaultChoice?: ThemeChoice;
  /** Resolved mode read by the server, normally via readThemeModeCookie(request Cookie header). */
  initialMode?: ThemeMode;
  /** Must match the Skin stylesheet loaded by the application. */
  skin?: CeebeeSkin;
  /** Server-known contrast preference. Browsers still refresh from live CSS after mounting. */
  contrast?: ThemeContrast;
  persist?: boolean;
  /** Optional Ant token/component overrides applied after the active Ceebee Skin. */
  antdTheme?: ThemeConfig;
}

interface ThemeState {
  choice: ThemeChoice;
  setChoice: (choice: ThemeChoice) => void;
  /** What is actually rendering right now, once `system` is resolved. */
  resolved: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeState | null>(null);
const STORAGE_KEY = 'cb-theme';

/**
 * CSS remains the colour source of truth. This flips `data-theme` and gives Ant the generated seed
 * for the server-known rendering; after mount ThemeBridge refreshes from the live CSS cascade.
 */
export function ThemeProvider({
  children,
  defaultChoice = 'system',
  initialMode,
  skin = 'ceebee',
  contrast = 'normal',
  persist = true,
  antdTheme,
}: ThemeProviderProps) {
  const [choice, setChoiceState] = useState<ThemeChoice>(defaultChoice);
  const [systemDark, setSystemDark] = useState(initialMode === 'dark');

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemDark(query.matches);
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!persist) return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') setChoiceState(stored);
  }, [persist]);

  useEffect(() => {
    const root = document.documentElement;
    if (choice === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', choice);
  }, [choice]);

  const setChoice = useCallback(
    (next: ThemeChoice) => {
      setChoiceState(next);
      if (persist) window.localStorage.setItem(STORAGE_KEY, next);
    },
    [persist],
  );

  const resolved = choice === 'system' ? (systemDark ? 'dark' : 'light') : choice;

  useEffect(() => {
    if (persist) document.cookie = serializeThemeModeCookie(resolved);
  }, [persist, resolved]);

  return (
    <ThemeContext.Provider value={{ choice, setChoice, resolved }}>
      <ThemeBridge mode={resolved} skin={skin} contrast={contrast} theme={antdTheme}>
        {children}
      </ThemeBridge>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeState {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used inside <ThemeProvider>');
  return value;
}
