'use client';

import { useState } from 'react';
import { ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import { Flex, Grid, Heading, Surface, Text } from '@ceebee/ui';
import { Button, Progress, Skeleton, Statistic } from '@ceebee/ui/client';

const TASKS = [
  { name: 'Migrate billing webhooks', owner: 'Sarah Chen', due: 'Today', done: true },
  { name: 'Draft Q3 retention brief', owner: 'Ada Putri', due: 'Tomorrow', done: false },
  { name: 'Review onboarding tour copy', owner: 'Rio Hakim', due: 'Fri', done: false },
];

export function AstraDashboard() {
  const [loading, setLoading] = useState(false);

  return (
    <Flex gap={4}>
      <Flex direction="row" justify="between" align="center">
        <Text size="sm" tone="subtle">
          {loading ? 'Loading state' : 'Loaded state'}
        </Text>
        <Button size="small" onClick={() => setLoading((value) => !value)}>
          Toggle loading
        </Button>
      </Flex>

      <Surface variant="gradient" hue="violet" padding="lg" radius="xl" elevation="md">
        <Flex gap={5}>
          <Flex direction="row" justify="between" align="center" wrap>
            <div>
              <Text size="sm" tone="muted">
                Good afternoon
              </Text>
              <Heading level={2} size="2xl">
                Sarah Chen
              </Heading>
            </div>
            <Flex direction="row" gap={5} align="center">
              {loading ? (
                <>
                  <Skeleton.Avatar active size={80} shape="circle" />
                  <Skeleton.Avatar active size={80} shape="circle" />
                </>
              ) : (
                <>
                  <Flex gap={1} align="center">
                    <Progress type="circle" percent={84} size={80} strokeWidth={11} strokeColor="var(--cb-decor-violet)" aria-label="Task progress" />
                    <Text size="xs" tone="subtle">
                      Tasks
                    </Text>
                  </Flex>
                  <Flex gap={1} align="center">
                    <Progress type="circle" percent={91} size={80} strokeWidth={11} strokeColor="var(--cb-decor-blue)" aria-label="Team performance" />
                    <Text size="xs" tone="subtle">
                      Team
                    </Text>
                  </Flex>
                </>
              )}
            </Flex>
          </Flex>

          <Grid minItemWidth="13rem" gap={4}>
            {loading ? (
              <>
                <Skeleton active paragraph={{ rows: 1 }} />
                <Skeleton active paragraph={{ rows: 1 }} />
                <Skeleton active paragraph={{ rows: 2 }} />
              </>
            ) : (
              <>
                <Surface variant="tinted" hue="teal" padding="md" radius="md">
                  <Statistic title="Projects shipped" value={48} prefix={<ArrowUpRight size={16} />} suffix={<Text size="xs" tone="success">+6</Text>} />
                </Surface>
                <Surface variant="tinted" hue="amber" padding="md" radius="md">
                  <Statistic title="Hours logged" value="1,204" prefix={<Clock size={16} />} suffix={<Text size="xs" tone="danger">-3.2%</Text>} />
                  <Text size="xs" tone="subtle">Fewer meetings this week</Text>
                </Surface>
                <Surface variant="tinted" hue="blue" padding="md" radius="md">
                  <Flex direction="row" justify="between" align="center">
                    <Statistic title="Review queue" value={12} />
                    <Progress
                      type="circle"
                      percent={(12 / 20) * 100}
                      size={56}
                      strokeWidth={12}
                      strokeColor="var(--cb-decor-blue)"
                      aria-label="Review queue"
                      format={() => (
                        <Text size="xs" tone="muted" numeric>
                          /20
                        </Text>
                      )}
                    />
                  </Flex>
                </Surface>
              </>
            )}
          </Grid>

          <Surface padding="md" radius="lg" elevation="none">
            <Flex gap={3}>
              <Text weight="semibold">Today</Text>
              {loading
                ? [0, 1, 2].map((row) => (
                    <Flex direction="row" gap={3} align="center" key={row}>
                      <Skeleton.Avatar active size={20} shape="circle" />
                      <Skeleton.Input active size="small" style={{ inlineSize: '45%' }} />
                      <Skeleton.Input active size="small" style={{ inlineSize: '18%' }} />
                    </Flex>
                  ))
                : TASKS.map((task) => (
                    <Flex direction="row" gap={3} align="center" justify="between" key={task.name}>
                      <Flex direction="row" gap={3} align="center">
                        <CheckCircle2
                          size={18}
                          color={task.done ? 'var(--cb-tone-success)' : 'var(--cb-fg-subtle)'}
                        />
                        <Text size="sm">{task.name}</Text>
                      </Flex>
                      <Flex direction="row" gap={3} align="center">
                        <Text size="xs" tone="subtle">
                          {task.owner}
                        </Text>
                        <Text size="xs" tone={task.due === 'Today' ? 'warning' : 'subtle'}>
                          {task.due}
                        </Text>
                      </Flex>
                    </Flex>
                  ))}
            </Flex>
          </Surface>
        </Flex>
      </Surface>
    </Flex>
  );
}
