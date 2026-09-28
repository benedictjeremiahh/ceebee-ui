import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Schedule } from './schedule.js';
import type { ScheduleLabels } from '../../client.js';

/* The substrate measures the DOM to lay its grid out, and jsdom has no layout — rendering the bars here
   throws inside SVAR's grid. The drawn rows are covered by `tests/browser/schedule.spec.ts`, which runs
   in a real browser; what is here is what the component decides before the substrate is involved. */

describe('Schedule', () => {
  it('contains the toolbar, legend and details in its expanded reading region', () => {
    const context = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    render(<Schedule items={[{ id: 'a', label: 'Work', start: '2026-09-01', end: '2026-09-30' }]}
      fullscreen label="Work schedule" toolbar={<button>Sort work</button>}
      footer={<span>Physical progress legend</span>}><span>Item details</span></Schedule>);
    const region = screen.getByRole('region', { name: 'Work schedule' });
    fireEvent.click(screen.getByRole('button', { name: 'Expand view' }));
    expect(region).toHaveAttribute('data-fullscreen', 'window');
    expect(region).toContainElement(screen.getByRole('button', { name: 'Sort work' }));
    expect(region).toContainElement(screen.getByText('Physical progress legend'));
    expect(region).toContainElement(screen.getByText('Item details'));
    fireEvent.keyDown(region, { key: 'Escape' });
    expect(region).toHaveAttribute('data-fullscreen', 'inline');
    context.mockRestore();
  });
  it('provides a labelled loading placeholder at the same chart height', () => {
    render(<Schedule.Skeleton height={300} label="Loading physical schedule" />);
    expect(screen.getByRole('status')).toHaveAccessibleName('Loading physical schedule');
  });
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
