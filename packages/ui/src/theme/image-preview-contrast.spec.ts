import { afterEach, describe, expect, it, vi } from 'vitest';
import { generatedCeebeeAntSeeds } from './ant-theme-seeds.generated.js';
import { readCeebeeThemeToken } from './theme-bridge.js';
import type { CeebeeSkin, ThemeContrast, ThemeMode } from './server-theme.js';

const rgbChannels = (value: string) => (value.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
const luminance = (value: string) => {
  const [red = 0, green = 0, blue = 0] = rgbChannels(value).map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};
const contrast = (foreground: string, background: string) => {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((left, right) => right - left);
  return ((lighter ?? 0) + 0.05) / ((darker ?? 0) + 0.05);
};

afterEach(() => vi.restoreAllMocks());

describe('image preview controls', () => {
  it('keeps the full-screen image ground opaque and preview controls readable in every seed', () => {
    const skins: CeebeeSkin[] = ['ceebee', 'astra', 'clarity', 'moodboard'];
    const modes: ThemeMode[] = ['light', 'dark'];
    const contrastModes: ThemeContrast[] = ['normal', 'more'];
    const failures = skins.flatMap((skin) => modes.flatMap((mode) => contrastModes.flatMap((contrastMode) => {
        const seed = generatedCeebeeAntSeeds[skin][mode][contrastMode];
        const image = seed.components.Image;
        const name = `${skin}/${mode}/${contrastMode}`;
        if (!image) return [`${name} has no Image seed`];
        const background = image.colorBgMask;
        const controls = [image.previewOperationColor, image.previewOperationHoverColor, image.colorTextLightSolid];
        return [
          ...(typeof background !== 'string' || !background.endsWith(', 1)') ? [`${name} preview ground is not opaque`] : []),
          ...controls.flatMap((foreground, index) => typeof foreground !== 'string' || typeof background !== 'string'
            || contrast(foreground, background) < 4.5 ? [`${name} preview control ${index} misses 4.5:1`] : []),
        ];
      })));

    expect(failures).toEqual([]);
  });

  it('maps resolved preview CSS tokens to Image alone in the live theme bridge', () => {
    const root = document.createElement('div');
    root.style.setProperty('--cb-image-preview-bg', 'rgb(20, 21, 28)');
    root.style.setProperty('--cb-fg-on-dark', 'rgb(252, 252, 252)');
    document.body.append(root);
    const nativeGetComputedStyle = window.getComputedStyle.bind(window);
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
      const resolved = nativeGetComputedStyle(element);
      if (!(element instanceof HTMLElement)) return resolved;
      const variable = element.style.color.match(/^var\((--[^)]+)\)$/)?.[1];
      const value = variable ? root.style.getPropertyValue(variable) : '';
      if (value) Object.defineProperty(resolved, 'color', { configurable: true, value });
      return resolved;
    });

    const theme = readCeebeeThemeToken(root);
    const image = theme.components.Image;
    expect(image).toBeDefined();
    if (!image) return;
    expect(image.colorBgMask).toBe('rgb(20, 21, 28)');
    expect(image.previewOperationColor).toBe('rgb(252, 252, 252)');
    expect(image.previewOperationHoverColor).toBe('rgb(252, 252, 252)');
    expect(image.colorTextLightSolid).toBe('rgb(252, 252, 252)');
    expect(theme.components.Tooltip).not.toHaveProperty('colorBgMask');
    expect(theme.components.Tour).not.toHaveProperty('previewOperationColor');
    root.remove();
  });
});
