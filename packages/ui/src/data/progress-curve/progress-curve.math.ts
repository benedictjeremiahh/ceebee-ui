/**
 * What a progress curve means: planned against actual, and the gap between them on a day.
 *
 * Only the domain arithmetic lives here. Ordering, de-duplication and the day-by-day alignment that
 * feeds the accessible table are the same for every dated chart in this library and live in
 * `../time-series/time-series.math.ts`.
 */
import { alignRows, seriesPoints, valueOn, round1 } from '../time-series/time-series.math.js';

/** One reading: a day, and the share of the work complete by then. */
export interface CurvePoint {
  /** `YYYY-MM-DD`. A calendar day, not an instant — progress is reported for a day's work. */
  day: string;
  /** 0–100. */
  percent: number;
}

export interface CurveReading {
  plannedPercent: number | null;
  actualPercent: number | null;
  /** Actual minus planned, in points. Negative is behind. Null when either side is unknown. */
  gap: number | null;
}

/** The library's generic point shape, from this Block's `percent`-named one. */
export function toPoints(points: readonly CurvePoint[]) {
  return seriesPoints(points.map((point) => ({ day: point.day, value: point.percent })));
}

/**
 * The reading on a given day: what was planned, what was reached, and the gap.
 *
 * Both sides carry the last report forward — a day nobody reported is not a day of no progress, and
 * drawing it as zero would say the work went backwards. A plan states its shape at the points it
 * states them, so it is read the same way.
 */
export function readingOn(
  planned: readonly CurvePoint[],
  actual: readonly CurvePoint[],
  day: string,
): CurveReading {
  const plannedPercent = valueOn(toPoints(planned), day);
  const actualPercent = valueOn(toPoints(actual), day);
  return {
    plannedPercent,
    actualPercent,
    gap: plannedPercent === null || actualPercent === null ? null : round1(actualPercent - plannedPercent),
  };
}

/** Every day either series reports, with both values and the gap — what a screen reader is given. */
export function curveRows(
  planned: readonly CurvePoint[],
  actual: readonly CurvePoint[],
): { day: string; plannedPercent: number | null; actualPercent: number | null; gap: number | null }[] {
  return alignRows([
    { key: 'planned', points: toPoints(planned) },
    { key: 'actual', points: toPoints(actual) },
  ]).map((row) => {
    const plannedPercent = row.values.planned ?? null;
    const actualPercent = row.values.actual ?? null;
    return {
      day: row.day,
      plannedPercent,
      actualPercent,
      gap: plannedPercent === null || actualPercent === null ? null : round1(actualPercent - plannedPercent),
    };
  });
}
