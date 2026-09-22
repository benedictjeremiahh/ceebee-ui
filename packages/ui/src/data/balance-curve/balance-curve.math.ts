/**
 * What a running balance says about itself.
 *
 * A balance chart exists to answer two questions a list of days cannot: **when does this dip below the
 * line, and how far down does it go.** Both are computed here rather than left to the reader, because
 * the reader's alternative is scanning thirty rows — which is exactly the thing the chart replaces.
 */
import { seriesPoints, type SeriesPoint } from '../time-series/time-series.math.js';

export interface BalanceReading {
  /** The lowest balance over the window, and the day it happens. Null when there is nothing to read. */
  lowest: number | null;
  lowestDay: string | null;
  /** The first day the balance is below the threshold, or null when it never is. */
  firstBelowDay: string | null;
  /** How many days sit below the threshold. Zero is the answer somebody is hoping for. */
  daysBelow: number;
  /** The balance on the last day of the window. */
  closing: number | null;
}

/**
 * The reading, against a threshold.
 *
 * The threshold is not always zero, and that is the point of it being a parameter: a business that must
 * keep fifty million on hand is in trouble well before it reaches nothing, and a chart drawn against
 * zero would tell it everything is fine right up to the day it is not.
 *
 * "Below" is strict. A balance sitting exactly on the threshold has met it, and reporting that as a
 * breach would cry wolf on the one day the business did precisely what it planned to.
 */
export function balanceReading(points: readonly SeriesPoint[], threshold: number): BalanceReading {
  const ordered = seriesPoints(points);
  if (ordered.length === 0) {
    return { lowest: null, lowestDay: null, firstBelowDay: null, daysBelow: 0, closing: null };
  }
  let lowestPoint = ordered[0];
  for (const point of ordered) {
    if (lowestPoint === undefined || point.value < lowestPoint.value) lowestPoint = point;
  }
  const below = ordered.filter((point) => point.value < threshold);
  return {
    lowest: lowestPoint?.value ?? null,
    lowestDay: lowestPoint?.day ?? null,
    firstBelowDay: below[0]?.day ?? null,
    daysBelow: below.length,
    closing: ordered.at(-1)?.value ?? null,
  };
}
