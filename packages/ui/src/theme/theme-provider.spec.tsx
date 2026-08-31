import { render, screen, waitFor } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Button } from 'antd';
import { createCeebeeAntStyleCache, extractCeebeeAntStyles } from './ant-style-cache.js';
import { CeebeeAntStyleProvider } from './ant-style-provider.js';
import { ThemeProvider, useTheme } from './theme-provider.js';

function CurrentMode() {
  const { resolved } = useTheme();
  return <output>{resolved}</output>;
}

describe('ThemeProvider server mode', () => {
  const values = new Map<string, string>();

  beforeEach(() => {
    values.clear();
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
    document.cookie = 'cb-theme-mode=; Path=/; Max-Age=0';
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
});
