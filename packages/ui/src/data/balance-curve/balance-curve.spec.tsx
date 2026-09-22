import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BalanceCurve } from './balance-curve';

/**
 * The canvas cannot be asserted — that is the point of the text alternative, and it is what these
 * specs cover. jsdom resolves no Custom Property, so the palette never resolves and the substrate is
 * never mounted here, which is exactly the "Tokens did not resolve" path the component has to survive:
 * the table must still be the whole chart.
 */
const rupiah = (value: number) => `Rp ${new Intl.NumberFormat('id-ID').format(Math.round(value))}`;

const projection = [
  { day: '2026-09-22', value: 40_980_000 },
  { day: '2026-09-23', value: -2_810_000 },
  { day: '2026-09-29', value: -2_810_000 },
  { day: '2026-09-30', value: 355_990_000 },
];

function forcedColors(active: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('forced-colors') ? active : false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('BalanceCurve', () => {
  it('says the day it goes under and the lowest it gets, before drawing anything', () => {
    render(<BalanceCurve label="Kas 30 hari" balances={projection} format={rupiah} />);
    const reading = screen.getByText(/Below the line/);
    expect(reading).toHaveTextContent('2026-09-23');
    expect(reading).toHaveTextContent('-2.810.000');
    expect(reading).toHaveAttribute('data-state', 'below');
  });

  it('says so when it stays above the line, rather than staying silent', () => {
    render(<BalanceCurve label="Kas" balances={[{ day: '2026-09-22', value: 5_000 }]} format={rupiah} />);
    expect(screen.getByText(/Stays above the line/)).toHaveAttribute('data-state', 'clear');
  });

  /* The threshold is why this is not hard-coded to zero: the same projection breaches immediately
     against a buffer a business must keep on hand. */
  it('reads against a buffer when one is given', () => {
    render(
      <BalanceCurve label="Kas" balances={projection} format={rupiah} threshold={{ value: 50_000_000, label: 'buffer 50 jt' }} />,
    );
    expect(screen.getByText(/Below the line/)).toHaveTextContent('2026-09-22');
    expect(screen.getByText('buffer 50 jt')).toBeInTheDocument();
  });

  it('renders every day as a row of the accessible table, formatted by the caller', () => {
    render(<BalanceCurve label="Kas 30 hari" balances={projection} format={rupiah} seriesLabel="Sisa" />);
    expect(screen.getByRole('table', { name: 'Balance by day' })).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(5); // header + four days
    expect(screen.getByRole('columnheader', { name: 'Sisa' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: '2026-09-30' })).toBeInTheDocument();
  });

  it('names the chart for a screen reader', () => {
    render(<BalanceCurve label="Kas 30 hari" balances={projection} format={rupiah} />);
    expect(screen.getByRole('img', { name: 'Kas 30 hari' })).toBeInTheDocument();
  });

  it('renders no canvas under forced colors, and keeps the table', () => {
    forcedColors(true);
    render(<BalanceCurve label="Kas 30 hari" balances={projection} format={rupiah} />);
    expect(screen.queryByRole('img', { name: 'Kas 30 hari' })).not.toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Balance by day' })).toBeInTheDocument();
  });

  it('says there is nothing to project rather than drawing an empty chart', () => {
    render(<BalanceCurve label="Kas" balances={[]} format={rupiah} />);
    expect(screen.getByText('Nothing to project yet.')).toBeInTheDocument();
    expect(screen.queryByRole('row')).not.toBeInTheDocument();
  });

  it('survives a day that is not a day, and a day reported twice', () => {
    render(
      <BalanceCurve
        label="Kas"
        balances={[
          { day: '2026-02-30', value: -999 },
          { day: '2026-09-22', value: 100 },
          { day: '2026-09-22', value: 250 },
        ]}
        format={rupiah}
      />,
    );
    expect(screen.getAllByRole('row')).toHaveLength(2);
    expect(screen.getByText(/Stays above the line/)).toHaveTextContent('250');
  });

  it('shows the skeleton while the balances load', () => {
    render(<BalanceCurve label="Kas" balances={projection} format={rupiah} loading />);
    expect(screen.getByRole('status', { name: 'Loading balance' })).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('takes its wording from the caller, so a product can speak its own language', () => {
    render(
      <BalanceCurve
        label="Kas"
        balances={projection}
        format={rupiah}
        tableLabel="Saldo per hari"
        belowLabel={(from, lowest, days) => `Kas minus mulai ${from}, terendah ${lowest}, ${days} hari`}
      />,
    );
    expect(screen.getByRole('table', { name: 'Saldo per hari' })).toBeInTheDocument();
    expect(screen.getByText(/Kas minus mulai 2026-09-23/)).toBeInTheDocument();
  });
});
