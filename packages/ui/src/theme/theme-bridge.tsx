'use client';

import { ConfigProvider, theme as antdTheme, type ThemeConfig } from 'antd';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  getCeebeeAntThemeSeed,
  type CeebeeSkin,
  type ThemeContrast,
  type ThemeMode,
} from './server-theme.js';

export interface ThemeBridgeProps {
  children: ReactNode;
  mode: ThemeMode;
  skin?: CeebeeSkin;
  contrast?: ThemeContrast;
  theme?: ThemeConfig;
}

const SKIN_LINK_ID = 'cb-skin';

/**
 * Translates Ceebee's live CSS Tokens into Ant's theme seed. Ant still owns component geometry,
 * interaction, accessibility, and derived tokens; Ceebee owns the active Skin and colour mode.
 */
export function ThemeBridge({
  children,
  mode,
  skin = 'ceebee',
  contrast = 'normal',
  theme,
}: ThemeBridgeProps) {
  /* The generated seed is deliberately the first value on both server and client. It makes SSR
     extraction deterministic and keeps hydration on the same Ant hash. Once mounted, the live CSS
     Tokens remain authoritative and the effect below takes over every Skin, mode, or contrast
     change the browser can actually resolve. */
  const [skinToken, setSkinToken] = useState<CeebeeTheme>(() =>
    getCeebeeAntThemeSeed({ skin, mode, contrast }));

  const refresh = useCallback(() => {
    setSkinToken(readCeebeeThemeToken(document.documentElement));
  }, []);

  useEffect(() => {
    refresh();

    const rootObserver = new MutationObserver(refresh);
    rootObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    const headObserver = new MutationObserver((records) => {
      const skinChanged = records.some((record) => [...record.addedNodes, ...record.removedNodes]
        .some((node) => node instanceof HTMLElement && node.id === SKIN_LINK_ID));
      if (skinChanged) refresh();
    });
    headObserver.observe(document.head, { childList: true });

    const onSkinLoad = (event: Event) => {
      if (event.target instanceof HTMLElement && event.target.id === SKIN_LINK_ID) refresh();
    };
    document.addEventListener('load', onSkinLoad, true);

    return () => {
      rootObserver.disconnect();
      headObserver.disconnect();
      document.removeEventListener('load', onSkinLoad, true);
    };
  }, [refresh]);

  const mergedTheme = useMemo<ThemeConfig>(() => ({
    ...theme,
    algorithm: theme?.algorithm ?? (mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm),
    cssVar: theme?.cssVar ?? { prefix: 'cb-ant' },
    token: { ...skinToken.token, ...theme?.token },
    components: mergeComponents(skinToken.components, theme?.components),
  }), [mode, skinToken, theme]);

  // Ant's static methods — `Modal.confirm`, `message.info`, `notification.open` — render into their
  // own root, outside this provider, so they miss the theme entirely and come up light on a dark
  // page. `holderRender` is Ant's own seam for that: it wraps the static holder in a provider
  // carrying the same theme, so a static dialog matches the page it was opened from.
  useEffect(() => {
    ConfigProvider.config({
      holderRender: (holder) => <ConfigProvider theme={mergedTheme}>{holder}</ConfigProvider>,
    });
  }, [mergedTheme]);

  return <ConfigProvider theme={mergedTheme}>{children}</ConfigProvider>;
}

export interface CeebeeTheme {
  token: NonNullable<ThemeConfig['token']>;
  components: NonNullable<ThemeConfig['components']>;
}

function mergeComponents(
  base: NonNullable<ThemeConfig['components']>,
  override: ThemeConfig['components'],
): NonNullable<ThemeConfig['components']> {
  if (!override) return base;
  const merged: Record<string, unknown> = { ...base };
  for (const [name, tokens] of Object.entries(override)) {
    merged[name] = { ...(merged[name] as object | undefined), ...tokens };
  }
  return merged as NonNullable<ThemeConfig['components']>;
}

export function readCeebeeThemeToken(root: HTMLElement): CeebeeTheme {
  const probe = document.createElement('span');
  probe.style.position = 'fixed';
  probe.style.pointerEvents = 'none';
  probe.style.visibility = 'hidden';
  root.append(probe);

  const color = (name: string) => resolveCssColor(probe, name);
  const length = (name: string) => resolveCssLength(probe, name);
  const tokens: NonNullable<ThemeConfig['token']> = {
    colorPrimary: color('--cb-tone-brand'),
    colorInfo: color('--cb-tone-info'),
    colorSuccess: color('--cb-tone-success'),
    colorWarning: color('--cb-tone-warning'),
    colorError: color('--cb-tone-danger'),
    colorText: color('--cb-fg'),
    colorTextSecondary: color('--cb-fg-muted'),
    colorTextTertiary: color('--cb-fg-subtle'),
    /* Ant derives its placeholder colour from its own algorithm rather than from any token this
       bridge already sends, and lands on a 25%-alpha grey that fails WCAG AA text contrast in both
       modes. Placeholder text is text, and the subtle foreground only clears AA against the plain
       surface, so placeholders take the muted foreground that clears it against every surface a
       control can sit on. */
    colorTextPlaceholder: color('--cb-fg-muted'),
    /* The same defect as the placeholder above, in the same shape: Ant derives its disabled
       foreground from its own algorithm and lands on a 25%-alpha grey — measured at 1.19:1 on a
       light stage and 2.08:1 on a dark one, which is a word you can see the shape of and not read.
       WCAG exempts inactive controls, and that exemption is the wrong thing to lean on: the label on
       a disabled control is exactly what tells you why it is disabled and what would enable it, so
       it is the one piece of text on the control that has to survive.

       The muted foreground rather than the subtle one, for the reason the placeholder note above
       already records: subtle clears AA against the plain surface and nothing else, and a disabled
       control sits on a translucent wash over whatever surface the product put it on. Measured on a
       consumer's own panel, subtle came back at 4.37:1 — under the bar, from the one step that
       looked quiet enough. Disabled still reads as disabled: the control also loses its border and
       its ground, which are cues that do not depend on colour at all. */
    colorTextDisabled: color('--cb-fg-muted'),
    colorTextLightSolid: color('--cb-fg-on-brand'),
    colorBgBase: color('--cb-bg'),
    colorBgContainer: color('--cb-surface'),
    colorBgElevated: color('--cb-surface-raised'),
    colorBorder: color('--cb-border-strong'),
    colorBorderSecondary: color('--cb-border'),
    fontFamily: 'var(--cb-font-sans)',
    fontSize: length('--cb-text-sm'),
    fontSizeSM: length('--cb-text-xs'),
    fontSizeLG: length('--cb-text-md'),
    borderRadius: length('--cb-radius-sm'),
    borderRadiusLG: length('--cb-radius-md'),
    controlHeight: length('--cb-control-height-md'),
    controlHeightSM: length('--cb-control-height-sm'),
    controlHeightLG: length('--cb-control-height-lg'),
    lineWidth: length('--cb-border-width'),
    boxShadow: 'var(--cb-shadow-md)',
    boxShadowSecondary: 'var(--cb-shadow-sm)',
  };

  /* Ant derives the Slider's filled track, handle, and active dot from `colorPrimaryBorder`, which
     its palette generator produces from the primary seed. That step lands close to white for a seed
     as light as Ceebee's brand, so a filled track stops reading as filled and the control looks
     disabled. Ceebee's own brand ramp already has the step Ant is reaching for, so the Slider reads
     it directly. */
  const components: NonNullable<ThemeConfig['components']> = {};
  const trackBg = color('--cb-brand-300');
  const trackHoverBg = color('--cb-brand-400');
  if (trackBg && trackHoverBg) {
    components.Slider = {
      trackBg,
      trackHoverBg,
      handleColor: trackBg,
      dotActiveBorderColor: trackBg,
    };
  }

  probe.remove();
  return {
    token: Object.fromEntries(
      Object.entries(tokens).filter(([, value]) => value !== undefined),
    ) as NonNullable<ThemeConfig['token']>,
    components,
  };
}

function resolveCssLength(probe: HTMLElement, name: string): number | undefined {
  probe.style.width = `var(${name})`;
  const value = Number.parseFloat(getComputedStyle(probe).width);
  probe.style.removeProperty('width');
  return Number.isFinite(value) ? value : undefined;
}

function resolveCssColor(probe: HTMLElement, name: string): string | undefined {
  probe.style.color = `var(${name})`;
  const value = getComputedStyle(probe).color;
  probe.style.removeProperty('color');
  if (!value) return undefined;
  // A DOM implementation without Custom Property resolution (notably jsdom) returns the var()
  // expression unchanged. It is not a colour and must not be sent through the canvas fallback.
  if (value.startsWith('var(')) return undefined;
  if (/^(?:#|rgb|hsl|hsv)/i.test(value)) return value;

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return undefined;
  context.clearRect(0, 0, 1, 1);
  context.fillStyle = value;
  context.fillRect(0, 0, 1, 1);
  const [red = 0, green = 0, blue = 0, alpha = 255] = context.getImageData(0, 0, 1, 1).data;
  return `rgba(${red}, ${green}, ${blue}, ${alpha / 255})`;
}
