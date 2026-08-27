import type { ReactNode } from 'react';
import { cn, type DecorHue } from '../lib/cn.js';

const HUES: DecorHue[] = ['violet', 'blue', 'teal', 'green', 'amber', 'rose'];

/**
 * First letter of the first and last word. Two letters at most, because three stop fitting and a
 * clipped initial reads as a rendering bug.
 */
function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = words[0]![0] ?? '';
  const last = words.length > 1 ? (words[words.length - 1]![0] ?? '') : '';
  return (first + last).toUpperCase();
}

/** Stable hue per name, so the same person keeps their colour across sessions and devices. */
function hueForName(name: string): DecorHue {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return HUES[hash % HUES.length]!;
}

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
            <span
              className="cb-leaderboard__avatar"
              data-hue={entry.hue ?? hueForName(entry.name)}
              role="img"
              aria-label={entry.name}
            >
              <span className="cb-leaderboard__initials" aria-hidden="true">{initialsOf(entry.name)}</span>
              {entry.avatarSrc ? <img className="cb-leaderboard__photo" src={entry.avatarSrc} alt="" loading="lazy" /> : null}
            </span>
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

export const Leaderboard = LeaderboardRoot;
