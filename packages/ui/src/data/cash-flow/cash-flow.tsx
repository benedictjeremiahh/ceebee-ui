'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../../lib/cn.js';
import { createCssProbe, watchTokens } from '../../lib/css-probe.js';
import { useDocumentLocale } from '../../lib/use-document-locale.js';
import { readableDay } from '../time-series/time-series.math.js';
import { cashFlowPlot, mountCashFlow, type CashFlowPalette, type MountedCashFlow } from './cash-flow.chart.js';
import { cashFlowReading, cashFlowRows } from './cash-flow.math.js';
import type { CashFlowChartProps } from './cash-flow.types.js';

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
  tableLabel = 'Cash flow by period',
  emptyLabel = 'Nothing to project yet.',
  belowLabel = (from, lowest, count) => `Below the line from ${from} — lowest ${lowest}, ${count} period(s) under.`,
  clearLabel = (lowest) => `Stays above the line. Lowest point ${lowest}.`,
  locale: givenLocale,
  className,
}: CashFlowChartProps) {
  const locale = useDocumentLocale(givenLocale);
  const host = useRef<HTMLDivElement>(null);
  const [forcedColors, setForcedColors] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const rows = useMemo(() => cashFlowRows(opening, periods), [opening, periods]);
  const reading = useMemo(() => cashFlowReading(rows, threshold.value), [rows, threshold.value]);
  const plot = useMemo(() => cashFlowPlot(opening, rows), [opening, rows]);
  const name = formatPeriod ?? ((day: string) => readableDay(day, locale, 'short'));
  const empty = rows.length === 0;

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
    void mountCashFlow(element, plot, format, name, threshold.value, lowest, initial, setActiveIndex).then((chart) => {
      if (cancelled) {
        chart.destroy();
        return;
      }
      mounted = chart;
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
    };
  }, [empty, forcedColors, plot, reading, format, formatPeriod, locale, threshold.value]);

  if (empty) return <p className={cn('cb-cash-flow__empty', className)}>{emptyLabel}</p>;
  const from = reading.firstBelowIndex === null ? null : rows[reading.firstBelowIndex];
  const active = activeIndex === null ? null : rows[activeIndex];

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
        <div className="cb-cash-flow__plot" onMouseLeave={() => setActiveIndex(null)}>
          <div ref={host} className="cb-cash-flow__canvas" style={{ blockSize: height }} aria-hidden="true" />
          {active ? (
            <div className="cb-cash-flow__detail" data-side={activeIndex !== null && activeIndex < rows.length / 2 ? 'end' : 'start'}
              data-testid="cash-flow-detail" aria-hidden="true">
              <strong>{name(active.start)}</strong>
              <dl>
                <div><dt>{inflowLabel}</dt><dd>{formatExact(active.inflow)}</dd></div>
                <div><dt>{outflowLabel}</dt><dd>{formatExact(active.outflow)}</dd></div>
                <div><dt>{balanceLabel}</dt><dd>{formatExact(active.balance)}</dd></div>
                {active.lowest === active.balance ? null : <div><dt>{lowestLabel}</dt><dd>{formatExact(active.lowest)}</dd></div>}
              </dl>
            </div>
          ) : null}
        </div>
      )}
      <div className="cb-cash-flow__periods" aria-label={tableLabel}>
        {rows.map((row, index) => {
          const describe = `${name(row.start)}: ${inflowLabel} ${formatExact(row.inflow)}, ${outflowLabel} ${formatExact(row.outflow)}, ${balanceLabel} ${formatExact(row.balance)}`;
          const props = {
            className: 'cb-cash-flow__period',
            'data-below': row.lowest < threshold.value ? 'true' : undefined,
            'data-selected': row.id === selectedPeriod ? 'true' : undefined,
          };
          return onSelectPeriod ? (
            <button key={row.id} type="button" {...props} aria-label={describe} aria-pressed={row.id === selectedPeriod}
              onClick={() => onSelectPeriod(row.id)} onFocus={() => setActiveIndex(index)} onBlur={() => setActiveIndex(null)}>
              {name(row.start)}
            </button>
          ) : <span key={row.id} {...props}>{name(row.start)}</span>;
        })}
      </div>
      <div className="cb-cash-flow__rows">
        <table>
          <caption>{tableLabel}</caption>
          <thead><tr><th scope="col" /><th scope="col">{inflowLabel}</th><th scope="col">{outflowLabel}</th><th scope="col">{balanceLabel}</th></tr></thead>
          <tbody>{rows.map((row) => (
            <tr key={row.id}><th scope="row">{name(row.start)}</th><td>{formatExact(row.inflow)}</td><td>{formatExact(row.outflow)}</td><td>{formatExact(row.balance)}</td></tr>
          ))}</tbody>
        </table>
      </div>
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
