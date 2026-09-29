import { Button } from 'antd';
import type { ScheduleRow } from './schedule.math.js';
import type { ScheduleHierarchy } from './schedule.hierarchy.js';
import { ScheduleDisclosure } from './schedule-disclosure.js';
import type { ResolvedScheduleLabels } from './schedule.types.js';

export function ScheduleMobileItems({ rows, text, onItemOpen, hierarchy, expanded, onToggle }: {
  rows: readonly ScheduleRow[];
  text: ResolvedScheduleLabels;
  onItemOpen?: (id: string) => void;
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
      {onItemOpen ? <Button type="link" onClick={() => onItemOpen(row.item.id)}>{text.details}</Button> : null}
    </li>)}
  </ol>;
}
