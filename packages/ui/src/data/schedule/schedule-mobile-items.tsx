import { Button } from 'antd';
import type { ScheduleRow } from './schedule.math.js';
import type { ScheduleHierarchy } from './schedule.hierarchy.js';
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
  return <ol className="cb-schedule__mobile-items" aria-label={text.item}>
    {rows.map((row) => <li key={row.item.id}>
      {(hierarchy.childCount.get(row.item.id) ?? 0) > 0 ? (
        <ScheduleDisclosure label={row.item.label} count={hierarchy.childCount.get(row.item.id) ?? 0}
          open={expanded.has(row.item.id)} text={text} onToggle={() => onToggle(row.item.id)} />
      ) : null}
      <span>{row.item.label}</span>
      <span className="cb-schedule__mobile-progress">{row.progress === null ? text.unreported : `${Math.round(row.progress * 100)}%`}</span>
      {(() => {
        const child = (hierarchy.depth.get(row.item.id) ?? 0) > 0;
        const href = child ? undefined : itemHref?.(row.item.id);
        if (href !== undefined) return <Button type="link" href={href}>{text.details}</Button>;
        const open = child ? onChildOpen : onItemOpen;
        return open ? <Button type="link" onClick={() => open(row.item.id)}>{child ? text.itemDetails : text.details}</Button> : null;
      })()}
    </li>)}
  </ol>;
}
