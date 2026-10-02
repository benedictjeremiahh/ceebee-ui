'use client';

import { Modal as AntModal } from 'antd';
import type { ModalProps as AntModalProps } from 'antd';
import type { MutableRefObject, ReactNode, Ref } from 'react';
import { useCallback, useEffect, useId, useInsertionEffect, useLayoutEffect, useRef, useState } from 'react';

import { cn } from '../lib/cn.js';
import { OverlayAncestorProvider, useOverlayAncestors } from './overlay-ancestors.js';
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
  const resolvedLayer = layer ?? (overlayAncestors.includes('drawer') ? 'above-drawer' : 'page');
  // Ant derives every descendant popup's rung from the rung this dialog reports (a date picker adds
  // its own offset on top). The CSS classes above pin the wrapper and backdrop, but the number has
  // to travel through Ant's own `zIndex` prop too — otherwise a popup opened from the dialog resolves
  // against Ant's unpinned arithmetic and paints underneath it. Read live from the token rather than
  // restating it: the stylesheet stays the single source of the rung.
  const [aboveDrawerZ, setAboveDrawerZ] = useState<number>();
  useEffect(() => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--cb-z-modal-above-drawer').trim();
    const parsed = Number.parseInt(raw, 10);
    if (Number.isFinite(parsed)) setAboveDrawerZ(parsed);
  }, []);
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
          wrapper: cn('cb-modal', resolvedLayer === 'above-drawer' && 'cb-modal--above-drawer', resolved.wrapper),
          mask: cn('cb-modal__backdrop', resolvedLayer === 'above-drawer' && 'cb-modal--above-drawer-backdrop', resolved.mask),
        };
      }
    : {
        ...classNames,
        wrapper: cn('cb-modal', resolvedLayer === 'above-drawer' && 'cb-modal--above-drawer', classNames?.wrapper),
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
      zIndex={resolvedLayer === 'above-drawer' ? (aboveDrawerZ ?? props.zIndex) : props.zIndex}
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
      <OverlayAncestorProvider ancestor="modal">{children}</OverlayAncestorProvider>
    </AntModal>
  );
}

/**
 * Ant Design's interaction contract with CeeBee-owned description, semantic
 * layer hooks, and focus restoration for conditionally mounted consumers.
 */
export const Modal = Object.assign(ModalRoot, AntModal);
