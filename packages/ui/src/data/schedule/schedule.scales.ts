import type { IScaleConfig } from '@svar-ui/react-gantt';
import type { ResolvedScheduleLabels } from './schedule.types.js';

/** Keep the substrate's two-level axis, with text owned by Schedule labels. */
export function scheduleScales(labels: Pick<ResolvedScheduleLabels, 'month' | 'day' | 'week'>, scale: 'day' | 'week' = 'day'): IScaleConfig[] {
  return [
    { unit: 'month', step: 1, format: labels.month },
    { unit: scale, step: 1, format: labels[scale] },
  ];
}
