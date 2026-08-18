import type { CSSProperties } from 'react';
import { cn } from '../lib/cn.js';

export interface SkeletonProps {
  width?: string;
  height?: string;
  radius?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

function box({ width = '100%', height = '1rem', radius = 'md', className }: SkeletonProps) {
  const style = { '--cb-skeleton-w': width, '--cb-skeleton-h': height } as CSSProperties;
  return <span aria-hidden="true" className={cn('cb-skeleton', `cb-radius--${radius}`, className)} style={style} />;
}

export interface SkeletonTextProps {
  lines?: number;
  /** Width of the last line, which is short in real text and should be short here too. */
  lastLineWidth?: string;
  className?: string;
}

function text({ lines = 3, lastLineWidth = '62%', className }: SkeletonTextProps) {
  return (
    <span className={cn('cb-skeleton-text', className)}>
      {Array.from({ length: lines }, (_, i) => (
        <SkeletonBox key={i} height="0.75rem" width={i === lines - 1 ? lastLineWidth : '100%'} />
      ))}
    </span>
  );
}

function circle({ size = '2.5rem', className }: { size?: string; className?: string }) {
  return <SkeletonBox width={size} height={size} radius="full" className={className} />;
}

const SkeletonBox = box;

/**
 * Placeholder shapes. Free-form cases use these; every Composition also ships its own
 * `.Skeleton` built from the same tokens as the real thing, so the two cannot drift (ADR 0009).
 */
export const Skeleton = Object.assign(box, {
  Text: text,
  Circle: circle,
  Rect: box,
});
