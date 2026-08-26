'use client';

import type { ReactNode } from 'react';
import { cn, type Size, type Tone } from '../../lib/cn.js';

export interface BorderBeamProps {
  /** Content keeps its own semantics and interactions; the beam is decorative. */
  children: ReactNode;
  tone?: Tone;
  /** Controls the beam thickness and the geometry of its visible sweep. */
  size?: Size;
  /** Opt out of the decorative movement while retaining a visible border. */
  motion?: boolean;
}

/**
 * Wraps content with a decorative moving border. The overlay is deliberately
 * not an interaction layer: it is hidden from assistive technology and cannot
 * intercept pointer events.
 */
export function BorderBeam({ children, tone = 'brand', size = 'md', motion = true }: BorderBeamProps) {
  return (
    <div className={cn('cb-border-beam', `cb-border-beam--${size}`)} data-tone={tone} data-motion={motion ? 'on' : 'off'}>
      <span className="cb-border-beam__overlay" aria-hidden="true" />
      <div className="cb-border-beam__content">{children}</div>
    </div>
  );
}
