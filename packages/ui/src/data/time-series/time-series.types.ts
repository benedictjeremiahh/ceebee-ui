import type { SeriesPoint } from './time-series.math.js';

/** The colours a canvas is drawn in, resolved from Tokens rather than written down. */
export interface ChartPalette {
  text: string;
  muted: string;
  grid: string;
  background: string;
  font: string;
  /** One entry per series, in the order the series were given. */
  series: string[];
  /** Where a baseline series sits above its base, and below it. */
  above: string;
  below: string;
}

/** How thick, and solid or dashed. A plan reads as a reference; delivery reads as the fact. */
export type SeriesEmphasis = 'reference' | 'primary';

export interface SeriesSpec {
  /** Stable key, used in the accessible table and to look a value up. */
  key: string;
  /** What a reader calls it. */
  label: string;
  points: SeriesPoint[];
  emphasis?: SeriesEmphasis;
  /** The Token this series takes its colour from, e.g. `--cb-tone-brand`. */
  colorToken: string;
}

/**
 * A fixed vertical range, when autoscale would lie.
 *
 * A percentage chart pins 0–100: autoscale stretches a job at 30% to the full height of the plot,
 * which reads as *nearly there* — the opposite of the truth. A money chart normally does not pin,
 * because there is no natural ceiling.
 */
export interface ValueRange {
  min: number;
  max: number;
}

/**
 * A baseline: the value the series is read against, coloured differently above and below.
 *
 * Zero on a cash projection is the obvious one — the day the balance crosses it is the whole point of
 * the chart — and a minimum buffer is the useful one, because a business that must keep 50 juta on hand
 * is in trouble well before it reaches zero.
 */
export interface Baseline {
  value: number;
  label?: string;
}

export interface TimeSeriesChartProps {
  /** Accessible name. It is the chart's title as a screen reader announces it. */
  label: string;
  series: SeriesSpec[];
  /** Turns a value into the text on the price scale and in the table. */
  format: (value: number) => string;
  range?: ValueRange;
  /** Draws one series against a base value, shaded above and below. Only the first series is drawn. */
  baseline?: Baseline;
  /** A day to mark, and what to call it. The mark lands on the nearest day any series reports. */
  mark?: { day: string; label: string };
  height?: number;
  emptyLabel?: string;
  tableLabel?: string;
  dayLabel?: string;
  loading?: boolean;
  className?: string;
}

export interface TimeSeriesChartSkeletonProps {
  height?: number;
  label?: string;
  className?: string;
}
