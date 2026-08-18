'use client';

import { useState } from 'react';
import { Bell, Search, Settings } from 'lucide-react';
import { Button, Coachmark, Tour, type SeenStore, type TourStep } from '@ceebee/ui/client';
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
              <button id="demo-search" className="demo-chrome">
                <Search size={16} /> Search
              </button>
              <button id="demo-alerts" className="demo-chrome">
                <Bell size={16} /> Alerts
              </button>
              <button id="demo-settings" className="demo-chrome">
                <Settings size={16} /> Settings
              </button>
            </Stack>
          </Surface>

          <Stack direction="row" gap={3} align="center" wrap>
            <Button size="sm" onClick={() => { setOutcome(null); setRunning(true); }}>
              Start tour
            </Button>
            <label>
              <input type="checkbox" checked={useStore} onChange={(e) => setUseStore(e.target.checked)} />{' '}
              <Text size="xs" tone="subtle" as="span">
                remember it with sessionStorage
              </Text>
            </label>
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
        <button ref={setAnchor} className="demo-chrome" onClick={() => setOpen((v) => !v)}>
          <Settings size={16} /> Point at me
        </button>
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
