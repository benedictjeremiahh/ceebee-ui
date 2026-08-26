import type { CSSProperties } from 'react';
import { Skeleton } from '../../feedback/skeleton.js';
import { cn } from '../../lib/cn.js';
import type { MasonryColumns, MasonryStep } from './masonry.js';

export interface MasonrySkeletonProps {
  items?: number;
  columns?: MasonryColumns;
  gap?: MasonryStep;
  className?: string;
}

export function MasonrySkeleton({ items = 6, columns = 3, gap = 4, className }: MasonrySkeletonProps) {
  const style = {
    '--cb-masonry-columns': String(columns),
    '--cb-masonry-gap': `var(--cb-space-${gap})`,
  } as CSSProperties;
  return (
    <div
      className={cn('cb-masonry', 'cb-masonry--skeleton', className)}
      style={style}
      data-columns={columns}
      data-gap={gap}
      aria-hidden="true"
    >
      {Array.from({ length: items }, (_, index) => (
        <div className="cb-masonry__item" key={index}>
          <Skeleton className={cn('cb-masonry__skeleton-item', `cb-masonry__skeleton-item--${index % 3}`)} />
        </div>
      ))}
    </div>
  );
}
