import type { CurvePoint } from './progress-curve.math.js';

export interface ProgressCurveProps {
  /** What the plan said would be complete, by day. */
  planned: CurvePoint[];
  /** What was actually reported complete, by day. */
  actual: CurvePoint[];
  /** Accessible name. It is the chart's title as a screen reader announces it, so name the job. */
  label: string;
  /**
   * `YYYY-MM-DD`. The day the reading above the plot is taken on — both series carry their last value
   * at or before it forward. Without it the reading is taken on the last day anything was reported.
   *
   * It is deliberately not drawn on the plot: a mark attaches to a data point, and today is usually not
   * one. What is marked is the last report (see `lastReportLabel`).
   */
  today?: string;
  height?: number;
  plannedLabel?: string;
  actualLabel?: string;
  /** Text on the mark sitting at the last reported day. */
  lastReportLabel?: string;
  /** Shown in place of the chart when neither series has a single usable day. */
  emptyLabel?: string;
  /** The table a screen reader reads, and what a forced-colors viewer sees instead of the canvas. */
  tableLabel?: string;
  /** Header of the table's day column. */
  dayLabel?: string;
  /**
   * How a number in the reading is written, without its `%` — the actual, the plan and the gap.
   * Defaults to one decimal with a dot; a product that marks decimals with a comma passes its own.
   */
  formatNumber?: (value: number) => string;
  aheadLabel?: string;
  behindLabel?: string;
  onTrackLabel?: string;
  loading?: boolean;
  className?: string;
}

export interface ProgressCurveSkeletonProps {
  height?: number;
  label?: string;
  className?: string;
}
