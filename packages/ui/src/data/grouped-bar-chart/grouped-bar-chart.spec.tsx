import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GroupedBarChart } from './grouped-bar-chart.js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const groups = [
  { id: 'first', label: 'First week', values: { incoming: 2000, outgoing: 500, accrued: null } },
  { id: 'second', label: 'Second week', values: { incoming: 0, outgoing: 250, accrued: 100 } },
];
const series = [
  { key: 'incoming', label: 'Due invoices', tone: 'brand' as const },
  { key: 'outgoing', label: 'Vendor liabilities', tone: 'warning' as const },
  { key: 'accrued', label: 'Accrued wages', tone: 'neutral' as const },
];
const format = (value: number) => `${value / 1000}K`;
const exact = (value: number) => value.toLocaleString('en-US');

describe('GroupedBarChart', () => {
  it('uses one zero-based scale for all groups without deriving a balance', () => {
    const { container } = render(<GroupedBarChart label="Due amounts" groups={groups} series={series} format={format} />);
    const bars = [...container.querySelectorAll('.cb-grouped-bars__bar')];
    expect(bars.map((bar) => bar.getAttribute('style'))).toEqual([
      'height: 100%;', 'height: 25%;', 'height: 0%;', 'height: 0%;', 'height: 12.5%;', 'height: 5%;',
    ]);
    expect(screen.queryByText(/balance/i)).not.toBeInTheDocument();
  });

  it('preserves unknown readings and exposes exact values in its accessible table', () => {
    render(<GroupedBarChart label="Due amounts" groups={groups} series={series} format={format} formatExact={exact} unknownLabel="Unknown" tableLabel="Weekly readings" />);
    const table = screen.getByRole('table', { name: 'Weekly readings' });
    expect(within(table).getAllByRole('row')[1]).toHaveTextContent('First week2,000500Unknown');
    expect(screen.getByRole('img', { name: 'First week: Due invoices 2,000, Vendor liabilities 500, Accrued wages Unknown' })).toHaveAttribute('tabindex', '0');
  });

  it('reveals full precision on keyboard focus without a fake click action', async () => {
    render(<GroupedBarChart label="Due amounts" groups={groups} series={series} format={format} formatExact={exact} />);
    fireEvent.focus(screen.getByRole('img', { name: /First week: Due invoices 2,000/ }));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Due invoices2,000');
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('handles all-zero and invalid readings without infinite geometry', () => {
    const { container } = render(<GroupedBarChart label="Zero amounts" groups={[{ id: 'zero', label: 'Zero', values: { incoming: 0, outgoing: NaN, accrued: -5 } }]} series={series} format={exact} unknownLabel="Unknown" />);
    expect(container.innerHTML).not.toMatch(/height: (NaN|Infinity)/);
    expect(screen.getByRole('table')).toHaveTextContent('Zero0UnknownUnknown');
  });

  it('provides empty and matching skeleton renderings', () => {
    const { rerender } = render(<GroupedBarChart label="Due amounts" groups={[]} series={series} format={format} emptyLabel="Nothing due" />);
    expect(screen.getByText('Nothing due')).toBeInTheDocument();
    rerender(<GroupedBarChart.Skeleton label="Loading due amounts" />);
    expect(screen.getByRole('status')).toHaveAccessibleName('Loading due amounts');
  });

  it('paints the skeleton instead of reserving invisible blank space', () => {
    const css = readFileSync(join(process.cwd(), 'packages/ui/src/data/grouped-bar-chart/grouped-bar-chart.css'), 'utf8');
    expect(css).toContain('.cb-grouped-bars__skeleton-fill');
    render(<GroupedBarChart.Skeleton />);
    expect(screen.getByRole('status').querySelectorAll('.cb-grouped-bars__skeleton-fill')).toHaveLength(2);
  });
});
