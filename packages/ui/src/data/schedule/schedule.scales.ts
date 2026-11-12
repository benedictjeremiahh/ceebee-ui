import type { IScaleConfig } from '@svar-ui/react-gantt';
import type { ResolvedScheduleLabels, ScheduleView } from './schedule.types.js';

export function fitScheduleScale(rangeDays: number, available: number): ScheduleView['scale'] {
  if (rangeDays * 44 <= available) return 'day';
  return (Math.ceil(rangeDays / 7) + 1) * 70 <= available ? 'week' : 'month';
}

/** Group the calendar only where the parent and child units align in the substrate. */
export function scheduleScales(
  labels: Pick<ResolvedScheduleLabels, 'month' | 'day' | 'week'>,
  scale: 'day' | 'week' | 'month' = 'day'
): IScaleConfig[] {
  if (scale === 'month')
    return [
      { unit: 'year', step: 1, format: (date) => String(date.getFullYear()) },
      { unit: 'month', step: 1, format: labels.month },
    ];
  // Calendar months do not contain an integral number of weeks. SVAR places month labels
  // over unrelated weeks after panning, so the week label carries the date on its own.
  if (scale === 'week') return [{ unit: 'week', step: 1, format: labels.week }];
  return [
    { unit: 'month', step: 1, format: labels.month },
    { unit: scale, step: 1, format: labels[scale] },
  ];
}
