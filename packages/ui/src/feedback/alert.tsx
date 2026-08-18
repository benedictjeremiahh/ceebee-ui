'use client';

import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn, type Tone } from '../lib/cn.js';

export interface AlertProps {
  title?: ReactNode;
  children?: ReactNode;
  tone?: Tone;
  /** Replaces the tone's default icon. Pass null to drop it. */
  icon?: ReactNode | null;
  actions?: ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const ICONS: Record<Tone, ReactNode> = {
  neutral: <Info size={18} />,
  brand: <Info size={18} />,
  info: <Info size={18} />,
  success: <CheckCircle2 size={18} />,
  warning: <AlertTriangle size={18} />,
  danger: <XCircle size={18} />,
};

/**
 * `danger` and `warning` announce themselves through `role="alert"`; the quieter tones do not,
 * because a success note that interrupts a screen reader mid-sentence is not helpful.
 */
export function Alert({ title, children, tone = 'info', icon, actions, onDismiss, className }: AlertProps) {
  const assertive = tone === 'danger' || tone === 'warning';
  return (
    <div
      className={cn('cb-alert', className)}
      data-tone={tone}
      role={assertive ? 'alert' : 'status'}
      aria-live={assertive ? 'assertive' : 'polite'}
    >
      {icon === null ? null : <span className="cb-alert__icon">{icon ?? ICONS[tone]}</span>}
      <div className="cb-alert__body">
        {title ? <p className="cb-alert__title">{title}</p> : null}
        {children ? <div className="cb-alert__text">{children}</div> : null}
        {actions ? <div className="cb-alert__actions">{actions}</div> : null}
      </div>
      {onDismiss ? (
        <button type="button" className="cb-alert__close" aria-label="Dismiss" onClick={onDismiss}>
          <X size={16} />
        </button>
      ) : null}
    </div>
  );
}
