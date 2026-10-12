'use client';

import type { ReactNode, RefObject } from 'react';
import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';

import './focus-recovery.css';

interface FocusRecoveryController {
  requestRecovery(source: Element | null): void;
}

const FocusRecoveryContext = createContext<FocusRecoveryController | null>(null);

export interface FocusRecoveryProps<T extends HTMLElement = HTMLElement> {
  /** The connected heading or control that should receive focus after a focused descendant is removed. */
  targetRef: RefObject<T | null>;
  /** Keep a removal pending while the related section is still loading. */
  ready?: boolean;
  children: ReactNode;
}

export function useFocusRecoveryController(): FocusRecoveryController | null {
  return useContext(FocusRecoveryContext);
}

function isNeutralFocus(activeElement: Element | null): boolean {
  return !activeElement
    || activeElement === document.body
    || activeElement === document.documentElement
    || !activeElement.isConnected;
}

export function FocusRecovery<T extends HTMLElement>({
  targetRef: injectedTargetRef,
  ready = true,
  children,
}: FocusRecoveryProps<T>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const focusedDescendant = useRef<HTMLElement | null>(null);
  const pendingRecovery = useRef(false);
  const targetRef = useRef(injectedTargetRef);
  const readyRef = useRef(ready);
  const pendingOverlaySource = useRef<Element | null | undefined>(undefined);
  const [recoveryRevision, setRecoveryRevision] = useState(0);
  targetRef.current = injectedTargetRef;
  readyRef.current = ready;

  const settleRecovery = useCallback(() => {
    const hasPendingOverlay = pendingOverlaySource.current !== undefined;
    if ((!pendingRecovery.current && !hasPendingOverlay) || !readyRef.current) return;
    const target = targetRef.current.current;
    if (!target?.isConnected) return;
    const activeElement = document.activeElement;
    const overlaySource = pendingOverlaySource.current;
    const focusBelongsToClosingOverlay = activeElement instanceof Element
      && overlaySource !== undefined
      && (overlaySource === activeElement || overlaySource?.contains(activeElement));
    if (!isNeutralFocus(activeElement) && !focusBelongsToClosingOverlay) {
      pendingRecovery.current = false;
      focusedDescendant.current = null;
      pendingOverlaySource.current = undefined;
      return;
    }
    target.focus();
    pendingRecovery.current = false;
    focusedDescendant.current = null;
    pendingOverlaySource.current = undefined;
  }, []);

  const requestRecovery = useCallback((source: Element | null) => {
    pendingOverlaySource.current = source;
    setRecoveryRevision((revision) => revision + 1);
  }, []);
  const controller = useMemo(() => ({ requestRecovery }), [requestRecovery]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const observeRemoval = new MutationObserver((records) => {
      const focused = focusedDescendant.current;
      if (!focused || focused.isConnected) return;
      const wasRemoved = records.some((record) => Array.from(record.removedNodes).some((node) => (
        node === focused || node.contains(focused)
      )));
      if (!wasRemoved) return;
      pendingRecovery.current = true;
      settleRecovery();
    });
    observeRemoval.observe(root, { childList: true, subtree: true });

    const trackFocus = (event: FocusEvent) => {
      const focused = event.target;
      const pendingSource = pendingOverlaySource.current;
      const focusBelongsToPendingSource = focused instanceof Element
        && pendingSource !== undefined
        && (pendingSource === focused || pendingSource?.contains(focused));
      if (pendingSource !== undefined && !isNeutralFocus(focused instanceof Element ? focused : null)
        && !focusBelongsToPendingSource) {
        pendingOverlaySource.current = undefined;
      }
      if (focused instanceof HTMLElement
        && root.contains(focused)
        && focused.closest('.cb-focus-recovery') === root) {
        focusedDescendant.current = focused;
        pendingRecovery.current = false;
      } else {
        focusedDescendant.current = null;
        pendingRecovery.current = false;
      }
    };
    document.addEventListener('focusin', trackFocus, true);

    return () => {
      observeRemoval.disconnect();
      document.removeEventListener('focusin', trackFocus, true);
      focusedDescendant.current = null;
      pendingRecovery.current = false;
      pendingOverlaySource.current = undefined;
    };
  }, [settleRecovery]);

  useLayoutEffect(() => {
    settleRecovery();
  }, [ready, recoveryRevision, injectedTargetRef, settleRecovery]);

  return (
    <FocusRecoveryContext.Provider value={controller}>
      <div ref={rootRef} className="cb-focus-recovery">{children}</div>
    </FocusRecoveryContext.Provider>
  );
}
