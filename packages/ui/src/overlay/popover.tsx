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

/** Shared arrow, drawn rather than rotated so the border stays a single hairline. */
export function ArrowShape() {
  return (
    <svg width="14" height="7" viewBox="0 0 14 7" fill="none" aria-hidden="true">
      <path d="M0 7L7 0L14 7" className="cb-arrow__fill" />
      <path d="M0 7L7 0L14 7" className="cb-arrow__stroke" fill="none" />
    </svg>
  );
}
