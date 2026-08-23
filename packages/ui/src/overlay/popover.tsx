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
        <BasePopover.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          className="cb-popover-positioner"
        >
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
  align?: Align;
  /** Distance from the anchor, in px. */
  sideOffset?: number;
  showArrow?: boolean;
  delay?: number;
}

export function Tooltip({
  children,
  label,
  side = 'top',
  align = 'center',
  sideOffset = 6,
  showArrow = true,
  delay = 400,
}: TooltipProps) {
  return (
    <BaseTooltip.Provider delay={delay}>
      <BaseTooltip.Root>
        <BaseTooltip.Trigger render={children} />
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner
            side={side}
            align={align}
            sideOffset={sideOffset}
            className="cb-tooltip-positioner"
          >
            <BaseTooltip.Popup className="cb-tooltip">
              {showArrow ? (
                <BaseTooltip.Arrow className="cb-tooltip__arrow">
                  <ArrowShape />
                </BaseTooltip.Arrow>
              ) : null}
              {label}
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}

/**
 * The bubble's tail is drawn in CSS inside Base UI's positioned, direction-aware Arrow wrapper.
 * Kept private and shared so Popover, Tooltip, and Coachmark cannot drift apart.
 */
export function ArrowShape() {
  return (
    <svg
      className="cb-arrow"
      viewBox="0 0 16 8"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path className="cb-arrow__fill" d="M0 8 L8 0 L16 8 Z" />
      <path className="cb-arrow__edge" d="M0 8 L8 0 L16 8" />
    </svg>
  );
}
