import { describe, expect, it } from 'vitest';
import { generatedCeebeeAntSeeds, generatedSubtleSurfaces } from './ant-theme-seeds.generated.js';

/**
 * The quiet text Ant draws on its own — a form field's help line (`colorTextDescription`), a placeholder,
 * a disabled label — is still text a person has to read. Each one defaulted to a step that clears WCAG AA
 * against the plain surface and nothing else: a consumer's sign-in card, painted on the subtle surface,
 * measured its field help at 4.35:1. Placeholder and disabled were fixed one at a time as they were found;
 * this checks all three, on every surface they can sit on, so the next one is not found by a person.
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
const seeds: { name: string; token: Token; subtle: string | undefined }[] = [];
for (const [skin, themes] of Object.entries(generatedCeebeeAntSeeds)) {
  for (const [theme, modes] of Object.entries(themes as Record<string, Record<string, { token: Token }>>)) {
    for (const [mode, seed] of Object.entries(modes)) {
      const subtle = generatedSubtleSurfaces[skin as keyof typeof generatedSubtleSurfaces]?.[theme as 'light' | 'dark']?.[mode as 'normal' | 'more'];
      seeds.push({ name: `${skin}/${theme}/${mode}`, token: seed.token, subtle });
    }
  }
}

const QUIET_TEXT = ['colorTextDescription', 'colorTextPlaceholder', 'colorTextDisabled'] as const;

describe('quiet text contrast', () => {
  it('sets every quiet text token for every seed, so none falls back to the runtime default', () => {
    expect(seeds.length).toBeGreaterThan(0);
    const missing = seeds.flatMap((s) => QUIET_TEXT.filter((t) => typeof s.token[t] !== 'string').map((t) => `${s.name} ${t}`));
    expect(missing).toEqual([]);
  });

  it('reads at WCAG AA 4.5:1 on every surface quiet text sits on, the subtle card surface included', () => {
    const failing = seeds.flatMap((s) =>
      QUIET_TEXT.flatMap((text) => {
        const grounds: [string, string | number | undefined][] = [
          ['colorBgContainer', s.token.colorBgContainer],
          ['colorBgBase', s.token.colorBgBase],
          ['colorBgElevated', s.token.colorBgElevated],
          ['subtle', s.subtle],
        ];
        return grounds
          .map(([bg, value]) => ({ bg, r: ratio(String(s.token[text]), String(value)) }))
          .filter(({ r }) => r < 4.5)
          .map(({ bg, r }) => `${s.name} ${text} on ${bg}: ${r.toFixed(2)}`);
      }),
    );
    expect(failing).toEqual([]);
  });
});
