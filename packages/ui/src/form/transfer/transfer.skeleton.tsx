import { Skeleton } from '../../feedback/skeleton.js';

export interface TransferSkeletonProps {
  items?: number;
}

/** Static two-list loading geometry matching Transfer without controls or destination state. */
export function TransferSkeleton({ items = 4 }: TransferSkeletonProps) {
  return (
    <div className="cb-transfer cb-transfer--skeleton" aria-hidden="true">
      <TransferSkeletonList items={items} />
      <div className="cb-transfer__actions">
        <span className="cb-skeleton cb-transfer__skeleton-action" />
        <span className="cb-skeleton cb-transfer__skeleton-action" />
      </div>
      <TransferSkeletonList items={items} />
    </div>
  );
}

function TransferSkeletonList({ items }: { items: number }) {
  return (
    <div className="cb-transfer__list">
      <Skeleton className="cb-transfer__skeleton-title" />
      <ul className="cb-transfer__items">
        {Array.from({ length: items }, (_, index) => (
          <li className="cb-transfer__item" key={index}>
            <span className="cb-skeleton cb-transfer__skeleton-checkbox" />
            <Skeleton className="cb-transfer__skeleton-label" />
          </li>
        ))}
      </ul>
    </div>
  );
}
