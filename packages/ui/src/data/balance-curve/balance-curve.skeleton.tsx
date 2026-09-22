import { TimeSeriesChartSkeleton } from '../time-series/index.js';
import type { BalanceCurveSkeletonProps } from './balance-curve.types.js';

/** Holds the chart's geometry while the balances load, so the page does not jump when they land. */
export function BalanceCurveSkeleton({
  height = 260,
  label = 'Loading balance',
  className,
}: BalanceCurveSkeletonProps) {
  return <TimeSeriesChartSkeleton height={height} label={label} className={className} />;
}
