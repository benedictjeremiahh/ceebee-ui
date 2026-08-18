'use client';

import { Inbox, Search } from 'lucide-react';
import { Alert, Button, Tabs, useToast } from '@ceebee/ui/client';
import { Badge, EmptyState, Stack, Surface, Text, Avatar, AvatarGroup } from '@ceebee/ui';

export function AlertDemo() {
  return (
    <div className="demo">
      <div className="demo__stage" data-layout="block">
        <Stack gap={3}>
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
        </Stack>
      </div>
      <pre className="demo__code">
        <code>{`<Alert tone="danger" title="Payment failed" actions={<Button size="sm" tone="danger">Retry</Button>}>
  The bank declined the charge. Nothing has been billed.
</Alert>`}</code>
      </pre>
    </div>
  );
}

export function ToastDemo() {
  const toast = useToast();
  return (
    <div className="demo">
      <div className="demo__stage">
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
      </div>
      <pre className="demo__code">
        <code>{`const toast = useToast();

toast.show({ title: 'Saved', description: 'Your changes are live.', tone: 'success' });
toast.show({ title: 'Draft deleted', action: { label: 'Undo', onClick: restore } });`}</code>
      </pre>
    </div>
  );
}

export function BadgeDemo() {
  return (
    <div className="demo">
      <div className="demo__stage">
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
      </div>
      <pre className="demo__code">
        <code>{`<Badge tone="success" dot>Live</Badge>
<Badge tone="danger" variant="solid">Overdue</Badge>`}</code>
      </pre>
    </div>
  );
}

export function EmptyStateDemo() {
  return (
    <div className="demo">
      <div className="demo__stage" data-layout="block">
        <Stack gap={4}>
          <Surface padding="none" radius="lg">
            <EmptyState
              icon={<Inbox size={22} />}
              title="No invoices yet"
              description="Invoices appear here once your first customer is billed."
              actions={<Button size="sm">Create an invoice</Button>}
            />
          </Surface>
          <Surface padding="none" radius="lg">
            <EmptyState
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
        </Stack>
      </div>
      <pre className="demo__code">
        <code>{`<EmptyState
  icon={<Inbox size={22} />}
  title="No invoices yet"
  description="Invoices appear here once your first customer is billed."
  actions={<Button size="sm">Create an invoice</Button>}
/>`}</code>
      </pre>
    </div>
  );
}

export function TabsDemo() {
  return (
    <div className="demo">
      <div className="demo__stage" data-layout="block">
        <Stack gap={6}>
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
        </Stack>
      </div>
      <pre className="demo__code">
        <code>{`<Tabs
  items={[
    { value: 'overview', label: 'Overview', content: <Overview /> },
    { value: 'activity', label: 'Activity', adornment: <Badge size="sm">12</Badge>, content: <Activity /> },
  ]}
/>`}</code>
      </pre>
    </div>
  );
}

export function AvatarDemo() {
  return (
    <div className="demo">
      <div className="demo__stage">
        <Avatar name="Sarah Chen" size="sm" />
        <Avatar name="Ada Putri" />
        <Avatar name="Rio Hakim" size="lg" status="online" />
        <Avatar name="Budi Santoso" size="xl" status="busy" />
        <AvatarGroup overflow={3}>
          <Avatar name="Sarah Chen" />
          <Avatar name="Ada Putri" />
          <Avatar name="Rio Hakim" />
        </AvatarGroup>
      </div>
      <pre className="demo__code">
        <code>{`<Avatar name="Rio Hakim" size="lg" status="online" />

<AvatarGroup overflow={3}>
  {members.map((member) => <Avatar key={member.id} name={member.name} src={member.photo} />)}
</AvatarGroup>`}</code>
      </pre>
    </div>
  );
}
