import type { ReactNode } from 'react';
import { ListySkeleton } from './listy.skeleton.js';

export interface ListyGroup {
  /** Stable identity; grouped input must keep every group contiguous. */
  key: string;
  label: ReactNode;
}

export interface ListyProps<Item> {
  items: Item[];
  /** Stable item identity. Duplicate keys are rejected before rendering. */
  getKey: (item: Item) => string;
  renderItem: (item: Item, index: number) => ReactNode;
  /** Optional presentational grouping. Groups must be contiguous in the supplied item order. */
  getGroup?: (item: Item) => ListyGroup;
  /** Keeps the current group title visible while its native list section scrolls. */
  stickyGroupHeadings?: boolean;
  /** Lets supporting browsers skip off-screen painting; no virtual-scroll or row-height state is owned. */
  optimizeRendering?: boolean;
  'aria-label'?: string;
}

interface GroupedItems<Item> {
  group?: ListyGroup;
  entries: Array<{ item: Item; index: number; key: string }>;
}

function grouped<Item>(items: Item[], getKey: (item: Item) => string, getGroup?: (item: Item) => ListyGroup): GroupedItems<Item>[] {
  const itemKeys = new Set<string>();
  const closedGroups = new Set<string>();
  const result: GroupedItems<Item>[] = [];
  let activeGroupKey: string | undefined;

  items.forEach((item, index) => {
    const key = getKey(item);
    if (itemKeys.has(key)) throw new RangeError(`Listy item keys must be unique: ${key}`);
    itemKeys.add(key);
    const group = getGroup?.(item);
    if (group && group.key.length === 0) throw new RangeError('Listy group keys must not be empty.');
    if (group?.key !== activeGroupKey) {
      if (activeGroupKey) closedGroups.add(activeGroupKey);
      if (group && closedGroups.has(group.key)) throw new RangeError(`Listy group keys must be contiguous: ${group.key}`);
      result.push({ group, entries: [] });
      activeGroupKey = group?.key;
    }
    if (result.length === 0) result.push({ entries: [] });
    result[result.length - 1]!.entries.push({ item, index, key });
  });
  return result;
}

/** Server-safe, presentational list. Rendering optimization is browser-native paint containment only. */
function ListyRoot<Item>({
  items,
  getKey,
  renderItem,
  getGroup,
  stickyGroupHeadings = false,
  optimizeRendering = false,
  'aria-label': ariaLabel = 'List',
}: ListyProps<Item>) {
  const sections = grouped(items, getKey, getGroup);
  return (
    <ul className="cb-listy" aria-label={ariaLabel} data-optimized={optimizeRendering || undefined}>
      {sections.flatMap((section, sectionIndex) => section.group ? (
        <li className="cb-listy__group" key={section.group.key}>
          <div className="cb-listy__group-heading" data-sticky={stickyGroupHeadings || undefined}>{section.group.label}</div>
          <ul className="cb-listy__group-items">
            {section.entries.map(({ item, index, key }) => <li className="cb-listy__item" key={key}>{renderItem(item, index)}</li>)}
          </ul>
        </li>
      ) : section.entries.map(({ item, index, key }) => <li className="cb-listy__item" key={`${sectionIndex}-${key}`}>{renderItem(item, index)}</li>))}
    </ul>
  );
}

export const Listy = Object.assign(ListyRoot, { Skeleton: ListySkeleton });
