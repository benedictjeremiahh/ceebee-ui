import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ScheduleBar } from './schedule-bar.js';
import { scheduleRows } from './schedule.math.js';

describe('ScheduleBar', () => {
  it('distinguishes reported zero from unknown progress without inventing a reporting marker', () => {
    const unknown = scheduleRows(
      [{ id: 'u', label: 'Unknown', start: '2026-01-05', end: '2026-01-09' }],
      undefined,
      'physical'
    )[0];
    const zero = scheduleRows(
      [{ id: 'z', label: 'Zero', start: '2026-01-05', end: '2026-01-09', progress: 0, reportedOn: '2026-01-06' }],
      undefined,
      'physical'
    )[0];
    if (!unknown || !zero) throw new Error('Expected both rows');
    const unreported = render(<ScheduleBar row={unknown} mode="physical" description="Unknown, not reported" />);
    expect(unreported.container.querySelector('[data-unreported]')).not.toBeNull();
    expect(unreported.container.querySelector('.cb-schedule__bar-fill')).toBeNull();
    expect(unreported.container.querySelector('.cb-schedule__bar-report')).toBeNull();
    const reportedZero = render(<ScheduleBar row={zero} mode="physical" description="Zero, 0% reported" />);
    expect(reportedZero.container.querySelector('[data-unreported]')).toBeNull();
    expect(reportedZero.container.querySelector('.cb-schedule__bar-fill')).toHaveStyle({ inlineSize: '0%' });
    expect(reportedZero.container.querySelector('.cb-schedule__bar-report')).not.toBeNull();
  });
  it('draws physical progress inside the plan even when all reports share a single day', () => {
    const row = scheduleRows(
      [
        {
          id: 'a',
          label: 'Slab',
          start: '2026-01-05',
          end: '2026-01-09',
          progress: 0.7,
          reportedOn: '2026-01-10',
          latenessDays: 1,
        },
      ],
      '2026-01-12',
      'physical'
    )[0];
    if (!row) throw new Error('Expected a row');
    const { container } = render(
      <ScheduleBar row={row} mode="physical" description="Slab, 70% physical completion, reported January 10" />
    );
    expect(screen.getByRole('img')).toHaveAccessibleName(/70% physical completion/);
    expect(container.querySelector('.cb-schedule__bar-fill')).toHaveStyle({
      inlineSize: `${row.planned.width * 0.7}%`,
    });
    expect(container.querySelector('.cb-schedule__bar-report')).not.toBeNull();
    expect(container.querySelector('.cb-schedule__bar-actual')).toBeNull();
  });
});
