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
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

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
    rows.push({
      item,
      start,
      end: end < start ? start : end,
      progress,
      weight,
      late: at !== null && end < at && (progress === null || progress < 1),
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
