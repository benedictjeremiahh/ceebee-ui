import { describe, expect, it } from 'vitest';
import { generatedCeebeeAntSeeds } from './ant-theme-seeds.generated.js';

/**
 * Ant reads each tone two ways at once: as text on a surface (an outlined tag, a danger button's label)
 * and as a fill under its light-solid text (a primary button, a solid tag, a badge). One value served
 * both badly — the danger tone measured 3.35–4.36:1 as text, white on the dark-mode brand fill 2.59:1 —
 * so each mode now picks its own step: dark tones with light text in light mode, light tones with dark
 * text in dark mode. This checks both readings for every skin, theme and contrast mode.
 */
const channels = (rgba: string) => (rgba.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
const luminance = (rgba: string) => {
  const [r = 0, g = 0, b = 0] = channels(rgba).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((hi ?? 0) + 0.05) / ((lo ?? 0) + 0.05);
};

type Token = Record<string, string | number>;
type Seed = { token: Token; components?: Record<string, Record<string, string>> };
const seeds: { name: string; seed: Seed }[] = [];
for (const [skin, themes] of Object.entries(generatedCeebeeAntSeeds)) {
  for (const [theme, modes] of Object.entries(themes as Record<string, Record<string, Seed>>)) {
    for (const [mode, seed] of Object.entries(modes)) seeds.push({ name: `${skin}/${theme}/${mode}`, seed });
  }
}

const TONES = ['colorPrimary', 'colorInfo', 'colorSuccess', 'colorWarning', 'colorError'] as const;
const SURFACES = ['colorBgContainer', 'colorBgBase', 'colorBgElevated'] as const;

describe('tone contrast', () => {
  it('covers every seed', () => {
    expect(seeds.length).toBeGreaterThan(0);
  });

  it('reads every tone as text at WCAG AA 4.5:1 on the surfaces it sits on', () => {
    const failing = seeds.flatMap(({ name, seed }) =>
      TONES.flatMap((tone) =>
        SURFACES.map((bg) => ({ tone, bg, r: ratio(String(seed.token[tone]), String(seed.token[bg])) }))
          .filter(({ r }) => r < 4.5)
          .map(({ tone, bg, r }) => `${name} ${tone} on ${bg}: ${r.toFixed(2)}`),
      ),
    );
    expect(failing).toEqual([]);
  });

  it('carries its light-solid text at WCAG AA 4.5:1 on every tone fill', () => {
    const failing = seeds.flatMap(({ name, seed }) =>
      TONES.map((tone) => ({ tone, r: ratio(String(seed.token.colorTextLightSolid), String(seed.token[tone])) }))
        .filter(({ r }) => r < 4.5)
        .map(({ tone, r }) => `${name} text on ${tone}: ${r.toFixed(2)}`),
    );
    expect(failing).toEqual([]);
  });

  it('reads every tone as text at WCAG AA 4.5:1 on its own quiet ground (a filled tag, an alert)', () => {
    const failing = seeds.flatMap(({ name, seed }) =>
      TONES.map((tone) => ({ tone, r: ratio(String(seed.token[tone]), String(seed.token[`${tone}Bg`])) }))
        .filter(({ r }) => r < 4.5)
        .map(({ tone, r }) => `${name} ${tone} on ${tone}Bg: ${r.toFixed(2)}`),
    );
    expect(failing).toEqual([]);
  });

  it('keeps light text on the dark neutrals (tooltip, tour, image preview) in both modes', () => {
    const failing = seeds.flatMap(({ name, seed }) =>
      (['Tooltip', 'Tour', 'Image'] as const)
        .filter((c) => luminance(String(seed.components?.[c]?.colorTextLightSolid ?? '')) < 0.8)
        .map((c) => `${name} ${c}`),
    );
    expect(failing).toEqual([]);
  });
});
