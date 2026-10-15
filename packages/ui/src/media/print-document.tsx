'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import './print-document.css';
import { createPrintDocumentSnapshot } from './print-document-snapshot.js';

export interface PrintDocumentProps {
  children: ReactNode;
  active?: boolean;
  className?: string;
  colorMode?: 'light' | 'current';
}

export function PrintDocument({
  children,
  active = true,
  className,
  colorMode = 'light',
}: PrintDocumentProps) {
  const sourceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const source = sourceRef.current;
    if (!active || !source) return;

    let cleanupSnapshot: (() => void) | undefined;
    const beforePrint = () => {
      cleanupSnapshot?.();
      cleanupSnapshot = undefined;
      const candidates = document.querySelectorAll<HTMLElement>('[data-cb-print-document="active"]');
      if (candidates.item(candidates.length - 1) !== source) return;
      cleanupSnapshot = createPrintDocumentSnapshot(source, colorMode);
    };
    const afterPrint = () => {
      cleanupSnapshot?.();
      cleanupSnapshot = undefined;
    };

    window.addEventListener('beforeprint', beforePrint);
    window.addEventListener('afterprint', afterPrint);
    return () => {
      window.removeEventListener('beforeprint', beforePrint);
      window.removeEventListener('afterprint', afterPrint);
      cleanupSnapshot?.();
    };
  }, [active, colorMode]);

  return (
    <div
      ref={sourceRef}
      className={className ? `cb-print-document-source ${className}` : 'cb-print-document-source'}
      data-cb-print-document={active ? 'active' : undefined}
    >
      {children}
    </div>
  );
}
