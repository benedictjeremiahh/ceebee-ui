import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  /** `search` reads as "nothing matched", `first-run` as "nothing here yet" — they differ. */
  variant?: 'first-run' | 'search' | 'error';
  className?: string;
}

export function EmptyState({ title, description, icon, actions, variant = 'first-run', className }: EmptyStateProps) {
  return (
    <div className={cn('cb-empty', className)} data-variant={variant}>
      {icon ? <span className="cb-empty__icon">{icon}</span> : null}
      <p className="cb-empty__title">{title}</p>
      {description ? <p className="cb-empty__description">{description}</p> : null}
      {actions ? <div className="cb-empty__actions">{actions}</div> : null}
    </div>
  );
}
