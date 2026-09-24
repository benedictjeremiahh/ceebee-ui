/**
 * What a dated series means, with no chart and no DOM in sight.
 *
 * Kept pure for the usual reason and one extra: these charts are drawn on a **canvas**, so nothing
 * about them is inspectable from the outside. These functions are the only testable description of
 * what the picture claims, and they are also what feeds the text alternative a screen reader reads
 * and what a forced-colors viewer gets instead of the bitmap.
 */

/** One reading: a day, and a value on that day. */
export interface SeriesPoint {
  /** `YYYY-MM-DD`. A calendar day, not an instant. */
  day: string;
  value: number;
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

/**
 * The points as the chart substrate demands them: ascending, and one per day.
 *
 * This is not tidying. The library **throws** on a repeated or out-of-order time rather than ignoring
 * it, so a source that reports the same day twice — a correction, two crews reporting the same site —
 * would take the whole screen down. The later value wins, because a correction is the point of sending
 * the day again.
 */
export function seriesPoints(points: readonly SeriesPoint[]): SeriesPoint[] {
  const byDay = new Map<string, number>();
  for (const point of points) {
    if (asDay(point.day) === null) continue;
    byDay.set(point.day, point.value);
  }
  return [...byDay].map(([day, value]) => ({ day, value })).sort((a, b) => a.day.localeCompare(b.day));
}

/** The value a series holds on a day: its last reading at or before it, or null before it starts. */
export function valueOn(points: readonly SeriesPoint[], day: string): number | null {
  const reached = seriesPoints(points).filter((point) => point.day <= day);
  const last = reached[reached.length - 1];
  return last ? last.value : null;
}

/**
 * Every day any series reports, with each series' value on it — the accessible rendering, not a caption.
 *
 * A canvas has no DOM, so this is the *only* thing a screen reader can be given, and it is what a
 * forced-colors viewer sees in place of the bitmap. It is therefore the same data, not a summary. A
 * value is carried forward from the last reading: a day nobody reported is not a day of nothing, and
 * showing it as zero would say the measure collapsed.
 */
export function alignRows(
  series: readonly { key: string; points: readonly SeriesPoint[] }[],
): { day: string; values: Record<string, number | null> }[] {
  const days = [...new Set(series.flatMap((one) => seriesPoints(one.points).map((point) => point.day)))].sort();
  return days.map((day) => {
    const values: Record<string, number | null> = {};
    for (const one of series) values[one.key] = valueOn(one.points, day);
    return { day, values };
  });
}

/** The span the axis has to cover, or null when there is nothing to draw. */
export function seriesSpan(
  series: readonly { points: readonly SeriesPoint[] }[],
): { from: string; to: string } | null {
  const days = series.flatMap((one) => seriesPoints(one.points).map((point) => point.day)).sort();
  const from = days[0];
  const to = days[days.length - 1];
  return from && to ? { from, to } : null;
}

/**
 * The reported day closest to a given one, or null when nothing was reported.
 *
 * A marker attaches to a data point — the substrate has no vertical line of its own — so anything a
 * chart wants to mark has to land on a day some series actually reports.
 */
export function nearestDay(days: readonly string[], day: string): string | null {
  const known = days.filter((candidate) => asDay(candidate) !== null);
  if (known.length === 0 || asDay(day) === null) return null;
  const distance = (candidate: string) =>
    Math.abs(new Date(`${candidate}T00:00:00Z`).getTime() - new Date(`${day}T00:00:00Z`).getTime());
  return known.reduce((closest, candidate) => (distance(candidate) < distance(closest) ? candidate : closest));
}

/** One decimal, because a figure read to four is false precision on a number somebody estimated. */
export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * A day as a person reads it — `24 Sep 2026`, or `24 Sep` for an axis with no room for the year.
 *
 * The locale is the caller's, because this library has no idea what language a product speaks, and the
 * default belongs to whoever renders it: a component defaults to the document's `lang`.
 *
 * Formatted at UTC noon for the same reason `asDay` exists: a calendar day has no time zone, and reading
 * one as local midnight would put 1 January on 31 December for anybody west of Greenwich.
 */
export function readableDay(day: string, locale: string, style: 'short' | 'medium' = 'medium'): string {
  const value = asDay(day);
  if (value === null) return day;
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    ...(style === 'medium' ? { year: 'numeric' } : {}),
    timeZone: 'UTC',
  })
    .format(new Date(`${value}T12:00:00Z`))
    .replace(/\./g, '');
}

/**
 * A value range rounded out to ticks of 1, 2 or 5 times a power of ten.
 *
 * The axis hands its ends to a formatter, and a compact one answers an autoscaled `97` with `97,0` while
 * it answers `100` with `100`: a decimal that is only there because the data happened to stop where it
 * did. Rounding **outwards** is the point of this — rounding inwards would hide the top of the data, and
 * a chart that quietly clips its own maximum is worse than one with an awkward label.
 */
export function niceRange(
  min: number,
  max: number,
  target = 5,
): { min: number; max: number; step: number } {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) return { min, max, step: 1 };
  const rough = (max - min) / Math.max(1, target);
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const steps = [1, 2, 5, 10].map((multiple) => multiple * magnitude);
  const step = steps.find((candidate) => candidate >= rough) ?? magnitude * 10;
  return { min: Math.floor(min / step) * step, max: Math.ceil(max / step) * step, step };
}
