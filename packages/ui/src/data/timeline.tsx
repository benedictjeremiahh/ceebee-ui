import type { ReactNode } from 'react';
import { cn, type Tone } from '../lib/cn.js';

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
export function Timeline({ entries, className }: TimelineProps) {
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
