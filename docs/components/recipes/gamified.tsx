'use client';

import { Flame, GraduationCap, Trophy } from 'lucide-react';
import { Button } from '@ceebee/ui/client';
import {
  Badge,
  Grid,
  Heading,
  Leaderboard,
  ProgressBar,
  ProgressRing,
  Flex,
  Statistic,
  Surface,
  Text,
} from '@ceebee/ui';

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
                <Badge tone="warning" size="sm" dot>12-day streak</Badge>
                <Badge tone="brand" size="sm">Level 7</Badge>
              </Flex>
            </Flex>
            <ProgressRing value={78} size={104} thickness={11} hue="violet" label="Course progress" />
          </Flex>
        </Surface>

        <Grid minItemWidth="8.5rem" gap={3}>
          <Statistic label="Streak" value="12" caption="days in a row" hue="amber" icon={<Flame size={16} />} />
          <Statistic label="Modules" value="9/12" hue="teal" icon={<GraduationCap size={16} />} />
          <Statistic label="Rank" value="#4" delta={{ value: '▲4', direction: 'up' }} hue="rose" icon={<Trophy size={16} />} />
        </Grid>

        <Surface padding="md" radius="lg">
          <Flex gap={3}>
            <Text size="sm" weight="semibold">This week</Text>
            <Flex gap={2}>
              <ProgressBar value={45} label="Foundations" size="sm" showValue />
              <ProgressBar value={80} tone="success" label="Data modelling" size="sm" showValue />
              <ProgressBar value={20} tone="warning" label="Security" size="sm" showValue />
            </Flex>
          </Flex>
        </Surface>

        <Surface padding="md" radius="lg">
          <Flex gap={3}>
            <Flex direction="row" justify="between" align="center">
              <Text size="sm" weight="semibold">Leaderboard</Text>
              <Button size="sm" variant="ghost" tone="neutral">This week</Button>
            </Flex>
            <Leaderboard label="Weekly leaders" entries={LEADERS} />
          </Flex>
        </Surface>
      </Flex>
    </div>
  );
}
