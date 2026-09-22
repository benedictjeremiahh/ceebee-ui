import type { CurvePoint } from './progress-curve.math.js';

/** The colours the canvas is drawn in, resolved from Tokens rather than written down. */
export interface CurvePalette {
  planned: string;
  actual: string;
  text: string;
  muted: string;
  grid: string;
  background: string;
  font: string;
}

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
   * It is deliberately not drawn on the plot: the substrate attaches a mark to a data point, and today
   * is usually not one. What is marked is the last report (see `lastReportLabel`).
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
