'use client';

import { Donut, Sparkline, BarMini, Stack, StatCard, Text, Grid } from '@ceebee/ui';
import { CodeBlock } from './code-block';

const REVENUE = [12, 18, 15, 22, 26, 21, 30, 28, 35];
const SIGNUPS = [4, 9, 6, 12, 8, 15, 11, 18];

export function DonutDemo() {
  return (
    <div className="demo">
      <div className="demo__stage">
        <Donut
          label="Spend by category"
          slices={[
            { value: 42, label: 'Infrastructure' },
            { value: 28, label: 'Salaries' },
            { value: 18, label: 'Tools' },
            { value: 12, label: 'Travel' },
          ]}
        >
          <Stack gap={0} align="center">
            <Text weight="semibold" numeric>
              100%
            </Text>
            <Text size="xs" tone="subtle">
              of budget
            </Text>
          </Stack>
        </Donut>

        <Donut label="Storage" size={88} thickness={12} slices={[{ value: 3, label: 'Used' }, { value: 7, label: 'Free' }]} />
      </div>
      <CodeBlock bare code={`<Donut
  label="Spend by category"
  slices={[{ value: 42, label: 'Infrastructure' }, { value: 28, label: 'Salaries' }]}
/>`} />
    </div>
  );
}

export function SparklineDemo() {
  return (
    <div className="demo">
      <div className="demo__stage" data-layout="block">
        <Stack gap={4}>
          <Stack direction="row" gap={5} align="center" wrap>
            <Sparkline values={REVENUE} label="Revenue trend" />
            <Sparkline values={REVENUE} filled hue="teal" label="Revenue trend, filled" />
            <Sparkline values={[8, 8, 8, 8]} tone="neutral" label="Flat series" />
            <BarMini values={SIGNUPS} hue="violet" label="Signups per day" />
          </Stack>

          <Grid minItemWidth="15rem" gap={4}>
            <StatCard
              label="Revenue"
              value="35.2M"
              delta={{ value: '+9.4%', direction: 'up' }}
              hue="teal"
              visual={<Sparkline values={REVENUE} filled hue="teal" width={96} height={36} label="Revenue trend" />}
            />
            <StatCard
              label="Signups"
              value="18"
              delta={{ value: '+3', direction: 'up' }}
              hue="violet"
              visual={<BarMini values={SIGNUPS} hue="violet" width={96} height={36} label="Signups per day" />}
            />
          </Grid>
        </Stack>
      </div>
      <CodeBlock bare code={`<Sparkline values={revenue} filled hue="teal" label="Revenue trend" />
<BarMini values={signups} hue="violet" label="Signups per day" />

<StatCard label="Revenue" value="35.2M" visual={<Sparkline values={revenue} filled />} />`} />
    </div>
  );
}
