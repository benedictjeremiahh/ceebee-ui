import { describe, expect, it, vi } from 'vitest';
import { cashFlowPlot, mountCashFlow } from './cash-flow.chart.js';

const chartEvents = vi.hoisted(() => {
  type EventHandler = (event: { time?: string; point?: { x: number; y: number } }) => void;
  return {
    hover: vi.fn<(handler: EventHandler) => void>(),
    click: vi.fn<(handler: EventHandler) => void>(),
    unsubscribeHover: vi.fn(),
    unsubscribeClick: vi.fn(),
    setCrosshair: vi.fn(),
    clearCrosshair: vi.fn(),
  };
});

vi.mock('lightweight-charts', () => ({
  ColorType: { Solid: 'solid' },
  HistogramSeries: {},
  LineSeries: {},
  LineStyle: { Dashed: 1 },
  createChart: () => ({
    addSeries: () => ({ applyOptions: vi.fn(), setData: vi.fn(), priceToCoordinate: () => 20, createPriceLine: vi.fn() }),
    applyOptions: vi.fn(),
    remove: vi.fn(),
    subscribeCrosshairMove: chartEvents.hover,
    unsubscribeCrosshairMove: chartEvents.unsubscribeHover,
    subscribeClick: chartEvents.click,
    unsubscribeClick: chartEvents.unsubscribeClick,
    setCrosshairPosition: chartEvents.setCrosshair,
    clearCrosshairPosition: chartEvents.clearCrosshair,
    timeScale: () => ({ fitContent: vi.fn(), timeToCoordinate: () => 40 }),
  }),
  createSeriesMarkers: () => ({ setMarkers: vi.fn() }),
}));

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

describe('CashFlowChart plot events', () => {
  it('reports dated clicks as inspections without changing hover and removes both listeners', async () => {
    const plot = cashFlowPlot(50, [{ id: 'week', start: '2026-09-28', inflow: 0, outflow: 30, net: -30, balance: 20, lowest: 20 }]);
    const onHover = vi.fn();
    const onInspect = vi.fn();
    const mounted = await mountCashFlow(document.createElement('div'), plot, String, day => day, 0, null,
      { background: 'white', text: 'black', grid: 'gray', muted: 'gray', inflow: 'green', outflow: 'red', balance: 'blue', font: 'sans-serif' },
      onHover, onInspect);
    const hover = chartEvents.hover.mock.calls.at(-1)?.[0];
    const click = chartEvents.click.mock.calls.at(-1)?.[0];
    const period = { time: plot.inflow[0]?.time, point: { x: 43, y: 24 } };
    const opening = { time: plot.balance[0]?.time, point: { x: 4, y: 20 } };
    try {
      click?.(opening);
      click?.(period);
      hover?.(period);
      hover?.({});
      mounted.highlight(0);
      expect(chartEvents.setCrosshair).toHaveBeenCalledWith(20, period.time, expect.anything());
      mounted.highlight(null);
      expect(chartEvents.clearCrosshair).toHaveBeenCalledOnce();
      expect(onInspect.mock.calls).toEqual([[null], [0]]);
      expect(onHover.mock.calls).toEqual([[0, { x: 40, y: 24 }], [null, null]]);
    } finally {
      mounted.destroy();
    }
    expect(chartEvents.unsubscribeClick).toHaveBeenCalledWith(click);
    expect(chartEvents.unsubscribeHover).toHaveBeenCalledWith(hover);
  });
});
