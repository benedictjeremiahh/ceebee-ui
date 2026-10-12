'use client';

import { Popover } from 'antd';
import { Button } from '../../../form/button.js';

export interface ScheduleScaleLabelsProps {
  labels: readonly string[];
  label: string;
}

/** Offers the full text of calendar scale cells that SVAR has clipped. */
export function ScheduleScaleLabels({ labels, label }: ScheduleScaleLabelsProps) {
  if (labels.length === 0) return null;

  return (
    <div className="cb-schedule__scale-labels">
      <Popover
        title={label}
        content={
          <ul className="cb-schedule__scale-label-list">
            {labels.map((fullLabel) => <li key={fullLabel}>{fullLabel}</li>)}
          </ul>
        }
        trigger="click"
        placement="topRight"
      >
        <Button size="small">{label}</Button>
      </Popover>
    </div>
  );
}
