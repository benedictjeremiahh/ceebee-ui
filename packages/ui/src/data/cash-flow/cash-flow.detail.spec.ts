import { describe, expect, it } from 'vitest';
import { cashFlowDetailPosition } from './cash-flow.detail.js';

describe('cashFlowDetailPosition', () => {
  it('stays beside the active period rather than at the opposite chart edge', () => {
    expect(cashFlowDetailPosition({ x: 600, y: 40 }, { width: 1000, height: 240 }, { width: 230, height: 140 }, 8))
      .toEqual({ left: 608, top: 48 });
  });

  it('flips at the right and bottom edges without clipping', () => {
    expect(cashFlowDetailPosition({ x: 950, y: 220 }, { width: 1000, height: 240 }, { width: 230, height: 140 }, 8))
      .toEqual({ left: 712, top: 72 });
  });

  it('clamps an oversized reading to the available chart inset', () => {
    expect(cashFlowDetailPosition({ x: 20, y: 20 }, { width: 200, height: 120 }, { width: 230, height: 140 }, 8))
      .toEqual({ left: 8, top: 8 });
  });
});
