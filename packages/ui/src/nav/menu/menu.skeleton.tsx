import { Skeleton } from '../../feedback/skeleton.js';
import { cn } from '../../lib/cn.js';

export interface MenuSkeletonProps {
  items?: number;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  'aria-label'?: string;
}

/** Placeholder rows for a persistent navigation menu whose destinations have not loaded yet. */
export function MenuSkeleton({
  items = 4,
  size = 'md',
  tone = 'brand',
  'aria-label': ariaLabel = 'Loading navigation',
}: MenuSkeletonProps) {
  return (
    <nav
      aria-label={ariaLabel}
      aria-hidden="true"
      className={cn('cb-persistent-menu', `cb-persistent-menu--${size}`, `cb-persistent-menu--${tone}`, 'cb-persistent-menu--skeleton')}
    >
      <ul className="cb-persistent-menu__list">
        {Array.from({ length: items }, (_, index) => (
          <li className="cb-persistent-menu__item" key={index}>
            <Skeleton className={cn('cb-persistent-menu__skeleton-line', index % 3 === 0 && 'cb-persistent-menu__skeleton-line--long')} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
