import type { ScheduleItem } from './schedule.types.js';

const DAY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * A `YYYY-MM-DD` day as the UTC midnight it names, or null when it is not a day.
 *
 * UTC, not local: the day is a calendar fact, and `new Date('2026-01-01')` already reads it that way.
 * Building it from local parts would move the bar by a day for anyone east of UTC.
 */
export function dayToDate(day: string): Date | null {
  if (!DAY.test(day)) return null;
  const at = new Date(`${day}T00:00:00Z`).getTime();
  if (Number.isNaN(at)) return null;
  return new Date(at).toISOString().startsWith(day) ? new Date(at) : null;
}

/** Whether an instant falls on a `YYYY-MM-DD` day, read in UTC or in the reader's own zone. */
export function sameDay(date: Date, day: string): boolean {
  if (date.toISOString().slice(0, 10) === day) return true;
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dateOfMonth = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${dateOfMonth}` === day;
}

export interface ScheduleRow {
  item: ScheduleItem;
  start: Date;
  end: Date;
  /** 0–1, clamped. Null when the item states no progress — absent is not zero. */
  progress: number | null;
  /** Basis points, clamped to 0–10000. */
  weight: number;
  /** The end is behind `today` and the work is not finished. */
  late: boolean;
  /** The drawn range: the union of the plan and the actuals, so neither is ever clipped. */
  spanStart: Date;
  spanEnd: Date;
  /** Where the planned bar sits inside the drawn range, 0–100. */
  planned: SpanPct;
  /** Where the actual bar sits inside the drawn range — null when nothing was reported. */
  actual: SpanPct | null;
  /** The actuals ran past the planned end. */
  overran: boolean;
}

/** One span's place inside the drawn range, as percentages the template positions with. */
export interface SpanPct {
  left: number;
  width: number;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Where `[from, to]` sits inside `[spanStart, spanEnd]`, as percentages. A span with no duration
 * is read as one day: a one-day item fills its row rather than drawing a zero-width bar.
 */
function spanPct(spanStart: Date, spanEnd: Date, from: Date, to: Date): SpanPct {
  const end = spanEnd <= spanStart ? new Date(spanStart.getTime() + DAY_MS) : spanEnd;
  const total = end.getTime() - spanStart.getTime();
  const left = ((from.getTime() - spanStart.getTime()) / total) * 100;
  return { left, width: ((to.getTime() - from.getTime()) / total) * 100 + (to <= from ? (DAY_MS / total) * 100 : 0) };
}

/**
 * The items as rows a schedule can draw: one per item, in the order given.
 *
 * An item whose dates are not days is dropped rather than guessed at — a bar drawn from a date nobody
 * can read is worse than no bar. An item whose end is before its start is drawn as a single day: the
 * plan says both, and a zero-width bar is invisible.
 *
 * `late` needs a `today`: without one there is no "behind" to be behind. A finished item is never late,
 * however old — it is done, which is the point of marking lateness at all.
 */
export function scheduleRows(items: ScheduleItem[], today?: string): ScheduleRow[] {
  const at = today ? dayToDate(today) : null;
  const rows: ScheduleRow[] = [];
  for (const item of items) {
    const start = dayToDate(item.start);
    const end = dayToDate(item.end);
    if (!start || !end) continue;
    const progress = typeof item.progress === 'number' && Number.isFinite(item.progress) ? clamp01(item.progress) : null;
    const weight = typeof item.weight === 'number' && Number.isFinite(item.weight) ? Math.min(10000, Math.max(0, Math.round(item.weight))) : 10000;
    const plannedEnd = end < start ? start : end;
    // Actuals follow the same rules as the plan: not days means no actuals (never guessed), and an
    // end before its start is a single day. A missing actual is not a zero — the row draws planned only.
    const rawActualStart = item.actual ? dayToDate(item.actual.start) : null;
    const rawActualEnd = item.actual ? dayToDate(item.actual.end) : null;
    const actualStart = rawActualStart && rawActualEnd ? rawActualStart : null;
    const actualEnd = actualStart && rawActualEnd ? (rawActualEnd < actualStart ? actualStart : rawActualEnd) : null;
    const spanStart = actualStart && actualStart < start ? actualStart : start;
    const spanEnd = actualEnd && actualEnd > plannedEnd ? actualEnd : plannedEnd;
    rows.push({
      item,
      start,
      end: plannedEnd,
      progress,
      weight,
      late: at !== null && plannedEnd < at && (progress === null || progress < 1),
      spanStart,
      spanEnd,
      planned: spanPct(spanStart, spanEnd, start, plannedEnd),
      actual: actualStart && actualEnd ? spanPct(spanStart, spanEnd, actualStart, actualEnd) : null,
      overran: actualEnd !== null && actualEnd > plannedEnd,
    });
  }
  return rows;
}

/** The rows whose end is behind `today` and which are not finished — what the weighted reading counts. */
export function lateRows(rows: ScheduleRow[]): ScheduleRow[] {
  return rows.filter((row) => row.late);
}

/** The late rows' weight as a share of every row's weight, 0–1. Zero when nothing is late. */
export function lateWeightShare(rows: ScheduleRow[]): number {
  const total = rows.reduce((sum, row) => sum + row.weight, 0);
  if (total === 0) return 0;
  return lateRows(rows).reduce((sum, row) => sum + row.weight, 0) / total;
}
