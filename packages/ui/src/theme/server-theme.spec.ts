import { describe, expect, it } from 'vitest';

import {
  getCeebeeAntThemeSeed,
  readThemeModeCookie,
  serializeThemeModeCookie,
  THEME_MODE_COOKIE,
} from './server-theme.js';

describe('server theme contract', () => {
  it('produces complete, mode-specific Ant seeds without a DOM', () => {
    const light = getCeebeeAntThemeSeed({ skin: 'ceebee', mode: 'light' });
    const dark = getCeebeeAntThemeSeed({ skin: 'ceebee', mode: 'dark' });

    expect(light.token.controlHeight).toBe(40);
    expect(dark.token.controlHeight).toBe(40);
    expect(light.token.colorBgContainer).not.toBe(dark.token.colorBgContainer);
    expect(dark.token.colorBgContainer).not.toBe('rgba(255, 255, 255, 1)');
    expect(dark.components.Slider?.trackBg).toBeTruthy();
  });

  it('returns independent objects so an Ant consumer cannot mutate the registry', () => {
    const first = getCeebeeAntThemeSeed({ mode: 'dark' });
    first.token.colorText = 'hotpink';
    const second = getCeebeeAntThemeSeed({ mode: 'dark' });

    expect(second.token.colorText).not.toBe('hotpink');
  });

  it('round-trips only a valid resolved mode cookie', () => {
    expect(serializeThemeModeCookie('dark')).toContain(`${THEME_MODE_COOKIE}=dark`);
    expect(readThemeModeCookie('session=x; cb-theme-mode=dark; locale=id')).toBe('dark');
    expect(readThemeModeCookie('cb-theme-mode=system')).toBeUndefined();
    expect(readThemeModeCookie(undefined)).toBeUndefined();
  });
});
