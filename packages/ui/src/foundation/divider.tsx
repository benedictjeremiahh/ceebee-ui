import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export interface DividerProps {
  /** A word or two sitting in the rule, for a section break that names itself. */
  children?: ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

/**
 * A rule between things.
 *
 * `<hr>` when it separates content, because that is what the element means and
 * a screen reader announces it. With a label it becomes a `<div>` carrying the
 * rule in its borders instead — an `<hr>` may not contain anything, and a
 * separator that says which section is starting is worth more than the element.
 */
export function Divider({ children, orientation = 'horizontal', className }: DividerProps) {
  if (orientation === 'vertical') {
    return <span className={cn('cb-divider', 'cb-divider--vertical', className)} role="separator" aria-orientation="vertical" />;
  }

  if (children) {
    return (
      <div className={cn('cb-divider', 'cb-divider--labelled', className)} role="separator">
        <span className="cb-divider__label">{children}</span>
      </div>
    );
  }

  return <hr className={cn('cb-divider', className)} />;
}
