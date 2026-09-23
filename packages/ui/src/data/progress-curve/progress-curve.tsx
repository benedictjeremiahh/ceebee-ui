'use client';

import { useMemo } from 'react';
import { cn } from '../../lib/cn.js';
import { TimeSeriesChart } from '../time-series/index.js';
import { asDay, round1 } from '../time-series/time-series.math.js';
import { curveRows, readingOn, toPoints } from './progress-curve.math.js';
import { ProgressCurveSkeleton } from './progress-curve.skeleton.js';
import type { ProgressCurveProps } from './progress-curve.types.js';

/**
 * An S-curve: what the plan said would be done by each day, against what was.
 *
 * The canvas, the Token reading, the forced-colors path and the accessible table all belong to
 * `TimeSeriesChart`. What is here is the part that is about *progress*: a scale pinned to 0–100%,
 * because autoscale stretches a job at 30% to the full height of the plot and reads as "nearly
 * there"; and the reading in words above it, which is the one number somebody opened this to find.
 */
function ProgressCurveRoot({
  planned,
  actual,
  label,
  today,
  height = 260,
  plannedLabel = 'Planned',
  actualLabel = 'Actual',
  lastReportLabel = 'Last report',
  emptyLabel = 'Nothing has been reported yet.',
  tableLabel = 'Progress by day',
  dayLabel,
  formatNumber = oneDecimal,
  aheadLabel = 'ahead of plan',
  behindLabel = 'behind plan',
  onTrackLabel = 'on plan',
  loading = false,
  className,
}: ProgressCurveProps) {
  const rows = useMemo(() => curveRows(planned, actual), [planned, actual]);
  const actualPoints = useMemo(() => toPoints(actual), [actual]);
  const lastReport = actualPoints.at(-1)?.day ?? null;

  /* The reading is taken on `today` itself, never on the marked day. They are different questions: a
     marker has to attach to a data point, so it snaps to the nearest reported day — which can be in
     the *future*, since a plan states days that have not arrived. Reading there would report the plan
     for next week as though it were due now, and a job 7 points behind would be shown as 22 behind. */
  const latest = useMemo(() => {
    if (!today) return rows[rows.length - 1];
    const day = asDay(today);
    return day === null ? rows[rows.length - 1] : { day, ...readingOn(planned, actual, day) };
  }, [today, rows, planned, actual]);

  const series = useMemo(
    () => [
      { key: 'planned', label: plannedLabel, points: toPoints(planned), emphasis: 'reference' as const, colorToken: '--cb-fg-subtle' },
      { key: 'actual', label: actualLabel, points: toPoints(actual), emphasis: 'primary' as const, colorToken: '--cb-tone-brand' },
    ],
    [planned, actual, plannedLabel, actualLabel],
  );

  if (loading) return <ProgressCurveSkeleton height={height} className={className} />;

  return (
    <figure className={cn('cb-progress-curve', className)}>
      <figcaption className="cb-progress-curve__head">
        <span className="cb-progress-curve__label">{label}</span>
        <span className="cb-chart-legend">
          {series.map((one) => (
            <span key={one.key} className="cb-chart-legend__key" data-emphasis={one.emphasis} data-series={one.key}>
              {one.label}
            </span>
          ))}
        </span>
      </figcaption>

      {/* The reading in words, above the picture — the one number somebody opened this to find. */}
      {latest ? (
        <p className="cb-progress-curve__reading" data-state={stateOf(latest.gap)}>
          <strong>{percent(latest.actualPercent, formatNumber)}</strong>
          {' '}
          {actualLabel.toLowerCase()} · {percent(latest.plannedPercent, formatNumber)} {plannedLabel.toLowerCase()}
          {latest.gap === null ? null : (
            <>
              {' — '}
              {formatNumber(Math.abs(latest.gap))} {gapWord(latest.gap, { aheadLabel, behindLabel, onTrackLabel })}
            </>
          )}
          <span className="cb-progress-curve__on-day"> ({latest.day})</span>
        </p>
      ) : null}

      <TimeSeriesChart
        label={label}
        series={series}
        format={percentOf}
        range={{ min: 0, max: 100 }}
        mark={lastReport ? { day: lastReport, label: lastReportLabel } : undefined}
        height={height}
        emptyLabel={emptyLabel}
        tableLabel={tableLabel}
        dayLabel={dayLabel}
      />
    </figure>
  );
}

/** The Composition and its Skeleton, so a loading page keeps the chart's geometry. */
export const ProgressCurve = Object.assign(ProgressCurveRoot, { Skeleton: ProgressCurveSkeleton });

const percentOf = (value: number): string => `${Math.round(value)}%`;

const oneDecimal = (value: number): string => String(round1(value));

function percent(value: number | null, formatNumber: (value: number) => string): string {
  return value === null ? '—' : `${formatNumber(value)}%`;
}

function stateOf(gap: number | null): 'behind' | 'ahead' | 'on-plan' | 'unknown' {
  if (gap === null) return 'unknown';
  if (gap < 0) return 'behind';
  if (gap > 0) return 'ahead';
  return 'on-plan';
}

function gapWord(gap: number, words: { aheadLabel: string; behindLabel: string; onTrackLabel: string }): string {
  if (gap < 0) return words.behindLabel;
  if (gap > 0) return words.aheadLabel;
  return words.onTrackLabel;
}
