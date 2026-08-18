'use client';

import { useState } from 'react';
import { Bell, Search, Settings } from 'lucide-react';
import { Button, Coachmark, Switch, Tour, type SeenStore, type TourStep } from '@ceebee/ui/client';
import { Stack, Surface, Text } from '@ceebee/ui';

const STEPS: TourStep[] = [
  {
    target: '#demo-search',
    title: 'Find anything',
    content: 'Search across projects, people, and documents from one place.',
    side: 'bottom',
  },
  {
    target: '#demo-alerts',
    title: 'Stay in the loop',
    content: 'Alerts collect here. Nothing is ever sent twice.',
    side: 'bottom',
  },
  {
    target: '#demo-settings',
    title: 'Make it yours',
    content: 'Theme, motion, and notification preferences live here.',
    side: 'left',
  },
];

/** A Seen Store is the app's, not the library's — here it is four lines against sessionStorage. */
const sessionSeenStore: SeenStore = {
  has: (id) => sessionStorage.getItem(`tour:${id}`) === 'seen',
  mark: (id) => sessionStorage.setItem(`tour:${id}`, 'seen'),
};

export function TourDemo() {
  const [running, setRunning] = useState(false);
  const [useStore, setUseStore] = useState(false);
  const [outcome, setOutcome] = useState<string | null>(null);

  return (
    <div className="demo">
      <div className="demo__stage" data-layout="block">
        <Stack gap={4}>
          <Surface padding="sm" radius="md">
            <Stack direction="row" gap={3} align="center" justify="between">
              <Button id="demo-search" variant="ghost" tone="neutral" iconStart={<Search size={16} />}>
                Search
              </Button>
              <Button id="demo-alerts" variant="ghost" tone="neutral" iconStart={<Bell size={16} />}>
                Alerts
              </Button>
              <Button id="demo-settings" variant="ghost" tone="neutral" iconStart={<Settings size={16} />}>
                Settings
              </Button>
            </Stack>
          </Surface>

          <Stack direction="row" gap={3} align="center" wrap>
            <Button size="sm" onClick={() => { setOutcome(null); setRunning(true); }}>
              Start tour
            </Button>
            <Switch
              label="remember it with sessionStorage"
              checked={useStore}
              onCheckedChange={setUseStore}
            />
            {outcome ? (
              <Text size="xs" tone="muted" as="span">
                {outcome}
              </Text>
            ) : null}
          </Stack>

          <Tour
            id="docs-demo"
            steps={STEPS}
            open={running}
            onOpenChange={setRunning}
            seenStore={useStore ? sessionSeenStore : undefined}
            onFinish={() => setOutcome('Finished — with the store on, it will not run again this session.')}
            onSkip={() => setOutcome('Skipped — skipping counts as seen too.')}
          />
        </Stack>
      </div>
    </div>
  );
}

export function CoachmarkDemo() {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<Element | null>(null);

  return (
    <div className="demo">
      <div className="demo__stage">
        <Button ref={setAnchor} variant="outline" tone="neutral" iconStart={<Settings size={16} />} onClick={() => setOpen((v) => !v)}>
          Point at me
        </Button>
        <Coachmark
          open={open}
          anchor={anchor}
          title="One bubble, one element"
          onDismiss={() => setOpen(false)}
          actions={
            <Button size="sm" onClick={() => setOpen(false)}>
              Got it
            </Button>
          }
        >
          A Coachmark knows about a single element. Sequence is the Tour&apos;s job, and memory is
          the Seen Store&apos;s.
        </Coachmark>
      </div>
    </div>
  );
}
