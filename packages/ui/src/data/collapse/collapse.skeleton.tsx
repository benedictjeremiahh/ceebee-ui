import { Skeleton } from '../../feedback/skeleton.js';
import { cn } from '../../lib/cn.js';

export interface CollapseSkeletonProps {
  items?: number;
  openItems?: number[];
  lines?: number;
  size?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
  expandIconPosition?: 'start' | 'end';
  className?: string;
}

/** Matching disclosure-row geometry for a Collapse that has not loaded yet (ADR 0009). */
export function CollapseSkeleton({
  items = 3,
  openItems = [0],
  lines = 2,
  size = 'md',
  bordered = true,
  expandIconPosition = 'start',
  className,
}: CollapseSkeletonProps) {
  const openSet = new Set(openItems);

  return (
    <div
      aria-hidden="true"
      className={cn(
        'cb-collapse',
        `cb-collapse--${size}`,
        'cb-collapse--skeleton',
        bordered && 'cb-collapse--bordered',
        expandIconPosition === 'end' && 'cb-collapse--icon-end',
        className,
      )}
    >
      {Array.from({ length: items }, (_, index) => (
        <div className="cb-collapse__item" key={index}>
          <div className="cb-collapse__trigger">
            <Skeleton.Circle size="1rem" className="cb-collapse__icon" />
            <Skeleton width="42%" height="0.875rem" className="cb-collapse__label" />
          </div>
          {openSet.has(index) ? (
            <div className="cb-collapse__content">
              <Skeleton.Text lines={lines} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
