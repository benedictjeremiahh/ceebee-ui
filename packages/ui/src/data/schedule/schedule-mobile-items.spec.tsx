import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { scheduleHierarchy } from './schedule.hierarchy.js';
import { scheduleRows } from './schedule.math.js';
import { ScheduleMobileItems } from './schedule-mobile-items.js';
import { DEFAULT_SCHEDULE_LABELS } from './parts/schedule-defaults.js';
import type { ScheduleEntry } from './schedule.types.js';

const items: ScheduleEntry[] = [
  { id: 'parent', label: 'Foundation', start: '2026-09-14', end: '2026-09-28' },
  { id: 'child', label: 'Footing', parentId: 'parent', start: '2026-09-14', end: '2026-09-20' },
];

describe('ScheduleMobileItems links', () => {
  it('renders parent destinations as links and keeps child details as an action', () => {
    const onItemOpen = vi.fn();
    const onChildOpen = vi.fn();
    const hierarchy = scheduleHierarchy(items, new Set(['parent']));
    const rows = scheduleRows(hierarchy.visible);

    render(
      <ScheduleMobileItems rows={rows} text={DEFAULT_SCHEDULE_LABELS} onItemOpen={onItemOpen}
        onChildOpen={onChildOpen} itemHref={(id) => `/work/${id}`} hierarchy={hierarchy}
        expanded={new Set(['parent'])} onToggle={vi.fn()} />,
    );

    const link = screen.getByRole('link', { name: 'Details' });
    expect(link).toHaveAttribute('href', '/work/parent');
    expect(screen.queryByRole('button', { name: 'Details' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Item details' }));
    expect(onItemOpen).not.toHaveBeenCalled();
    expect(onChildOpen).toHaveBeenCalledWith('child');
  });

  it('uses the parent callback when itemHref has no destination', () => {
    const onItemOpen = vi.fn();
    const hierarchy = scheduleHierarchy(items, new Set());
    const rows = scheduleRows(hierarchy.visible);

    render(
      <ScheduleMobileItems rows={rows} text={DEFAULT_SCHEDULE_LABELS} onItemOpen={onItemOpen}
        itemHref={() => undefined} hierarchy={hierarchy} expanded={new Set()} onToggle={vi.fn()} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Details' }));
    expect(onItemOpen).toHaveBeenCalledWith('parent');
  });
});
