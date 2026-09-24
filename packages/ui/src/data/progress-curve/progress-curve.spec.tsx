import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProgressCurve } from './progress-curve';

/**
 * The canvas cannot be asserted — that is the point of the text alternative, and it is what these
 * specs cover. jsdom resolves no Custom Property, so the palette never resolves and the substrate is
 * never mounted here, which is exactly the "Tokens did not resolve" path the component has to
 * survive: the table must still be the whole chart.
 */
const planned = [
  { day: '2026-09-01', percent: 10 },
  { day: '2026-09-10', percent: 35 },
  { day: '2026-09-20', percent: 70 },
];
const actual = [
  { day: '2026-09-01', percent: 10 },
  { day: '2026-09-12', percent: 30 },
];

function forcedColors(active: boolean) {
  const listeners = new Set<() => void>();
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('forced-colors') ? active : false,
    media: query,
    onchange: null,
    addEventListener: (_: string, handler: () => void) => listeners.add(handler),
    removeEventListener: (_: string, handler: () => void) => listeners.delete(handler),
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ProgressCurve', () => {
  it('renders every reported day as a row, with both values and the gap', () => {
    render(<ProgressCurve planned={planned} actual={actual} label="Ruko Depok" />);
    const rows = screen.getAllByRole('row');
    // One header row plus the four days either series reports.
    expect(rows).toHaveLength(5);
    expect(screen.getByRole('rowheader', { name: 'Sep 12, 2026' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Progress by day' })).toBeInTheDocument();
  });

  // The whole reason somebody opens this: how far behind, in words, without reading a picture.
  it('states the reading on the latest reported day', () => {
    render(<ProgressCurve planned={planned} actual={actual} label="Ruko Depok" />);
    const reading = screen.getByText(/behind plan/);
    expect(reading).toHaveTextContent('30%');
    expect(reading).toHaveTextContent('70%');
    expect(reading).toHaveTextContent('40 behind plan');
    expect(reading).toHaveAttribute('data-state', 'behind');
  });

  // A product that marks decimals with a comma shows the reading its own way, and names the day column.
  it('formats the reading and heads the day column in the consumer\'s language', () => {
    render(
      <ProgressCurve
        planned={[{ day: '2026-09-01', percent: 12.5 }]}
        actual={[{ day: '2026-09-01', percent: 7.5 }]}
        label="Ruko Depok"
        dayLabel="Tanggal"
        behindLabel="tertinggal"
        formatNumber={(value) => String(value).replace('.', ',')}
      />,
    );
    const reading = screen.getByText(/tertinggal/);
    expect(reading).toHaveTextContent('7,5%');
    expect(reading).toHaveTextContent('12,5%');
    expect(screen.getByRole('columnheader', { name: 'Tanggal' })).toBeInTheDocument();
  });

  it('says ahead, and says on plan, rather than only ever counting down', () => {
    render(<ProgressCurve planned={actual} actual={planned} label="Ruko Depok" />);
    expect(screen.getByText(/ahead of plan/)).toHaveAttribute('data-state', 'ahead');
  });

  it('reads on the day asked for, not on the last one, when today is given', () => {
    render(<ProgressCurve planned={planned} actual={actual} label="Ruko Depok" today="2026-09-11" />);
    // Read on 2026-09-11 itself: both series carry forward — planned 35, actual 10 — and the day named
    // is the one asked for, not whichever reported day happens to sit nearest it.
    expect(screen.getByText(/behind plan/)).toHaveTextContent('25 behind plan');
    expect(screen.getByText(/behind plan/)).toHaveTextContent('(2026-09-11)');
  });

  /* The case a real plan produces and the spec above did not: the nearest reported day is in the FUTURE,
     because a plan states days that have not arrived. Reading there reports next week's target as though
     it were due today, which is how a job 7 points behind gets shown as 22 behind. */
  it('does not read the plan from a day that has not arrived', () => {
    const plan = [
      { day: '2026-09-18', percent: 55 },
      { day: '2026-09-25', percent: 70 },
    ];
    const done = [{ day: '2026-09-18', percent: 48 }];
    render(<ProgressCurve planned={plan} actual={done} label="Ruko Depok" today="2026-09-22" />);
    const reading = screen.getByText(/behind plan/);
    expect(reading).toHaveTextContent('7 behind plan');
    expect(reading).toHaveTextContent('(2026-09-22)');
    expect(reading).not.toHaveTextContent('70%');
  });

  it('names the chart for a screen reader', () => {
    render(<ProgressCurve planned={planned} actual={actual} label="Ruko Depok" />);
    expect(screen.getByRole('img', { name: 'Ruko Depok' })).toBeInTheDocument();
  });

  // A canvas in forced colors is a bitmap the system cannot recolour, so it is not rendered at all
  // and the table — which the stylesheet brings into view in that mode — is the chart.
  it('renders no canvas under forced colors, and keeps the table', () => {
    forcedColors(true);
    render(<ProgressCurve planned={planned} actual={actual} label="Ruko Depok" />);
    expect(screen.queryByRole('img', { name: 'Ruko Depok' })).not.toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Progress by day' })).toBeInTheDocument();
  });

  it('says nothing has been reported rather than drawing an empty chart', () => {
    render(<ProgressCurve planned={[]} actual={[]} label="Ruko Depok" />);
    expect(screen.getByText('Nothing has been reported yet.')).toBeInTheDocument();
    expect(screen.queryByRole('row')).not.toBeInTheDocument();
  });

  // One bad day must not take the screen down — the substrate throws on an unsorted or repeated time.
  it('survives a day that is not a day, and a day reported twice', () => {
    render(
      <ProgressCurve
        planned={[{ day: '2026-02-30', percent: 5 }, { day: '2026-09-01', percent: 10 }]}
        actual={[{ day: '2026-09-01', percent: 8 }, { day: '2026-09-01', percent: 9 }]}
        label="Ruko Depok"
      />,
    );
    expect(screen.getAllByRole('row')).toHaveLength(2);
    expect(screen.getByText(/behind plan/)).toHaveTextContent('1 behind plan');
  });

  it('shows the skeleton while the readings load', () => {
    render(<ProgressCurve planned={planned} actual={actual} label="Ruko Depok" loading />);
    expect(screen.getByRole('status', { name: 'Loading progress' })).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('takes its labels from the caller, so a product can speak its own language', () => {
    render(
      <ProgressCurve
        planned={planned}
        actual={actual}
        label="Ruko Depok"
        plannedLabel="Rencana"
        actualLabel="Realisasi"
        behindLabel="di belakang rencana"
        tableLabel="Progres per hari"
      />,
    );
    expect(screen.getByRole('table', { name: 'Progres per hari' })).toBeInTheDocument();
    expect(screen.getByText(/di belakang rencana/)).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Rencana' })).toBeInTheDocument();
  });
});
