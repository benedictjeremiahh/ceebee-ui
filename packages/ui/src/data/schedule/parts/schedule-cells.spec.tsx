import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ScheduleCells, ScheduleNameCell } from '../schedule-cells.js';
import { scheduleRows } from '../schedule.math.js';
import { DEFAULT_SCHEDULE_LABELS } from './schedule-defaults.js';

describe('Schedule detail action', () => {
  it('does not select its grid row before opening an item with the pointer', () => {
    const selectRow = vi.fn();
    const openItem = vi.fn();
    const rows = scheduleRows([{ id: 'task', label: 'Foundation', start: '2026-09-14', end: '2026-09-28' }]);
    render(
      <div onMouseDown={selectRow} onClick={selectRow}>
        <ScheduleCells rows={new Map(rows.map((row) => [row.item.id, row]))} text={DEFAULT_SCHEDULE_LABELS} onItemOpen={openItem}>
          <ScheduleNameCell row={{ id: 'task' }} />
        </ScheduleCells>
      </div>
    );
    const action = screen.getByRole('button', { name: 'Details: Foundation' });
    fireEvent.mouseDown(action);
    fireEvent.click(action);
    expect(selectRow).not.toHaveBeenCalled();
    expect(openItem).toHaveBeenCalledWith('task');
  });
});
