'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../../lib/cn.js';
import { createCssProbe, watchTokens } from '../../lib/css-probe.js';
import { mountCurveChart, type CurveChart } from './progress-curve.chart.js';
import { curveRows, curveSeries, nearestDay, round1 } from './progress-curve.math.js';
import { ProgressCurveSkeleton } from './progress-curve.skeleton.js';
import type { CurvePalette, ProgressCurveProps } from './progress-curve.types.js';

/**
 * An S-curve: what the plan said would be done by each day, against what was.
 *
 * Drawn on a canvas by a charting substrate, which has one consequence that shapes this whole file:
 * **the picture is not in the DOM.** A screen reader finds nothing, a forced-colors viewer gets a
 * bitmap the system cannot recolour, and no test can look at it. So the table below the chart is not
 * a caption or a fallback — it is the chart's other rendering, always present, built from the same
 * numbers, and it is what a forced-colors viewer sees *instead of* the canvas.
 */
function ProgressCurveRoot({
  planned,
  actual,
  label,
  today,
  height = 260,
  plannedLabel = 'Planned',
  actualLabel = 'Actual',
  todayLabel = 'Today',
  emptyLabel = 'Nothing has been reported yet.',
  tableLabel = 'Progress by day',
  aheadLabel = 'ahead of plan',
  behindLabel = 'behind plan',
  onTrackLabel = 'on plan',
  loading = false,
  className,
}: ProgressCurveProps) {
  const host = useRef<HTMLDivElement>(null);
  const [forcedColors, setForcedColors] = useState(false);

  const plannedSeries = useMemo(() => curveSeries(planned), [planned]);
  const actualSeries = useMemo(() => curveSeries(actual), [actual]);
  const rows = useMemo(() => curveRows(plannedSeries, actualSeries), [plannedSeries, actualSeries]);
  const empty = rows.length === 0;

  const todayMark = useMemo(
    () => (today ? nearestDay(rows.map((row) => row.day), today) : null),
    [rows, today],
  );
  const latest = todayMark ? rows.find((row) => row.day === todayMark) : rows[rows.length - 1];

  /* Forced colors is asked once and then watched, because it can be switched on while the page is
     open. When it is on the canvas is never mounted at all: a bitmap the system cannot recolour is
     worse than no picture, and the table is the better rendering for that reader anyway. */
  useEffect(() => {
    const query = window.matchMedia('(forced-colors: active)');
    const read = () => setForcedColors(query.matches);
    read();
    query.addEventListener('change', read);
    return () => query.removeEventListener('change', read);
  }, []);

  useEffect(() => {
    const element = host.current;
    if (!element || empty || forcedColors || loading) return;

    let chart: CurveChart | null = null;
    let cancelled = false;

    let palette = readPalette(element);
    /* No palette means the Tokens did not resolve — a server-rendered first paint, a Skin stylesheet
       that has not landed, an environment with no Custom Property support. Drawing anyway would mean
       inventing colours, so nothing is drawn and the table stands as the rendering until the Tokens
       arrive and the watcher below runs this again. */
    if (!palette) return;

    void mountCurveChart(element, palette).then((mounted) => {
      if (cancelled) {
        mounted.destroy();
        return;
      }
      chart = mounted;
      /* The Tokens are re-read here rather than reused from before the import. The substrate is
         loaded asynchronously, so a theme that is applied during that gap — which is exactly what a
         page restoring a saved theme after first paint does — would otherwise be missed by the
         watcher below (there was no chart yet to apply it to) and never seen again: a light page
         with a dark plot, until something else happened to change the theme. */
      const current = readPalette(element) ?? palette;
      if (current) mounted.applyPalette(current);
      mounted.setData(plannedSeries, actualSeries);
      mounted.markToday(todayMark, todayLabel);
    });

    const stopWatchingTokens = watchTokens(() => {
      const next = readPalette(element);
      if (!next) return;
      palette = next;
      chart?.applyPalette(next);
    });

    return () => {
      cancelled = true;
      stopWatchingTokens();
      chart?.destroy();
      chart = null;
    };
  }, [plannedSeries, actualSeries, todayMark, todayLabel, empty, forcedColors, loading]);

  if (loading) return <ProgressCurveSkeleton height={height} className={className} />;

  return (
    <figure className={cn('cb-progress-curve', className)} data-forced-colors={forcedColors || undefined}>
      <figcaption className="cb-progress-curve__head">
        <span className="cb-progress-curve__label">{label}</span>
        <span className="cb-progress-curve__legend">
          <span className="cb-progress-curve__key cb-progress-curve__key--planned">{plannedLabel}</span>
          <span className="cb-progress-curve__key cb-progress-curve__key--actual">{actualLabel}</span>
        </span>
      </figcaption>

      {/* The reading in words, above the picture — the one number somebody opened this to find. */}
      {latest ? (
        <p className="cb-progress-curve__reading" data-state={stateOf(latest.gap)}>
          <strong>{format(latest.actualPercent)}</strong>
          {' '}
          {actualLabel.toLowerCase()} · {format(latest.plannedPercent)} {plannedLabel.toLowerCase()}
          {latest.gap === null ? null : (
            <>
              {' — '}
              {Math.abs(latest.gap)} {gapWord(latest.gap, { aheadLabel, behindLabel, onTrackLabel })}
            </>
          )}
          <span className="cb-progress-curve__on-day"> ({latest.day})</span>
        </p>
      ) : null}

      {empty ? <p className="cb-progress-curve__empty" style={{ minHeight: height }}>{emptyLabel}</p> : null}

      {/* Under forced colors the canvas is not rendered at all — not hidden. An empty labelled
          region would still be announced as an image, and would still hold a chart's worth of blank
          space, which is a worse answer than the table taking its place. */}
      {empty || forcedColors ? null : (
        <div
          ref={host}
          className="cb-progress-curve__canvas"
          style={{ height }}
          role="img"
          aria-label={label}
        />
      )}

      {/* An empty table is not an accessible rendering of nothing: it announces four columns and no
          rows, where the sentence above already said what happened. */}
      {empty ? null : (
      <div className="cb-progress-curve__rows">
      <table className="cb-progress-curve__table">
        <caption>{tableLabel}</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">{plannedLabel}</th>
            <th scope="col">{actualLabel}</th>
            <th scope="col">Gap</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.day} data-today={row.day === todayMark || undefined}>
              <th scope="row">{row.day}</th>
              <td>{format(row.plannedPercent)}</td>
              <td>{format(row.actualPercent)}</td>
              <td>{row.gap === null ? '—' : `${row.gap > 0 ? '+' : ''}${row.gap}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      )}
    </figure>
  );
}

/** The Composition and its Skeleton, so a loading page keeps the chart's geometry. */
export const ProgressCurve = Object.assign(ProgressCurveRoot, { Skeleton: ProgressCurveSkeleton });

function format(percent: number | null): string {
  return percent === null ? '—' : `${round1(percent)}%`;
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

function readPalette(host: HTMLElement): CurvePalette | null {
  const probe = createCssProbe(host);
  const planned = probe.color('--cb-fg-subtle');
  const actual = probe.color('--cb-tone-brand');
  const text = probe.color('--cb-fg-muted');
  const muted = probe.color('--cb-fg-subtle');
  const grid = probe.color('--cb-border');
  const background = probe.color('--cb-surface');
  probe.done();

  const font = getComputedStyle(host).fontFamily;
  if (!planned || !actual || !text || !muted || !grid || !background || !font) return null;
  return { planned, actual, text, muted, grid, background, font };
}
