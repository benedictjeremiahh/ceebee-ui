import { Skeleton } from '../feedback/skeleton.js';
import { cn } from '../lib/cn.js';

export interface ModalSkeletonProps {
  size?: 'sm' | 'md' | 'lg';
  lines?: number;
  withActions?: boolean;
  className?: string;
}

/** Static loading geometry for content that will resolve into a Modal (ADR 0009). */
export function ModalSkeleton({
  size = 'md',
  lines = 3,
  withActions = true,
  className,
}: ModalSkeletonProps) {
  return (
    <div
      className={cn('cb-modal-skeleton', `cb-modal--${size}`, className)}
      aria-hidden="true"
    >
      <Skeleton width="48%" height="1.125rem" />
      <div className="cb-modal-skeleton__body">
        <Skeleton.Text lines={lines} />
      </div>
      {withActions ? (
        <div className="cb-modal__footer">
          <Skeleton width="5rem" height="2.5rem" />
          <Skeleton width="5rem" height="2.5rem" />
        </div>
      ) : null}
    </div>
  );
}
