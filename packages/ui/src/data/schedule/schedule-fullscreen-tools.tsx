'use client';
import { Button } from 'antd';
import type { ReactNode } from 'react';
import type { ResolvedScheduleLabels } from './schedule.types.js';
import type { useScheduleFullscreen } from './use-schedule-fullscreen.js';

export function ScheduleFullscreenTools({ enabled, toolbar, presentation, text }: {
  enabled: boolean; toolbar?: ReactNode;
  presentation: ReturnType<typeof useScheduleFullscreen>; text: ResolvedScheduleLabels;
}) {
  return <>
    {enabled || toolbar ? <div className="cb-schedule__toolbar"><div>{toolbar}</div>
      {enabled ? <Button size="small" aria-pressed={presentation.mode !== 'inline'} onClick={presentation.toggle}>
        {presentation.mode === 'native' ? text.exitFullscreen : presentation.mode === 'window' ? text.exitExpanded
          : presentation.available ? text.fullscreen : text.expandWindow}
      </Button> : null}
    </div> : null}
    {presentation.mode !== 'inline' ? <p className="cb-schedule__fullscreen-hint" role="status">
      {presentation.mode === 'native' ? text.fullscreenHint : text.expandedHint}
    </p> : null}
  </>;
}
