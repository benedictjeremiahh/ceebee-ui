'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../../lib/cn.js';
import { createCssProbe, watchTokens } from '../../lib/css-probe.js';
import { useDocumentLocale } from '../../lib/use-document-locale.js';
import { readableDay } from '../time-series/time-series.math.js';
import { cashFlowPlot, mountCashFlow, type CashFlowPalette, type MountedCashFlow } from './cash-flow.chart.js';
import { cashFlowReading, cashFlowRows } from './cash-flow.math.js';
import type { CashFlowChartProps } from './cash-flow.types.js';
import { cashFlowDetailPosition, type CashFlowAnchor } from './cash-flow.detail.js';

/** The canvas is the visual rendering; the table remains the exact accessible rendering. */
export function CashFlowChart({
  label,
  opening,
  periods,
  format,
  formatExact = format,
  formatPeriod,
  threshold = { value: 0 },
  onSelectPeriod,
  selectedPeriod,
  height = 240,
  inflowLabel = 'In',
  outflowLabel = 'Out',
  balanceLabel = 'Balance',
  lowestLabel = 'Low',
  adjustmentLabel = 'Adjustment',
  periodLabel = 'Period',
  tableLabel = 'Cash flow by period',
  periodControlsLabel,
  compact = false,
  emptyLabel = 'Nothing to project yet.',
  belowLabel = (from, lowest, count) => `Below the line from ${from} — lowest ${lowest}, ${count} period(s) under.`,
  clearLabel = (lowest) => `Stays above the line. Lowest point ${lowest}.`,
  locale: givenLocale,
  className,
}: CashFlowChartProps) {
  const locale = useDocumentLocale(givenLocale);
  const host = useRef<HTMLDivElement>(null);
  const detail = useRef<HTMLDivElement>(null);
  const [mountedChart, setMountedChart] = useState<MountedCashFlow | null>(null);
  const [forcedColors, setForcedColors] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<CashFlowAnchor | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const activeIndex = focusedIndex ?? hoveredIndex;
  const rows = useMemo(() => cashFlowRows(opening, periods), [opening, periods]);
  const reading = useMemo(() => cashFlowReading(rows, threshold.value), [rows, threshold.value]);
  const plot = useMemo(() => cashFlowPlot(opening, rows), [opening, rows]);
  const name = formatPeriod ?? ((day: string) => readableDay(day, locale, 'short'));
  const empty = rows.length === 0;
  const hasAdjustments = rows.some((row) => (row.adjustment ?? 0) !== 0);

  useEffect(() => {
    const query = window.matchMedia('(forced-colors: active)');
    const read = () => setForcedColors(query.matches);
    read();
    query.addEventListener('change', read);
    return () => query.removeEventListener('change', read);
  }, []);

  useEffect(() => {
    const element = host.current;
    if (!element || empty || forcedColors) return;
    const initial = readPalette(element);
    if (!initial) return;
    let mounted: MountedCashFlow | null = null;
    let cancelled = false;
    const lowest = reading.lowestIndex === null || reading.lowest === null
      ? null : { index: reading.lowestIndex, value: reading.lowest };
    void mountCashFlow(element, plot, format, name, threshold.value, lowest, initial, (index, point) => {
      setHoveredIndex(index);
      setHoveredPoint(point);
    }).then((chart) => {
      if (cancelled) {
        chart.destroy();
        return;
      }
      mounted = chart;
      setMountedChart(chart);
      chart.applyPalette(readPalette(element) ?? initial);
    });
    const stopWatchingTokens = watchTokens(() => {
      const palette = readPalette(element);
      if (palette) mounted?.applyPalette(palette);
    });
    return () => {
      cancelled = true;
      stopWatchingTokens();
      mounted?.destroy();
      setMountedChart(null);
    };
  }, [empty, forcedColors, plot, reading, format, formatPeriod, locale, threshold.value]);

  useLayoutEffect(() => {
    const element = host.current;
    const tooltip = detail.current;
    if (!element || !tooltip || activeIndex === null) return;
    const position = () => {
      const point = focusedIndex === null ? hoveredPoint : mountedChart?.pointAt(focusedIndex);
      if (!point) return;
      const probe = createCssProbe(element);
      const gap = probe.length('--cb-space-2') ?? 0;
      probe.done();
      const offset = cashFlowDetailPosition(point, element.getBoundingClientRect(), tooltip.getBoundingClientRect(), gap);
      tooltip.style.left = `${offset.left}px`;
      tooltip.style.top = `${offset.top}px`;
    };
    position();
    const resize = new ResizeObserver(position);
    resize.observe(element);
    resize.observe(tooltip);
    return () => resize.disconnect();
  }, [activeIndex, focusedIndex, hoveredPoint, mountedChart, rows]);

  if (empty) return <p className={cn('cb-cash-flow__empty', className)}>{emptyLabel}</p>;
  const from = reading.firstBelowIndex === null ? null : rows[reading.firstBelowIndex];
  const active = activeIndex === null ? null : rows[activeIndex];
  const periodControls = <div className={cn('cb-cash-flow__periods', compact && 'cb-cash-flow__periods--compact')} aria-label={tableLabel}>
    {rows.map((row, index) => {
      const describe = `${name(row.start)}: ${inflowLabel} ${formatExact(row.inflow)}, ${outflowLabel} ${formatExact(row.outflow)}, ${balanceLabel} ${formatExact(row.balance)}${hasAdjustments ? `, ${adjustmentLabel} ${formatExact(row.adjustment ?? 0)}` : ''}`;
      const props = {
        className: 'cb-cash-flow__period',
        'data-below': row.lowest < threshold.value ? 'true' : undefined,
        'data-selected': row.id === selectedPeriod ? 'true' : undefined,
      };
      return onSelectPeriod ? (
        <button key={row.id} type="button" {...props} aria-label={describe} aria-pressed={row.id === selectedPeriod}
          onClick={() => onSelectPeriod(row.id)} onFocus={() => setFocusedIndex(index)} onBlur={() => setFocusedIndex(null)}>
          {name(row.start)}
        </button>
      ) : <span key={row.id} {...props} role="img" tabIndex={0} aria-label={describe}
        onFocus={() => setFocusedIndex(index)} onBlur={() => setFocusedIndex(null)}>{name(row.start)}</span>;
    })}
  </div>;
  const exactTable = <table>
    <caption>{tableLabel}</caption>
    <thead><tr><th scope="col">{periodLabel}</th><th scope="col">{inflowLabel}</th><th scope="col">{outflowLabel}</th>{hasAdjustments ? <th scope="col">{adjustmentLabel}</th> : null}<th scope="col">{balanceLabel}</th></tr></thead>
    <tbody>{rows.map((row, index) => (
      <tr key={row.id} data-selected={row.id === selectedPeriod || undefined}>
        <th scope="row">{periodControlsLabel && onSelectPeriod ? <button type="button" className="cb-cash-flow__period"
          aria-label={`${name(row.start)}: ${inflowLabel} ${formatExact(row.inflow)}, ${outflowLabel} ${formatExact(row.outflow)}, ${balanceLabel} ${formatExact(row.balance)}${hasAdjustments ? `, ${adjustmentLabel} ${formatExact(row.adjustment ?? 0)}` : ''}`}
          aria-pressed={row.id === selectedPeriod} onClick={() => onSelectPeriod(row.id)}
          onFocus={() => setFocusedIndex(index)} onBlur={() => setFocusedIndex(null)}>{name(row.start)}</button> : name(row.start)}</th>
        <td>{formatExact(row.inflow)}</td><td>{formatExact(row.outflow)}</td>{hasAdjustments ? <td>{formatExact(row.adjustment ?? 0)}</td> : null}<td>{formatExact(row.balance)}</td>
      </tr>
    ))}</tbody>
  </table>;

  return (
    <figure className={cn('cb-cash-flow', className)} data-forced-colors={forcedColors || undefined}>
      <figcaption className="cb-cash-flow__head">
        <span className="cb-cash-flow__label">{label}</span>
        <span className="cb-cash-flow__legend" aria-hidden="true">
          <span className="cb-cash-flow__key cb-cash-flow__key--in">{inflowLabel}</span>
          <span className="cb-cash-flow__key cb-cash-flow__key--out">{outflowLabel}</span>
          <span className="cb-cash-flow__key cb-cash-flow__key--balance">{balanceLabel}</span>
        </span>
      </figcaption>
      {reading.lowest === null ? null : (
        <p className="cb-cash-flow__reading" data-state={from ? 'below' : 'clear'}>
          {from ? belowLabel(name(from.start), format(reading.lowest), reading.periodsBelow) : clearLabel(format(reading.lowest))}
        </p>
      )}
      {forcedColors ? null : (
        <div className="cb-cash-flow__plot" onMouseLeave={() => setHoveredIndex(null)}>
          <div ref={host} className="cb-cash-flow__canvas" style={{ blockSize: height }} aria-hidden="true" />
          {active ? (
            <div ref={detail} className="cb-cash-flow__detail"
              data-testid="cash-flow-detail" aria-hidden="true">
              <strong>{name(active.start)}</strong>
              <dl>
                <div><dt>{inflowLabel}</dt><dd>{formatExact(active.inflow)}</dd></div>
                <div><dt>{outflowLabel}</dt><dd>{formatExact(active.outflow)}</dd></div>
                {hasAdjustments ? <div><dt>{adjustmentLabel}</dt><dd>{formatExact(active.adjustment ?? 0)}</dd></div> : null}
                <div><dt>{balanceLabel}</dt><dd>{formatExact(active.balance)}</dd></div>
                {active.lowest === active.balance ? null : <div><dt>{lowestLabel}</dt><dd>{formatExact(active.lowest)}</dd></div>}
              </dl>
            </div>
          ) : null}
        </div>
      )}
      {periodControlsLabel && !forcedColors ? <details className="cb-cash-flow__browse" onToggle={(event) => {
        if (!event.currentTarget.open) setFocusedIndex(null);
      }}><summary>{periodControlsLabel}</summary><div className="cb-cash-flow__table">{exactTable}</div></details>
        : <>{periodControlsLabel ? null : periodControls}<div className="cb-cash-flow__rows">{exactTable}</div></>}
    </figure>
  );
}

function readPalette(host: HTMLElement): CashFlowPalette | null {
  const probe = createCssProbe(host);
  const background = probe.color('--cb-surface');
  const text = probe.color('--cb-fg-muted');
  const grid = probe.color('--cb-border');
  const muted = probe.color('--cb-fg-subtle');
  const inflow = probe.color('--cb-tone-success');
  const outflow = probe.color('--cb-tone-danger');
  const balance = probe.color('--cb-tone-brand');
  probe.done();
  const font = getComputedStyle(host).fontFamily;
  if (!background || !text || !grid || !muted || !inflow || !outflow || !balance || !font) return null;
  return { background, text, grid, muted, inflow, outflow, balance, font };
}
