import type { ReactNode } from 'react';
import { cn, type Tone } from '../lib/cn.js';
import { Skeleton } from '../feedback/skeleton.js';

export interface TimelineEntry {
  /** When it happened. Already formatted — the library does not decide date format. */
  time: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  tone?: Tone;
}

export interface TimelineProps {
  entries: TimelineEntry[];
  className?: string;
}

/**
 * An ordered list of things that happened. Server-safe, and an `<ol>` rather than divs, so the
 * order is a fact a screen reader reads out rather than a visual convention.
 */
function TimelineRoot({ entries, className }: TimelineProps) {
  return (
    <ol className={cn('cb-timeline', className)}>
      {entries.map((entry, index) => (
        <li className="cb-timeline__entry" key={index} data-tone={entry.tone ?? 'neutral'}>
          <span className="cb-timeline__rail" aria-hidden="true">
            <span className="cb-timeline__marker">{entry.icon}</span>
          </span>
          <div className="cb-timeline__body">
            <div className="cb-timeline__head">
              <p className="cb-timeline__title">{entry.title}</p>
              <span className="cb-timeline__time">{entry.time}</span>
            </div>
            {entry.description ? <p className="cb-timeline__description">{entry.description}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export interface TimelineSkeletonProps {
  entries?: number;
  className?: string;
}

function TimelineSkeleton({ entries = 3, className }: TimelineSkeletonProps) {
  return (
    <div className={cn('cb-timeline', className)} aria-hidden="true">
      {Array.from({ length: entries }, (_, index) => (
        <div className="cb-timeline__entry" key={index}>
          <span className="cb-timeline__rail">
            <Skeleton.Circle size="1.5rem" />
          </span>
          <div className="cb-timeline__body">
            <Skeleton width="45%" height="0.875rem" />
            <div style={{ marginTop: 'var(--cb-space-2)' }}>
              <Skeleton width="70%" height="0.75rem" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export const Timeline = Object.assign(TimelineRoot, { Skeleton: TimelineSkeleton });
