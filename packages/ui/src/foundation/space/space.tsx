import { Children, Fragment, isValidElement, type CSSProperties, type ReactNode } from 'react';
import { cn } from '../../lib/cn.js';
import { SpaceSkeleton } from './space.skeleton.js';

export type SpaceStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type SpaceSize = SpaceStep | 'small' | 'middle' | 'large';
export type SpaceDirection = 'horizontal' | 'vertical';
export type SpaceAlign = 'start' | 'center' | 'end' | 'baseline' | 'stretch';

const sizeSteps: Record<Exclude<SpaceSize, SpaceStep>, SpaceStep> = {
  small: 2,
  middle: 3,
  large: 4,
};

function stepFor(size: SpaceSize): SpaceStep {
  return typeof size === 'number' ? size : sizeSteps[size];
}

function normalizeChildren(children: ReactNode): ReactNode[] {
  return Children.toArray(children).flatMap((child) =>
    isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment
      ? normalizeChildren(child.props.children)
      : [child],
  );
}

export interface SpaceProps {
  direction?: SpaceDirection;
  size?: SpaceSize;
  align?: SpaceAlign;
  wrap?: boolean;
  split?: ReactNode;
  className?: string;
  children?: ReactNode;
}

function SpaceRoot({
  direction = 'horizontal',
  size = 'small',
  align = 'center',
  wrap = false,
  split,
  className,
  children,
}: SpaceProps) {
  const style = { '--cb-space-gap': `var(--cb-space-${stepFor(size)})` } as CSSProperties;
  const items = normalizeChildren(children);
  const renderedItems = items.map((child, index) => (
    <span className="cb-space__item" key={`item-${index}`}>
      {child}
    </span>
  ));

  return (
    <div
      className={cn(
        'cb-space',
        `cb-space--${direction}`,
        `cb-space--align-${align}`,
        wrap && 'cb-space--wrap',
        className,
      )}
      style={style}
    >
      {renderedItems.flatMap((item, index) =>
        split != null && index < items.length - 1
          ? [item, <span className="cb-space__split" aria-hidden="true" key={`split-${index}`}>{split}</span>]
          : [item],
      )}
    </div>
  );
}

export interface SpaceCompactProps {
  direction?: SpaceDirection;
  className?: string;
  children?: ReactNode;
}

function SpaceCompact({ direction = 'horizontal', className, children }: SpaceCompactProps) {
  return (
    <div className={cn('cb-space-compact', `cb-space-compact--${direction}`, className)}>
      {children}
    </div>
  );
}

export const Space = Object.assign(SpaceRoot, {
  Compact: SpaceCompact,
  Skeleton: SpaceSkeleton,
});
