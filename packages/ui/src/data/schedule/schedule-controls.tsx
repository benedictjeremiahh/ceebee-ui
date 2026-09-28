'use client';
import { Button } from 'antd';
import type { IApi } from '@svar-ui/react-gantt';
import type { RefObject } from 'react';
import { dayForGantt, dayToDate } from './schedule.math.js';
import type { ResolvedScheduleLabels, ScheduleView } from './schedule.types.js';

export function ScheduleControls({
  api,
  navigation,
  onChange,
  width,
  gridWidth,
  rangeDays,
  today,
  text,
}: {
  api: RefObject<IApi | null>;
  navigation: ScheduleView;
  onChange: (view: ScheduleView) => void;
  width: number | null;
  gridWidth: number;
  rangeDays: number;
  today?: string;
  text: ResolvedScheduleLabels;
}) {
  return (
    <div className="cb-schedule__controls">
      <Button
        size="small"
        onClick={() => {
          const available = (width ?? 1100) - gridWidth;
          const scale =
            rangeDays * 44 <= available ? 'day' : (Math.ceil(rangeDays / 7) + 1) * 70 <= available ? 'week' : 'month';
          onChange({ scale, fit: true, left: 0, top: navigation.top, initialized: true });
          void api.current?.exec('scroll-chart', { left: 0 });
        }}
      >
        {text.fullSchedule}
      </Button>
      <Button
        size="small"
        disabled={!today}
        onClick={() => {
          const state = api.current?.getState();
          const day = today ? dayToDate(today) : null;
          if (!state?._scales || !state.lengthUnit || !state.cellWidth || !day) return;
          const left = Math.max(
            0,
            state._scales.diff(dayForGantt(day), state._scales.start, state.lengthUnit) * state.cellWidth -
              ((width ?? 1100) - gridWidth) / 2
          );
          void api.current?.exec('scroll-chart', { left });
        }}
      >
        {text.goToday}
      </Button>
      <div className="cb-schedule__scales" role="group" aria-label={text.fullSchedule}>
        {(['day', 'week', 'month'] as const).map((unit) => (
          <Button
            size="small"
            key={unit}
            type={navigation.scale === unit ? 'primary' : 'default'}
            aria-pressed={navigation.scale === unit}
            onClick={() => onChange({ ...navigation, scale: unit, fit: false })}
          >
            {unit === 'day' ? text.dayScale : unit === 'week' ? text.weekScale : text.monthScale}
          </Button>
        ))}
      </div>
    </div>
  );
}
