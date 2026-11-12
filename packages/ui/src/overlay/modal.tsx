'use client';

import { Modal as AntModal } from 'antd';
import type { ModalProps as AntModalProps } from 'antd';
import type { MutableRefObject, ReactNode, Ref } from 'react';
import { useCallback, useId, useInsertionEffect, useLayoutEffect, useRef } from 'react';

import { cn } from '../lib/cn.js';
import { useFocusRecoveryController } from '../focus/focus-recovery/index.js';
import { OverlayAncestorProvider, useOverlayAncestors } from './overlay-ancestors.js';
import { ModalLayerProvider, useModalLayer } from './modal-layer.js';
import './modal.css';

export type ModalLayer = 'page' | 'above-drawer';

export interface ModalProps extends AntModalProps {
  /** Separate explanatory copy announced after the dialog title. */
  description?: ReactNode;
  /**
   * A dialog opened from a Drawer is still one interruption, not two pages. CeeBee detects that
   * call chain automatically; pass a value only to control an exceptional one deliberately.
   */
  layer?: ModalLayer;
}

function ModalRoot({
  description,
  layer,
  children,
  classNames,
  styles,
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
  const overlayAncestors = useOverlayAncestors();
  const focusRecovery = useFocusRecoveryController();
  const resolvedLayer = layer ?? (overlayAncestors.includes('drawer') ? 'above-drawer' : 'page');
  const modalLayer = useModalLayer(resolvedLayer, props.zIndex, styles);
  const shouldRestoreFocus = focusable?.focusTriggerAfterClose
    ?? focusTriggerAfterClose
    ?? true;

  const restoreFocus = useCallback(() => {
    const target = returnFocus.current;
    if (!shouldRestoreFocus || (!target?.isConnected && !focusRecovery)) {
      returnFocus.current = null;
      return;
    }
    if (restoreTask.current) return;
    restoreTask.current = setTimeout(() => {
      restoreTask.current = undefined;
      if (openRef.current && panel.current?.isConnected) return;
      if (target?.isConnected) {
        target.focus({ preventScroll: true });
      } else if (focusRecovery) {
        const activeElement = document.activeElement;
        const focusIsNeutral = !activeElement
          || activeElement === document.body
          || activeElement === document.documentElement
          || !activeElement.isConnected;
        if (focusIsNeutral || (activeElement instanceof Element && panel.current?.contains(activeElement))) {
          focusRecovery.requestRecovery(panel.current);
        }
      }
      if (returnFocus.current === target) returnFocus.current = null;
    });
  }, [focusRecovery, shouldRestoreFocus]);

  useInsertionEffect(() => {
    if (open && restoreTask.current) {
      clearTimeout(restoreTask.current);
      restoreTask.current = undefined;
    }
    if (open && !wasOpen.current && document.activeElement instanceof HTMLElement) {
      const activeElement = document.activeElement;
      returnFocus.current = activeElement === document.body || activeElement === document.documentElement
        ? null
        : activeElement;
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
          wrapper: cn('cb-modal', resolvedLayer === 'above-drawer' && 'cb-modal--above-drawer', resolved.wrapper),
          mask: cn('cb-modal__backdrop', resolvedLayer === 'above-drawer' && 'cb-modal--above-drawer-backdrop', resolved.mask),
          close: cn('cb-modal__close', resolved.close),
        };
      }
    : {
        ...classNames,
        wrapper: cn('cb-modal', resolvedLayer === 'above-drawer' && 'cb-modal--above-drawer', classNames?.wrapper),
        close: cn('cb-modal__close', classNames?.close),
        mask: cn(
          'cb-modal__backdrop',
          resolvedLayer === 'above-drawer' && 'cb-modal--above-drawer-backdrop',
          classNames?.mask,
        ),
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
      zIndex={modalLayer.value?.panel ?? props.zIndex}
      styles={modalLayer.styles}
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
      <ModalLayerProvider value={modalLayer.value}>
        <OverlayAncestorProvider ancestor="modal">{children}</OverlayAncestorProvider>
      </ModalLayerProvider>
    </AntModal>
  );
}

/**
 * Ant Design's interaction contract with CeeBee-owned description, semantic
 * layer hooks, and focus restoration for conditionally mounted consumers.
 */
export const Modal = Object.assign(ModalRoot, AntModal);
