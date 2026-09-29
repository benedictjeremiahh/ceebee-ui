import type { ScheduleEntry, UnscheduledItem } from './schedule.types.js';

export interface ScheduleHierarchy {
  /** Roots in the order given, each followed by its children when expanded; orphans read as roots. */
  visible: ScheduleEntry[];
  /** How many children each parent has, whether or not they are shown. */
  childCount: ReadonlyMap<string, number>;
  /** How many of a parent's children carry dates. */
  datedCount: ReadonlyMap<string, number>;
  /** Nesting depth of every visible item: 0 for a root. */
  depth: ReadonlyMap<string, number>;
}

/** An item that states no dates is kept and labelled, never given a guessed bar. */
export function isUnscheduled(item: ScheduleEntry): item is UnscheduledItem {
  return 'unscheduled' in item && item.unscheduled === true;
}

/**
 * Flatten parent/child items into the rows on screen.
 *
 * The chart never receives a hierarchy: the substrate's own summary tasks would re-derive dates and
 * progress from children, and those belong to the consumer's baseline. Disclosure only decides which
 * of the given rows are shown.
 */
export function scheduleHierarchy(items: readonly ScheduleEntry[], expanded: ReadonlySet<string>): ScheduleHierarchy {
  const ids = new Set(items.map((item) => item.id));
  const children = new Map<string, ScheduleEntry[]>();
  const roots: ScheduleEntry[] = [];
  for (const item of items) {
    const parent = item.parentId;
    if (parent !== undefined && parent !== item.id && ids.has(parent)) {
      children.set(parent, [...(children.get(parent) ?? []), item]);
    } else roots.push(item);
  }
  const visible: ScheduleEntry[] = [];
  const depth = new Map<string, number>();
  for (const root of roots) {
    visible.push(root);
    depth.set(root.id, 0);
    if (!expanded.has(root.id)) continue;
    for (const child of children.get(root.id) ?? []) {
      visible.push(child);
      depth.set(child.id, 1);
    }
  }
  return {
    visible,
    depth,
    childCount: new Map([...children].map(([id, list]) => [id, list.length])),
    datedCount: new Map([...children].map(([id, list]) => [id, list.filter((item) => !isUnscheduled(item)).length])),
  };
}
