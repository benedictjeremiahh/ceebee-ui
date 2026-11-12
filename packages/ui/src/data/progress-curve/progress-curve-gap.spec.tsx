import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressCurve } from './progress-curve';

describe('ProgressCurve fractional gaps', () => {
  it.each([
    { actual: 14.25, direction: 'behind plan', state: 'behind' },
    { actual: 14.33, direction: 'ahead of plan', state: 'ahead' },
  ])('keeps a small $state gap nonzero in the default reading', ({ actual, direction, state }) => {
    render(<ProgressCurve label="Site progress"
      planned={[{ day: '2026-09-01', percent: 14.29 }]}
      actual={[{ day: '2026-09-01', percent: actual }]} />);
    const reading = screen.getByText(new RegExp(direction));
    expect(reading).toHaveTextContent(`less than 0.1 points ${direction}`);
    expect(reading).toHaveAttribute('data-state', state);
    expect(reading).not.toHaveTextContent('0 points');
  });

  it('reads the gap on each selected date and leaves a future plan-only point unqualified', () => {
    render(<ProgressCurve label="Site progress"
      planned={[
        { day: '2026-09-01', percent: 10.53 }, { day: '2026-09-08', percent: 20 },
        { day: '2026-09-15', percent: 30 }, { day: '2026-09-22', percent: 40 },
      ]}
      actual={[
        { day: '2026-09-01', percent: 8.41 }, { day: '2026-09-08', percent: 23 },
        { day: '2026-09-15', percent: 30 },
      ]}
      formatDetailNumber={value => value.toFixed(2).replace('.', ',')}
      gapUnitLabel="poin" behindLabel="tertinggal" aheadLabel="di atas rencana" onTrackLabel="sesuai rencana" />);
    const chart = screen.getByRole('img', { name: 'Site progress' });
    for (const text of ['2,12 poin tertinggal', '3,00 poin di atas rencana', 'sesuai rencana']) {
      fireEvent.keyDown(chart, { key: 'ArrowRight' });
      expect(screen.getByRole('status')).toHaveTextContent(text);
    }
    fireEvent.keyDown(chart, { key: 'ArrowRight' });
    const future = screen.getByRole('status');
    expect(future).toHaveTextContent('Actual—');
    expect(future).not.toHaveTextContent(/poin|sesuai rencana/);
  });

  it('lets a consumer format the gap magnitude independently from progress percentages', () => {
    const magnitudes: number[] = [];
    render(<ProgressCurve label="Site progress"
      planned={[{ day: '2026-09-01', percent: 14.29 }]}
      actual={[{ day: '2026-09-01', percent: 14.25 }]}
      formatNumber={(value) => value.toFixed(1).replace('.', ',')}
      formatGapNumber={(value) => {
        magnitudes.push(value);
        return 'under 0,1';
      }}
      gapUnitLabel="pp" behindLabel="behind" />);
    expect(screen.getByText(/under/)).toHaveTextContent('14,3% actual · 14,3% planned · under 0,1 pp behind');
    expect(magnitudes[0]).toBeCloseTo(0.04, 8);
    expect(magnitudes[0]).toBeGreaterThan(0);
  });

  it('retains the custom summary formatter for the gap when no gap formatter is supplied', () => {
    render(<ProgressCurve label="Site progress"
      planned={[{ day: '2026-09-01', percent: 14.29 }]}
      actual={[{ day: '2026-09-01', percent: 14.25 }]}
      formatNumber={(value) => value.toFixed(2).replace('.', ',')} />);
    expect(screen.getByText(/behind plan/)).toHaveTextContent('0,04 points behind plan');
  });

  it('reserves on-plan wording for an exact zero gap', () => {
    render(<ProgressCurve label="Site progress"
      planned={[{ day: '2026-09-01', percent: 14.29 }]}
      actual={[{ day: '2026-09-01', percent: 14.29 }]} />);
    const reading = screen.getByText(/on plan/);
    expect(reading).toHaveTextContent('0 points on plan');
    expect(reading).toHaveAttribute('data-state', 'on-plan');
  });
});
