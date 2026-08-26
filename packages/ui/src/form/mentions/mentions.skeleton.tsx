import { Skeleton } from '../../feedback/skeleton.js';

export interface MentionsSkeletonProps {
  rows?: number;
}

export function MentionsSkeleton({ rows = 3 }: MentionsSkeletonProps) {
  return (
    <div className="cb-mentions cb-mentions--skeleton" aria-hidden="true">
      <Skeleton.Text lines={rows} />
    </div>
  );
}
