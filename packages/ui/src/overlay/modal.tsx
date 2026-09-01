'use client';

import { Modal as AntModal } from 'antd';
import type { ModalProps as AntModalProps } from 'antd';
import type { MutableRefObject, ReactNode, Ref } from 'react';
import { useCallback, useId, useInsertionEffect, useLayoutEffect, useRef } from 'react';

import { cn } from '../lib/cn.js';
import './modal.css';

export interface ModalProps extends AntModalProps {
  /** Separate explanatory copy announced after the dialog title. */
  description?: ReactNode;
}

function ModalRoot({
  description,
  children,
  classNames,
  open,
  afterOpenChange,
  focusTriggerAfterClose,
  focusable,
  panelRef,
  ...props
}: ModalProps) {
  const descriptionId = useId();
  const returnFocus = useRef<HTMLElement | null>(null);
  const restoreTask = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const panel = useRef<HTMLDivElement | null>(null);
  const wasOpen = useRef(false);
  const openRef = useRef(!!open);
  openRef.current = !!open;
  const shouldRestoreFocus = focusable?.focusTriggerAfterClose
    ?? focusTriggerAfterClose
    ?? true;

  const restoreFocus = useCallback(() => {
    const target = returnFocus.current;
    if (!shouldRestoreFocus || !target?.isConnected) {
      returnFocus.current = null;
      return;
    }
    if (restoreTask.current) return;
    restoreTask.current = setTimeout(() => {
      restoreTask.current = undefined;
      if (openRef.current && panel.current?.isConnected) return;
      if (target.isConnected) target.focus({ preventScroll: true });
      if (returnFocus.current === target) returnFocus.current = null;
    });
  }, [shouldRestoreFocus]);

  useInsertionEffect(() => {
    if (open && restoreTask.current) {
      clearTimeout(restoreTask.current);
      restoreTask.current = undefined;
    }
    if (open && !wasOpen.current && document.activeElement instanceof HTMLElement) {
      returnFocus.current = document.activeElement;
    }
  }, [open]);

  useLayoutEffect(() => {
    if (!open && wasOpen.current) {
      restoreFocus();
    }
    wasOpen.current = !!open;
  }, [open, restoreFocus]);

  useLayoutEffect(() => () => {
    if (wasOpen.current) restoreFocus();
  }, [restoreFocus]);

  const modalClassNames = typeof classNames === 'function'
    ? (info: Parameters<typeof classNames>[0]) => {
        const resolved = classNames(info) ?? {};
        return {
          ...resolved,
          wrapper: cn('cb-modal', resolved.wrapper),
          mask: cn('cb-modal__backdrop', resolved.mask),
        };
      }
    : {
        ...classNames,
        wrapper: cn('cb-modal', classNames?.wrapper),
        mask: cn('cb-modal__backdrop', classNames?.mask),
      };

  const describedBy = [
    (props as AntModalProps & { 'aria-describedby'?: string })['aria-describedby'],
    description ? descriptionId : null,
  ].filter(Boolean).join(' ') || undefined;

  const setPanelRef = useCallback((node: HTMLDivElement | null) => {
    panel.current = node;
    if (node && describedBy) node.setAttribute('aria-describedby', describedBy);
    else node?.removeAttribute('aria-describedby');
    if (typeof panelRef === 'function') panelRef(node);
    else if (panelRef) (panelRef as MutableRefObject<HTMLDivElement | null>).current = node;
  }, [describedBy, panelRef]);

  useLayoutEffect(() => {
    if (panel.current && describedBy) panel.current.setAttribute('aria-describedby', describedBy);
    else panel.current?.removeAttribute('aria-describedby');
  }, [describedBy]);

  return (
    <AntModal
      {...props}
      open={open}
      classNames={modalClassNames}
      focusable={{ ...focusable, focusTriggerAfterClose: false }}
      panelRef={setPanelRef as Ref<HTMLDivElement>}
      afterOpenChange={(nextOpen) => {
        afterOpenChange?.(nextOpen);
        if (!nextOpen) restoreFocus();
      }}
    >
      {description ? (
        <div id={descriptionId} className="cb-modal__description">
          {description}
        </div>
      ) : null}
      {children}
    </AntModal>
  );
}

/**
 * Ant Design's interaction contract with CeeBee-owned description, semantic
 * layer hooks, and focus restoration for conditionally mounted consumers.
 */
export const Modal = Object.assign(ModalRoot, AntModal);
