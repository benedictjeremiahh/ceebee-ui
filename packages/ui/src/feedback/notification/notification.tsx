import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Tone } from '../../lib/cn.js';
import { NotificationSkeleton } from './notification.skeleton.js';

export type NotificationTone = Extract<Tone, 'neutral' | 'info' | 'success' | 'warning' | 'danger'>;

const ICONS: Record<NotificationTone, ReactNode> = {
  neutral: <Info size={20} />,
  info: <Info size={20} />,
  success: <CheckCircle2 size={20} />,
  warning: <AlertTriangle size={20} />,
  danger: <XCircle size={20} />,
};

export interface NotificationProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  tone?: NotificationTone;
  /** Accessible status announcement. Danger is assertive; every other tone is polite. */
  announce?: boolean;
}

/**
 * Persistent rich feedback in normal document flow. The app owns its lifetime, placement, and
 * actions; transient timed feedback remains Toast.
 */
function NotificationRoot({
  title,
  description,
  icon,
  actions,
  tone = 'info',
  announce = true,
}: NotificationProps) {
  const liveProps = announce
    ? { role: tone === 'danger' ? ('alert' as const) : ('status' as const) }
    : {};

  return (
    <section className="cb-notification" data-tone={tone} {...liveProps}>
      {icon === null ? null : (
        <span className="cb-notification__icon" aria-hidden="true">
          {icon ?? ICONS[tone]}
        </span>
      )}
      <div className="cb-notification__content">
        <div className="cb-notification__title">{title}</div>
        {description ? <div className="cb-notification__description">{description}</div> : null}
        {actions ? <div className="cb-notification__actions">{actions}</div> : null}
      </div>
    </section>
  );
}

export const Notification = Object.assign(NotificationRoot, {
  Skeleton: NotificationSkeleton,
});

