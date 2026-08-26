import { Skeleton } from '../../feedback/skeleton.js';
import { cn } from '../../lib/cn.js';

export interface TreeSkeletonProps {
  items?: number;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  'aria-label'?: string;
}

/** Placeholder geometry for an inline tree whose static nodes are still loading. */
export function TreeSkeleton({ items = 5, size = 'md', tone = 'brand', 'aria-label': ariaLabel = 'Loading tree' }: TreeSkeletonProps) {
  return (
    <div role="tree" aria-label={ariaLabel} aria-hidden="true" className={cn('cb-tree', `cb-tree--${size}`, `cb-tree--${tone}`, 'cb-tree--skeleton')}>
      <div role="group" className="cb-tree__group">
        {Array.from({ length: items }, (_, index) => (
          <div className="cb-tree__node" key={index}>
            <Skeleton className={cn('cb-tree__skeleton-line', index % 3 === 0 && 'cb-tree__skeleton-line--long')} />
          </div>
        ))}
      </div>
    </div>
  );
}
