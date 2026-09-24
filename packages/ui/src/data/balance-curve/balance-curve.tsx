'use client';

import { useMemo } from 'react';
import { cn } from '../../lib/cn.js';
import { useDocumentLocale } from '../../lib/use-document-locale.js';
import { TimeSeriesChart } from '../time-series/index.js';
import { readableDay, seriesPoints } from '../time-series/time-series.math.js';
import { balanceReading } from './balance-curve.math.js';
import { BalanceCurveSkeleton } from './balance-curve.skeleton.js';
import type { BalanceCurveProps } from './balance-curve.types.js';

/**
 * A running balance over days, read against a line: a cash projection, a budget remaining, a tank.
 *
 * The substrate draws this as a **baseline** series rather than a line, which is not decoration: it
 * shades above and below the threshold in the semantic colours, so the stretch that is in trouble is
 * coloured by its own values instead of by a tag somebody has to read. Seven red tags in a row say
 * nothing about how far down the dip goes; a shaded area says it at a glance.
 *
 * The sentence above the plot is the other half. A chart shows the shape; the sentence gives the two
 * figures a decision needs — the day it goes under and the lowest it gets — so nobody has to read a
 * position off an axis to act on it.
 */
function BalanceCurveRoot({
  label,
  balances,
  format,
  threshold = { value: 0 },
  height = 260,
  seriesLabel = 'Balance',
  emptyLabel = 'Nothing to project yet.',
  tableLabel = 'Balance by day',
  belowLabel = (from, lowest, days) => `Below the line from ${from} — lowest ${lowest}, ${days} day(s) under.`,
  clearLabel = (lowest) => `Stays above the line. Lowest point ${lowest}.`,
  locale: givenLocale,
  loading = false,
  className,
}: BalanceCurveProps) {
  const locale = useDocumentLocale(givenLocale);
  const points = useMemo(() => seriesPoints(balances), [balances]);
  const reading = useMemo(() => balanceReading(points, threshold.value), [points, threshold.value]);

  const series = useMemo(
    () => [{ key: 'balance', label: seriesLabel, points, emphasis: 'primary' as const, colorToken: '--cb-tone-brand' }],
    [points, seriesLabel],
  );

  if (loading) return <BalanceCurveSkeleton height={height} className={className} />;

  const breached = reading.firstBelowDay !== null;

  return (
    <figure className={cn('cb-balance-curve', className)}>
      <figcaption className="cb-balance-curve__head">
        <span className="cb-balance-curve__label">{label}</span>
        {threshold.label ? <span className="cb-balance-curve__threshold">{threshold.label}</span> : null}
      </figcaption>

      {reading.lowest === null ? null : (
        <p className="cb-balance-curve__reading" data-state={breached ? 'below' : 'clear'}>
          {breached && reading.firstBelowDay
            // The sentence is prose, so the day in it is written the way a person reads one — the table's
            // row header and the axis are the same date in other shapes, not a different spelling of it.
            ? belowLabel(readableDay(reading.firstBelowDay, locale), format(reading.lowest), reading.daysBelow)
            : clearLabel(format(reading.lowest))}
        </p>
      )}

      <TimeSeriesChart
        label={label}
        series={series}
        format={format}
        baseline={threshold}
        locale={locale}
        /* The low point is marked rather than today: a reader scanning a projection is looking for the
           worst day, and it is a day the series definitely reports, so the mark lands exactly on it. */
        mark={reading.lowestDay ? { day: reading.lowestDay, label: format(reading.lowest ?? 0) } : undefined}
        height={height}
        emptyLabel={emptyLabel}
        tableLabel={tableLabel}
      />
    </figure>
  );
}

/** The Composition and its Skeleton, so a loading page keeps the chart's geometry. */
export const BalanceCurve = Object.assign(BalanceCurveRoot, { Skeleton: BalanceCurveSkeleton });
