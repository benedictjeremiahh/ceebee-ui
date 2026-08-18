'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn, type Tone } from '../lib/cn.js';

export interface ToastProviderProps {
  children: ReactNode;
  /** Milliseconds before a toast leaves on its own. Errors ignore it and stay. */
  timeout?: number;
  limit?: number;
}

/**
 * Wrap the app once. The viewport is rendered here rather than left to the caller, because a
 * provider without a viewport fails silently: the toast is created and nothing appears.
 */
export function ToastProvider({ children, timeout = 5000, limit = 4 }: ToastProviderProps) {
  return (
    <BaseToast.Provider timeout={timeout} limit={limit}>
      {children}
      <BaseToast.Portal>
        <BaseToast.Viewport className="cb-toast__viewport">
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}

const ICONS: Record<string, ReactNode> = {
  success: <CheckCircle2 size={16} />,
  warning: <AlertTriangle size={16} />,
  danger: <XCircle size={16} />,
  error: <XCircle size={16} />,
  info: <Info size={16} />,
};

function ToastList() {
  const { toasts } = BaseToast.useToastManager();

  return toasts.map((toast) => (
    <BaseToast.Root key={toast.id} toast={toast} className={cn('cb-toast')} data-tone={toast.type ?? 'neutral'}>
      <span className="cb-toast__icon">{ICONS[toast.type ?? 'info'] ?? ICONS.info}</span>
      <BaseToast.Content className="cb-toast__content">
        <BaseToast.Title className="cb-toast__title" />
        <BaseToast.Description className="cb-toast__description" />
      </BaseToast.Content>
      <BaseToast.Action className="cb-toast__action" />
      <BaseToast.Close className="cb-toast__close" aria-label="Dismiss">
        <X size={14} />
      </BaseToast.Close>
    </BaseToast.Root>
  ));
}

export interface ToastOptions {
  title?: string;
  description?: string;
  tone?: Extract<Tone, 'info' | 'success' | 'warning' | 'danger'>;
  timeout?: number;
  action?: { label: string; onClick: () => void };
}

/** Called inside a ToastProvider. Returns the manager, with our vocabulary in front of it. */
export function useToast() {
  const manager = BaseToast.useToastManager();

  return {
    show: ({ title, description, tone = 'info', timeout, action }: ToastOptions) =>
      manager.add({
        title,
        description,
        type: tone,
        // Errors do not time out: something went wrong is not a thing to miss by looking away.
        timeout: timeout ?? (tone === 'danger' ? 0 : undefined),
        ...(action ? { actionProps: { children: action.label, onClick: action.onClick } } : {}),
      }),
    close: (id?: string) => manager.close(id),
    promise: manager.promise,
  };
}
