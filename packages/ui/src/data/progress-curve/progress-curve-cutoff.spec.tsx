import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressCurve } from './progress-curve';

describe('ProgressCurve reported-date boundary', () => {
  it('keeps the latest summary but does not project actual values onto later planned dates', () => {
    render(
      <ProgressCurve
        label="Site progress"
        today="2026-09-15"
        planned={[
          { day: '2026-09-01', percent: 10 },
          { day: '2026-09-10', percent: 35 },
          { day: '2026-09-20', percent: 70 },
        ]}
        actual={[
          { day: '2026-09-01', percent: 10 },
          { day: '2026-09-12', percent: 30 },
        ]}
      />,
    );

    const beforeLastReport = screen.getByRole('row', { name: /Sep 10, 2026/ });
    expect(within(beforeLastReport).getAllByRole('cell').map((cell) => cell.textContent)).toEqual(['35%', '10%']);
    const lastReport = screen.getByRole('row', { name: /Sep 12, 2026/ });
    expect(within(lastReport).getAllByRole('cell').map((cell) => cell.textContent)).toEqual(['35%', '30%']);
    const futurePlan = screen.getByRole('row', { name: /Sep 20, 2026/ });
    expect(within(futurePlan).getAllByRole('cell').map((cell) => cell.textContent)).toEqual(['70%', '-']);
    expect(screen.getByText(/behind plan/)).toHaveTextContent('30% actual · 35% planned');
  });

  it('preserves a reported zero on its day and leaves later actual cells unavailable', () => {
    render(
      <ProgressCurve
        label="Site progress"
        planned={[
          { day: '2026-09-01', percent: 10 },
          { day: '2026-09-02', percent: 20 },
        ]}
        actual={[{ day: '2026-09-01', percent: 0 }]}
      />,
    );

    const reported = screen.getByRole('row', { name: /Sep 1, 2026/ });
    expect(within(reported).getAllByRole('cell').map((cell) => cell.textContent)).toEqual(['10%', '0%']);
    const futurePlan = screen.getByRole('row', { name: /Sep 2, 2026/ });
    expect(within(futurePlan).getAllByRole('cell').map((cell) => cell.textContent)).toEqual(['20%', '-']);
  });
});
