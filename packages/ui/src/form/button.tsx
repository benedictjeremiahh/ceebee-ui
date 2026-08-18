'use client';

import { motion } from 'motion/react';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn, type Size, type Tone } from '../lib/cn.js';
import { useMotionSettings } from '../motion/motion-provider.js';

/** Motion redefines the drag and animation event handlers, so the DOM versions are dropped
 *  rather than silently conflicting. A button that needs HTML5 drag is not this component. */
type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'color' | 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'
>;

export interface ButtonProps extends NativeButtonProps {
  variant?: 'solid' | 'soft' | 'outline' | 'ghost';
  tone?: Tone;
  size?: Size;
  /** Shown instead of the label, with the button held at its current width. */
  loading?: boolean;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  /** Opts this button out of press feedback without touching the provider. */
  motion?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'solid',
    tone = 'brand',
    size = 'md',
    loading = false,
    iconStart,
    iconEnd,
    motion: motionProp = true,
    className,
    children,
    disabled,
    ...rest
  },
  ref,
) {
  const { enabled, spring } = useMotionSettings();
  const animate = enabled && motionProp;

  return (
    <motion.button
      ref={ref}
      className={cn('cb-button', `cb-button--${variant}`, `cb-button--${size}`, className)}
      data-tone={tone}
      data-loading={loading || undefined}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      whileTap={animate ? { scale: 0.97 } : undefined}
      whileHover={animate ? { y: -1 } : undefined}
      transition={spring('snappy')}
      {...rest}
    >
      {loading ? <span className="cb-button__spinner" aria-hidden="true" /> : iconStart}
      <span className="cb-button__label">{children}</span>
      {loading ? null : iconEnd}
    </motion.button>
  );
});
