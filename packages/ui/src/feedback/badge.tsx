import type { ReactNode } from 'react';
import { cn, type Tone } from '../lib/cn.js';

export interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  variant?: 'soft' | 'solid' | 'outline';
  size?: 'sm' | 'md';
  /** Leading dot — for status, where the colour alone would be the only signal. */
  dot?: boolean;
  className?: string;
}

/** A label, not a button. If it can be clicked or removed, it is a Tag and needs a control. */
export function Badge({ children, tone = 'neutral', variant = 'soft', size = 'md', dot, className }: BadgeProps) {
  return (
    <span className={cn('cb-badge', `cb-badge--${variant}`, `cb-badge--${size}`, className)} data-tone={tone}>
      {dot ? <span className="cb-badge__dot" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
