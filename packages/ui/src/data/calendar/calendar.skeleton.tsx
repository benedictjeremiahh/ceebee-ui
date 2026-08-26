import { Skeleton } from '../../feedback/skeleton.js';

export interface CalendarSkeletonProps {
  weekStartsOn?: 0 | 1;
}

/** A fixed six-week placeholder matching Calendar's inline month-grid geometry. */
export function CalendarSkeleton({ weekStartsOn = 1 }: CalendarSkeletonProps) {
  return (
    <div className="cb-calendar cb-calendar--skeleton" aria-hidden="true" data-week-starts-on={weekStartsOn}>
      <div className="cb-calendar__header">
        <Skeleton.Circle size="var(--cb-control-height-sm)" />
        <Skeleton width="42%" height="var(--cb-text-sm)" />
        <Skeleton.Circle size="var(--cb-control-height-sm)" />
      </div>
      <div className="cb-calendar__weekdays">
        {Array.from({ length: 7 }, (_, index) => <Skeleton key={index} width="60%" height="var(--cb-text-xs)" />)}
      </div>
      <div className="cb-calendar__grid">
        {Array.from({ length: 42 }, (_, index) => <Skeleton key={index} className="cb-calendar__skeleton-day" />)}
      </div>
    </div>
  );
}
