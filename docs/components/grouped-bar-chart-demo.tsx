'use client';

import { GroupedBarChart } from '@ceebee/ui/client';
import { Demo } from './demo';

const groups = [
  { id: 'one', label: 'Week 1', values: { receivable: 125_000, payable: 90_000 } },
  { id: 'two', label: 'Week 2', values: { receivable: 450_000, payable: 120_000 } },
  { id: 'three', label: 'Week 3', values: { receivable: 0, payable: 65_000 } },
];
const series = [
  { key: 'receivable', label: 'Receivables', tone: 'brand' as const },
  { key: 'payable', label: 'Payables', tone: 'warning' as const },
];
const exact = new Intl.NumberFormat('en', { maximumFractionDigits: 2 });

export function GroupedBarChartDemo() {
  return <Demo layout="block" code={'<GroupedBarChart label="Due amounts by week" groups={groups} series={series}\n  format={compact} formatExact={exact.format} />'}>
    <GroupedBarChart label="Due amounts by week" groups={groups} series={series}
      format={(value) => `${Math.round(value / 1_000)}k`} formatExact={exact.format} />
  </Demo>;
}
