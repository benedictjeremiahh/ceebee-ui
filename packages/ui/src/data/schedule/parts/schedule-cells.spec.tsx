import { fireEvent, render, screen } from '@testing-library/react';
import { useState, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ScheduleCells, ScheduleNameCell } from '../schedule-cells.js';
import { scheduleHierarchy } from '../schedule.hierarchy.js';
import { scheduleRows } from '../schedule.math.js';
import type { ScheduleEntry } from '../schedule.types.js';
import { DEFAULT_SCHEDULE_LABELS } from './schedule-defaults.js';

const items: ScheduleEntry[] = [
  { id: 'wp', label: 'Foundation', start: '2026-09-14', end: '2026-09-28' },
  { id: 'a', label: 'Footing', parentId: 'wp', start: '2026-09-14', end: '2026-09-20' },
  { id: 'b', label: 'Slab', parentId: 'wp', unscheduled: true },
];

function Harness({ onItemOpen, onChildOpen, children }: {
  onItemOpen?: (id: string) => void;
  onChildOpen?: (id: string) => void;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set());
  const hierarchy = scheduleHierarchy(items, expanded);
  const rows = scheduleRows(hierarchy.visible);
  return (
    <ScheduleCells rows={new Map(rows.map((row) => [row.item.id, row]))} text={DEFAULT_SCHEDULE_LABELS}
      onItemOpen={onItemOpen} onChildOpen={onChildOpen} items={new Map(items.map((item) => [item.id, item]))} hierarchy={hierarchy}
      expanded={expanded}
      onToggle={(id) => setExpanded((previous) => new Set(previous.has(id) ? [] : [id]))}>
      {children}
    </ScheduleCells>
  );
}

describe('Schedule detail action', () => {
  it('does not select its grid row before opening an item with the pointer', () => {
    const selectRow = vi.fn();
    const openItem = vi.fn();
    render(
      <div onMouseDown={selectRow} onClick={selectRow}>
        <Harness onItemOpen={openItem}>
          <ScheduleNameCell row={{ id: 'wp' }} />
        </Harness>
      </div>
    );
    const action = screen.getByRole('button', { name: 'Details: Foundation' });
    fireEvent.mouseDown(action);
    fireEvent.click(action);
    expect(selectRow).not.toHaveBeenCalled();
    expect(openItem).toHaveBeenCalledWith('wp');
  });
});

describe('Schedule row disclosure', () => {
  it('sits in the parent identity cell with its item count, apart from the detail action', () => {
    const openItem = vi.fn();
    render(<Harness onItemOpen={openItem}><ScheduleNameCell row={{ id: 'wp' }} /></Harness>);
    const toggle = screen.getByRole('button', { name: 'Show items: Foundation (2)' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Hide items: Foundation (2)' })).toHaveAttribute('aria-expanded', 'true');
    expect(openItem).not.toHaveBeenCalled();
  });

  it('says coverage is incomplete when only some children are dated', () => {
    render(<Harness><ScheduleNameCell row={{ id: 'wp' }} /></Harness>);
    expect(screen.getByText('1 of 2 items dated')).toBeInTheDocument();
  });

  it('labels an undated child instead of drawing dates for it', () => {
    render(<Harness><ScheduleNameCell row={{ id: 'b' }} /></Harness>);
    expect(screen.getByText('Not scheduled')).toBeInTheDocument();
  });
});

describe('Schedule child rows', () => {
  it('has no labelled action of its own; its name opens it through the child handler', () => {
    const openItem = vi.fn();
    const openChild = vi.fn();
    render(
      <Harness onItemOpen={openItem} onChildOpen={openChild}>
        <ScheduleNameCell row={{ id: 'wp' }} />
        <ScheduleNameCell row={{ id: 'a' }} />
      </Harness>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Show items: Foundation (2)' }));
    expect(screen.getAllByRole('button', { name: /^Details:/ })).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Details: Foundation' })).toHaveTextContent('Details');
    fireEvent.click(screen.getByRole('button', { name: 'Details: Footing' }));
    expect(openChild).toHaveBeenCalledWith('a');
    expect(openItem).not.toHaveBeenCalled();
  });
});
