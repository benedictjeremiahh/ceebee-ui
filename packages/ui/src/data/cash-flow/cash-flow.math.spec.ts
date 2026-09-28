import { describe, expect, it } from 'vitest';
import { cashFlowReading, cashFlowRows } from './cash-flow.math.js';

const PERIODS = [
  { id: 'w1', start: '2026-09-28', inflow: 0, outflow: 30 },
  { id: 'w2', start: '2026-10-05', inflow: 10, outflow: 40 },
  { id: 'w3', start: '2026-10-12', inflow: 120, outflow: 20 },
];

describe('cashFlowRows', () => {
  it('includes balance adjustments without calling them inflows or outflows', () => {
    expect(cashFlowRows(50, [{ id: 'a', start: '2026-09-28', inflow: 10, outflow: 5, adjustment: -20 }])[0])
      .toMatchObject({ inflow: 10, outflow: 5, net: -15, balance: 35 });
  });
  it('runs the balance from the opening balance through each period\'s net flow', () => {
    expect(cashFlowRows(50, PERIODS).map((row) => [row.id, row.net, row.balance])).toEqual([
      ['w1', -30, 20],
      ['w2', -30, -10],
      ['w3', 100, 90],
    ]);
  });

  it('reads an outflow given as a negative number as the same outflow', () => {
    expect(cashFlowRows(0, [{ id: 'a', start: '2026-09-28', inflow: 5, outflow: -3 }])[0]).toMatchObject({ outflow: 3, balance: 2 });
  });
});

describe('cashFlowReading', () => {
  it('finds the lowest balance, the first period below the line, and how many are below it', () => {
    expect(cashFlowReading(cashFlowRows(50, PERIODS), 0)).toEqual({ lowest: -10, lowestIndex: 1, firstBelowIndex: 1, periodsBelow: 1, closing: 90 });
  });

  it('counts a balance sitting exactly on the line as meeting it', () => {
    expect(cashFlowReading(cashFlowRows(30, PERIODS.slice(0, 1)), 0).periodsBelow).toBe(0);
  });

  it('reads nothing from no periods', () => {
    expect(cashFlowReading([], 0)).toEqual({ lowest: null, lowestIndex: null, firstBelowIndex: null, periodsBelow: 0, closing: null });
  });
});

describe('a dip inside a period', () => {
  it('reads a period\'s low against the line even when it closes above it', () => {
    const rows = cashFlowRows(50, [{ id: 'w1', start: '2026-09-28', inflow: 40, outflow: 30, low: -5 }]);
    expect(rows[0]).toMatchObject({ balance: 60, lowest: -5 });
    expect(cashFlowReading(rows, 0)).toMatchObject({ lowest: -5, firstBelowIndex: 0, periodsBelow: 1 });
  });

  it('ignores a low that is not lower than the close', () => {
    expect(cashFlowRows(50, [{ id: 'w1', start: '2026-09-28', inflow: 0, outflow: 10, low: 45 }])[0]?.lowest).toBe(40);
  });
});
