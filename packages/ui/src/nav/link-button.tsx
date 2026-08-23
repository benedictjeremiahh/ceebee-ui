import { cloneElement, isValidElement, type AnchorHTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { cn, type Size, type Tone } from '../lib/cn.js';

export interface LinkButtonProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> {
  variant?: 'solid' | 'soft' | 'outline' | 'ghost';
  tone?: Tone;
  size?: Size;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  children?: ReactNode;
  /**
   * Render something else in the anchor's place — a router's own Link, which has
   * to stay itself or client-side navigation is lost. It receives the classes
   * and the tone; everything else it keeps. The same `render` seam Base UI uses
   * elsewhere in this library.
   */
  render?: ReactElement;
}

/**
 * A link wearing a button's clothes.
 *
 * Not a `Button` with an `href`. A link navigates and a button acts, and the
 * difference is not decoration: a link can be opened in a new tab, copied,
 * dragged to a bookmark bar and reached by a screen reader's list of links,
 * while a button can be disabled and submit a form. Those are different
 * contracts, so they are different components (ADR 0014).
 *
 * What they share is the look, and that is shared literally — the same
 * `cb-button` classes rather than a second set that would agree today and drift
 * apart later. It is server-safe: an anchor needs no hook, no handler and no
 * motion, so it stays a Server Component (ADR 0004). The press animation is
 * Button's alone, which is honest: a link does not depress, it goes somewhere.
 */
export function LinkButton({
  variant = 'solid',
  tone = 'brand',
  size = 'md',
  iconStart,
  iconEnd,
  className,
  children,
  render,
  ...rest
}: LinkButtonProps) {
  const iconOnly = children === undefined || children === null || children === false || children === '';
  const classes = cn(
    'cb-button',
    'cb-link-button',
    `cb-button--${variant}`,
    `cb-button--${size}`,
    iconOnly && 'cb-button--icon',
    className,
  );
  const body = (
    <>
      {iconStart}
      {iconOnly ? null : <span className="cb-button__label">{children}</span>}
      {iconOnly ? null : iconEnd}
    </>
  );

  if (render && isValidElement(render)) {
    return cloneElement(render as ReactElement<Record<string, unknown>>, {
      className: cn(classes, (render.props as { className?: string }).className),
      'data-tone': tone,
      ...rest,
      children: body,
    });
  }

  return (
    <a
      className={cn(
        'cb-button',
        'cb-link-button',
        `cb-button--${variant}`,
        `cb-button--${size}`,
        iconOnly && 'cb-button--icon',
        className,
      )}
      data-tone={tone}
      {...rest}
    >
      {body}
    </a>
  );
}
