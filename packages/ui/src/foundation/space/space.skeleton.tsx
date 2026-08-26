import type { CSSProperties } from 'react';
import { Skeleton } from '../../feedback/skeleton.js';
import { cn } from '../../lib/cn.js';
import type { SpaceDirection, SpaceSize, SpaceStep } from './space.js';

export interface SpaceSkeletonProps {
  items?: number;
  direction?: SpaceDirection;
  size?: SpaceSize;
  wrap?: boolean;
  className?: string;
}

const sizeSteps: Record<Exclude<SpaceSize, SpaceStep>, SpaceStep> = {
  small: 2,
  middle: 3,
  large: 4,
};

function stepFor(size: SpaceSize): SpaceStep {
  return typeof size === 'number' ? size : sizeSteps[size];
}

export function SpaceSkeleton({ items = 3, direction = 'horizontal', size = 'small', wrap = false, className }: SpaceSkeletonProps) {
  const style = { '--cb-space-gap': `var(--cb-space-${stepFor(size)})` } as CSSProperties;
  return (
    <div
      className={cn(
        'cb-space',
        'cb-space--skeleton',
        `cb-space--${direction}`,
        'cb-space--align-center',
        wrap && 'cb-space--wrap',
        className,
      )}
      style={style}
      aria-hidden="true"
    >
      {Array.from({ length: items }, (_, index) => (
        <span className="cb-space__item" key={index}>
          <Skeleton className="cb-space__skeleton-item" />
        </span>
      ))}
    </div>
  );
}
