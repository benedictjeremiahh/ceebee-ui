import { Button } from 'antd';
import type { ScheduleRow } from './schedule.math.js';
import { isUnscheduled, type ScheduleHierarchy } from './schedule.hierarchy.js';
import { ScheduleDisclosure } from './schedule-disclosure.js';
import type { ResolvedScheduleLabels } from './schedule.types.js';

export function ScheduleMobileItems({ rows, text, onItemOpen, itemHref, onChildOpen, hierarchy, expanded, onToggle }: {
  rows: readonly ScheduleRow[];
  text: ResolvedScheduleLabels;
  onItemOpen?: (id: string) => void;
  itemHref?: (id: string) => string | undefined;
  onChildOpen?: (id: string) => void;
  hierarchy: ScheduleHierarchy;
  expanded: ReadonlySet<string>;
  onToggle: (id: string) => void;
}) {
  const rowById = new Map(rows.map((row) => [row.item.id, row]));
  return <ol className="cb-schedule__mobile-items" aria-label={text.item}>
    {hierarchy.visible.map((item) => {
      const row = rowById.get(item.id);
      if (!row && !isUnscheduled(item)) return null;
      const count = hierarchy.childCount.get(item.id) ?? 0;
      const dated = hierarchy.datedCount.get(item.id) ?? 0;
      const child = (hierarchy.depth.get(item.id) ?? 0) > 0;
      const action = child ? text.itemDetails : text.details;
      const href = child ? undefined : itemHref?.(item.id);
      const open = child ? onChildOpen : onItemOpen;
      const progress = !row ? text.unscheduled : row.progress === null ? text.unreported : text.percent(row.progress * 100);
      return <li key={item.id}>
        {count > 0 ? (
          <ScheduleDisclosure label={item.label} count={count}
            open={expanded.has(item.id)} text={text} onToggle={() => onToggle(item.id)} />
        ) : null}
        <span>{item.label}</span>
        <span className="cb-schedule__mobile-progress">{progress}</span>
        {dated < count ? <span className="cb-schedule__note">{text.partialCoverage(dated, count)}</span> : null}
        {href !== undefined ? <Button type="link" href={href} aria-label={`${action}: ${item.label}`}>{action}</Button>
          : open ? <Button type="link" aria-label={`${action}: ${item.label}`} onClick={() => open(item.id)}>{action}</Button> : null}
      </li>;
    })}
  </ol>;
}
