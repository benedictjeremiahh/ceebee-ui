'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export interface DrawerProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  /** The element that opens it. Omit for a fully controlled drawer. */
  trigger?: ReactNode;
  className?: string;
}

/**
 * Modal navigation or task panel anchored to the inline end edge. Base UI supplies
 * focus trapping, dismissal, scroll locking, and accessible dialog semantics.
 */
export function Drawer({
  open,
  defaultOpen,
  onOpenChange,
  title,
  description,
  children,
  footer,
  trigger,
  className,
}: DrawerProps) {
  return (
    <BaseDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <BaseDialog.Trigger render={trigger as never} /> : null}
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="cb-drawer__backdrop" />
        <BaseDialog.Popup className={cn('cb-drawer', className)}>
          <BaseDialog.Title className="cb-drawer__title">{title}</BaseDialog.Title>
          {description ? (
            <BaseDialog.Description className="cb-drawer__description">{description}</BaseDialog.Description>
          ) : null}
          {children ? <div className="cb-drawer__body">{children}</div> : null}
          {footer ? <div className="cb-drawer__footer">{footer}</div> : null}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

export const DrawerClose = BaseDialog.Close;
