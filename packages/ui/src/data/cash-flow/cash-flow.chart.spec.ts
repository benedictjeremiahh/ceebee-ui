import { describe, expect, it } from 'vitest';
import { cashFlowPlot } from './cash-flow.chart.js';

describe('cashFlowPlot', () => {
  it('keeps the opening balance before the first period and plots each flow with its close', () => {
    const plot = cashFlowPlot(50, [
      { id: 'week-a', start: '2026-09-28', inflow: 0, outflow: 30, net: -30, balance: 20, lowest: 20 },
      { id: 'week-b', start: '2026-10-05', inflow: 10, outflow: 40, net: -30, balance: -10, lowest: -15 },
    ]);
    expect(plot.balance.map((point) => point.value)).toEqual([50, 20, -10]);
    expect(plot.inflow.map((point) => point.value)).toEqual([0, 10]);
    expect(plot.outflow.map((point) => point.value)).toEqual([-30, -40]);
    expect(plot.low.map((point) => point.value)).toEqual([20, -15]);
    expect(plot.balance[1]?.time).toBe(plot.inflow[0]?.time);
    expect(plot.balance[2]?.time).toBe(plot.inflow[1]?.time);
    expect(plot.labels.get(plot.balance[2]?.time ?? '')).toBe('2026-10-05');
    expect(plot.labels.get(plot.balance[0]?.time ?? '')).toBeUndefined();
  });

  it('keeps input order even for repeated calendar days', () => {
    const plot = cashFlowPlot(0, [
      { id: 'a', start: '2026-09-28', inflow: 1, outflow: 0, net: 1, balance: 1, lowest: 1 },
      { id: 'b', start: '2026-09-28', inflow: 2, outflow: 0, net: 2, balance: 3, lowest: 3 },
    ]);
    expect(plot.inflow[0]?.time).not.toBe(plot.inflow[1]?.time);
    expect(plot.labels.get(plot.inflow[1]?.time ?? '')).toBe('2026-09-28');
  });
});
