'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { ConfigProviderProps, ThemeConfig } from 'antd';
import { ThemeBridge } from './theme-bridge.js';
import {
  serializeThemeModeCookie,
  type CeebeeSkin,
  type ThemeContrast,
  type ThemeMode,
} from './server-theme.js';
import { THEME_CHOICE_STORAGE_KEY } from './bootstrap-theme.js';

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
  /**
   * The language of the strings the runtime draws itself — an empty table's "No data", a date
   * picker's "Select date", pagination. Pass one of the locale exports (`idIDLocale`, …). The
   * library's own strings are a separate contract: see `LabelsProvider`.
   */
  locale?: ConfigProviderProps['locale'];
}

interface ThemeState {
  choice: ThemeChoice;
  setChoice: (choice: ThemeChoice) => void;
  /** What is actually rendering right now, once `system` is resolved. */
  resolved: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeState | null>(null);
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
  locale,
}: ThemeProviderProps) {
  const [choice, setChoiceState] = useState<ThemeChoice>(defaultChoice);
  const [systemDark, setSystemDark] = useState(initialMode === 'dark');
  const [choiceRestored, setChoiceRestored] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemDark(query.matches);
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (persist) {
      try {
        const stored = window.localStorage.getItem(THEME_CHOICE_STORAGE_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') setChoiceState(stored);
      } catch {
        // Storage can be disabled by browser policy; keep the server-provided choice.
      }
    }
    setChoiceRestored(true);
  }, [persist]);

  useEffect(() => {
    if (!choiceRestored) return;
    const root = document.documentElement;
    if (choice === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', choice);
    root.setAttribute('data-cb-theme-mode', choice === 'system' ? (systemDark ? 'dark' : 'light') : choice);
  }, [choice, choiceRestored, systemDark]);

  const setChoice = useCallback(
    (next: ThemeChoice) => {
      setChoiceState(next);
      if (persist) {
        try {
          window.localStorage.setItem(THEME_CHOICE_STORAGE_KEY, next);
        } catch {
          // The selection remains active for this page even when it cannot be persisted.
        }
      }
    },
    [persist],
  );

  const resolved = choice === 'system' ? (systemDark ? 'dark' : 'light') : choice;

  useEffect(() => {
    if (!persist || !choiceRestored) return;
    try {
      document.cookie = serializeThemeModeCookie(resolved);
    } catch {
      // Cookie access can be blocked; theme selection still works in this page.
    }
  }, [choiceRestored, persist, resolved]);

  return (
    <ThemeContext.Provider value={{ choice, setChoice, resolved }}>
      <ThemeBridge mode={resolved} skin={skin} contrast={contrast} theme={antdTheme} locale={locale}>
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
