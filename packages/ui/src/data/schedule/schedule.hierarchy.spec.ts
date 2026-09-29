import { describe, expect, it } from 'vitest';
import { scheduleHierarchy } from './schedule.hierarchy.js';
import type { ScheduleEntry } from './schedule.types.js';

const dated = (id: string, parentId?: string): ScheduleEntry => ({
  id, label: id, start: '2026-09-01', end: '2026-09-10', ...(parentId ? { parentId } : {}),
});
const undated = (id: string, parentId: string): ScheduleEntry => ({ id, label: id, parentId, unscheduled: true });

describe('scheduleHierarchy', () => {
  const items = [dated('a'), dated('a1', 'a'), undated('a2', 'a'), dated('b'), dated('b1', 'b')];

  it('starts collapsed: only roots are shown, and children are still counted', () => {
    const result = scheduleHierarchy(items, new Set());
    expect(result.visible.map((item) => item.id)).toEqual(['a', 'b']);
    expect(result.childCount.get('a')).toBe(2);
    expect(result.datedCount.get('a')).toBe(1);
  });

  it('shows the children of an expanded parent directly beneath it', () => {
    const result = scheduleHierarchy(items, new Set(['a']));
    expect(result.visible.map((item) => item.id)).toEqual(['a', 'a1', 'a2', 'b']);
    expect(result.depth.get('a1')).toBe(1);
  });

  it('reads a child whose parent is missing, or itself, as a root', () => {
    const result = scheduleHierarchy([dated('x', 'gone'), dated('y', 'y')], new Set());
    expect(result.visible.map((item) => item.id)).toEqual(['x', 'y']);
  });
});
