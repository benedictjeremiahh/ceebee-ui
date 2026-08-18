'use client';

import { useState } from 'react';
import { ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import { Grid, Heading, ProgressRing, Skeleton, Stack, StatCard, Surface, Text } from '@ceebee/ui';
import { Button } from '@ceebee/ui/client';

const TASKS = [
  { name: 'Migrate billing webhooks', owner: 'Sarah Chen', due: 'Today', done: true },
  { name: 'Draft Q3 retention brief', owner: 'Ada Putri', due: 'Tomorrow', done: false },
  { name: 'Review onboarding tour copy', owner: 'Rio Hakim', due: 'Fri', done: false },
];

export function AstraDashboard() {
  const [loading, setLoading] = useState(false);

  return (
    <Stack gap={4}>
      <Stack direction="row" justify="between" align="center">
        <Text size="sm" tone="subtle">
          {loading ? 'Loading state' : 'Loaded state'}
        </Text>
        <Button size="sm" variant="outline" tone="neutral" onClick={() => setLoading((value) => !value)}>
          Toggle loading
        </Button>
      </Stack>

      <Surface variant="gradient" hue="violet" padding="lg" radius="xl" elevation="md">
        <Stack gap={5}>
          <Stack direction="row" justify="between" align="center" wrap>
            <div>
              <Text size="sm" tone="muted">
                Good afternoon
              </Text>
              <Heading level={2} size="2xl">
                Sarah Chen
              </Heading>
            </div>
            <Stack direction="row" gap={5} align="center">
              {loading ? (
                <>
                  <Skeleton.Circle size="5rem" />
                  <Skeleton.Circle size="5rem" />
                </>
              ) : (
                <>
                  <Stack gap={1} align="center">
                    <ProgressRing value={84} size={80} thickness={9} hue="violet" label="Task progress" />
                    <Text size="xs" tone="subtle">
                      Tasks
                    </Text>
                  </Stack>
                  <Stack gap={1} align="center">
                    <ProgressRing value={91} size={80} thickness={9} hue="blue" label="Team performance" />
                    <Text size="xs" tone="subtle">
                      Team
                    </Text>
                  </Stack>
                </>
              )}
            </Stack>
          </Stack>

          <Grid minItemWidth="13rem" gap={4}>
            {loading ? (
              <>
                <StatCard.Skeleton />
                <StatCard.Skeleton />
                <StatCard.Skeleton withVisual />
              </>
            ) : (
              <>
                <StatCard
                  label="Projects shipped"
                  value="48"
                  delta={{ value: '+6', direction: 'up' }}
                  hue="teal"
                  icon={<ArrowUpRight size={16} />}
                />
                <StatCard
                  label="Hours logged"
                  value="1,204"
                  delta={{ value: '-3.2%', direction: 'down' }}
                  hue="amber"
                  caption="Fewer meetings this week"
                  icon={<Clock size={16} />}
                />
                <StatCard
                  label="Review queue"
                  value="12"
                  hue="blue"
                  visual={
                    <ProgressRing value={12} max={20} size={56} thickness={7} hue="blue" label="Review queue">
                      <Text size="xs" tone="muted" numeric>
                        /20
                      </Text>
                    </ProgressRing>
                  }
                />
              </>
            )}
          </Grid>

          <Surface padding="md" radius="lg" elevation="none">
            <Stack gap={3}>
              <Text weight="semibold">Today</Text>
              {loading
                ? [0, 1, 2].map((row) => (
                    <Stack direction="row" gap={3} align="center" key={row}>
                      <Skeleton.Circle size="1.25rem" />
                      <Skeleton width="45%" height="0.875rem" />
                      <Skeleton width="18%" height="0.75rem" />
                    </Stack>
                  ))
                : TASKS.map((task) => (
                    <Stack direction="row" gap={3} align="center" justify="between" key={task.name}>
                      <Stack direction="row" gap={3} align="center">
                        <CheckCircle2
                          size={18}
                          color={task.done ? 'var(--cb-tone-success)' : 'var(--cb-fg-subtle)'}
                        />
                        <Text size="sm">{task.name}</Text>
                      </Stack>
                      <Stack direction="row" gap={3} align="center">
                        <Text size="xs" tone="subtle">
                          {task.owner}
                        </Text>
                        <Text size="xs" tone={task.due === 'Today' ? 'warning' : 'subtle'}>
                          {task.due}
                        </Text>
                      </Stack>
                    </Stack>
                  ))}
            </Stack>
          </Surface>
        </Stack>
      </Surface>
    </Stack>
  );
}
