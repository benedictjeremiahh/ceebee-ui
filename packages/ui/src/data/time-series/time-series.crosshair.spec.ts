import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mountTimeSeries } from './time-series.chart.js';
import { readableDay } from './time-series.math.js';

const chartState = vi.hoisted(() => {
  const options: { localization?: { priceFormatter?: (value: number) => string; timeFormatter?: (time: unknown) => string } }[] = [];
  return { options };
});

vi.mock('lightweight-charts', () => ({
  BaselineSeries: {},
  ColorType: { Solid: 'solid' },
  LineSeries: {},
  LineStyle: { Dashed: 1, Solid: 0 },
  createChart: (_host: HTMLElement, options: (typeof chartState.options)[number]) => {
    chartState.options.push(options);
    return {
      addSeries: () => ({ applyOptions: () => undefined, setData: () => undefined }),
      applyOptions: (next: (typeof chartState.options)[number]) => chartState.options.push(next),
      remove: () => undefined,
      timeScale: () => ({ fitContent: () => undefined }),
    };
  },
  createSeriesMarkers: () => ({ setMarkers: () => undefined }),
}));

describe('time-series crosshair localization', () => {
  beforeEach(() => chartState.options.splice(0));

  it('formats crosshair days in the chart locale and retains that formatter across palette updates', async () => {
    const format = (value: number) => `IDR ${value}`;
    const formatDay = (day: string) => readableDay(day, 'id-ID');
    const chart = await mountTimeSeries(
      document.createElement('div'),
      {
        series: [{ key: 'sales', label: 'Sales', points: [], colorToken: '--cb-tone-brand' }],
        format,
        formatDay,
      },
      { text: 'text', muted: 'muted', grid: 'grid', background: 'background', font: 'font', series: ['series'], above: 'above', below: 'below' },
    );

    const firstLocalization = chartState.options[1]?.localization;
    expect(firstLocalization?.priceFormatter?.(1250)).toBe('IDR 1250');
    expect(firstLocalization?.timeFormatter?.('2026-10-09')).toBe('9 Okt 2026');
    expect(firstLocalization?.timeFormatter?.({ year: 2026, month: 10, day: 9 })).toBe('9 Okt 2026');
    expect(firstLocalization?.timeFormatter?.(Date.UTC(2026, 9, 9) / 1000)).toBe('9 Okt 2026');

    chart.applyPalette({ text: 'text-2', muted: 'muted-2', grid: 'grid-2', background: 'background-2', font: 'font-2', series: ['series-2'], above: 'above-2', below: 'below-2' });
    const updatedLocalization = chartState.options.at(-1)?.localization;
    expect(updatedLocalization?.priceFormatter?.(1250)).toBe('IDR 1250');
    expect(updatedLocalization?.timeFormatter?.('2026-10-09')).toBe('9 Okt 2026');
    chart.destroy();
  });

  it('leaves the substrate date formatter in place when no product formatter is supplied', async () => {
    await mountTimeSeries(
      document.createElement('div'),
      {
        series: [{ key: 'sales', label: 'Sales', points: [], colorToken: '--cb-tone-brand' }],
        format: (value) => String(value),
      },
      { text: 'text', muted: 'muted', grid: 'grid', background: 'background', font: 'font', series: ['series'], above: 'above', below: 'below' },
    );

    expect(chartState.options[1]?.localization?.timeFormatter).toBeUndefined();
  });
});
