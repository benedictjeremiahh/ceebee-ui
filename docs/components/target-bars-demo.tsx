import { TargetBars } from '@ceebee/ui';
import { Demo } from './demo';

/* Finished construction jobs, priced at a 15% margin. One beat it, one lost money, one is still waiting
   for its last invoice — so its margin is unknown, which is not the same as zero. */
const jobs = [
  { id: 'a', label: 'House extension, Jl. Melati', target: 15, actual: 18.2, detail: 'closed 2 Sep' },
  { id: 'b', label: 'Shophouse fit-out, Block C', target: 15, actual: -3.5, detail: 'closed 28 Aug' },
  { id: 'c', label: 'Warehouse roof', target: 15, actual: 11.4, detail: 'closed 20 Aug' },
  { id: 'd', label: 'Kitchen renovation', target: 15, actual: null, detail: 'last invoice not issued' },
];

/** The library holds no unit: a product passes its own formatter. This one writes a decimal comma. */
const percent = (value: number) => `${value.toFixed(1).replace('.', ',')}%`;

export function TargetBarsDemo() {
  return (
    <Demo
      layout="block"
      code={`<TargetBars
  label="Final margin of finished jobs"
  rows={jobs}
  format={percent}
/>`}
    >
      <TargetBars label="Final margin of finished jobs" rows={jobs} format={percent} />
    </Demo>
  );
}

const sites = [
  { id: 'a', label: 'Site A', target: 30, actual: 26 },
  { id: 'b', label: 'Site B', target: 30, actual: 41 },
  { id: 'c', label: 'Site C', target: 45, actual: 45 },
];

export function TargetBarsLowerDemo() {
  return (
    <Demo
      layout="block"
      code={`<TargetBars
  label="Days to handover, against the days allowed"
  rows={sites}
  format={(days) => \`\${days} days\`}
  better="lower"
  targetLabel="Allowed"
/>`}
    >
      <TargetBars
        label="Days to handover, against the days allowed"
        rows={sites}
        format={(days) => `${days} days`}
        better="lower"
        targetLabel="Allowed"
      />
    </Demo>
  );
}

/* Each job was priced at its own margin, so the question is who missed their own target by most. */
const priced = [
  { id: 'b', label: 'Shophouse fit-out, Block C', target: 15, actual: -3.5 },
  { id: 'c', label: 'Warehouse roof', target: 20, actual: 11.4 },
  { id: 'e', label: 'Office partition', target: 12, actual: 12.6 },
  { id: 'a', label: 'House extension, Jl. Melati', target: 15, actual: 18.2 },
];

export function TargetBarsDeviationDemo() {
  return (
    <Demo
      layout="block"
      code={`<TargetBars
  label="Margin against each job's own target"
  rows={priced}
  format={percent}
  variant="deviation"
/>`}
    >
      <TargetBars label="Margin against each job's own target" rows={priced} format={percent} variant="deviation" />
    </Demo>
  );
}
