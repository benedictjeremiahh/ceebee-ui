'use client';

import { Inbox, Search } from 'lucide-react';
import { useState } from 'react';
import { Alert, Button, Tabs, Tag, useToast } from '@ceebee/ui/client';
import { Badge, Empty, Flex, Surface, Text, Avatar, AvatarGroup } from '@ceebee/ui';
import { Demo } from './demo';

export function AlertDemo() {
  return (
    <Demo
      layout="block"
      code={`<Alert tone="danger" title="Payment failed" actions={<Button size="sm" tone="danger">Retry</Button>}>
  The bank declined the charge. Nothing has been billed.
</Alert>`}
    >
      <Flex gap={3}>
        <Alert tone="info" title="Scheduled maintenance">
          The dashboard will be read-only on Sunday from 02:00 to 04:00 WIB.
        </Alert>
        <Alert tone="success" title="Invoice sent" />
        <Alert tone="warning" title="Card expires this month">
          Update it before the next billing run to avoid an interruption.
        </Alert>
        <Alert
          tone="danger"
          title="Payment failed"
          actions={
            <>
              <Button size="sm" tone="danger">
                Retry
              </Button>
              <Button size="sm" variant="ghost" tone="neutral">
                Change card
              </Button>
            </>
          }
        >
          The bank declined the charge. Nothing has been billed.
        </Alert>
      </Flex>
    </Demo>
  );
}

export function ToastDemo() {
  const toast = useToast();
  return (
    <Demo
      code={`const toast = useToast();

toast.show({ title: 'Saved', description: 'Your changes are live.', tone: 'success' });
toast.show({ title: 'Draft deleted', action: { label: 'Undo', onClick: restore } });`}
    >
      <Button onClick={() => toast.show({ title: 'Saved', description: 'Your changes are live.', tone: 'success' })}>
        Success
      </Button>
      <Button
        variant="outline"
        tone="neutral"
        onClick={() =>
          toast.show({
            title: 'Draft deleted',
            tone: 'info',
            action: { label: 'Undo', onClick: () => toast.show({ title: 'Restored', tone: 'success' }) },
          })
        }
      >
        With an action
      </Button>
      <Button
        variant="outline"
        tone="danger"
        onClick={() => toast.show({ title: 'Upload failed', description: 'The file was larger than 25 MB.', tone: 'danger' })}
      >
        Error (stays put)
      </Button>
    </Demo>
  );
}

export function BadgeDemo() {
  return (
    <Demo
      code={`<Badge tone="success" dot>Live</Badge>
<Badge tone="danger" variant="solid">Overdue</Badge>`}
    >
      <Badge>Neutral</Badge>
      <Badge tone="brand">Brand</Badge>
      <Badge tone="success" dot>
        Live
      </Badge>
      <Badge tone="warning" variant="outline">
        Pending
      </Badge>
      <Badge tone="danger" variant="solid">
        Overdue
      </Badge>
      <Badge tone="info" size="sm">
        sm
      </Badge>
    </Demo>
  );
}

export function EmptyStateDemo() {
  return (
    <Demo
      layout="block"
      code={`<Empty
  icon={<Inbox size={22} />}
  title="No invoices yet"
  description="Invoices appear here once your first customer is billed."
  actions={<Button size="sm">Create an invoice</Button>}
/>`}
    >
      <Flex gap={4}>
        <Surface padding="none" radius="lg">
          <Empty
            icon={<Inbox size={22} />}
            title="No invoices yet"
            description="Invoices appear here once your first customer is billed."
            actions={<Button size="sm">Create an invoice</Button>}
          />
        </Surface>
        <Surface padding="none" radius="lg">
          <Empty
            variant="search"
            icon={<Search size={22} />}
            title="Nothing matched “quarterly”"
            description="Try a shorter term, or clear the status filter."
            actions={
              <Button size="sm" variant="outline" tone="neutral">
                Clear filters
              </Button>
            }
          />
        </Surface>
      </Flex>
    </Demo>
  );
}

export function TabsDemo() {
  return (
    <Demo
      layout="block"
      code={`<Tabs
  items={[
    { value: 'overview', label: 'Overview', content: <Overview /> },
    { value: 'activity', label: 'Activity', adornment: <Badge size="sm">12</Badge>, content: <Activity /> },
  ]}
/>`}
    >
      <Flex gap={6}>
        <Tabs
          items={[
            { value: 'overview', label: 'Overview', content: <Text tone="muted">Totals, trends, and the week at a glance.</Text> },
            {
              value: 'activity',
              label: 'Activity',
              adornment: <Badge tone="brand" size="sm">12</Badge>,
              content: <Text tone="muted">Every change, newest first.</Text>,
            },
            { value: 'settings', label: 'Settings', content: <Text tone="muted">Who can see this workspace.</Text> },
            { value: 'archive', label: 'Archive', disabled: true, content: <Text tone="muted">Nothing archived.</Text> },
          ]}
        />

        <Tabs
          variant="pill"
          items={[
            { value: 'day', label: 'Day', content: <Text tone="muted">24 hours.</Text> },
            { value: 'week', label: 'Week', content: <Text tone="muted">7 days.</Text> },
            { value: 'month', label: 'Month', content: <Text tone="muted">30 days.</Text> },
          ]}
        />
      </Flex>
    </Demo>
  );
}

export function AvatarDemo() {
  return (
    <Demo
      code={`<Avatar name="Rio Hakim" size="lg" status="online" />

<AvatarGroup overflow={3}>
  {members.map((member) => <Avatar key={member.id} name={member.name} src={member.photo} />)}
</AvatarGroup>`}
    >
      <Avatar name="Sarah Chen" size="sm" />
      <Avatar name="Ada Putri" />
      <Avatar name="Rio Hakim" size="lg" status="online" />
      <Avatar name="Budi Santoso" size="xl" status="busy" />
      <AvatarGroup overflow={3}>
        <Avatar name="Sarah Chen" />
        <Avatar name="Ada Putri" />
        <Avatar name="Rio Hakim" />
      </AvatarGroup>
    </Demo>
  );
}

const CUISINES = [
  { key: 'indonesian', label: 'Indonesian (128)' },
  { key: 'japanese', label: 'Japanese (41)' },
  { key: 'italian', label: 'Italian (23)' },
  { key: 'thai', label: 'Thai (12)' },
];

export function TagDemo() {
  return (
    <Demo
      code={`<Tag tone="brand">Indonesian</Tag>
<Tag tone="success" variant="solid">Verified</Tag>
<Tag tone="warning" variant="outline">Pending</Tag>
<Tag size="sm">sm</Tag>`}
    >
      <Tag tone="brand">Indonesian</Tag>
      <Tag tone="success" variant="solid">Verified</Tag>
      <Tag tone="warning" variant="outline">Pending</Tag>
      <Tag tone="danger">Closed</Tag>
      <Tag size="sm">sm</Tag>
    </Demo>
  );
}

export function TagFilterDemo() {
  const [active, setActive] = useState<string[]>(['japanese']);
  const toggle = (key: string) =>
    setActive((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );

  return (
    <Demo
      code={`<Tag onClick={() => toggle('japanese')} pressed={active.includes('japanese')}>
  Japanese (41)
</Tag>`}
    >
      {CUISINES.map((cuisine) => (
        <Tag
          key={cuisine.key}
          tone="brand"
          onClick={() => toggle(cuisine.key)}
          pressed={active.includes(cuisine.key)}
        >
          {cuisine.label}
        </Tag>
      ))}
    </Demo>
  );
}

export function TagRemovableDemo() {
  const [places, setPlaces] = useState(['Kebayoran Baru', 'Menteng', 'Senopati']);

  return (
    <Demo code={`<Tag onClose={() => remove(place)}>{place}</Tag>`}>
      {places.length === 0 ? (
        <Text tone="muted" size="sm">
          Every filter removed. Reload the page to bring them back.
        </Text>
      ) : (
        places.map((place) => (
          <Tag key={place} onClose={() => setPlaces((rest) => rest.filter((item) => item !== place))}>
            {place}
          </Tag>
        ))
      )}
    </Demo>
  );
}
