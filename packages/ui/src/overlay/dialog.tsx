'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** Slides from the edge instead of scaling in the centre. */
  placement?: 'center' | 'end';
  /** The element that opens it. Omit for a fully controlled dialog. */
  trigger?: ReactNode;
  className?: string;
}

/**
 * Focus trapping, scroll locking, dismissal, and the `aria-labelledby` wiring are Base UI's
 * (ADR 0003). Enter and exit are CSS transitions driven by Base UI's own state attributes,
 * because Base UI owns this element's mount lifecycle — motion is used where we own it.
 */
export function Dialog({
  open,
  defaultOpen,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
  placement = 'center',
  trigger,
  className,
}: DialogProps) {
  return (
    <BaseDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <BaseDialog.Trigger render={trigger as never} /> : null}
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="cb-dialog__backdrop" />
        <BaseDialog.Popup
          className={cn('cb-dialog', `cb-dialog--${size}`, `cb-dialog--${placement}`, className)}
        >
          <BaseDialog.Title className="cb-dialog__title">{title}</BaseDialog.Title>
          {description ? (
            <BaseDialog.Description className="cb-dialog__description">{description}</BaseDialog.Description>
          ) : null}
          {children ? <div className="cb-dialog__body">{children}</div> : null}
          {footer ? <div className="cb-dialog__footer">{footer}</div> : null}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

export const DialogClose = BaseDialog.Close;
