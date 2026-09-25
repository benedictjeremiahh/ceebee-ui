/**
 * What a cash flow says about itself — the scale and reading behind `CashFlowChart`.
 *
 * A running balance shows *that* cash dips; the flows per period show *why*. Both are computed here, away
 * from the drawing, because these are the parts that can be wrong: a balance that forgets the opening
 * figure, or a scale that clips the one bar the reader needed to see.
 */
import { niceRange } from '../time-series/time-series.math.js';

export interface CashFlowPeriod {
  /** Stable key for the period. */
  id: string;
  /** The first day of the period, `YYYY-MM-DD` — a day, a week's Monday, a month's first. */
  start: string;
  /** Money in during the period. */
  inflow: number;
  /** Money out during the period, as a positive amount (a negative one is read as the same outflow). */
  outflow: number;
  /**
   * The lowest balance *within* the period, when the consumer knows it — a week bucketed from daily figures
   * can dip mid-week and recover by its close. Read against the line in place of the close when lower.
   */
  low?: number;
}

export interface CashFlowRow extends CashFlowPeriod {
  /** In minus out. */
  net: number;
  /** The balance at the end of the period. */
  balance: number;
  /** The lowest balance in the period: its `low` when given and lower, otherwise its close. */
  lowest: number;
}

export interface CashFlowReading {
  lowest: number | null;
  lowestIndex: number | null;
  /** The first period whose closing balance is below the line, or null when none is. */
  firstBelowIndex: number | null;
  periodsBelow: number;
  closing: number | null;
}

export interface CashFlowScale {
  min: number;
  max: number;
  step: number;
  ticks: number[];
}

/** Each period with its net flow and the balance it closes on, running from `opening`. */
export function cashFlowRows(opening: number, periods: readonly CashFlowPeriod[]): CashFlowRow[] {
  let balance = opening;
  return periods.map((period) => {
    const outflow = Math.abs(period.outflow);
    const net = period.inflow - outflow;
    balance += net;
    return { ...period, outflow, net, balance, lowest: Math.min(balance, period.low ?? balance) };
  });
}

/** The lowest balance (a period's `low` counts) and where it first goes below the line. "Below" is strict. */
export function cashFlowReading(rows: readonly CashFlowRow[], threshold = 0): CashFlowReading {
  if (rows.length === 0) return { lowest: null, lowestIndex: null, firstBelowIndex: null, periodsBelow: 0, closing: null };
  let lowestIndex = 0;
  rows.forEach((row, index) => {
    if (row.lowest < (rows[lowestIndex]?.lowest ?? row.lowest)) lowestIndex = index;
  });
  const firstBelow = rows.findIndex((row) => row.lowest < threshold);
  return {
    lowest: rows[lowestIndex]?.lowest ?? null,
    lowestIndex,
    firstBelowIndex: firstBelow === -1 ? null : firstBelow,
    periodsBelow: rows.filter((row) => row.lowest < threshold).length,
    closing: rows.at(-1)?.balance ?? null,
  };
}

/**
 * One scale for bars and line, always containing zero: inflows stand up from it, outflows hang down, and the
 * balance crosses it. Rounded outwards to ticks of 1, 2 or 5 × 10ⁿ so no label carries a trivial decimal.
 */
export function cashFlowScale(rows: readonly CashFlowRow[], target = 4): CashFlowScale {
  const values = rows.flatMap((row) => [row.inflow, -row.outflow, row.balance, row.lowest]);
  const low = Math.min(0, ...values);
  const high = Math.max(0, ...values);
  const { min, max, step } = high === low ? { min: low, max: low + 1, step: 1 } : niceRange(low, high, target);
  const ticks: number[] = [];
  for (let tick = min; tick <= max + step / 2; tick += step) ticks.push(Math.round(tick / step) * step || 0);
  return { min, max, step, ticks };
}

/** How far up the plot a value sits, as a percentage of its height. */
export function heightOf(value: number, scale: CashFlowScale): number {
  return ((value - scale.min) / (scale.max - scale.min)) * 100;
}
