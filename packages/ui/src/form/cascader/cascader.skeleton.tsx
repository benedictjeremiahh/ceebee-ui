import { Skeleton } from '../../feedback/skeleton.js';

export interface CascaderSkeletonProps {
  rows?: number;
}

export function CascaderSkeleton({ rows = 3 }: CascaderSkeletonProps) {
  return (
    <div className="cb-cascader cb-cascader--skeleton" aria-hidden="true">
      <Skeleton className="cb-cascader__skeleton-label" />
      <ChevronPlaceholder />
      <div className="cb-cascader__skeleton-menu">
        {Array.from({ length: rows }, (_, index) => <Skeleton key={index} height="var(--cb-control-height-sm)" />)}
      </div>
    </div>
  );
}

function ChevronPlaceholder() {
  return <Skeleton.Circle size="var(--cb-space-4)" />;
}
