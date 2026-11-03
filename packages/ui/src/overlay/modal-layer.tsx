'use client';

import { createContext, useContext, useLayoutEffect, useState, type CSSProperties } from 'react';
import type { ModalProps } from 'antd';

interface ModalLevel { panel: number; mask: number }
const ModalLayerContext = createContext<ModalLevel | null>(null);
export const ModalLayerProvider = ModalLayerContext.Provider;

/** Compose modal ancestry using the semantic panel/backdrop gap, including elevated parents. */
export function useModalLayer(layer: 'page' | 'above-drawer', customZIndex: number | undefined,
  styles: ModalProps['styles']) {
  const parent = useContext(ModalLayerContext);
  const [value, setValue] = useState<ModalLevel | null>(null);
  useLayoutEffect(() => {
    const tokens = getComputedStyle(document.documentElement);
    const prefix = layer === 'above-drawer' ? '--cb-z-modal-above-drawer' : '--cb-z-modal';
    const panelToken = tokens.getPropertyValue(prefix).trim();
    const maskToken = tokens.getPropertyValue(`${prefix}-backdrop`).trim();
    if (!panelToken || !maskToken) return;
    const base = Number(panelToken), mask = Number(maskToken), gap = base - mask;
    if (!Number.isFinite(base) || !Number.isFinite(gap) || gap <= 0) return;
    const requested = customZIndex ?? base;
    if (!Number.isFinite(requested)) return;
    const configured = Math.max(requested, base);
    // Two gaps put the child's backdrop strictly above the parent and below the child panel.
    const panel = parent ? Math.max(configured, parent.panel + gap * 2) : configured;
    const next = { panel, mask: panel - gap };
    setValue(previous => previous?.panel === next.panel && previous.mask === next.mask ? previous : next);
  }, [layer, customZIndex, parent]);

  const merge = (base: { wrapper?: CSSProperties; mask?: CSSProperties } | undefined) => value ? {
    ...base, wrapper: { ...base?.wrapper, zIndex: value.panel }, mask: { ...base?.mask, zIndex: value.mask },
  } : base;
  const mergedStyles = typeof styles === 'function'
    ? (info: Parameters<typeof styles>[0]) => merge(styles(info))
    : merge(styles);
  return { value, styles: mergedStyles };
}
