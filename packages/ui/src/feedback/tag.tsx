'use client';

import { X } from 'lucide-react';
import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { useLabels } from '../lib/labels.js';
import { cn, type Tone } from '../lib/cn.js';

export interface TagProps {
  children: ReactNode;
  tone?: Tone;
  variant?: 'soft' | 'solid' | 'outline';
  size?: 'sm' | 'md';
  icon?: ReactNode;
  /** Makes the tag itself pressable — filtering by it, or opening what it names. */
  onClick?: () => void;
  /** Whether a pressable tag is currently on. Reported as `aria-pressed`. */
  pressed?: boolean;
  /** Adds a control that takes the tag away. Not the same as pressing it. */
  onClose?: () => void;
  /** Render something else in the tag's place — a router's own Link. */
  render?: ReactElement;
  className?: string;
}

/**
 * A label you can do something to.
 *
 * `Badge` is the one you cannot: it says what something is and nothing more, and
 * its own note says that a label which can be pressed or removed is this instead.
 * That is the whole boundary between them — not the size, not the colour, but
 * whether there is anything to press (ADR 0014). They share the look and differ
 * in what they are.
 *
 * Pressing and removing are also two different things, so they are two props. A
 * tag that filters by its own value and a tag that takes itself off a list are
 * not the same gesture, and one component that guessed which you meant would be
 * wrong half the time.
 */
export function Tag({
  children,
  tone = 'neutral',
  variant = 'soft',
  size = 'md',
  icon,
  onClick,
  pressed,
  onClose,
  render,
  className,
}: TagProps) {
  const labels = useLabels();
  const classes = cn('cb-badge', 'cb-tag', `cb-badge--${variant}`, `cb-badge--${size}`, className);
  const body = (
    <>
      {icon}
      {children}
    </>
  );

  if (render && isValidElement(render)) {
    return cloneElement(render as ReactElement<Record<string, unknown>>, {
      className: cn(classes, 'cb-tag--pressable', (render.props as { className?: string }).className),
      'data-tone': tone,
      children: body,
    });
  }

  /* A tag that removes itself holds a button, so it cannot be one — a button
     inside a button is invalid, and the row would have two answers to one press. */
  if (onClose) {
    return (
      <span className={classes} data-tone={tone}>
        {body}
        <button type="button" className="cb-tag__close" aria-label={labels.dismiss} onClick={onClose}>
          <X size={12} />
        </button>
      </span>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        className={cn(classes, 'cb-tag--pressable')}
        data-tone={tone}
        aria-pressed={pressed}
        onClick={onClick}
      >
        {body}
      </button>
    );
  }

  return (
    <span className={classes} data-tone={tone}>
      {body}
    </span>
  );
}
