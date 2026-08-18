'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type ThemeChoice = 'light' | 'dark' | 'system';

interface ThemeState {
  choice: ThemeChoice;
  setChoice: (choice: ThemeChoice) => void;
  /** What is actually rendering right now, once `system` is resolved. */
  resolved: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeState | null>(null);
const STORAGE_KEY = 'cb-theme';

/**
 * Colour itself comes from CSS, not from here (ADR 0002) — this only flips `data-theme`
 * on the document root, so the first paint is already correct without a blocking script
 * for anyone who never overrides the system setting.
 */
export function ThemeProvider({
  children,
  defaultChoice = 'system',
  persist = true,
}: {
  children: ReactNode;
  defaultChoice?: ThemeChoice;
  persist?: boolean;
}) {
  const [choice, setChoiceState] = useState<ThemeChoice>(defaultChoice);
  const [systemDark, setSystemDark] = useState(false);

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

  return <ThemeContext.Provider value={{ choice, setChoice, resolved }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeState {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used inside <ThemeProvider>');
  return value;
}
