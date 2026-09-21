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
   * `YYYY-MM-DD`. Marks where the reader is standing. The mark lands on the nearest reported day —
   * the substrate attaches markers to data points, not to arbitrary positions — and the reading
   * beside the chart names that day, so it never implies a line drawn exactly on today.
   */
  today?: string;
  height?: number;
  plannedLabel?: string;
  actualLabel?: string;
  todayLabel?: string;
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
