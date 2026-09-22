import { TimeSeriesChartSkeleton } from '../time-series/index.js';
import type { ProgressCurveSkeletonProps } from './progress-curve.types.js';

/** Holds the chart's geometry while the readings load, so the page does not jump when they land. */
export function ProgressCurveSkeleton({
  height = 260,
  label = 'Loading progress',
  className,
}: ProgressCurveSkeletonProps) {
  return <TimeSeriesChartSkeleton height={height} label={label} className={className} />;
}
