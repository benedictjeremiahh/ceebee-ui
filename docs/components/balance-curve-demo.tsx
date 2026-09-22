'use client';

import { BalanceCurve } from '@ceebee/ui/client';
import { Demo } from './demo';

/* A real 30-day cash projection has this shape: a dip that lasts a week because a bill lands before a
   receipt does, then a large payment that clears it. The dip is small against the turnover — which is
   exactly why a chart beats seven identical red warnings. */
const projection = [
  { day: '2026-09-22', value: 40_980_000 },
  { day: '2026-09-23', value: -2_810_000 },
  { day: '2026-09-24', value: -2_810_000 },
  { day: '2026-09-25', value: -2_810_000 },
  { day: '2026-09-26', value: -2_810_000 },
  { day: '2026-09-27', value: -2_810_000 },
  { day: '2026-09-28', value: -2_810_000 },
  { day: '2026-09-29', value: -2_810_000 },
  { day: '2026-09-30', value: 355_990_000 },
  { day: '2026-10-03', value: 331_890_000 },
  { day: '2026-10-10', value: 331_890_000 },
  { day: '2026-10-18', value: 298_400_000 },
  { day: '2026-10-22', value: 298_400_000 },
];

const UNITS = [
  { at: 1e9, suffix: 'M' },
  { at: 1e6, suffix: 'jt' },
  { at: 1e3, suffix: 'rb' },
];

/** The library holds no currency: a product passes its own formatter. This is a plausible one. */
function rupiah(value: number): string {
  const sign = value < 0 ? '-' : '';
  const size = Math.abs(value);
  const unit = UNITS.find((candidate) => size >= candidate.at);
  if (!unit) return `${sign}Rp ${Math.round(size)}`;
  return `${sign}Rp ${(size / unit.at).toFixed(1).replace('.', ',')} ${unit.suffix}`;
}

export function BalanceCurveDemo() {
  return (
    <Demo
      layout="block"
      code={`<BalanceCurve
  label="Cash, next 30 days"
  balances={projection}
  format={rupiah}
  threshold={{ value: 0, label: 'zero line' }}
/>`}
    >
      <BalanceCurve
        label="Cash, next 30 days"
        balances={projection}
        format={rupiah}
        threshold={{ value: 0, label: 'zero line' }}
        seriesLabel="Balance"
      />
    </Demo>
  );
}

export function BalanceCurveBufferDemo() {
  return (
    <Demo
      layout="block"
      code={`<BalanceCurve
  label="Cash against a 50 jt buffer"
  balances={projection}
  format={rupiah}
  threshold={{ value: 50_000_000, label: 'minimum buffer 50 jt' }}
/>`}
    >
      <BalanceCurve
        label="Cash against a 50 jt buffer"
        balances={projection}
        format={rupiah}
        threshold={{ value: 50_000_000, label: 'minimum buffer 50 jt' }}
        seriesLabel="Balance"
      />
    </Demo>
  );
}

export function BalanceCurveSkeletonDemo() {
  return (
    <Demo layout="block" code={'<BalanceCurve.Skeleton />'}>
      <BalanceCurve.Skeleton />
    </Demo>
  );
}
