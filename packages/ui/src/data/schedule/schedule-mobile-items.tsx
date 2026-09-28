import { Button } from 'antd';
import type { ScheduleRow } from './schedule.math.js';
import type { ResolvedScheduleLabels } from './schedule.types.js';

export function ScheduleMobileItems({ rows, text, onItemOpen }: {
  rows: readonly ScheduleRow[];
  text: ResolvedScheduleLabels;
  onItemOpen?: (id: string) => void;
}) {
  return <ol className="cb-schedule__mobile-items" aria-label={text.item}>
    {rows.map((row) => <li key={row.item.id}>
      <span>{row.item.label}</span>
      <span className="cb-schedule__mobile-progress">{row.progress === null ? text.unreported : `${Math.round(row.progress * 100)}%`}</span>
      {onItemOpen ? <Button type="link" onClick={() => onItemOpen(row.item.id)}>{text.details}</Button> : null}
    </li>)}
  </ol>;
}
