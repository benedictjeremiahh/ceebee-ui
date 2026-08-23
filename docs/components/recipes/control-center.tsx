'use client';

import { useState } from 'react';
import { Bell, Moon, ShieldCheck, Volume2, Wifi } from 'lucide-react';
import { Button, Switch } from '@ceebee/ui/client';
import { Avatar, Badge, Flex, Surface, Text } from '@ceebee/ui';

const NOTIFICATIONS = [
  { id: 1, from: 'Sarah Chen', text: 'Left three comments on the pricing brief.', time: '2m', hue: 'violet' as const },
  { id: 2, from: 'Deploys', text: 'atlas-web shipped to production.', time: '18m', hue: 'teal' as const },
  { id: 3, from: 'Ada Putri', text: 'Invited you to the Q3 planning call.', time: '1h', hue: 'amber' as const },
];

const TOGGLES = [
  { id: 'wifi', label: 'Wi-Fi', description: 'Sagitta 5G', icon: <Wifi size={16} />, on: true },
  { id: 'focus', label: 'Focus', description: 'Until 18:00', icon: <Moon size={16} />, on: true },
  { id: 'sound', label: 'Sound', description: 'Alerts audible', icon: <Volume2 size={16} />, on: false },
  { id: 'vpn', label: 'Secure tunnel', description: 'Frankfurt', icon: <ShieldCheck size={16} />, on: false },
];

/** Reproduces the glass control-center pin: frosted panels over a coloured field. */
export function ControlCenterRecipe() {
  const [toggles, setToggles] = useState(() => Object.fromEntries(TOGGLES.map((t) => [t.id, t.on])));

  return (
    <div className="recipe recipe--control">
      <div className="recipe__field" aria-hidden="true" />
      <div className="recipe__content">
        <Flex gap={4}>
          <Surface variant="glass" radius="xl" padding="md" elevation="lg">
            <Flex gap={3}>
              <Flex direction="row" justify="between" align="center">
                <Text weight="semibold" size="sm">Control</Text>
                <Badge tone="brand" size="sm" dot>3 new</Badge>
              </Flex>

              <Flex gap={3}>
                {TOGGLES.map((toggle) => (
                  <Flex direction="row" gap={3} align="center" key={toggle.id}>
                    <span className="recipe__glyph" data-on={toggles[toggle.id] || undefined}>
                      {toggle.icon}
                    </span>
                    <Switch
                      justified
                      label={toggle.label}
                      description={toggle.description}
                      checked={toggles[toggle.id]}
                      onCheckedChange={(next) => setToggles((current) => ({ ...current, [toggle.id]: next }))}
                    />
                  </Flex>
                ))}
              </Flex>
            </Flex>
          </Surface>

          <Surface variant="glass" radius="xl" padding="md" elevation="lg">
            <Flex gap={3}>
              <Flex direction="row" justify="between" align="center">
                <Flex direction="row" gap={2} align="center">
                  <Bell size={15} />
                  <Text weight="semibold" size="sm">Notifications</Text>
                </Flex>
                <Button size="sm" variant="ghost" tone="neutral">Clear</Button>
              </Flex>

              {NOTIFICATIONS.map((item) => (
                <Flex direction="row" gap={3} align="start" key={item.id}>
                  <Avatar name={item.from} size="sm" hue={item.hue} />
                  <Flex gap={0} className="recipe__grow">
                    <Flex direction="row" justify="between" align="baseline" gap={3}>
                      <Text size="sm" weight="medium" as="span">{item.from}</Text>
                      <Text size="xs" tone="subtle" as="span">{item.time}</Text>
                    </Flex>
                    <Text size="sm" tone="muted">{item.text}</Text>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          </Surface>
        </Flex>
      </div>
    </div>
  );
}
