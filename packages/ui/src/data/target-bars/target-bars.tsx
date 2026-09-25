import type { ReactNode } from 'react';
import { cn } from '../../lib/cn.js';
import { barSpan, deviationOf, deviationScale, positionOf, targetBarsScale, verdictOf, type TargetBarsScale } from './target-bars.math.js';

export interface TargetBarsRow {
  id: string;
  label: string;
  /** What the row was meant to reach. `null` when nobody set one. */
  target: number | null;
  /** What it reached. `null` when it cannot be known yet — shown as unknown, never as zero. */
  actual: number | null;
  /** A second line under the label: a date, a reason, a group. */
  detail?: ReactNode;
}

export interface TargetBarsProps {
  /** Names the list; required, because a column of bars says nothing on its own. */
  label: string;
  rows: TargetBarsRow[];
  /** How a figure is written. The library holds no unit, currency or locale. */
  format: (value: number) => string;
  /** Whether reaching above the target is good (a margin) or bad (a cost). */
  better?: 'higher' | 'lower';
  /**
   * `bullet` (default) draws each actual from zero with its target as a mark. `deviation` draws how far each
   * row landed from its own target, from a centre line that *is* the target — right when it beat it, left
   * when it missed — for rows whose targets differ, where reading the gap off a bullet takes subtraction.
   */
  variant?: 'bullet' | 'deviation';
  actualLabel?: string;
  targetLabel?: string;
  /** Written where a figure cannot be known yet. */
  unknownLabel?: string;
  emptyLabel?: string;
  className?: string;
}

/**
 * Actual against target, one row per thing, all on one shared scale that always contains zero — a
 * bullet chart. It exists because two dated series do not fit a question that is asked per category:
 * *which finished jobs made the margin they were priced at, and by how much did the others miss.*
 *
 * Server-safe and plain DOM: a list, so each row is read out as a row; both figures written as text,
 * so the bar adds the comparison and never hides the number; the bars `aria-hidden`, because the
 * sentence already says what they show.
 */
export function TargetBars({
  label,
  rows,
  format,
  better = 'higher',
  variant = 'bullet',
  actualLabel = 'Actual',
  targetLabel = 'Target',
  unknownLabel = 'unknown',
  emptyLabel = 'Nothing to compare yet.',
  className,
}: TargetBarsProps) {
  if (rows.length === 0) return <p className={cn('cb-target-bars__empty', className)}>{emptyLabel}</p>;
  const deviation = variant === 'deviation';
  const scale = deviation
    ? deviationScale(rows.map((row) => deviationOf(row.target, row.actual, better)))
    : targetBarsScale(rows.flatMap((row) => [row.target, row.actual]));
  const written = (value: number | null) => (value === null ? unknownLabel : format(value));

  return (
    <ul className={cn('cb-target-bars', className)} aria-label={label} data-variant={variant}>
      {rows.map((row) => (
        <li key={row.id} className="cb-target-bars__row" data-verdict={verdictOf(row.target, row.actual, better)}>
          <div className="cb-target-bars__head">
            <span className="cb-target-bars__label">{row.label}</span>
            <span className="cb-target-bars__figures">
              <span className="cb-target-bars__actual">{actualLabel} {written(row.actual)}</span>
              <span className="cb-target-bars__sep" aria-hidden="true"> · </span>
              <span>{targetLabel} {written(row.target)}</span>
            </span>
          </div>
          {row.detail ? <div className="cb-target-bars__detail">{row.detail}</div> : null}
          {deviation ? <DeviationTrack gap={deviationOf(row.target, row.actual, better)} scale={scale} /> : <Track row={row} scale={scale} />}
        </li>
      ))}
    </ul>
  );
}

function Track({ row, scale }: { row: TargetBarsRow; scale: TargetBarsScale }) {
  const span = row.actual === null ? null : barSpan(row.actual, scale);
  return (
    <div className="cb-target-bars__track" aria-hidden="true">
      <span className="cb-target-bars__zero" style={{ insetInlineStart: `${positionOf(0, scale)}%` }} />
      {span ? (
        <span className="cb-target-bars__fill" style={{ insetInlineStart: `${span.start}%`, inlineSize: `${span.width}%` }} />
      ) : null}
      {row.target === null ? null : (
        <span className="cb-target-bars__target" style={{ insetInlineStart: `${positionOf(row.target, scale)}%` }} />
      )}
    </div>
  );
}

function DeviationTrack({ gap, scale }: { gap: number | null; scale: TargetBarsScale }) {
  const span = gap === null ? null : barSpan(gap, scale);
  return (
    <div className="cb-target-bars__track" aria-hidden="true">
      <span className="cb-target-bars__zero cb-target-bars__zero--target" style={{ insetInlineStart: '50%' }} />
      {span ? (
        <span className="cb-target-bars__fill" style={{ insetInlineStart: `${span.start}%`, inlineSize: `${span.width}%` }} />
      ) : null}
    </div>
  );
}
