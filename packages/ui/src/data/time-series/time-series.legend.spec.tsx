import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { TimeSeriesChart } from './time-series.js';
import type { SeriesSpec } from './time-series.types.js';

const series: SeriesSpec[] = [
  { key: 'plan', label: 'Plan', emphasis: 'reference', colorToken: '--cb-fg-subtle', points: [{ day: '2026-10-01', value: 100 }] },
  { key: 'actual', label: 'Actual', emphasis: 'primary', colorToken: '--cb-tone-brand', points: [{ day: '2026-10-01', value: 80 }] },
];

afterEach(cleanup);

describe('TimeSeriesChart legend', () => {
  it('leaves the legend to compositions unless explicitly requested', () => {
    render(<TimeSeriesChart label="Cost" series={series} format={String} />);
    expect(screen.queryByRole('list')).toBeNull();
  });

  it('names the plotted series with their reference or primary treatment', () => {
    render(<TimeSeriesChart label="Cost" series={series} format={String} showLegend legendLabel="Cost series" />);
    const legend = screen.getByRole('list', { name: 'Cost series' });
    const entries = within(legend).getAllByRole('listitem');
    expect(entries.map(entry => entry.textContent)).toEqual(['Plan', 'Actual']);
    expect(entries[0]?.getAttribute('data-emphasis')).toBe('reference');
    expect(entries[1]?.getAttribute('data-emphasis')).toBe('primary');
  });

  it('only names the first series when the chart uses a baseline', () => {
    render(<TimeSeriesChart label="Balance" series={series} baseline={{ value: 0 }} format={String} showLegend />);
    const legend = screen.getByRole('list', { name: 'Series' });
    expect(within(legend).getAllByRole('listitem').map(entry => entry.textContent)).toEqual(['Plan']);
  });

  it('does not label an empty or loading plot', () => {
    const view = render(<TimeSeriesChart label="Cost" series={[]} format={String} showLegend />);
    expect(screen.queryByRole('list')).toBeNull();
    view.rerender(<TimeSeriesChart label="Cost" series={series} format={String} showLegend loading />);
    expect(screen.queryByRole('list')).toBeNull();
  });
});
