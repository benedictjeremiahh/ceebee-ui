import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ScheduleBar } from './schedule-bar.js';
import { ScheduleMobileItems } from './schedule-mobile-items.js';
import { scheduleRows } from './schedule.math.js';
import { scheduleHierarchy } from './schedule.hierarchy.js';
import { DEFAULT_SCHEDULE_LABELS } from './parts/schedule-defaults.js';

const items = [
  { id: 'small', label: 'Small reading', start: '2026-01-05', end: '2026-01-09', progress: 0.0004 },
  { id: 'zero', label: 'Reported zero', start: '2026-01-05', end: '2026-01-09', progress: 0 },
  { id: 'unknown', label: 'Missing reading', start: '2026-01-05', end: '2026-01-09' },
];
const labels = {
  ...DEFAULT_SCHEDULE_LABELS,
  percent: (value: number) => `${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}%`,
  progress: (value: number) => `${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}% complete`,
};

describe('Schedule completion readings', () => {
  it('passes a small completion to spoken and visible bar formatters without rounding first', () => {
    const row = scheduleRows(items)[0];
    if (!row) throw new Error('Expected a schedule row');
    render(<ScheduleBar row={row} mode="physical" labels={labels} percentLabels />);
    expect(screen.getByRole('img')).toHaveAccessibleName('Small reading, 0.04% complete');
    expect(screen.getByText('0.04%')).toBeInTheDocument();
  });

  it('uses the percentage formatter for small readings and zero in the compact list', () => {
    const expanded = new Set<string>();
    render(<ScheduleMobileItems rows={scheduleRows(items)} text={labels}
      hierarchy={scheduleHierarchy(items, expanded)} expanded={expanded} onToggle={vi.fn()} />);
    expect(screen.getByText('0.04%')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('Not reported')).toBeInTheDocument();
  });

  it('keeps absent completion distinct from a spoken zero', () => {
    const row = scheduleRows(items)[2];
    if (!row) throw new Error('Expected an unreported row');
    render(<ScheduleBar row={row} mode="range" labels={labels} percentLabels />);
    expect(screen.getByRole('img')).toHaveAccessibleName('Missing reading, Not reported');
    expect(screen.queryByText('0%')).not.toBeInTheDocument();
  });
});
