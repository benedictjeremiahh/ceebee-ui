'use client';

import { Drawer as AntDrawer } from 'antd';
import type { DrawerProps as AntDrawerProps } from 'antd';
import { useCallback, useEffect, useInsertionEffect, useRef } from 'react';

import { cn } from '../lib/cn.js';
import { useFocusRecoveryController } from '../focus/focus-recovery/index.js';
import { OverlayAncestorProvider } from './overlay-ancestors.js';
import './drawer.css';

export type DrawerProps = AntDrawerProps;

/**
 * Ant Design's Drawer on CeeBee's documented drawer rung.
 *
 * Drawer is deliberately a thin adapter rather than a restyled generic: Ant owns its interaction,
 * accessibility, motion, and geometry. This adapter guarantees that the Drawer and its backdrop
 * resolve to `--cb-z-drawer` and `--cb-z-drawer-backdrop`, so a Drawer and a page-level Modal keep
 * the ladder the design system documents. It also restores a connected opener when conditional
 * unmounting interrupts Ant's close callback.
 *
 * Everything else remains Ant's contract, including its ordinary close behavior.
 */
function DrawerRoot({
  children,
  classNames,
  rootClassName,
  open,
  afterOpenChange,
  focusable,
  panelRef,
  ...props
}: DrawerProps) {
  const returnFocus = useRef<HTMLElement | null>(null);
  const panel = useRef<HTMLDivElement | null>(null);
  const restoreTask = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wasOpen = useRef(false);
  const mounted = useRef(false);
  const openRef = useRef(!!open);
  openRef.current = !!open;
  const focusRecovery = useFocusRecoveryController();
  const shouldRestoreFocus = focusable?.focusTriggerAfterClose ?? true;
  const shouldRestoreFocusRef = useRef(shouldRestoreFocus);
  shouldRestoreFocusRef.current = shouldRestoreFocus;

  const restoreRecoveryTarget = useCallback(() => {
    if (!shouldRestoreFocusRef.current || !focusRecovery || restoreTask.current) return;
    restoreTask.current = setTimeout(() => {
      restoreTask.current = undefined;
      if (openRef.current && mounted.current) return;
      const activeElement = document.activeElement;
      const focusIsNeutral = !activeElement
        || activeElement === document.body
        || activeElement === document.documentElement
        || !activeElement.isConnected;
      if (focusIsNeutral || (activeElement instanceof Element && panel.current?.contains(activeElement))) {
        focusRecovery.requestRecovery(panel.current);
      }
    });
  }, [focusRecovery]);

  useInsertionEffect(() => {
    if (open) {
      if (restoreTask.current) {
        clearTimeout(restoreTask.current);
        restoreTask.current = undefined;
      }
      if (!wasOpen.current && document.activeElement instanceof HTMLElement) {
        const activeElement = document.activeElement;
        returnFocus.current = activeElement === document.body || activeElement === document.documentElement
          ? null
          : activeElement;
      }
    }
    wasOpen.current = !!open;
  }, [open]);

  useEffect(() => {
    mounted.current = true;
    if (restoreTask.current) {
      clearTimeout(restoreTask.current);
      restoreTask.current = undefined;
    }
    return () => {
      mounted.current = false;
      const target = returnFocus.current;
      if (!shouldRestoreFocusRef.current) return;
      if (!target?.isConnected) {
        returnFocus.current = null;
        restoreRecoveryTarget();
        return;
      }
      restoreTask.current = setTimeout(() => {
        restoreTask.current = undefined;
        if (mounted.current) return;
        const activeElement = document.activeElement;
        const focusIsNeutral = !activeElement
          || activeElement === document.body
          || activeElement === document.documentElement
          || !activeElement.isConnected;
        if (target.isConnected) {
          if (focusIsNeutral) target.focus({ preventScroll: true });
        } else if (shouldRestoreFocusRef.current && focusRecovery
          && (focusIsNeutral || (activeElement instanceof Element && panel.current?.contains(activeElement)))) {
          focusRecovery.requestRecovery(panel.current);
        }
        if (returnFocus.current === target) returnFocus.current = null;
      });
    };
  }, [restoreRecoveryTarget]);

  const drawerClassNames =
    typeof classNames === 'function'
      ? (info: Parameters<typeof classNames>[0]) => {
          const resolved = classNames(info) ?? {};
          return {
            ...resolved,
            mask: cn('cb-drawer__backdrop', resolved.mask),
          };
        }
      : {
          ...classNames,
          mask: cn('cb-drawer__backdrop', classNames?.mask),
        };

  return (
    <AntDrawer
      {...props}
      open={open}
      focusable={focusable}
      panelRef={(node) => {
        panel.current = node;
        if (typeof panelRef === 'function') panelRef(node);
        else if (panelRef) panelRef.current = node;
      }}
      afterOpenChange={(nextOpen) => {
        if (!nextOpen) {
          if (!returnFocus.current?.isConnected) restoreRecoveryTarget();
          returnFocus.current = null;
        }
        afterOpenChange?.(nextOpen);
      }}
      rootClassName={cn('cb-drawer', rootClassName)}
      classNames={drawerClassNames}
    >
      <OverlayAncestorProvider ancestor="drawer">{children}</OverlayAncestorProvider>
    </AntDrawer>
  );
}

export const Drawer: typeof DrawerRoot & Omit<typeof AntDrawer, never> = Object.assign(DrawerRoot, AntDrawer);
