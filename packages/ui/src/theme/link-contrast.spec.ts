import { describe, expect, it } from 'vitest';
import { generatedCeebeeAntSeeds, generatedSubtleSurfaces } from './ant-theme-seeds.generated.js';

/**
 * Link-style buttons carry the row actions of every data table, so their colour is read dozens of times
 * a page. Two things went wrong at once before this spec: Ant derived the link colour from the info hue
 * (a second accent beside the brand), and on dark surfaces it measured ~4.1–4.5:1 — at or under WCAG AA.
 * Every skin, theme and contrast mode is checked against the surfaces a link sits on — including the
 * subtle surface cards paint, after a consumer measured 4.49:1 on a board card the seed surfaces all
 * passed. A surface a link sits on belongs in that check, not in a reviewer's memory.
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
const seeds: { name: string; token: Token }[] = [];
for (const [skin, themes] of Object.entries(generatedCeebeeAntSeeds)) {
  for (const [theme, modes] of Object.entries(themes as Record<string, Record<string, { token: Token }>>)) {
    for (const [mode, seed] of Object.entries(modes)) seeds.push({ name: `${skin}/${theme}/${mode}`, token: seed.token });
  }
}

describe('link colour', () => {
  it('is set for every seed', () => {
    expect(seeds.length).toBeGreaterThan(0);
    expect(seeds.filter((s) => typeof s.token.colorLink !== 'string').map((s) => s.name)).toEqual([]);
  });

  it('is not the info hue — one theme, one accent', () => {
    expect(seeds.filter((s) => s.token.colorLink === s.token.colorInfo).map((s) => s.name)).toEqual([]);
  });

  it('meets WCAG AA 4.5:1 on the surfaces a link sits on', () => {
    const failing = seeds.flatMap((s) =>
      (['colorBgContainer', 'colorBgBase', 'colorBgElevated'] as const)
        .map((bg) => ({ bg, r: ratio(String(s.token.colorLink), String(s.token[bg])) }))
        .filter(({ r }) => r < 4.5)
        .map(({ bg, r }) => `${s.name} on ${bg}: ${r.toFixed(2)}`),
    );
    expect(failing).toEqual([]);
  });

  it('meets WCAG AA 4.5:1 on the subtle surface cards paint (consumer finding: 4.49:1 on a board card)', () => {
    const failing = seeds.flatMap((s) => {
      const [skin, theme, mode] = s.name.split('/');
      const subtle = generatedSubtleSurfaces[skin as keyof typeof generatedSubtleSurfaces]?.[theme as 'light' | 'dark']?.[mode as 'normal' | 'more'];
      if (!subtle) return [`${s.name}: no subtle surface generated`];
      const r = ratio(String(s.token.colorLink), subtle);
      return r < 4.5 ? [`${s.name} on subtle: ${r.toFixed(2)}`] : [];
    });
    expect(failing).toEqual([]);
  });
});
