'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn, type Tone } from '../lib/cn.js';
import { ModalSkeleton } from './modal.skeleton.js';

const CONFIRM_ICONS: Record<Tone, ReactNode> = {
  neutral: <Info size={20} />,
  brand: <Info size={20} />,
  info: <Info size={20} />,
  success: <CheckCircle2 size={20} />,
  warning: <AlertTriangle size={20} />,
  danger: <XCircle size={20} />,
};

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
function ModalRoot({
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
        <BaseDialog.Backdrop className="cb-modal__backdrop" />
        <BaseDialog.Popup
          className={cn('cb-modal', `cb-modal--${size}`, `cb-modal--${placement}`, className)}
        >
          <BaseDialog.Title className="cb-modal__title">{title}</BaseDialog.Title>
          {description ? (
            <BaseDialog.Description className="cb-modal__description">{description}</BaseDialog.Description>
          ) : null}
          {children ? <div className="cb-modal__body">{children}</div> : null}
          {footer ? <div className="cb-modal__footer">{footer}</div> : null}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

export interface ModalConfirmProps
  extends Omit<DialogProps, 'children' | 'footer' | 'placement' | 'size'> {
  /** Optional supporting content below the description. */
  children?: ReactNode;
  /** Action that dismisses without applying the decision. Rendered first. */
  cancelAction?: ReactNode;
  /** Action that applies the decision. Rendered last. */
  confirmAction: ReactNode;
  /** Semantic treatment for the confirmation icon and emphasis. */
  tone?: Tone;
  /** Replaces the semantic icon supplied by the consumer. */
  icon?: ReactNode;
}

/**
 * A composable counterpart to Ant's modal confirmation family. It intentionally reuses Modal's
 * dialog contract: this is viewport-modal confirmation, never an anchored Popconfirm.
 */
export function ModalConfirm({
  title,
  description,
  children,
  cancelAction,
  confirmAction,
  tone = 'warning',
  icon,
  className,
  ...rootProps
}: ModalConfirmProps) {
  return (
    <ModalRoot
      {...rootProps}
      title={
        <span className="cb-modal-confirm__heading">
          {icon === null ? null : (
            <span className="cb-modal-confirm__icon" data-tone={tone} aria-hidden="true">
              {icon ?? CONFIRM_ICONS[tone]}
            </span>
          )}
          <span>{title}</span>
        </span>
      }
      description={description}
      footer={
        <>
          {cancelAction}
          {confirmAction}
        </>
      }
      size="sm"
      placement="center"
      className={cn('cb-modal-confirm', className)}
    >
      {children}
    </ModalRoot>
  );
}

export const Modal = Object.assign(ModalRoot, {
  Confirm: ModalConfirm,
  Skeleton: ModalSkeleton,
});

export const DialogClose = BaseDialog.Close;
