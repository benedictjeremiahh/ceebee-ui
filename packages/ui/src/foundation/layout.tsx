import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../lib/cn.js';

type SpaceStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface StackProps {
  direction?: 'row' | 'column';
  gap?: SpaceStep;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between';
  wrap?: boolean;
  className?: string;
  children?: ReactNode;
}

/** Flex layout whose gap can only be a spacing token — the reason the library has no raw padding. */
export function Flex({
  direction = 'column',
  gap = 4,
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className,
  children,
}: StackProps) {
  const style = { '--cb-flex-gap': `var(--cb-space-${gap})` } as CSSProperties;
  return (
    <div
      className={cn('cb-flex', `cb-flex--${direction}`, wrap && 'cb-flex--wrap', className)}
      style={style}
      data-align={align}
      data-justify={justify}
    >
      {children}
    </div>
  );
}

export interface GridProps {
  /** Column count at the widest breakpoint; the grid collapses on its own below it. */
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: SpaceStep;
  minItemWidth?: string;
  className?: string;
  children?: ReactNode;
}

export function Grid({ columns = 3, gap = 4, minItemWidth, className, children }: GridProps) {
  const style = {
    '--cb-grid-gap': `var(--cb-space-${gap})`,
    '--cb-grid-columns': String(columns),
    ...(minItemWidth ? { '--cb-grid-min': minItemWidth } : {}),
  } as CSSProperties;
  return (
    <div className={cn('cb-grid', minItemWidth && 'cb-grid--auto', className)} style={style}>
      {children}
    </div>
  );
}

export interface ContainerProps {
  size?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
  children?: ReactNode;
}

export function Container({ size = 'lg', className, children }: ContainerProps) {
  return <div className={cn('cb-container', `cb-container--${size}`, className)}>{children}</div>;
}
