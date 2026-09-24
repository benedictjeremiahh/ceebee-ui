'use client';

import { Schedule, type ScheduleItem } from '@ceebee/ui/client';
import { Demo } from './demo';

const ITEMS: ScheduleItem[] = [
  { id: 'survey', label: 'Survey', start: '2026-01-05', end: '2026-01-09', progress: 1 },
  { id: 'slab', label: 'Pour the slab', start: '2026-01-08', end: '2026-01-16', progress: 0.4, weight: 4000 },
  { id: 'wiring', label: 'First-fix wiring', start: '2026-01-14', end: '2026-01-23', progress: 0.1 },
  { id: 'inspection', label: 'Frame inspection', start: '2026-01-26', end: '2026-01-27' },
];

export function ScheduleDemo() {
  return (
    <Demo layout="block" code={`<Schedule items={items} today="2026-01-19" />`}>
      <Schedule items={ITEMS} today="2026-01-19" height={300} />
      <p>
        Bars run from each item's planned start to its planned end, the fill is how much has been reported done, and
        today is marked. A bar that is behind and unfinished reads as late.
      </p>
    </Demo>
  );
}
