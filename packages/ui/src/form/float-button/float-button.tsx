'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { cn, type Size, type Tone } from '../../lib/cn.js';

export type FloatButtonPlacement = 'bottom-start' | 'bottom-end';

type NativeFloatButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'className' | 'color' | 'role' | 'style'
>;

type FloatButtonCommonProps = NativeFloatButtonProps & {
  /** Required accessible name. It is also rendered when `visibleLabel` is enabled. */
  label: string;
  tone?: Tone;
  size?: Size;
  placement?: FloatButtonPlacement;
  /** These native escape hatches are rejected so FloatButton owns its name and fixed layout. */
  'aria-label'?: never;
  'aria-labelledby'?: never;
  style?: never;
};

export type FloatButtonProps = FloatButtonCommonProps & (
  | {
      /** Renders `label` beside the optional icon. */
      visibleLabel: true;
      icon?: ReactNode;
    }
  | {
      /** An icon-only action must still expose a visible affordance. */
      visibleLabel?: false;
      icon: ReactElement;
    }
);

/**
 * A persistent, fixed-viewport action. It intentionally remains one native
 * button: navigation, grouped actions, and scroll-to-top behaviour are separate
 * contracts rather than variants of this component.
 */
export const FloatButton = forwardRef<HTMLButtonElement, FloatButtonProps>(function FloatButton(
  {
    label,
    visibleLabel = false,
    icon,
    tone = 'brand',
    size = 'md',
    placement = 'bottom-end',
    type = 'button',
    'aria-label': _ariaLabel,
    'aria-labelledby': _ariaLabelledBy,
    style: _style,
    ...rest
  },
  ref,
) {
  const {
    className: _className,
    role: _role,
    color: _color,
    children: _children,
    'data-tone': _dataTone,
    ...safeRest
  } = rest as typeof rest & {
    className?: unknown;
    role?: unknown;
    color?: unknown;
    children?: unknown;
    'data-tone'?: unknown;
  };

  return (
    <button
      ref={ref}
      type={type}
      {...safeRest}
      className={cn(
        'cb-float-button',
        `cb-float-button--${size}`,
        `cb-float-button--${placement}`,
        visibleLabel && 'cb-float-button--label-visible',
      )}
      data-tone={tone}
      aria-label={label}
    >
      {icon ? <span className="cb-float-button__icon" aria-hidden="true">{icon}</span> : null}
      {visibleLabel ? <span className="cb-float-button__label">{label}</span> : null}
    </button>
  );
});
