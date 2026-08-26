import type { ReactNode } from 'react';
import type { Tone } from '../../lib/cn.js';
import { ResultSkeleton } from './result.skeleton.js';

export type ResultStatus = 'success' | 'info' | 'warning' | 'error' | '404' | '403' | '500';

const STATUS_TONES: Record<ResultStatus, Tone> = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'danger',
  '404': 'neutral',
  '403': 'warning',
  '500': 'danger',
};

const STATUS_MARKS: Record<ResultStatus, string> = {
  success: '✓',
  info: 'i',
  warning: '!',
  error: '×',
  '404': '?',
  '403': '!',
  '500': '×',
};

export interface ResultProps {
  title: ReactNode;
  description?: ReactNode;
  status?: ResultStatus;
  icon?: ReactNode;
  extra?: ReactNode;
  children?: ReactNode;
}

/** A presentational end state for a completed flow. Actions keep their own interaction contract. */
function ResultRoot({ title, description, status = 'info', icon, extra, children }: ResultProps) {
  const tone = STATUS_TONES[status];

  return (
    <section className="cb-result" data-status={status} data-tone={tone}>
      <div className="cb-result__icon" aria-hidden="true">
        {icon ?? <span className="cb-result__mark">{STATUS_MARKS[status]}</span>}
      </div>
      <div className="cb-result__title">{title}</div>
      {description ? <div className="cb-result__description">{description}</div> : null}
      {extra ? <div className="cb-result__extra">{extra}</div> : null}
      {children ? <div className="cb-result__content">{children}</div> : null}
    </section>
  );
}

export const Result = Object.assign(ResultRoot, { Skeleton: ResultSkeleton });
