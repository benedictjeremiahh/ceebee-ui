import type { SeriesPoint } from '../time-series/time-series.math.js';

export interface BalanceCurveProps {
  /** Accessible name. It is the chart's title as a screen reader announces it. */
  label: string;
  /** The running balance, by day. One point per day the balance is known for. */
  balances: SeriesPoint[];
  /**
   * How a value is written. The library holds no currency: a product passes its own formatter, so the
   * same chart serves rupiah, a percentage of a budget, or litres of diesel.
   */
  format: (value: number) => string;
  /**
   * The line the balance is read against, and what to call it. Defaults to zero.
   *
   * Not always zero, and that is the point: a business that must keep a minimum on hand is in trouble
   * well before it reaches nothing.
   */
  threshold?: { value: number; label?: string };
  height?: number;
  seriesLabel?: string;
  emptyLabel?: string;
  tableLabel?: string;
  /**
   * How the axis, the table and the reading's sentence name a date. Omitted, the document's `lang` is used
   * — a library has no business choosing a language for somebody else's dashboard.
   */
  locale?: string;
  /** How the reading is worded. Each takes the formatted figures the component computed. */
  belowLabel?: (from: string, lowest: string, days: number) => string;
  clearLabel?: (lowest: string) => string;
  loading?: boolean;
  className?: string;
}

export interface BalanceCurveSkeletonProps {
  height?: number;
  label?: string;
  className?: string;
}
