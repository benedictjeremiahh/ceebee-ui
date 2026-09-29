'use client';

import { Schedule, type ScheduleEntry, type ScheduleItem } from '@ceebee/ui/client';
import { Demo } from './demo';

const ITEMS: ScheduleItem[] = [
  { id: 'survey', label: 'Survey', start: '2026-01-05', end: '2026-01-09', progress: 1 },
  {
    id: 'slab',
    label: 'Pour the slab',
    start: '2026-01-08',
    end: '2026-01-16',
    progress: 0.4,
    weight: 4000,
    actual: { start: '2026-01-08', end: '2026-01-18' },
  },
  {
    id: 'wiring',
    label: 'First-fix wiring',
    start: '2026-01-14',
    end: '2026-01-23',
    progress: 0.1,
    actual: { start: '2026-01-14', end: '2026-01-18' },
  },
  { id: 'inspection', label: 'Frame inspection', start: '2026-01-26', end: '2026-01-27' },
];

export function ScheduleDemo() {
  return (
    <Demo layout="block" code={`<Schedule items={items} today="2026-01-19" />`}>
      <Schedule items={ITEMS} today="2026-01-19" height={300} />
      <p>
        Outlined bars show the plan; solid bars show reported actual dates. The Actual column shows completion,
        The slab pour ran two days past plan, while first-fix wiring stayed within its planned window. Today is marked.
      </p>
    </Demo>
  );
}

const GROUPED: ScheduleEntry[] = [
  { id: 'kitchen', label: 'Kitchen fit-out', start: '2026-01-05', end: '2026-01-23', progress: 0.5 },
  { id: 'cabinets', label: 'Cabinets', parentId: 'kitchen', start: '2026-01-05', end: '2026-01-14', progress: 1 },
  { id: 'tiling', label: 'Tiling', parentId: 'kitchen', start: '2026-01-15', end: '2026-01-23', progress: 0.1 },
  { id: 'paint', label: 'Paint', parentId: 'kitchen', unscheduled: true },
];

export function ScheduleGroupedDemo() {
  return (
    <Demo layout="block" code={`<Schedule items={items} onChildOpen={openItem} />`}>
      <Schedule items={GROUPED} today="2026-01-19" mode="physical" height={300} onChildOpen={() => undefined}
        onItemOpen={() => undefined} />
      <p>Rows start collapsed. Paint states no dates, so it is listed and labelled but never drawn.</p>
    </Demo>
  );
}
