'use client';

import { useState } from 'react';
import { CashFlowChart } from '@ceebee/ui/client';
import { Demo } from './demo';

/* Six weeks of a small contractor's cash: bills land in weeks two and three before the next stage payment
   arrives in week four. The balance line shows that it dips; the bars show which bills pull it under. */
const weeks = [
  { id: 'w1', start: '2026-09-28', inflow: 12_000_000, outflow: 18_500_000 },
  { id: 'w2', start: '2026-10-05', inflow: 0, outflow: 26_000_000 },
  { id: 'w3', start: '2026-10-12', inflow: 4_000_000, outflow: 21_000_000 },
  { id: 'w4', start: '2026-10-19', inflow: 95_000_000, outflow: 14_000_000 },
  { id: 'w5', start: '2026-10-26', inflow: 8_000_000, outflow: 19_000_000 },
  { id: 'w6', start: '2026-11-02', inflow: 30_000_000, outflow: 12_000_000 },
];

/** The library holds no currency: a product passes its own formatter. */
function compact(value: number): string {
  const sign = value < 0 ? '−' : '';
  const size = Math.abs(value);
  if (size === 0) return '0';
  return size >= 1e6 ? `${sign}${(size / 1e6).toFixed(0)}M` : `${sign}${Math.round(size / 1e3)}k`;
}

export function CashFlowChartDemo() {
  const [week, setWeek] = useState<string | undefined>(undefined);
  return (
    <Demo
      layout="block"
      code={`<CashFlowChart
  label="Cash, next six weeks"
  opening={40_000_000}
  periods={weeks}
  format={compact}
  onSelectPeriod={setWeek}
  selectedPeriod={week}
/>`}
    >
      <CashFlowChart label="Cash, next six weeks" opening={40_000_000} periods={weeks} format={compact} onSelectPeriod={setWeek} selectedPeriod={week} />
      <p>{week ? `Showing what is behind ${week}.` : 'Press a week to list what is behind it.'}</p>
    </Demo>
  );
}
