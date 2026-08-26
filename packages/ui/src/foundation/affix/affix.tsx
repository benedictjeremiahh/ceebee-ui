import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../lib/cn.js';

export type AffixEdge = 'top' | 'bottom';
export type AffixOffset = 'sm' | 'md' | 'lg';

export interface AffixProps {
  /** Edge of the nearest scroll container where the content should stick. */
  edge?: AffixEdge;
  /** Spacing Token used as the sticky inset from the selected edge. */
  offset?: AffixOffset;
  children?: ReactNode;
}

/**
 * Server-safe sticky layout atom. The nearest scroll container owns the scroll
 * context; Affix only supplies sticky positioning and a semantic stacking rung.
 */
export function Affix({ edge = 'top', offset = 'md', children }: AffixProps) {
  const style = { '--cb-affix-offset': `var(--cb-space-${offset === 'sm' ? 2 : offset === 'md' ? 4 : 6})` } as CSSProperties;

  return (
    <div className={cn('cb-affix', `cb-affix--${edge}`, `cb-affix--offset-${offset}`)} style={style} data-edge={edge} data-offset={offset}>
      {children}
    </div>
  );
}
