import { cn } from '../../lib/cn.js';
import type { ProgressCurveSkeletonProps } from './progress-curve.types.js';

/** Holds the chart's geometry while the readings load, so the page does not jump when they land. */
export function ProgressCurveSkeleton({
  height = 260,
  label = 'Loading progress',
  className,
}: ProgressCurveSkeletonProps) {
  return (
    <div className={cn('cb-progress-curve', 'cb-progress-curve--skeleton', className)} role="status" aria-label={label}>
      <span className="cb-progress-curve__skeleton-head" aria-hidden="true" />
      <span className="cb-progress-curve__skeleton-reading" aria-hidden="true" />
      <span className="cb-progress-curve__skeleton-plot" style={{ height }} aria-hidden="true" />
    </div>
  );
}
