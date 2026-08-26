import { Skeleton } from '../../feedback/skeleton.js';

export interface TreeSelectSkeletonProps { size?: 'sm' | 'md' | 'lg'; }
export function TreeSelectSkeleton({ size = 'md' }: TreeSelectSkeletonProps) {
  return <Skeleton className={`cb-tree-select cb-tree-select--${size} cb-tree-select--skeleton`} />;
}
