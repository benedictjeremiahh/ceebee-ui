import type { ReactNode } from 'react';
import { cn, type DecorHue } from '../lib/cn.js';
import { Avatar } from '../media/avatar.js';
import { Skeleton } from '../feedback/skeleton.js';

export interface LeaderboardEntry {
  id: string;
  name: string;
  /** Already formatted — the library does not decide what a score looks like. */
  score: ReactNode;
  avatarSrc?: string;
  detail?: ReactNode;
  /** Movement since the last ranking. */
  delta?: { value: string; direction: 'up' | 'down' | 'flat' };
  /** Marks the viewer's own row, wherever it sits. */
  you?: boolean;
  hue?: DecorHue;
}

export interface LeaderboardProps {
  entries: LeaderboardEntry[];
  /** Names the list; required, because a bare ranked list says nothing on its own. */
  label: string;
  /** Ranks 1–3 get a medal tint. Turn it off for a plain ranked list. */
  medals?: boolean;
  className?: string;
}

/**
 * A ranked list — the gamified board pattern. Server-safe, and an `<ol>`, so the ranking is a
 * fact a screen reader reads out rather than a column of numbers it has to infer.
 */
function LeaderboardRoot({ entries, label, medals = true, className }: LeaderboardProps) {
  return (
    <ol className={cn('cb-leaderboard', className)} aria-label={label}>
      {entries.map((entry, index) => {
        const rank = index + 1;
        return (
          <li
            className="cb-leaderboard__row"
            key={entry.id}
            data-rank={medals && rank <= 3 ? rank : undefined}
            data-you={entry.you || undefined}
          >
            <span className="cb-leaderboard__rank" aria-hidden="true">
              {rank}
            </span>
            <Avatar name={entry.name} src={entry.avatarSrc} size="sm" hue={entry.hue} />
            <span className="cb-leaderboard__text">
              <span className="cb-leaderboard__name">
                {entry.name}
                {entry.you ? <span className="cb-leaderboard__you">You</span> : null}
              </span>
              {entry.detail ? <span className="cb-leaderboard__detail">{entry.detail}</span> : null}
            </span>
            {entry.delta ? (
              <span className="cb-leaderboard__delta" data-direction={entry.delta.direction}>
                {entry.delta.value}
              </span>
            ) : null}
            <span className="cb-leaderboard__score">{entry.score}</span>
          </li>
        );
      })}
    </ol>
  );
}

export interface LeaderboardSkeletonProps {
  rows?: number;
  className?: string;
}

/** Same row geometry as the real list, so the panel does not resize on load (ADR 0009). */
function LeaderboardSkeleton({ rows = 5, className }: LeaderboardSkeletonProps) {
  return (
    <div className={cn('cb-leaderboard', className)} aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <div className="cb-leaderboard__row" key={index}>
          <span className="cb-leaderboard__rank">
            <Skeleton width="0.75rem" height="0.75rem" />
          </span>
          <Skeleton.Circle size="1.75rem" />
          <span className="cb-leaderboard__text">
            <Skeleton width="7rem" height="0.875rem" />
          </span>
          <Skeleton width="2.5rem" height="0.875rem" />
        </div>
      ))}
    </div>
  );
}

export const Leaderboard = Object.assign(LeaderboardRoot, { Skeleton: LeaderboardSkeleton });
