'use client';

import { useMemo } from 'react';
import { cn } from '../../lib/cn.js';
import { useDocumentLocale } from '../../lib/use-document-locale.js';
import { readableDay } from '../time-series/time-series.math.js';
import { cashFlowReading, cashFlowRows, cashFlowScale, heightOf, type CashFlowRow, type CashFlowScale } from './cash-flow.math.js';
import type { CashFlowChartProps } from './cash-flow.types.js';

/**
 * Money in and out per period, with the running balance over them — the shape cash-forecast dashboards
 * converge on. A balance line alone shows *that* cash dips; the bars show *why*: which week's bills pull it
 * under and which receipt brings it back.
 *
 * Inflows stand up from the zero line in the success tone, outflows hang below it, and the balance is a line
 * across both, starting from the opening balance. A period that closes below the line is shaded, so the
 * trouble reads by position and fill, not by colour alone, and the lowest point carries a small dot with its
 * figure. The sentence above the plot says the two things a decision needs — when it goes under and how
 * far — and a visually hidden table gives every figure to a reader who cannot see the plot.
 *
 * Plain DOM with one SVG line: the bars are percentages of the plot, so the chart reflows to any width and
 * its text never scales with it.
 */
export function CashFlowChart({
  label,
  opening,
  periods,
  format,
  formatPeriod,
  threshold = { value: 0 },
  onSelectPeriod,
  selectedPeriod,
  height = 240,
  inflowLabel = 'In',
  outflowLabel = 'Out',
  balanceLabel = 'Balance',
  tableLabel = 'Cash flow by period',
  emptyLabel = 'Nothing to project yet.',
  belowLabel = (from, lowest, count) => `Below the line from ${from} — lowest ${lowest}, ${count} period(s) under.`,
  clearLabel = (lowest) => `Stays above the line. Lowest point ${lowest}.`,
  locale: givenLocale,
  className,
}: CashFlowChartProps) {
  const locale = useDocumentLocale(givenLocale);
  const rows = useMemo(() => cashFlowRows(opening, periods), [opening, periods]);
  const reading = useMemo(() => cashFlowReading(rows, threshold.value), [rows, threshold.value]);
  const scale = useMemo(() => cashFlowScale([...rows, { id: '', start: '', inflow: 0, outflow: 0, net: 0, balance: opening }]), [rows, opening]);
  const name = formatPeriod ?? ((start: string) => readableDay(start, locale, 'short'));

  if (rows.length === 0) return <p className={cn('cb-cash-flow__empty', className)}>{emptyLabel}</p>;

  const from = reading.firstBelowIndex === null ? null : rows[reading.firstBelowIndex];
  const stride = Math.ceil(rows.length / 6);

  return (
    <figure className={cn('cb-cash-flow', className)}>
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
      <div className="cb-cash-flow__body">
        <div className="cb-cash-flow__plot" style={{ blockSize: `${height}px` }}>
          {scale.ticks.map((tick) => (
            <span key={tick} aria-hidden="true" className={cn('cb-cash-flow__grid', tick === 0 && 'cb-cash-flow__grid--zero')} style={{ insetBlockEnd: `${heightOf(tick, scale)}%` }} />
          ))}
          <div className="cb-cash-flow__columns">
            {rows.map((row) => (
              <Column key={row.id} row={row} scale={scale} threshold={threshold.value} selected={row.id === selectedPeriod}
                describe={`${name(row.start)}: ${inflowLabel} ${format(row.inflow)}, ${outflowLabel} ${format(row.outflow)}, ${balanceLabel} ${format(row.balance)}`}
                onSelect={onSelectPeriod} />
            ))}
          </div>
          <BalanceLine rows={rows} opening={opening} scale={scale} />
          {reading.lowestIndex !== null && reading.lowest !== null ? (
            <span className="cb-cash-flow__low" aria-hidden="true" style={{ insetInlineStart: `${((reading.lowestIndex + 0.5) / rows.length) * 100}%`, insetBlockEnd: `${heightOf(reading.lowest, scale)}%` }}>
              <span className="cb-cash-flow__low-label">{format(reading.lowest)}</span>
            </span>
          ) : null}
        </div>
        <div className="cb-cash-flow__ticks" aria-hidden="true" style={{ blockSize: `${height}px` }}>
          {scale.ticks.map((tick) => (
            <span key={tick} style={{ insetBlockEnd: `${heightOf(tick, scale)}%` }}>{format(tick)}</span>
          ))}
        </div>
        <div className="cb-cash-flow__periods" aria-hidden="true" style={{ gridTemplateColumns: `repeat(${rows.length}, minmax(0, 1fr))` }}>
          {rows.map((row, index) => <span key={row.id}>{index % stride === 0 ? name(row.start) : ''}</span>)}
        </div>
      </div>
      <div className="cb-cash-flow__rows">
        <table>
          <caption>{tableLabel}</caption>
          <thead>
            <tr><th scope="col" /><th scope="col">{inflowLabel}</th><th scope="col">{outflowLabel}</th><th scope="col">{balanceLabel}</th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}><th scope="row">{name(row.start)}</th><td>{format(row.inflow)}</td><td>{format(row.outflow)}</td><td>{format(row.balance)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

function Column({ row, scale, threshold, selected, describe, onSelect }: {
  row: CashFlowRow; scale: CashFlowScale; threshold: number; selected: boolean; describe: string; onSelect?: (id: string) => void;
}) {
  const zero = heightOf(0, scale);
  const bars = (
    <>
      <span aria-hidden="true" className="cb-cash-flow__bar cb-cash-flow__bar--in" style={{ insetBlockEnd: `${zero}%`, blockSize: `${heightOf(row.inflow, scale) - zero}%` }} />
      <span aria-hidden="true" className="cb-cash-flow__bar cb-cash-flow__bar--out" style={{ insetBlockEnd: `${heightOf(-row.outflow, scale)}%`, blockSize: `${zero - heightOf(-row.outflow, scale)}%` }} />
    </>
  );
  const props = { className: 'cb-cash-flow__column', 'data-below': row.balance < threshold ? 'true' : undefined, 'data-selected': selected ? 'true' : undefined };
  // The bars are decoration (the table says every figure); a pressable period is a button named in full.
  return onSelect ? (
    <button type="button" {...props} aria-label={describe} aria-pressed={selected} onClick={() => onSelect(row.id)}>{bars}</button>
  ) : (
    <span {...props}>{bars}</span>
  );
}

/** The balance as one line from the opening figure at the left edge through each period's close, at its column's centre. */
function BalanceLine({ rows, opening, scale }: { rows: readonly CashFlowRow[]; opening: number; scale: CashFlowScale }) {
  const points = [`0,${100 - heightOf(opening, scale)}`, ...rows.map((row, index) => `${index + 0.5},${100 - heightOf(row.balance, scale)}`)];
  return (
    <svg className="cb-cash-flow__line" aria-hidden="true" viewBox={`0 0 ${rows.length} 100`} preserveAspectRatio="none">
      <polyline points={points.join(' ')} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
