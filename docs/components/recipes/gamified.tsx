'use client';

import { Flame, GraduationCap, Trophy } from 'lucide-react';

import { Badge, Button, Progress, Progress as ProgressBar, Statistic } from '@ceebee/ui/client';
import { Flex, Grid, Heading, Leaderboard, Surface, Text } from '@ceebee/ui';

const LEADERS = [
  { id: '1', name: 'Ada Putri', score: '2,480', detail: '12 modules', delta: { value: '▲2', direction: 'up' as const } },
  { id: '2', name: 'Rio Hakim', score: '2,150', detail: '11 modules', delta: { value: '▼1', direction: 'down' as const } },
  { id: '3', name: 'Sarah Chen', score: '1,990', detail: '10 modules', delta: { value: '—', direction: 'flat' as const } },
  { id: '4', name: 'Benedict J', score: '1,840', detail: '9 modules', you: true, delta: { value: '▲4', direction: 'up' as const } },
  { id: '5', name: 'Citra Dewi', score: '1,610', detail: '8 modules' },
];

/** Reproduces the gamified learning pins: rings, streaks, and a leaderboard. */
export function GamifiedRecipe() {
  return (
    <div className="recipe recipe--gamified">
      <Flex gap={4}>
        <Surface variant="gradient" hue="violet" radius="xl" padding="lg" elevation="md">
          <Flex direction="row" justify="between" align="center" wrap gap={5}>
            <Flex gap={1}>
              <Text size="sm" tone="muted">Learning plan</Text>
              <Heading level={2} size="2xl">78% complete</Heading>
              <Flex direction="row" gap={2} align="center">
                <Badge count="12-day streak" color="var(--cb-tone-warning)" />
                <Badge count="Level 7" color="var(--cb-tone-brand)" />
              </Flex>
            </Flex>
            <Progress type="circle" percent={78} size={104} strokeWidth={11} strokeColor="var(--cb-decor-violet)" aria-label="Course progress" />
          </Flex>
        </Surface>

        <Grid minItemWidth="8.5rem" gap={3}>
          <Surface variant="tinted" hue="amber" padding="md" radius="md">
            <Statistic title="Streak" value={12} suffix={<Text size="xs" tone="subtle">days in a row</Text>} prefix={<Flame size={16} />} />
          </Surface>
          <Surface variant="tinted" hue="teal" padding="md" radius="md">
            <Statistic title="Modules" value="9/12" prefix={<GraduationCap size={16} />} />
          </Surface>
          <Surface variant="tinted" hue="rose" padding="md" radius="md">
            <Statistic title="Rank" value="#4" suffix={<Text size="xs" tone="success">▲4</Text>} prefix={<Trophy size={16} />} />
          </Surface>
        </Grid>

        <Surface padding="md" radius="lg">
          <Flex gap={3}>
            <Text size="sm" weight="semibold">This week</Text>
            <Flex gap={2}>
              <ProgressBar percent={45} size="small" aria-label="Foundations" />
              <ProgressBar percent={80} size="small" strokeColor="var(--cb-tone-success)" aria-label="Data modelling" />
              <ProgressBar percent={20} size="small" strokeColor="var(--cb-tone-warning)" aria-label="Security" />
            </Flex>
          </Flex>
        </Surface>

        <Surface padding="md" radius="lg">
          <Flex gap={3}>
            <Flex direction="row" justify="between" align="center">
              <Text size="sm" weight="semibold">Leaderboard</Text>
              <Button size="small" type="text">This week</Button>
            </Flex>
            <Leaderboard label="Weekly leaders" entries={LEADERS} />
          </Flex>
        </Surface>
      </Flex>
    </div>
  );
}
