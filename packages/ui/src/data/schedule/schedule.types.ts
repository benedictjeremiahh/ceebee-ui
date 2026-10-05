import type { ReactNode } from 'react';

/**
 * A bar on the schedule: one item, its plan, and how far along it is.
 *
 * `start` and `end` are calendar days (`YYYY-MM-DD`), not instants — a plan states days (ADR 0045), and
 * the two ends are inclusive: a one-day item starts and ends on the same day.
 */
export interface ScheduleItem {
  id: string;
  label: string;
  /** Rows with a parent are disclosed from its identity cell and start collapsed. */
  parentId?: string;
  start: string;
  end: string;
  /** 0–1. `0.4` draws a bar 40% filled. Absent means nothing is known, which is not the same as zero. */
  progress?: number;
  /** Basis points, so a late item can be weighted by how much it matters. Defaults to 10000 (all of it). */
  weight?: number;
  /** Physical-progress mode: last reporting day, not an actual start or finish. */
  reportedOn?: string;
  /** 0–1 planned physical completion at the consumer's measurement date. */
  plannedProgress?: number;
  /** Consumer-owned calendar lateness; completed work may have finished late. */
  latenessDays?: number;
  /**
   * When the work actually ran, as calendar days. Absent means nobody reported actuals yet — the row
   * draws planned only, never a guessed actual. The caller must qualify the meaning of these dates.
   */
  actual?: {
    start: string;
    end: string;
  };
}

/**
 * A child that states no dates. It stays in its parent's group and item count, is labelled, and draws
 * no bar: an invented range would read as a plan nobody made.
 */
export interface UnscheduledItem {
  id: string;
  label: string;
  parentId: string;
  unscheduled: true;
}

/** What `items` accepts: dated rows, and children that state no dates. */
export type ScheduleEntry = ScheduleItem | UnscheduledItem;

/** Every string the schedule says. Override any of them for a product that does not speak English. */
export interface ScheduleLabels {
  empty: string;
  item: string;
  /** Header for the stable completion reading beside each Work Item. */
  actualProgress?: string;
  /** Distinct from a reported zero. */
  unreported?: string;
  today: string;
  /** A human-readable rendering of the calendar day; the `<time>` keeps the ISO dateTime. */
  todayDate?: (day: string) => string;
  progress: (percent: number) => string;
  actual: (start: string, end: string) => string;
  notStarted: string;
  overran: string;
  late: string;
  /** Visible instruction on narrow screens where the time axis needs horizontal panning. */
  pan?: string;
  /** Month row on the time axis; receives the calendar month being drawn. */
  month?: (date: Date) => string;
  /** Day row on the time axis; receives the calendar day being drawn. */
  day?: (date: Date) => string;
  /** Week row on the time axis when the weekly scale is selected. */
  week?: (date: Date) => string;
  plannedProgress?: string;
  variance?: string;
  gap?: (points: number) => string;
  lateDays?: (days: number) => string;
  report?: (day: string) => string;
  details?: string;
  /** Names a child row's own way in; distinct from `details`, which is the parent's labelled action. */
  itemDetails?: string;
  fullSchedule?: string;
  goToday?: string;
  dayScale?: string;
  weekScale?: string;
  monthScale?: string;
  percent?: (percent: number) => string;
  fullscreen?: string;
  expandWindow?: string;
  exitFullscreen?: string;
  exitExpanded?: string;
  fullscreenHint?: string;
  expandedHint?: string;
  /** Names the disclosure control of a row that has children. */
  expandItems?: string;
  collapseItems?: string;
  /** Marks a child that states no dates. */
  unscheduled?: string;
  /** A parent whose children are only partly dated: how many of them are. */
  partialCoverage?: (dated: number, total: number) => string;
}

export interface ScheduleView {
  scale: 'day' | 'week' | 'month';
  fit: boolean;
  left: number;
  top: number;
  /** Set after initial fit selection so a fullscreen mount preserves the chosen scale. */
  initialized?: boolean;
}

/** The complete label set after Schedule merges a consumer's overrides with its defaults. */
export type ResolvedScheduleLabels = Required<ScheduleLabels>;

export interface ScheduleProps {
  items: ScheduleEntry[];
  /** `YYYY-MM-DD`. Marked on the axis, and what decides which bars are late. Absent marks nothing. */
  today?: string;
  labels?: Partial<ScheduleLabels>;
  /** Bars are read-only by default: a schedule is a view of someone else's plan, not a plan editor. */
  editable?: boolean;
  /** Optional `%` badge on bars. Off by default because the grid carries an aligned reading. */
  percentLabels?: boolean;
  /** Day cells by default; week cells keep longer schedules readable at a glance. */
  scale?: 'day' | 'week' | 'month';
  /** Opt-in: blue fill measures physical completion within the plan, never a reporting envelope. */
  mode?: 'range' | 'physical';
  /** Optional controlled navigation for preserving the view across fullscreen mounts. */
  view?: ScheduleView;
  onViewChange?: (view: ScheduleView) => void;
  /** The labelled details action, on top-level rows only; a child never repeats its parent's action. */
  onItemOpen?: (id: string) => void;
  /** Optional native destination for a top-level item's details action. */
  itemHref?: (id: string) => string | undefined;
  /** Opens a child row from its own name, so one row has one way in. */
  onChildOpen?: (id: string) => void;
  /** Ids of expanded parents. Omit for uncontrolled disclosure, which survives fullscreen. */
  expanded?: readonly string[];
  onExpandedChange?: (expanded: string[]) => void;
  /** Opt in to native fullscreen with an isolated full-window fallback; no chart remount. */
  fullscreen?: boolean;
  /** Accessible name for the fullscreen region. */
  label?: string;
  /** Consumer controls and legend stay inside the same fullscreen root. */
  toolbar?: ReactNode;
  footer?: ReactNode;
  /** Item detail surfaces; render portals within this root, e.g. Modal getContainer={false}. */
  children?: ReactNode;
  height?: number;
  className?: string;
}
