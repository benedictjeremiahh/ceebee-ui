import type { CSSProperties } from 'react';
import { Skeleton } from '../../feedback/skeleton.js';
import type { SplitterHandleSize, SplitterOrientation } from './splitter.js';

export interface SplitterSkeletonProps {
  orientation?: SplitterOrientation;
  size?: number;
  handleSize?: SplitterHandleSize;
}

export function SplitterSkeleton({
  orientation = 'horizontal',
  size = 50,
  handleSize = 'md',
}: SplitterSkeletonProps) {
  const safeSize = Number.isFinite(size) ? size : 50;
  const boundedSize = Math.min(100, Math.max(0, Math.round(safeSize)));
  const style = {
    '--cb-splitter-first-grow': String(boundedSize),
    '--cb-splitter-second-grow': String(100 - boundedSize),
  } as CSSProperties;
  return (
    <div
      className={`cb-splitter cb-splitter--skeleton cb-splitter--${orientation} cb-splitter--handle-${handleSize}`}
      style={style}
      aria-hidden="true"
    >
      <div className="cb-splitter__pane cb-splitter__pane--first"><Skeleton className="cb-splitter__skeleton-pane" /></div>
      <div className="cb-splitter__handle" />
      <div className="cb-splitter__pane cb-splitter__pane--second"><Skeleton className="cb-splitter__skeleton-pane" /></div>
    </div>
  );
}
