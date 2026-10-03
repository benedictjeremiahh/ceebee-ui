import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Button, Empty } from 'antd';
import idID from 'antd/locale/id_ID.js';
import { createCeebeeAntStyleCache, extractCeebeeAntStyles } from './ant-style-cache.js';
import { CeebeeAntStyleProvider } from './ant-style-provider.js';
import { getThemeBootstrapScript, THEME_CHOICE_STORAGE_KEY } from './bootstrap-theme.js';
import { ThemeProvider, useTheme } from './theme-provider.js';

const originalMatchMediaDescriptor = Object.getOwnPropertyDescriptor(window, 'matchMedia');
const originalDocumentCookieDescriptor = Object.getOwnPropertyDescriptor(document, 'cookie');

function CurrentMode() {
  const { resolved } = useTheme();
  return <output>{resolved}</output>;
}

describe('ThemeProvider server mode', () => {
  const values = new Map<string, string>();
  let systemDark = false;
  let mediaListeners: Array<(event: MediaQueryListEvent) => void> = [];

  beforeEach(() => {
    values.clear();
    systemDark = false;
    mediaListeners = [];
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: () => ({
        matches: systemDark,
        addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => mediaListeners.push(listener),
        removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
          mediaListeners = mediaListeners.filter((candidate) => candidate !== listener);
        },
      }),
    });
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
        removeItem: (key: string) => values.delete(key),
        clear: () => values.clear(),
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (originalDocumentCookieDescriptor) {
      Object.defineProperty(document, 'cookie', originalDocumentCookieDescriptor);
    } else {
      delete (document as unknown as { cookie?: string }).cookie;
    }
    if (originalMatchMediaDescriptor) {
      Object.defineProperty(window, 'matchMedia', originalMatchMediaDescriptor);
    } else {
      delete (window as unknown as { matchMedia?: typeof window.matchMedia }).matchMedia;
    }
    document.cookie = 'cb-theme-mode=; Path=/; Max-Age=0';
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-cb-theme-mode');
  });

  it('restores explicit light, explicit dark, and system themes before paint', () => {
    expect(getThemeBootstrapScript()).toContain("localStorage.getItem('cb-theme')");
    expect(getThemeBootstrapScript()).toBe(getThemeBootstrapScript());

    values.set(THEME_CHOICE_STORAGE_KEY, 'dark');
    window.eval(getThemeBootstrapScript());
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-cb-theme-mode')).toBe('dark');

    values.set(THEME_CHOICE_STORAGE_KEY, 'system');
    systemDark = true;
    window.eval(getThemeBootstrapScript());

    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    expect(document.documentElement.getAttribute('data-cb-theme-mode')).toBe('dark');

    values.set(THEME_CHOICE_STORAGE_KEY, 'light');
    window.eval(getThemeBootstrapScript());
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.documentElement.getAttribute('data-cb-theme-mode')).toBe('light');
  });

  it('leaves the server root unchanged for missing, invalid, or inaccessible storage', () => {
    const root = document.documentElement;
    root.setAttribute('data-theme', 'dark');
    root.setAttribute('data-cb-theme-mode', 'dark');

    window.eval(getThemeBootstrapScript());
    values.set(THEME_CHOICE_STORAGE_KEY, 'sepia');
    window.eval(getThemeBootstrapScript());
    expect(root.getAttribute('data-theme')).toBe('dark');
    expect(root.getAttribute('data-cb-theme-mode')).toBe('dark');

    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get: () => { throw new Error('storage unavailable'); },
    });
    expect(() => window.eval(getThemeBootstrapScript())).not.toThrow();
    expect(root.getAttribute('data-theme')).toBe('dark');
    expect(root.getAttribute('data-cb-theme-mode')).toBe('dark');
  });

  it('does not replace a pre-paint saved choice with the deterministic server default', async () => {
    values.set(THEME_CHOICE_STORAGE_KEY, 'dark');
    const root = document.documentElement;
    root.setAttribute('data-theme', 'dark');
    const rootThemeMutations: string[] = [];
    const setAttribute = root.setAttribute.bind(root);
    const removeAttribute = root.removeAttribute.bind(root);
    vi.spyOn(root, 'setAttribute').mockImplementation((name, value) => {
      if (name === 'data-theme') rootThemeMutations.push(`set:${value}`);
      setAttribute(name, value);
    });
    vi.spyOn(root, 'removeAttribute').mockImplementation((name) => {
      if (name === 'data-theme') rootThemeMutations.push('remove');
      removeAttribute(name);
    });
    render(
      <ThemeProvider defaultChoice="light" initialMode="light">
        <CurrentMode />
      </ThemeProvider>,
    );

    await waitFor(() => expect(screen.getByText('dark')).toBeInTheDocument());
    expect(rootThemeMutations).toEqual(['set:dark']);
    expect(root.getAttribute('data-theme')).toBe('dark');
    expect(root.getAttribute('data-cb-theme-mode')).toBe('dark');
  });

  it('keeps the server choice when reading storage fails and applies choices when writing fails', async () => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get: () => { throw new Error('storage unavailable'); },
    });
    function ChoiceControl() {
      const { choice, setChoice } = useTheme();
      return <button onClick={() => setChoice('dark')}>{choice}</button>;
    }

    render(<ThemeProvider defaultChoice="light"><ChoiceControl /></ThemeProvider>);
    expect(screen.getByRole('button', { name: 'light' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'light' }));
    expect(screen.getByRole('button', { name: 'dark' })).toBeInTheDocument();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('tracks system theme changes after restoring the system choice', async () => {
    values.set(THEME_CHOICE_STORAGE_KEY, 'system');
    render(<ThemeProvider><CurrentMode /></ThemeProvider>);
    await waitFor(() => expect(screen.getByText('light')).toBeInTheDocument());

    systemDark = true;
    act(() => {
      for (const listener of mediaListeners) listener({ matches: true } as MediaQueryListEvent);
    });

    await waitFor(() => expect(screen.getByText('dark')).toBeInTheDocument());
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    expect(document.documentElement.getAttribute('data-cb-theme-mode')).toBe('dark');
  });

  it('keeps an explicit light choice when the operating system switches to dark', async () => {
    values.set(THEME_CHOICE_STORAGE_KEY, 'light');
    render(<ThemeProvider><CurrentMode /></ThemeProvider>);
    await waitFor(() => expect(screen.getByText('light')).toBeInTheDocument());

    systemDark = true;
    act(() => {
      for (const listener of mediaListeners) listener({ matches: true } as MediaQueryListEvent);
    });

    expect(screen.getByText('light')).toBeInTheDocument();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.documentElement.getAttribute('data-cb-theme-mode')).toBe('light');
  });

  it('continues with the selected mode when cookie writes are blocked', async () => {
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: () => '',
      set: () => { throw new Error('cookies unavailable'); },
    });

    render(<ThemeProvider defaultChoice="dark" initialMode="dark"><CurrentMode /></ThemeProvider>);

    expect(screen.getByText('dark')).toBeInTheDocument();
    await waitFor(() => expect(document.documentElement.getAttribute('data-theme')).toBe('dark'));
  });

  it('server-renders an Ant control from a DOM-free dark seed', () => {
    const cache = createCeebeeAntStyleCache();
    const html = renderToString(
      <CeebeeAntStyleProvider cache={cache}>
        <ThemeProvider defaultChoice="dark" initialMode="dark">
          <Button>Open</Button>
        </ThemeProvider>
      </CeebeeAntStyleProvider>,
    );
    const css = extractCeebeeAntStyles(cache);

    expect(html).toContain('ant-btn');
    expect(html).toContain('Open');
    expect(css).toContain('--cb-ant-control-height:40px');
    expect(css).toContain('--cb-ant-color-bg-container:rgba(31, 32, 45, 1)');
    expect(css).not.toContain('--cb-ant-color-bg-container:#fff');
  });

  it('persists the resolved mode for the next server request', async () => {
    render(
      <ThemeProvider defaultChoice="dark" initialMode="dark">
        <CurrentMode />
      </ThemeProvider>,
    );

    expect(screen.getByText('dark')).toBeInTheDocument();
    await waitFor(() => expect(document.cookie).toContain('cb-theme-mode=dark'));
  });

  it('speaks the locale it is given, in the strings Ant draws for itself', () => {
    render(
      <ThemeProvider locale={idID} persist={false}>
        <Empty />
      </ThemeProvider>,
    );

    expect(document.querySelector('.ant-empty-description')?.textContent).toBe('Tidak ada data');
  });
});
