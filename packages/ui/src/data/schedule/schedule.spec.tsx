import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Schedule } from './schedule.js';
import type { ScheduleLabels } from '../../client.js';

/* The substrate measures the DOM to lay its grid out, and jsdom has no layout — rendering the bars here
   throws inside SVAR's grid. The drawn rows are covered by `tests/browser/schedule.spec.ts`, which runs
   in a real browser; what is here is what the component decides before the substrate is involved. */

describe('Schedule', () => {
  it('keeps the original complete label shape source-compatible', () => {
    const labels: ScheduleLabels = {
      empty: 'Nothing planned.',
      item: 'Work item',
      today: 'Today',
      progress: (percent) => `${percent}% done`,
      actual: (start, end) => `actual ${start}–${end}`,
      notStarted: 'not started',
      overran: 'past the plan',
      late: 'late',
    };

    render(<Schedule items={[]} labels={labels} />);

    expect(screen.getByText('Nothing planned.')).toBeInTheDocument();
  });

  it('says so when there is nothing planned, rather than drawing an empty axis', () => {
    render(<Schedule items={[]} />);
    expect(screen.getByText('Nothing is planned yet.')).toBeInTheDocument();
  });

  it('takes an empty message from the caller', () => {
    render(<Schedule items={[]} labels={{ empty: 'Belum ada rencana.' }} />);
    expect(screen.getByText('Belum ada rencana.')).toBeInTheDocument();
  });
});
