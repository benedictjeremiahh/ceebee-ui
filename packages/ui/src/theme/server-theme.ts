import type { ThemeConfig } from 'antd';

import { generatedCeebeeAntSeeds } from './ant-theme-seeds.generated.js';

export type CeebeeSkin = 'ceebee' | 'astra' | 'clarity' | 'moodboard';
export type ThemeMode = 'light' | 'dark';
export type ThemeContrast = 'normal' | 'more';

export interface CeebeeAntThemeSeed {
  token: NonNullable<ThemeConfig['token']>;
  components: NonNullable<ThemeConfig['components']>;
}

export type CeebeeAntSeedRegistry = Record<
  CeebeeSkin,
  Record<ThemeMode, Record<ThemeContrast, CeebeeAntThemeSeed>>
>;

export interface CeebeeAntThemeSeedOptions {
  skin?: CeebeeSkin;
  mode: ThemeMode;
  contrast?: ThemeContrast;
}

/**
 * Returns the DOM-free Ant seed generated from the same CSS Tokens as the selected Skin.
 * Consumers use this only to tell ThemeProvider what the server knew; raw values remain owned here.
 */
export function getCeebeeAntThemeSeed({
  skin = 'ceebee',
  mode,
  contrast = 'normal',
}: CeebeeAntThemeSeedOptions): CeebeeAntThemeSeed {
  const seed = generatedCeebeeAntSeeds[skin][mode][contrast];
  return {
    token: { ...seed.token },
    components: Object.fromEntries(
      Object.entries(seed.components).map(([name, tokens]) => [name, { ...tokens }]),
    ) as NonNullable<ThemeConfig['components']>,
  };
}

export const THEME_MODE_COOKIE = 'cb-theme-mode';

/** Reads the resolved light/dark mode from a Cookie header without depending on a web framework. */
export function readThemeModeCookie(cookieHeader: string | null | undefined): ThemeMode | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(';')) {
    const separator = part.indexOf('=');
    if (separator < 0) continue;
    const name = part.slice(0, separator).trim();
    if (name !== THEME_MODE_COOKIE) continue;
    const value = decodeURIComponent(part.slice(separator + 1).trim());
    return value === 'light' || value === 'dark' ? value : undefined;
  }
  return undefined;
}

/** Serializes the non-sensitive resolved mode that lets the next server render use the right seed. */
export function serializeThemeModeCookie(mode: ThemeMode): string {
  return `${THEME_MODE_COOKIE}=${mode}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
