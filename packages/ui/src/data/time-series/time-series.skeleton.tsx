import { cn } from '../../lib/cn.js';
import type { TimeSeriesChartSkeletonProps } from './time-series.types.js';

/** Holds the chart's geometry while the readings load, so the page does not jump when they land. */
export function TimeSeriesChartSkeleton({
  height = 260,
  label = 'Loading chart',
  className,
}: TimeSeriesChartSkeletonProps) {
  return (
    <div className={cn('cb-chart', 'cb-chart--skeleton', className)} role="status" aria-label={label}>
      <span className="cb-chart__skeleton-head" aria-hidden="true" />
      <span className="cb-chart__skeleton-plot" style={{ height }} aria-hidden="true" />
    </div>
  );
}
