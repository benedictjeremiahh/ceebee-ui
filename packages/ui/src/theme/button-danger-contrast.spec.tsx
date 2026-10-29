import { useContext } from 'react';
import { createCache, StyleProvider } from '@ant-design/cssinjs';
import { render, screen, waitFor } from '@testing-library/react';
import { Button, ConfigProvider, theme as antTheme } from 'antd';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getCeebeeAntThemeSeed, type CeebeeSkin, type ThemeContrast, type ThemeMode } from './server-theme.js';
import { readCeebeeThemeToken, ThemeBridge } from './theme-bridge.js';

const skins: CeebeeSkin[] = ['byceebee', 'ceebee', 'astra', 'clarity', 'moodboard'];
const modes: ThemeMode[] = ['light', 'dark'];
const contrasts: ThemeContrast[] = ['normal', 'more'];
const states = ['colorError', 'colorErrorHover', 'colorErrorActive'] as const;
const surfaces = ['colorBgContainer', 'colorBgBase', 'colorBgElevated'] as const;
function luminance(color: string) {
  const hex = /^#([\da-f]{6})$/i.exec(color)?.[1];
  const channels = hex ? [0, 2, 4].map(index => Number.parseInt(hex.slice(index, index + 2), 16))
    : (color.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
  const [red = 0, green = 0, blue = 0] = channels.map(channel => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}
function ratio(foreground: string, background: string) {
  const values = [luminance(foreground), luminance(background)];
  return (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05);
}
const variants = skins.flatMap(skin => modes.flatMap(mode => contrasts.map(contrast => ({ skin, mode, contrast }))));

function resolveProbeColors(root: HTMLElement) {
  const original = window.getComputedStyle.bind(window);
  vi.spyOn(window, 'getComputedStyle').mockImplementation(element => {
    const resolved = original(element);
    if (!(element instanceof HTMLElement)) return resolved;
    const variable = element.style.color.match(/^var\((--[^)]+)\)$/)?.[1];
    const value = variable ? root.style.getPropertyValue(variable) : '';
    if (value) Object.defineProperty(resolved, 'color', { configurable: true, value });
    return resolved;
  });
}
function ReadConfig() {
  const config = useContext(ConfigProvider.ConfigContext);
  return <output>{JSON.stringify(config.theme?.components?.Button)}</output>;
}
function buttonStyleDeclarations(button: HTMLElement) {
  const scope = [...button.classList].find(name => name.startsWith('css-var-'));
  return [...document.querySelectorAll('style')].map(element => element.textContent ?? '')
    .filter(css => scope && css.includes(`.${scope}`) && css.includes('.ant-btn')).join('');
}

afterEach(() => {
  vi.restoreAllMocks();
  document.documentElement.style.removeProperty('--cb-tone-danger');
});

describe('danger Button contrast', () => {
  it('keeps the effective Ant Button state colors accessible after real palette derivation', () => {
    const failures = variants.flatMap(variant => {
      const seed = getCeebeeAntThemeSeed(variant);
      const derived = antTheme.getDesignToken({ token: seed.token,
        algorithm: variant.mode === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm });
      return states.flatMap(state => surfaces.flatMap(surface => {
        // Ant applies component aliases after deriving the global palette.
        const foreground = seed.components.Button?.[state] ?? derived[state];
        const measured = ratio(foreground, derived[surface]);
        return measured < 4.5 ? [`${variant.skin}/${variant.mode}/${variant.contrast} ${state} on ${surface}: ${measured.toFixed(2)}`] : [];
      }));
    });
    expect(failures).toEqual([]);
  });

  it('keeps server Button aliases on the selected semantic danger tone in every state', () => {
    for (const variant of variants) {
      const seed = getCeebeeAntThemeSeed(variant);
      for (const state of states) expect(seed.components.Button?.[state]).toBe(seed.token.colorError);
    }
  });

  it('maps the live resolved danger tone to Button states without changing primary behavior', () => {
    const root = document.createElement('div');
    root.style.setProperty('--cb-tone-danger', 'rgb(248, 112, 152)');
    root.style.setProperty('--cb-tone-brand', 'rgb(156, 197, 255)');
    document.body.append(root);
    resolveProbeColors(root);
    const live = readCeebeeThemeToken(root);
    for (const state of states) expect(live.components.Button?.[state]).toBe('rgb(248, 112, 152)');
    expect(live.components.Form?.colorError).toBe('rgb(248, 112, 152)');
    expect(live.token.colorPrimary).toBe('rgb(156, 197, 255)');
    expect(live.token.colorPrimaryHover).toBe(live.token.colorPrimary);
    expect(live.token.colorPrimaryActive).toBe(live.token.colorPrimary);
    root.remove();
  });

  it('emits the semantic danger aliases in the actual rendered Button CSS', async () => {
    document.documentElement.style.setProperty('--cb-tone-danger', 'rgb(248, 112, 152)');
    resolveProbeColors(document.documentElement);
    render(<StyleProvider cache={createCache()}><ThemeBridge mode="dark"><Button danger>Remove item</Button><ReadConfig /></ThemeBridge></StyleProvider>);
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain('rgb(248, 112, 152)'));
    const css = buttonStyleDeclarations(screen.getByRole('button', { name: 'Remove item' }));
    for (const state of ['error', 'error-hover', 'error-active']) {
      expect(css).toContain(`--cb-ant-color-${state}:rgb(248, 112, 152)`);
    }
    expect(screen.getByRole('button', { name: 'Remove item' })).toBeEnabled();
  });

  it('preserves explicit component overrides after merging the live theme', async () => {
    document.documentElement.style.setProperty('--cb-tone-danger', 'rgb(248, 112, 152)');
    resolveProbeColors(document.documentElement);
    render(<StyleProvider cache={createCache()}><ThemeBridge mode="dark" theme={{ components: { Button: { colorError: 'rgb(200, 100, 150)' } } }}>
      <Button danger>Remove item</Button><ReadConfig />
    </ThemeBridge></StyleProvider>);
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain('rgb(200, 100, 150)'));
    const css = buttonStyleDeclarations(screen.getByRole('button', { name: 'Remove item' }));
    expect(css).toContain('--cb-ant-color-error:rgb(200, 100, 150)');
    expect(css).toContain('--cb-ant-color-error-hover:rgb(248, 112, 152)');
    expect(css).toContain('--cb-ant-color-error-active:rgb(248, 112, 152)');
  });
});
