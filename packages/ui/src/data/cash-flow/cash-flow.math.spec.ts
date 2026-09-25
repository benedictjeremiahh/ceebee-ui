import { describe, expect, it } from 'vitest';
import { cashFlowReading, cashFlowRows, cashFlowScale, heightOf } from './cash-flow.math.js';

const PERIODS = [
  { id: 'w1', start: '2026-09-28', inflow: 0, outflow: 30 },
  { id: 'w2', start: '2026-10-05', inflow: 10, outflow: 40 },
  { id: 'w3', start: '2026-10-12', inflow: 120, outflow: 20 },
];

describe('cashFlowRows', () => {
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

describe('cashFlowScale', () => {
  it('holds every bar, every balance and zero, on round ticks', () => {
    const scale = cashFlowScale(cashFlowRows(50, PERIODS));
    // Outflows reach −40, inflows 120, balances −10…90.
    expect(scale.min).toBeLessThanOrEqual(-40);
    expect(scale.max).toBeGreaterThanOrEqual(120);
    expect(scale.ticks).toContain(0);
    for (const tick of scale.ticks) expect(Math.abs(tick % scale.step)).toBe(0);
  });

  it('gives an all-zero set a span so nothing divides by zero', () => {
    const scale = cashFlowScale(cashFlowRows(0, [{ id: 'a', start: '2026-09-28', inflow: 0, outflow: 0 }]));
    expect(scale.max).toBeGreaterThan(scale.min);
  });
});

describe('heightOf', () => {
  it('places a value as a percentage up the plot', () => {
    const scale = { min: -50, max: 150, step: 50, ticks: [-50, 0, 50, 100, 150] };
    expect(heightOf(-50, scale)).toBe(0);
    expect(heightOf(0, scale)).toBe(25);
    expect(heightOf(150, scale)).toBe(100);
  });
});

describe('a dip inside a period', () => {
  it('reads a period\'s low against the line even when it closes above it', () => {
    const rows = cashFlowRows(50, [{ id: 'w1', start: '2026-09-28', inflow: 40, outflow: 30, low: -5 }]);
    expect(rows[0]).toMatchObject({ balance: 60, lowest: -5 });
    expect(cashFlowReading(rows, 0)).toMatchObject({ lowest: -5, firstBelowIndex: 0, periodsBelow: 1 });
    expect(cashFlowScale(rows).min).toBeLessThanOrEqual(-5);
  });

  it('ignores a low that is not lower than the close', () => {
    expect(cashFlowRows(50, [{ id: 'w1', start: '2026-09-28', inflow: 0, outflow: 10, low: 45 }])[0]?.lowest).toBe(40);
  });
});
