'use client';
import { Skeleton } from 'antd';

export interface ScheduleSkeletonProps {
  height?: number;
  label?: string;
}

export function ScheduleSkeleton({ height = 320, label = 'Loading schedule' }: ScheduleSkeletonProps) {
  return (
    <div
      className="cb-schedule cb-schedule__loading"
      style={{ height }}
      role="status"
      aria-label={label}
      aria-busy="true"
    >
      <Skeleton active title={false} paragraph={{ rows: 4 }} />
    </div>
  );
}
