import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useCellSize } from './diagram-flow.js';
import { FALLBACK_CELL } from './diagram.math.js';

/* jsdom has no layout, so the two widths are stubbed: the layout width the Token gives the cell, and the
   on-screen box an opening Modal's zoom shrinks. The grid must follow the first. */

afterEach(() => vi.restoreAllMocks());

const cellElement = (layoutWidth: number, screenWidth: number) => {
  const element = document.createElement('span');
  vi.spyOn(element, 'offsetWidth', 'get').mockReturnValue(layoutWidth);
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({ width: screenWidth } as DOMRect);
  return element;
};

describe('useCellSize', () => {
  it('reads the layout width, so a diagram mounted inside a zooming Modal keeps its full grid', () => {
    const ref = { current: cellElement(24, 5) };
    const { result } = renderHook(() => useCellSize(ref));
    expect(result.current).toBe(24);
  });

  it('falls back to the default cell when the element has no width yet', () => {
    const ref = { current: cellElement(0, 0) };
    const { result } = renderHook(() => useCellSize(ref));
    expect(result.current).toBe(FALLBACK_CELL);
  });
});
