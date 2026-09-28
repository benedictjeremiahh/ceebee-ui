import { readableDay } from '../../time-series/time-series.math.js';
import type { ResolvedScheduleLabels } from '../schedule.types.js';

export const DEFAULT_SCHEDULE_LABELS: ResolvedScheduleLabels = {
  empty: 'Nothing is planned yet.', item: 'Work item', actualProgress: 'Actual', unreported: 'Not reported',
  today: 'Today', todayDate: (day) => readableDay(day, 'en-US'), progress: (percent) => `${percent}% done`,
  actual: (start, end) => `actual ${start}–${end}`, notStarted: 'not started', overran: 'past the plan', late: 'late',
  pan: 'Swipe the timeline to see later dates.',
  month: (date) => new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date),
  day: (date) => new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(date),
  week: (date) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date),
  plannedProgress: 'Planned', variance: 'Variance / lateness', gap: (points) => `${points > 0 ? '+' : ''}${points.toFixed(1)} pp`,
  lateDays: (days) => `${days} days late`, report: (day) => `Reported ${readableDay(day, 'en-US')}`,
  details: 'Details', fullSchedule: 'Full schedule', goToday: 'Go to today', dayScale: 'Day', weekScale: 'Week', monthScale: 'Month',
  percent: (percent) => `${Math.round(percent * 10) / 10}%`,
};
