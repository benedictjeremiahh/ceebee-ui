'use client';

import { ProgressCurve } from '@ceebee/ui/client';
import { Demo } from './demo';

/* A job that started on plan and slipped through the wet season — the shape somebody actually opens
   an S-curve to find, rather than a smooth textbook curve that never happens on a site. */
const planned = [
  { day: '2026-06-01', percent: 0 },
  { day: '2026-06-15', percent: 6 },
  { day: '2026-07-01', percent: 18 },
  { day: '2026-07-15', percent: 34 },
  { day: '2026-08-01', percent: 52 },
  { day: '2026-08-15', percent: 70 },
  { day: '2026-09-01', percent: 86 },
  { day: '2026-09-15', percent: 96 },
  { day: '2026-09-30', percent: 100 },
];

const actual = [
  { day: '2026-06-01', percent: 0 },
  { day: '2026-06-15', percent: 7 },
  { day: '2026-07-01', percent: 19 },
  { day: '2026-07-15', percent: 30 },
  { day: '2026-08-01', percent: 41 },
  { day: '2026-08-15', percent: 52 },
  { day: '2026-09-01', percent: 64 },
  { day: '2026-09-15', percent: 73 },
];

export function ProgressCurveDemo() {
  return (
    <Demo
      layout="block"
      code={`<ProgressCurve
  label="Ruko Depok — structure"
  planned={planned}
  actual={actual}
  today="2026-09-22"
/>`}
    >
      <ProgressCurve label="Ruko Depok — structure" planned={planned} actual={actual} today="2026-09-22" />
    </Demo>
  );
}

export function ProgressCurveSkeletonDemo() {
  return (
    <Demo layout="block" code={'<ProgressCurve.Skeleton />'}>
      <ProgressCurve.Skeleton />
    </Demo>
  );
}
