/**
 * A bar on the schedule: one item, its plan, and how far along it is.
 *
 * `start` and `end` are calendar days (`YYYY-MM-DD`), not instants — a plan states days (ADR 0045), and
 * the two ends are inclusive: a one-day item starts and ends on the same day.
 */
export interface ScheduleItem {
  id: string;
  label: string;
  start: string;
  end: string;
  /** 0–1. `0.4` draws a bar 40% filled. Absent means nothing is known, which is not the same as zero. */
  progress?: number;
  /** Basis points, so a late item can be weighted by how much it matters. Defaults to 10000 (all of it). */
  weight?: number;
  /**
   * When the work actually ran, as calendar days. Absent means nobody reported actuals yet — the row
   * draws planned only, never a guessed actual. A consumer derives this from reports (never typed).
   */
  actual?: {
    start: string;
    end: string;
  };
}

/** Every string the schedule says. Override any of them for a product that does not speak English. */
export interface ScheduleLabels {
  empty: string;
  item: string;
  today: string;
  progress: (percent: number) => string;
  actual: (start: string, end: string) => string;
  notStarted: string;
  overran: string;
  late: string;
}

export interface ScheduleProps {
  items: ScheduleItem[];
  /** `YYYY-MM-DD`. Marked on the axis, and what decides which bars are late. Absent marks nothing. */
  today?: string;
  labels?: Partial<ScheduleLabels>;
  /** Bars are read-only by default: a schedule is a view of someone else's plan, not a plan editor. */
  editable?: boolean;
  /** The `%` reading at each actual bar. On by default; a caller with 30+ rows turns it off. */
  percentLabels?: boolean;
  height?: number;
  className?: string;
}
