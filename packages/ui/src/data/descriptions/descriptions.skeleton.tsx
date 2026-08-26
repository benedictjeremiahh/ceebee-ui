import type { CSSProperties } from 'react';
import { Skeleton } from '../../feedback/skeleton.js';
import { cn } from '../../lib/cn.js';
import type { DescriptionsSize } from './descriptions.js';

export interface DescriptionsSkeletonProps {
  columns?: 1 | 2 | 3 | 4;
  layout?: 'horizontal' | 'vertical';
  size?: DescriptionsSize;
  bordered?: boolean;
  items?: number;
  className?: string;
}

/** Matching label/value geometry for a Descriptions record that has not loaded yet. */
export function DescriptionsSkeleton({
  columns = 3,
  layout = 'horizontal',
  size = 'md',
  bordered = false,
  items = 6,
  className,
}: DescriptionsSkeletonProps) {
  return (
    <section
      aria-hidden="true"
      className={cn(
        'cb-descriptions',
        `cb-descriptions--${size}`,
        `cb-descriptions--${layout}`,
        bordered && 'cb-descriptions--bordered',
        'cb-descriptions--skeleton',
        className,
      )}
      data-columns={columns}
      style={{ '--cb-descriptions-columns': columns } as CSSProperties}
    >
      <dl className="cb-descriptions__list">
        {Array.from({ length: items }, (_, index) => (
          <div className="cb-descriptions__item" key={index}>
            <dt className="cb-descriptions__label cb-descriptions__skeleton-label"><Skeleton /></dt>
            <dd className="cb-descriptions__value cb-descriptions__skeleton-value"><Skeleton /></dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
