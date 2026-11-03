import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ModalLayerProvider, useModalLayer } from './modal-layer.js';

const tokens = {
  '--cb-z-modal': '300', '--cb-z-modal-backdrop': '200',
  '--cb-z-modal-above-drawer': '1500', '--cb-z-modal-above-drawer-backdrop': '1400',
};
const originals = new Map<string, string>();
beforeEach(() => {
  for (const [name, value] of Object.entries(tokens)) {
    originals.set(name, document.documentElement.style.getPropertyValue(name));
    document.documentElement.style.setProperty(name, value);
  }
});
afterEach(() => {
  for (const [name, value] of originals) {
    if (value) document.documentElement.style.setProperty(name, value);
    else document.documentElement.style.removeProperty(name);
  }
  originals.clear();
});

describe('modal layer ancestry', () => {
  it('puts the child backdrop between its parent and its panel', () => {
    const { result } = renderHook(() => useModalLayer('page', undefined, undefined), {
      wrapper: ({ children }) => <ModalLayerProvider value={{ panel: 300, mask: 200 }}>{children}</ModalLayerProvider>,
    });
    expect(result.current.value?.mask).toBeGreaterThan(300);
    expect(result.current.value?.panel).toBeGreaterThan(result.current.value?.mask ?? Infinity);
  });

  it('composes with an elevated parent rather than falling back to the page layer', () => {
    const { result } = renderHook(() => useModalLayer('above-drawer', undefined, undefined), {
      wrapper: ({ children }) => <ModalLayerProvider value={{ panel: 1500, mask: 1400 }}>{children}</ModalLayerProvider>,
    });
    expect(result.current.value?.mask).toBeGreaterThan(1500);
    expect(result.current.value?.panel).toBeGreaterThan(result.current.value?.mask ?? Infinity);
  });

  it('retains caller styling while owning only panel/backdrop order', () => {
    const { result } = renderHook(() => useModalLayer('page', undefined, {
      body: { overflow: 'auto' }, wrapper: { pointerEvents: 'auto' }, mask: { cursor: 'default' },
    }));
    expect(result.current.styles).toMatchObject({ body: { overflow: 'auto' },
      wrapper: { pointerEvents: 'auto' }, mask: { cursor: 'default' } });
  });

  it('does not let an explicit lower child index paint behind its parent', () => {
    const { result } = renderHook(() => useModalLayer('page', 100, undefined), {
      wrapper: ({ children }) => <ModalLayerProvider value={{ panel: 1700, mask: 1600 }}>{children}</ModalLayerProvider>,
    });
    expect(result.current.value?.mask).toBeGreaterThan(1700);
  });

  it('does not lower an explicit above-drawer layer beneath its semantic base', () => {
    const { result } = renderHook(() => useModalLayer('above-drawer', 100, undefined));
    expect(result.current.value?.panel).toBeGreaterThanOrEqual(1500);
  });
});
