/**
 * What a progress curve means, with no chart and no DOM in sight.
 *
 * Kept pure for the usual reason and one extra: the curve is drawn on a **canvas**, so nothing about
 * it is inspectable from the outside. These functions are the only testable description of what the
 * picture claims, and they are also what feeds the text alternative a screen reader reads and what a
 * forced-colors viewer gets instead of the bitmap.
 */

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

/**
 * `YYYY-MM-DD`, or null when it is not a day at all.
 *
 * The pattern is not the check: `2026-02-30` matches it and is not a day. The round-trip through `Date`
 * settles that — but **an impossible month makes an Invalid Date, and `toISOString()` throws on one**
 * rather than returning anything falsy. So the time value is tested before it is formatted; otherwise
 * `2026-13-01` takes the whole chart down instead of being ignored.
 */
export function asDay(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const at = new Date(`${value}T00:00:00Z`).getTime();
  if (Number.isNaN(at)) return null;
  return new Date(at).toISOString().startsWith(value) ? value : null;
}

/** Points in day order, dropping anything that is not a day so one bad row cannot bend the whole line. */
export function orderedPoints(points: readonly CurvePoint[]): CurvePoint[] {
  return points.filter((p) => asDay(p.day) !== null).sort((a, b) => a.day.localeCompare(b.day));
}

/**
 * The reading on a given day: what was planned, what was reached, and the gap.
 *
 * Actual is carried forward from the last report on or before the day — a day nobody reported is not a
 * day of no progress, and drawing it as zero would say the work went backwards. Planned is read the
 * same way, since a plan states its shape at the points it states them.
 */
export function readingOn(
  planned: readonly CurvePoint[],
  actual: readonly CurvePoint[],
  day: string,
): CurveReading {
  const lastAtOrBefore = (points: readonly CurvePoint[]): number | null => {
    const reached = orderedPoints(points).filter((p) => p.day <= day);
    const last = reached[reached.length - 1];
    return last ? last.percent : null;
  };
  const plannedPercent = lastAtOrBefore(planned);
  const actualPercent = lastAtOrBefore(actual);
  return {
    plannedPercent,
    actualPercent,
    gap: plannedPercent === null || actualPercent === null ? null : round1(actualPercent - plannedPercent),
  };
}

/** One decimal, because a curve read to four is false precision on a number somebody estimated. */
export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/** The span the axis has to cover, or null when there is nothing to draw. */
export function curveSpan(
  planned: readonly CurvePoint[],
  actual: readonly CurvePoint[],
): { from: string; to: string } | null {
  const days = [...orderedPoints(planned), ...orderedPoints(actual)].map((p) => p.day).sort();
  const from = days[0];
  const to = days[days.length - 1];
  return from && to ? { from, to } : null;
}

/**
 * The chart as rows a person can read — the accessible rendering, not a caption.
 *
 * A canvas has no DOM, so this is the *only* thing a screen reader can be given, and it is what a
 * forced-colors viewer sees in place of the bitmap. It is therefore the same data, not a summary:
 * every day either series reports, with both values and the gap.
 */
export function curveRows(
  planned: readonly CurvePoint[],
  actual: readonly CurvePoint[],
): { day: string; plannedPercent: number | null; actualPercent: number | null; gap: number | null }[] {
  const days = [...new Set([...orderedPoints(planned), ...orderedPoints(actual)].map((p) => p.day))].sort();
  return days.map((day) => ({ day, ...readingOn(planned, actual, day) }));
}

/**
 * The points as the chart substrate demands them: ascending, and one per day.
 *
 * This is not tidying. The library **throws** on a repeated or out-of-order time rather than
 * ignoring it, so a source that reports the same day twice — a correction, two crews reporting the
 * same site — would take the whole screen down. The later value wins, because a correction is the
 * point of sending the day again.
 */
export function curveSeries(points: readonly CurvePoint[]): CurvePoint[] {
  const byDay = new Map<string, number>();
  for (const point of orderedPoints(points)) byDay.set(point.day, point.percent);
  return [...byDay].map(([day, percent]) => ({ day, percent })).sort((a, b) => a.day.localeCompare(b.day));
}

/**
 * The reported day closest to a given one, or null when nothing was reported.
 *
 * The "today" mark is a marker on a series, and a marker attaches to a data point — the substrate has
 * no vertical line of its own. So today lands on the nearest day either series reports, and the
 * rendering says which day that is rather than implying the line sits exactly on today.
 */
export function nearestDay(days: readonly string[], day: string): string | null {
  const known = days.filter((candidate) => asDay(candidate) !== null);
  if (known.length === 0 || asDay(day) === null) return null;
  const distance = (candidate: string) =>
    Math.abs(new Date(`${candidate}T00:00:00Z`).getTime() - new Date(`${day}T00:00:00Z`).getTime());
  return known.reduce((closest, candidate) => (distance(candidate) < distance(closest) ? candidate : closest));
}
