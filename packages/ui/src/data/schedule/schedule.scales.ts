import type { IScaleConfig } from '@svar-ui/react-gantt';
import type { ResolvedScheduleLabels } from './schedule.types.js';

/** Keep the substrate's two-level axis, with text owned by Schedule labels. */
export function scheduleScales(
  labels: Pick<ResolvedScheduleLabels, 'month' | 'day' | 'week'>,
  scale: 'day' | 'week' | 'month' = 'day'
): IScaleConfig[] {
  if (scale === 'month')
    return [
      { unit: 'year', step: 1, format: (date) => String(date.getFullYear()) },
      { unit: 'month', step: 1, format: labels.month },
    ];
  return [
    { unit: 'month', step: 1, format: labels.month },
    { unit: scale, step: 1, format: labels[scale] },
  ];
}
