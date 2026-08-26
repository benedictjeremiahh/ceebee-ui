import { Skeleton } from '../../feedback/skeleton.js';
import { cn } from '../../lib/cn.js';

export interface AnchorSkeletonProps {
  items?: number;
  orientation?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  'aria-label'?: string;
}

/** Matching link geometry for an Anchor whose section labels have not loaded yet. */
export function AnchorSkeleton({
  items = 4,
  orientation = 'vertical',
  size = 'md',
  tone = 'brand',
  'aria-label': ariaLabel = 'Loading on this page navigation',
}: AnchorSkeletonProps) {
  return (
    <nav
      aria-label={ariaLabel}
      aria-hidden="true"
      className={cn('cb-anchor', `cb-anchor--${orientation}`, `cb-anchor--${size}`, `cb-anchor--${tone}`, 'cb-anchor--skeleton')}
    >
      <ul className="cb-anchor__list">
        {Array.from({ length: items }, (_, index) => (
          <li className="cb-anchor__item" key={index}>
            <Skeleton className={cn('cb-anchor__skeleton-link', index % 3 === 0 && 'cb-anchor__skeleton-link--long')} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
