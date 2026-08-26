import { Skeleton } from '../../feedback/skeleton.js';

export interface ListySkeletonProps {
  items?: number;
  grouped?: boolean;
}

export function ListySkeleton({ items = 5, grouped = false }: ListySkeletonProps) {
  return (
    <ul className="cb-listy cb-listy--skeleton" aria-hidden="true">
      <li className={grouped ? 'cb-listy__group' : 'cb-listy__section'}>
        {grouped ? <Skeleton className="cb-listy__skeleton-heading" /> : null}
        <ul className={grouped ? 'cb-listy__group-items' : 'cb-listy__section-items'}>
          {Array.from({ length: items }, (_, index) => <li className="cb-listy__item" key={index}><Skeleton className="cb-listy__skeleton-row" /></li>)}
        </ul>
      </li>
    </ul>
  );
}
