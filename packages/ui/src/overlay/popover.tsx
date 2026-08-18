'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type { ReactElement, ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export type Side = 'top' | 'right' | 'bottom' | 'left';
export type Align = 'start' | 'center' | 'end';

export interface PopoverProps {
  trigger: ReactElement;
  children: ReactNode;
  side?: Side;
  align?: Align;
  /** Distance from the anchor, in px. Keep it at the token step unless the arrow needs room. */
  sideOffset?: number;
  showArrow?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/** Positioning, dismissal, and focus return come from Base UI; this adds the surface (ADR 0003). */
export function Popover({
  trigger,
  children,
  side = 'bottom',
  align = 'center',
  sideOffset = 8,
  showArrow = true,
  open,
  onOpenChange,
  className,
}: PopoverProps) {
  return (
    <BasePopover.Root open={open} onOpenChange={onOpenChange}>
      <BasePopover.Trigger render={trigger} />
      <BasePopover.Portal>
        <BasePopover.Positioner side={side} align={align} sideOffset={sideOffset}>
          <BasePopover.Popup className={cn('cb-popover', className)}>
            {showArrow ? (
              <BasePopover.Arrow className="cb-popover__arrow">
                <ArrowShape />
              </BasePopover.Arrow>
            ) : null}
            {children}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}

export interface TooltipProps {
  children: ReactElement;
  /** Plain text. A tooltip that needs markup is a Popover — screen readers read this as a label. */
  label: string;
  side?: Side;
  delay?: number;
}

export function Tooltip({ children, label, side = 'top', delay = 400 }: TooltipProps) {
  return (
    <BaseTooltip.Provider delay={delay}>
      <BaseTooltip.Root>
        <BaseTooltip.Trigger render={children} />
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner side={side} sideOffset={6}>
            <BaseTooltip.Popup className="cb-tooltip">{label}</BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}

/**
 * The bubble's tail. Three passes in one shape, because the naive version leaves a seam:
 * the filled tail, then a line in the surface colour that erases the popup's own border
 * across the tail's base, then the two outer edges stroked back in. Without the middle
 * pass the popup border cuts straight across the tail and it reads as a patch, not a tail.
 */
export function ArrowShape() {
  return (
    <svg width="18" height="9" viewBox="0 0 18 9" fill="none" aria-hidden="true">
      <path d="M0 9C4 9 5.6 7.9 8 4.6C8.5 3.9 9.5 3.9 10 4.6C12.4 7.9 14 9 18 9Z" className="cb-arrow__fill" />
      <path d="M0 8.5H18" className="cb-arrow__seam" />
      <path d="M0 9C4 9 5.6 7.9 8 4.6C8.5 3.9 9.5 3.9 10 4.6C12.4 7.9 14 9 18 9" className="cb-arrow__stroke" />
    </svg>
  );
}
