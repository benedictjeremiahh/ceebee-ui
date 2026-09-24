'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../../lib/cn.js';
import { createCssProbe, watchTokens } from '../../lib/css-probe.js';
import { mountTimeSeries, type MountedChart } from './time-series.chart.js';
import { alignRows, nearestDay, readableDay, seriesPoints } from './time-series.math.js';
import { TimeSeriesChartSkeleton } from './time-series.skeleton.js';
import type { ChartPalette, TimeSeriesChartProps } from './time-series.types.js';

/**
 * A dated chart: any number of series over calendar days, or one series read against a baseline.
 *
 * It is drawn on a canvas, and that has one consequence which shapes this whole file: **the picture is
 * not in the DOM.** A screen reader finds nothing, a forced-colors viewer gets a bitmap the system
 * cannot recolour, and no test can look at it. So the table below the plot is not a caption or a
 * fallback — it is the chart's other rendering, always present, built from the same numbers, and it is
 * what a forced-colors viewer sees *instead of* the canvas.
 *
 * This is the primitive the library's dated Compositions are built from. It carries no domain meaning:
 * it does not know what a plan is or what money is, only how to draw dated values honestly and how to
 * say the same thing in words.
 */
export function TimeSeriesChart({
  label,
  series,
  format,
  range,
  baseline,
  mark,
  height = 260,
  emptyLabel = 'Nothing has been reported yet.',
  tableLabel = 'Readings by day',
  dayLabel = 'Day',
  locale: givenLocale,
  loading = false,
  className,
}: TimeSeriesChartProps) {
  const locale = useDocumentLocale(givenLocale);
  const host = useRef<HTMLDivElement>(null);
  const [forcedColors, setForcedColors] = useState(false);

  const cleaned = useMemo(
    () => series.map((one) => ({ ...one, points: seriesPoints(one.points) })),
    [series],
  );
  const rows = useMemo(() => alignRows(cleaned), [cleaned]);
  const empty = rows.length === 0;
  const markDay = useMemo(
    () => (mark ? nearestDay(rows.map((row) => row.day), mark.day) : null),
    [rows, mark],
  );

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

  const tokens = useMemo(() => cleaned.map((one) => one.colorToken), [cleaned]);

  useEffect(() => {
    const element = host.current;
    if (!element || empty || forcedColors || loading) return;

    let chart: MountedChart | null = null;
    let cancelled = false;

    let palette = readPalette(element, tokens);
    /* No palette means the Tokens did not resolve — a server-rendered first paint, a Skin stylesheet
       that has not landed, an environment with no Custom Property support. Drawing anyway would mean
       inventing colours, so nothing is drawn and the table stands as the rendering until the Tokens
       arrive and the watcher below runs this again. */
    if (!palette) return;

    void mountTimeSeries(
      element,
      /* The axis and the table read the same days in the same language: two renderings of one chart that
         disagreed about the date would be two charts. */
      { series: cleaned, format, range, baseline, tickMark: (day) => readableDay(day, locale, 'short') },
      palette,
    ).then((mounted) => {
      if (cancelled) {
        mounted.destroy();
        return;
      }
      chart = mounted;
      /* The Tokens are re-read here rather than reused from before the import. The substrate is loaded
         asynchronously, so a theme applied during that gap — which is exactly what a page restoring a
         saved theme after first paint does — would otherwise be missed by the watcher below (there was
         no chart yet to apply it to) and never seen again: a light page with a dark plot. */
      const current = readPalette(element, tokens) ?? palette;
      if (current) mounted.applyPalette(current);
      mounted.setData(cleaned);
      mounted.mark(markDay, mark?.label ?? '');
    });

    const stopWatchingTokens = watchTokens(() => {
      const next = readPalette(element, tokens);
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
  }, [cleaned, tokens, format, range, baseline, markDay, mark, empty, forcedColors, loading, locale]);

  if (loading) return <TimeSeriesChartSkeleton height={height} className={className} />;

  return (
    <div className={cn('cb-chart', className)} data-forced-colors={forcedColors || undefined}>
      {empty ? <p className="cb-chart__empty" style={{ minHeight: height }}>{emptyLabel}</p> : null}

      {/* Under forced colors the canvas is not rendered at all — not hidden. An empty labelled region
          would still be announced as an image, and would still hold a chart's worth of blank space,
          which is a worse answer than the table taking its place. */}
      {empty || forcedColors ? null : (
        <div ref={host} className="cb-chart__canvas" style={{ height }} role="img" aria-label={label} />
      )}

      {/* An empty table is not an accessible rendering of nothing: it announces columns and no rows. */}
      {empty ? null : (
        <div className="cb-chart__rows">
          <table className="cb-chart__table">
            <caption>{tableLabel}</caption>
            <thead>
              <tr>
                <th scope="col">{dayLabel}</th>
                {cleaned.map((one) => (
                  <th key={one.key} scope="col">{one.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.day} data-marked={row.day === markDay || undefined}>
                  <th scope="row">{readableDay(row.day, locale)}</th>
                  {cleaned.map((one) => {
                    const value = row.values[one.key];
                    return <td key={one.key}>{value === null || value === undefined ? '—' : format(value)}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/**
 * The language to write dates in: the prop when a consumer gives one, otherwise the document's `lang`.
 *
 * Read after mount rather than during render, because a server render has no document — choosing one there
 * would hydrate a different string from the one the page was rendered with, and a day column that changes
 * its words on hydration is the kind of mismatch React reports by throwing the tree away.
 */
function useDocumentLocale(given?: string): string {
  const [lang, setLang] = useState('en');
  useEffect(() => setLang(document.documentElement.lang || 'en'), []);
  return given ?? lang;
}

/**
 * The palette, read from the DOM because CSS cannot reach a canvas.
 *
 * Null when any colour fails to resolve. The alternative would be inventing one, and a chart drawn in
 * a colour the design system never chose is worse than a chart not drawn at all — the table is already
 * there and says the same thing.
 */
function readPalette(host: HTMLElement, seriesTokens: readonly string[]): ChartPalette | null {
  const probe = createCssProbe(host);
  const text = probe.color('--cb-fg-muted');
  const muted = probe.color('--cb-fg-subtle');
  const grid = probe.color('--cb-border');
  const background = probe.color('--cb-surface');
  const above = probe.color('--cb-tone-success');
  const below = probe.color('--cb-tone-danger');
  const seriesColors = seriesTokens.map((token) => probe.color(token));
  probe.done();

  const font = getComputedStyle(host).fontFamily;
  if (!text || !muted || !grid || !background || !above || !below || !font) return null;
  if (seriesColors.some((colour) => colour === undefined)) return null;
  return {
    text,
    muted,
    grid,
    background,
    font,
    above,
    below,
    series: seriesColors.filter((colour): colour is string => colour !== undefined),
  };
}
