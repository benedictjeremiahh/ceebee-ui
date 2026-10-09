import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ScheduleCells, ScheduleProgressCell, ScheduleVarianceCell } from './schedule-cells.js';
import { scheduleHierarchy } from './schedule.hierarchy.js';
import { scheduleRows } from './schedule.math.js';
import type { ScheduleItem } from './schedule.types.js';
import { DEFAULT_SCHEDULE_LABELS } from './parts/schedule-defaults.js';

const items: ScheduleItem[] = [
  { id: 'unplanned', label: 'Unplanned', start: '2026-10-01', end: '2026-10-02', progress: 0.5 },
  { id: 'unreported', label: 'Unreported', start: '2026-10-01', end: '2026-10-02', plannedProgress: 0.5 },
  { id: 'on-plan', label: 'On plan', start: '2026-10-01', end: '2026-10-02', progress: 0.5, plannedProgress: 0.5 },
];

function Harness() {
  const hierarchy = scheduleHierarchy(items, new Set());
  const rows = scheduleRows(hierarchy.visible, undefined, 'physical');
  const labels = { ...DEFAULT_SCHEDULE_LABELS, unavailable: 'Reading unavailable' };

  return (
    <ScheduleCells rows={new Map(rows.map((row) => [row.item.id, row]))} text={labels}
      items={new Map(items.map((item) => [item.id, item]))} hierarchy={hierarchy}
      expanded={new Set()} onToggle={() => undefined}>
      <ScheduleProgressCell row={{ id: 'unplanned' }} />
      <ScheduleVarianceCell row={{ id: 'unreported' }} />
      <ScheduleVarianceCell row={{ id: 'on-plan' }} />
    </ScheduleCells>
  );
}

describe('Schedule reading cells', () => {
  it('labels missing planned progress as unavailable', () => {
    render(<Harness />);

    expect(screen.getByText('Planned Reading unavailable')).toBeInTheDocument();
    expect(screen.queryByText('Planned —')).toBeNull();
  });

  it('labels a missing progress gap as unavailable and preserves a measured zero gap', () => {
    render(<Harness />);

    expect(screen.getByText('Reading unavailable')).toBeInTheDocument();
    expect(screen.getByText('0.0 pp')).toBeInTheDocument();
    expect(screen.queryByText('—')).toBeNull();
  });
});
