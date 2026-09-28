'use client';

import { Gantt } from '@svar-ui/react-gantt';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../../lib/cn.js';
import { useMediaQuery } from '../../lib/use-media-query.js';
import { readableDay } from '../time-series/time-series.math.js';
import { dayForGantt, dayToDate, scheduleRows } from './schedule.math.js';
import type { ResolvedScheduleLabels, ScheduleProps } from './schedule.types.js';
import { scheduleScales } from './schedule.scales.js';
import { useScheduleGridColor } from './use-schedule-grid-color.js';

const DEFAULTS: ResolvedScheduleLabels = {
  empty: 'Nothing is planned yet.',
  item: 'Work item',
  actualProgress: 'Actual',
  unreported: 'Not reported',
  today: 'Today',
  todayDate: (day) => readableDay(day, 'en-US'),
  progress: (percent) => `${percent}% done`,
  actual: (start, end) => `actual ${start}–${end}`,
  notStarted: 'not started',
  overran: 'past the plan',
  late: 'late',
  pan: 'Swipe the timeline to see later dates.',
  month: (date) => new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date),
  day: (date) => new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(date),
  week: (date) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date),
};

/**
 * A schedule: one row per item, drawn against a time axis, with today marked.
 *
 * The drawing is SVAR Gantt's (`@svar-ui/react-gantt`, MIT). What is here is the part that is about
 * *this* product: the plan's calendar days (`YYYY-MM-DD`, ADR 0045) become the instants the substrate
 * needs, lateness is decided against `today` and weighted in basis points, and every colour comes from
 * Tokens — the substrate's `--wx-*` properties are pointed at `--cb-*` in `schedule.css`.
 */
function ScheduleRoot({ items, today, labels, editable = false, percentLabels = false, scale = 'day', height = 320, className }: ScheduleProps) {
  const text: ResolvedScheduleLabels = { ...DEFAULTS, ...labels };
  const narrow = useMediaQuery('(max-width: 48rem)');
  const scheduleRef = useRef<HTMLDivElement>(null);
  const gridColor = useScheduleGridColor(scheduleRef, items.length > 0);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [chartMode, setChartMode] = useState({ color: '', narrow: false });
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const element = scheduleRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setContainerWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [items.length]);
  // The panel can be narrow even when the viewport is wide (for example beside a planning rail).
  const compact = containerWidth === null ? narrow : containerWidth < 680;
  // Every substrate remount (including a theme-colour change) needs one layout pass with its grid
  // before chart-only mode can size. A mode saved for the previous colour must not carry across.
  const chartNarrow = chartMode.color === gridColor && chartMode.narrow;
  useEffect(() => {
    if (!mounted || !gridColor) return;
    const frame = requestAnimationFrame(() => setChartMode({ color: gridColor, narrow: compact }));
    return () => cancelAnimationFrame(frame);
  }, [mounted, compact, gridColor]);
  const rows = useMemo(() => scheduleRows(items, today), [items, today]);
  const axisBounds = rows.reduce(
    (bounds, row) => ({
      start: Math.min(bounds.start, row.spanStart.getTime()),
      end: Math.max(bounds.end, row.spanEnd.getTime()),
    }),
    { start: Number.POSITIVE_INFINITY, end: Number.NEGATIVE_INFINITY },
  );
  // Remount only when the substrate's axis domain changes; sorting rows or resizing must keep its
  // live layout intact. SVAR calculates the precise calendar coordinate in its own scale state.
  const axisKey = `${gridColor}:${scale}:${today ?? ''}:${axisBounds.start}:${axisBounds.end}`;

  const tasks = useMemo(
    () =>
      rows.map((row) => ({
        id: row.item.id,
        text: row.item.label,
        start: dayForGantt(row.spanStart),
        end: dayForGantt(row.spanEnd),
        /* The substrate wants a percentage; the plan states a fraction. Absent progress is drawn as
           nothing done rather than as an unknown, because a bar with no fill is the honest reading of
           "nobody has reported". */
        progress: Math.round(((row.progress ?? 0) * 100)),
        progressText: row.progress === null ? text.unreported : `${Math.round(row.progress * 100)}%`,
        reported: row.progress !== null,
        // Read by the template below, not by the substrate: the planned track, the actual overlay,
        // and whether the row is late or ran past its plan.
        late: row.late,
        overran: row.overran,
        planned: row.planned,
        actual: row.actual,
        actualStart: row.actual ? row.item.actual?.start ?? null : null,
        actualEnd: row.actual ? row.item.actual?.end ?? null : null,
        showPercent: percentLabels && row.progress !== null,
      })),
    [rows, percentLabels],
  );

  if (items.length === 0) return <p className={cn('cb-schedule__empty', className)}>{text.empty}</p>;

  return (
    <div ref={scheduleRef} className={cn('cb-schedule', className)}>
      {/* The text remains accessible; the vertical line is drawn on the substrate's own content layer. */}
      {today !== undefined ? (
        <p className="cb-schedule__today">
          <span className="cb-schedule__today-label">{text.today}</span>
          <time dateTime={today}>{text.todayDate(today)}</time>
        </p>
      ) : null}
      {compact ? <p className="cb-schedule__pan">{text.pan}</p> : null}
      <div className="cb-schedule__chart" style={{ height }} aria-busy={!mounted || !gridColor}>
      {mounted && gridColor ? <Gantt
        key={axisKey}
        init={(api) => {
          requestAnimationFrame(() => {
            const root = scheduleRef.current;
            root?.removeAttribute('data-today-on-axis');
            root?.style.removeProperty('--cb-today-x');
            const date = today ? dayToDate(today) : null;
            const state = api.getState();
            const axis = state._scales;
            if (!root || !date || !axis || !state.cellWidth || !state.lengthUnit) return;
            const localDay = dayForGantt(date);
            if (localDay < axis.start || localDay > axis.end) return;
            const x = axis.diff(localDay, axis.start, state.lengthUnit) * state.cellWidth;
            if (!Number.isFinite(x)) return;
            root.style.setProperty('--cb-today-x', `${x}px`);
            root.dataset.todayOnAxis = '';
          });
        }}
        tasks={tasks}
        scales={scheduleScales(text, scale)}
        gridWidth={chartNarrow ? 112 : 380}
        displayMode={chartNarrow ? 'chart' : 'all'}
        readonly={!editable}
        columns={[
          { id: 'text', header: text.item, width: chartNarrow ? 112 : 260 },
          { id: 'progressText', header: text.actualProgress, width: 120 },
        ]}
        taskTemplate={({ data }) => {
          const percent = data.progress ?? 0;
          const label = data.text ?? '';
          const planned = (data.planned ?? { left: 0, width: 100 }) as { left: number; width: number };
          const actual = (data.actual ?? null) as { left: number; width: number } | null;
          const words = [
            label,
            data.reported === true ? text.progress(percent) : text.unreported,
            actual && data.actualStart && data.actualEnd
              ? text.actual(String(data.actualStart), String(data.actualEnd))
              : text.notStarted,
            data.late === true ? text.late : null,
            data.overran === true ? text.overran : null,
          ].filter((word): word is string => word !== null);
          return (
            /* The grid already names the row, so the bar does not repeat it. It is a graphic, and its
               name is the reading it carries: the plan against the actuals, and how far along it is. */
            <span
              className="cb-schedule__bar"
              data-late={data.late === true ? '' : undefined}
              data-overran={data.overran === true ? '' : undefined}
              data-actual={actual ? '' : undefined}
              role="img"
              aria-label={words.join(', ')}
            >
              <span
                className="cb-schedule__bar-planned"
                style={{ insetInlineStart: `${planned.left}%`, inlineSize: `${planned.width}%` }}
              />
              {actual ? (
                <span
                  className="cb-schedule__bar-actual"
                  style={{ insetInlineStart: `${actual.left}%`, inlineSize: `${actual.width}%` }}
                />
              ) : (
                <span className="cb-schedule__bar-fill" style={{ inlineSize: `${percent}%` }} />
              )}
              {data.showPercent === true ? (
                <span
                  className="cb-schedule__bar-percent"
                  style={{ insetInlineStart: `min(calc(${actual ? actual.left + actual.width : percent}% + var(--cb-space-1)), calc(100% - 2.5em))` }}
                >
                  {percent}%
                </span>
              ) : null}
            </span>
          );
        }}
      /> : null}
      </div>
      {compact ? (
        <ol className="cb-schedule__mobile-items" aria-label={text.item}>
          {rows.map((row) => <li key={row.item.id}><span>{row.item.label}</span><span className="cb-schedule__mobile-progress">{row.progress === null ? text.unreported : `${Math.round(row.progress * 100)}%`}</span></li>)}
        </ol>
      ) : null}
    </div>
  );
}

export const Schedule = Object.assign(ScheduleRoot, {});
