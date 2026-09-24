'use client';

import { Gantt } from '@svar-ui/react-gantt';
import { useMemo } from 'react';
import { cn } from '../../lib/cn.js';
import { scheduleRows } from './schedule.math.js';
import type { ScheduleLabels, ScheduleProps } from './schedule.types.js';

const DEFAULTS: ScheduleLabels = {
  empty: 'Nothing is planned yet.',
  item: 'Work item',
  today: 'Today',
  progress: (percent) => `${percent}% done`,
};

/**
 * A schedule: one row per item, drawn against a time axis, with today marked.
 *
 * The drawing is SVAR Gantt's (`@svar-ui/react-gantt`, MIT). What is here is the part that is about
 * *this* product: the plan's calendar days (`YYYY-MM-DD`, ADR 0045) become the instants the substrate
 * needs, lateness is decided against `today` and weighted in basis points, and every colour comes from
 * Tokens — the substrate's `--wx-*` properties are pointed at `--cb-*` in `schedule.css`.
 */
function ScheduleRoot({ items, today, labels, editable = false, height = 320, className }: ScheduleProps) {
  const text = { ...DEFAULTS, ...labels };
  const rows = useMemo(() => scheduleRows(items, today), [items, today]);

  const tasks = useMemo(
    () =>
      rows.map((row) => ({
        id: row.item.id,
        text: row.item.label,
        start: row.start,
        end: row.end,
        /* The substrate wants a percentage; the plan states a fraction. Absent progress is drawn as
           nothing done rather than as an unknown, because a bar with no fill is the honest reading of
           "nobody has reported". */
        progress: Math.round((row.progress ?? 0) * 100),
        // Read by the template below, not by the substrate: a late, unfinished row.
        late: row.late,
        weight: row.weight,
      })),
    [rows],
  );

  if (items.length === 0) return <p className={cn('cb-schedule__empty', className)}>{text.empty}</p>;

  return (
    <div className={cn('cb-schedule', className)} style={{ height }}>
      {/* Today, stated. An on-axis vertical marker is a PRO feature of the substrate and the free build
          ignores both `markers` and a scale cell's `css` without complaint, so today is named here, in
          this library's own layer, where it is readable and reaches assistive technology. */}
      {today !== undefined ? (
        <p className="cb-schedule__today">
          <span className="cb-schedule__today-label">{text.today}</span>
          <time dateTime={today}>{today}</time>
        </p>
      ) : null}
      <Gantt
        tasks={tasks}
        readonly={!editable}
        columns={[{ id: 'text', header: text.item, width: 240 }]}
        taskTemplate={({ data }) => {
          const percent = data.progress ?? 0;
          const label = data.text ?? '';
          return (
            /* The grid already names the row, so the bar does not repeat it. It is a graphic, and its
               name is the reading it carries: the item and how far along it is. */
            <span
              className="cb-schedule__bar"
              data-late={data.late === true ? '' : undefined}
              role="img"
              aria-label={`${label}, ${text.progress(percent)}`}
            >
              <span className="cb-schedule__bar-fill" style={{ inlineSize: `${percent}%` }} />
            </span>
          );
        }}
      />
    </div>
  );
}

export const Schedule = Object.assign(ScheduleRoot, {});
