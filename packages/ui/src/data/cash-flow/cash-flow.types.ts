import type { CashFlowPeriod } from './cash-flow.math.js';

export interface CashFlowChartProps {
  /** Accessible name, and the chart's visible title. */
  label: string;
  /** The balance the first period starts from — today's cash, not zero, or the line starts in the wrong place. */
  opening: number;
  /** The consumer's buckets, in order: days, weeks or months. */
  periods: CashFlowPeriod[];
  /** How a value is written. The library holds no currency. */
  format: (value: number) => string;
  /** How a period is named on the axis and in the table. Defaults to its start day in the document's locale. */
  formatPeriod?: (start: string) => string;
  /** The line the balance is read against. Defaults to zero. */
  threshold?: { value: number; label?: string };
  /** Called with a period's id when it is pressed; the periods become buttons only when this is given. */
  onSelectPeriod?: (id: string) => void;
  /** The period the consumer is showing the detail of. */
  selectedPeriod?: string;
  height?: number;
  inflowLabel?: string;
  outflowLabel?: string;
  balanceLabel?: string;
  tableLabel?: string;
  emptyLabel?: string;
  /** The reading's sentence when the balance goes below the line: the first period, the lowest figure, how many. */
  belowLabel?: (from: string, lowest: string, periods: number) => string;
  clearLabel?: (lowest: string) => string;
  locale?: string;
  className?: string;
}
