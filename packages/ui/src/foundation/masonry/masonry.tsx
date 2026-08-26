import { Children, Fragment, isValidElement, type CSSProperties, type ReactNode } from 'react';
import { cn } from '../../lib/cn.js';
import { MasonrySkeleton } from './masonry.skeleton.js';

export type MasonryColumns = 1 | 2 | 3 | 4;
export type MasonryStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

function normalizeChildren(children: ReactNode): ReactNode[] {
  return Children.toArray(children).flatMap((child) =>
    isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment
      ? normalizeChildren(child.props.children)
      : [child],
  );
}

export interface MasonryProps {
  /** Column count at the widest breakpoint; the layout collapses below it. */
  columns?: MasonryColumns;
  /** Gap Token shared by both the column and item axes. */
  gap?: MasonryStep;
  className?: string;
  children?: ReactNode;
}

function MasonryRoot({ columns = 3, gap = 4, className, children }: MasonryProps) {
  const style = {
    '--cb-masonry-columns': String(columns),
    '--cb-masonry-gap': `var(--cb-space-${gap})`,
  } as CSSProperties;
  const items = normalizeChildren(children);

  return (
    <div
      className={cn('cb-masonry', className)}
      style={style}
      data-columns={columns}
      data-gap={gap}
    >
      {items.map((child, index) => (
        <div className="cb-masonry__item" key={`item-${index}`}>
          {child}
        </div>
      ))}
    </div>
  );
}

export const Masonry = Object.assign(MasonryRoot, { Skeleton: MasonrySkeleton });
