import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { scheduleHierarchy } from '../schedule.hierarchy.js';
import { scheduleRows } from '../schedule.math.js';
import { ScheduleMobileItems } from '../schedule-mobile-items.js';
import type { ScheduleEntry } from '../schedule.types.js';
import { DEFAULT_SCHEDULE_LABELS } from './schedule-defaults.js';

const items: ScheduleEntry[] = [
  { id: 'parent', label: 'Foundation', start: '2026-09-14', end: '2026-09-28' },
  { id: 'dated', label: 'Footing', parentId: 'parent', start: '2026-09-14', end: '2026-09-20' },
  { id: 'undated', label: 'Slab', parentId: 'parent', unscheduled: true },
];

describe('Schedule mobile items', () => {
  it('keeps an undated child in order without fabricating progress and opens its own detail', () => {
    const expanded = new Set(['parent']);
    const hierarchy = scheduleHierarchy(items, expanded);
    const openChild = vi.fn();
    const openParent = vi.fn();
    render(<ScheduleMobileItems rows={scheduleRows(hierarchy.visible)} text={DEFAULT_SCHEDULE_LABELS}
      hierarchy={hierarchy} expanded={expanded} onToggle={vi.fn()}
      onChildOpen={openChild} onItemOpen={openParent} />);

    const entries = screen.getAllByRole('listitem');
    expect(entries).toHaveLength(3);
    expect(screen.getByText('1 of 2 items dated')).toBeInTheDocument();
    const undated = entries[2];
    if (!undated) throw new Error('Undated child is missing');
    expect(undated).toHaveTextContent('Slab');
    expect(within(undated).getByText('Not scheduled')).toBeInTheDocument();
    expect(within(undated).queryByText('Not reported')).toBeNull();
    fireEvent.click(within(undated).getByRole('button', { name: 'Item details: Slab' }));
    expect(openChild).toHaveBeenCalledWith('undated');
    expect(openParent).not.toHaveBeenCalled();
  });

  it('keeps undated children hidden when their parent is collapsed', () => {
    const expanded = new Set<string>();
    const hierarchy = scheduleHierarchy(items, expanded);
    render(<ScheduleMobileItems rows={scheduleRows(hierarchy.visible)} text={DEFAULT_SCHEDULE_LABELS}
      hierarchy={hierarchy} expanded={expanded} onToggle={vi.fn()} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.queryByText('Slab')).toBeNull();
    expect(screen.getByRole('button', { name: 'Show items: Foundation (2)' })).toBeInTheDocument();
  });
});
