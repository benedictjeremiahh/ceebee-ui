'use client';

import { BarMini, Donut, Flex, Grid, Sparkline, Surface, Text } from '@ceebee/ui';
import { Statistic } from '@ceebee/ui/client';
import { Demo } from './demo';

const REVENUE = [12, 18, 15, 22, 26, 21, 30, 28, 35];
const SIGNUPS = [4, 9, 6, 12, 8, 15, 11, 18];

export function DonutDemo() {
  return (
    <Demo code={`<Donut
  label="Spend by category"
  slices={[{ value: 42, label: 'Infrastructure' }, { value: 28, label: 'Salaries' }]}
/>`}>
      <Donut
        label="Spend by category"
        slices={[
          { value: 42, label: 'Infrastructure' },
          { value: 28, label: 'Salaries' },
          { value: 18, label: 'Tools' },
          { value: 12, label: 'Travel' },
        ]}
      >
        <Flex gap={0} align="center">
          <Text weight="semibold" numeric>
            100%
          </Text>
          <Text size="xs" tone="subtle">
            of budget
          </Text>
        </Flex>
      </Donut>

      <Donut label="Storage" size={88} thickness={12} slices={[{ value: 3, label: 'Used' }, { value: 7, label: 'Free' }]} />
    </Demo>
  );
}

export function SparklineDemo() {
  return (
    <Demo layout="block" code={`<Sparkline values={revenue} filled hue="teal" label="Revenue trend" />
<BarMini values={signups} hue="violet" label="Signups per day" />

<Statistic label="Revenue" value="35.2M" visual={<Sparkline values={revenue} filled />} />`}>
      <Flex gap={4}>
        <Flex direction="row" gap={5} align="center" wrap>
          <Sparkline values={REVENUE} label="Revenue trend" />
          <Sparkline values={REVENUE} filled hue="teal" label="Revenue trend, filled" />
          <Sparkline values={[8, 8, 8, 8]} tone="neutral" label="Flat series" />
          <BarMini values={SIGNUPS} hue="violet" label="Signups per day" />
        </Flex>

        <Grid minItemWidth="15rem" gap={4}>
          <Surface variant="tinted" hue="teal" padding="md" radius="md">
            <Flex direction="row" justify="between" align="center">
              <Statistic title="Revenue" value="35.2M" suffix={<Text size="xs" tone="success">+9.4%</Text>} />
              <Sparkline values={REVENUE} filled hue="teal" width={96} height={36} label="Revenue trend" />
            </Flex>
          </Surface>
          <Surface variant="tinted" hue="violet" padding="md" radius="md">
            <Flex direction="row" justify="between" align="center">
              <Statistic title="Signups" value="18" suffix={<Text size="xs" tone="success">+3</Text>} />
              <BarMini values={SIGNUPS} hue="violet" width={96} height={36} label="Signups per day" />
            </Flex>
          </Surface>
        </Grid>
      </Flex>
    </Demo>
  );
}
