'use client';

import { useEffect, useState } from 'react';
import { CreditCard, FileText, GitBranch, LogOut, Plus, Rocket, Settings, Upload as UploadGlyph, UserPlus } from 'lucide-react';
import {
  Alert,
  Button,
  Checklist,
  AutoComplete,
  CommandPalette,
  DatePicker,
  Field,
  TimePicker,
  Upload,
  formatISO,
  type PaletteCommand,
} from '@ceebee/ui/client';
import { ProgressBar, Spin, Flex, Surface, Text, Timeline } from '@ceebee/ui';
import { CodeBlock } from './code-block';

const COUNTRIES = [
  { value: 'id', label: 'Indonesia', description: 'Asia · IDR' },
  { value: 'sg', label: 'Singapore', description: 'Asia · SGD' },
  { value: 'my', label: 'Malaysia', description: 'Asia · MYR' },
  { value: 'jp', label: 'Japan', description: 'Asia · JPY' },
  { value: 'de', label: 'Germany', description: 'Europe · EUR' },
  { value: 'nl', label: 'Netherlands', description: 'Europe · EUR' },
  { value: 'us', label: 'United States', description: 'Americas · USD' },
  { value: 'br', label: 'Brazil', description: 'Americas · BRL' },
];

export function ComboboxDemo() {
  const [value, setValue] = useState<string | null>('id');
  return (
    <div className="demo">
      <div className="demo__stage" data-layout="block">
        <Flex gap={4}>
          <Field label="Country" hint="Type to narrow the list.">
            <AutoComplete items={COUNTRIES} value={value} onValueChange={setValue} placeholder="Search countries…" />
          </Field>
          <Text size="sm" tone="muted">
            Selected: <code>{value ?? 'none'}</code>
          </Text>
        </Flex>
      </div>
      <CodeBlock
        bare
        code={`<Field label="Country" hint="Type to narrow the list.">
  <AutoComplete
    items={countries}
    value={value}
    onValueChange={setValue}
    placeholder="Search countries…"
  />
</Field>`}
      />
    </div>
  );
}

export function DateDemo() {
  const [date, setDate] = useState<Date | null>(new Date(2026, 7, 18));
  return (
    <div className="demo">
      <div className="demo__stage" data-layout="block">
        <Flex gap={4}>
          <Field label="Invoice date" hint="Type 18/08/2026, or pick it.">
            <DatePicker value={date} onValueChange={setDate} />
          </Field>
          <Field label="Within this month only">
            <DatePicker defaultValue={null} min={new Date(2026, 7, 1)} max={new Date(2026, 7, 31)} />
          </Field>
          <Text size="sm" tone="muted">
            {/* formatISO, not toISOString: the latter shifts a local midnight into the previous
                day for anyone east of UTC — the exact trap this library exists to avoid. */}
            Selected: <code>{date ? formatISO(date) : 'none'}</code>
          </Text>
        </Flex>
      </div>
      <CodeBlock bare code={`<Field label="Invoice date">
  <DatePicker value={date} onValueChange={setDate} min={start} max={end} />
</Field>`} />
    </div>
  );
}

export function TimeDemo() {
  const [time, setTime] = useState<{ hours: number; minutes: number } | null>({ hours: 9, minutes: 30 });
  return (
    <div className="demo">
      <div className="demo__stage" data-layout="block">
        <Flex gap={4}>
          <Field label="Start time" hint="Type 9, 0930, 9:30 or 9pm — or pick one.">
            <TimePicker value={time} onValueChange={setTime} step={30} />
          </Field>
          <Field label="Office hours only">
            <TimePicker defaultValue={null} min={{ hours: 8, minutes: 0 }} max={{ hours: 17, minutes: 0 }} step={15} />
          </Field>
          <Text size="sm" tone="muted">
            Selected: <code>{time ? `${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}` : 'none'}</code>
          </Text>
        </Flex>
      </div>
      <CodeBlock
        bare
        code={`<Field label="Start time" hint="Type 9, 0930, 9:30 or 9pm — or pick one.">
  <TimePicker value={time} onValueChange={setTime} step={30} />
</Field>`}
      />
    </div>
  );
}

export function FileDropDemo() {
  const [files, setFiles] = useState<File[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  return (
    <div className="demo">
      <div className="demo__stage" data-layout="block">
        <Flex gap={3}>
          <Field label="Attachments" hint="PDFs only, up to 2 MB each, three at most.">
            <Upload
              files={files}
              onFilesChange={setFiles}
              onReject={(rejections) => setRejected(rejections.map((r) => `${r.file.name} (${r.reason})`))}
              accept={['.pdf']}
              maxSize={2 * 1024 * 1024}
              maxFiles={3}
            />
          </Field>
          {rejected.length > 0 ? (
            <Alert tone="warning" title="Some files were not added" onDismiss={() => setRejected([])}>
              {rejected.join(', ')}
            </Alert>
          ) : null}
        </Flex>
      </div>
      <CodeBlock bare code={`<Upload
  files={files}
  onFilesChange={setFiles}
  onReject={(rejections) => notify(rejections)}
  accept={['.pdf']}
  maxSize={2 * 1024 * 1024}
  maxFiles={3}
/>`} />
    </div>
  );
}

export function PaletteDemo() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState<string | null>(null);

  const commands: PaletteCommand[] = [
    { id: 'invoice', label: 'New invoice', group: 'Create', icon: <FileText size={15} />, shortcut: '⌘N', onRun: () => setLast('New invoice') },
    { id: 'invite', label: 'Invite a teammate', group: 'Create', icon: <UserPlus size={15} />, keywords: ['member', 'user'], onRun: () => setLast('Invite a teammate') },
    { id: 'deploy', label: 'Deploy to production', group: 'Actions', icon: <Rocket size={15} />, keywords: ['ship', 'release'], onRun: () => setLast('Deploy to production') },
    { id: 'branch', label: 'Switch branch', group: 'Actions', icon: <GitBranch size={15} />, onRun: () => setLast('Switch branch') },
    { id: 'billing', label: 'Open billing', group: 'Account', icon: <CreditCard size={15} />, onRun: () => setLast('Open billing') },
    { id: 'settings', label: 'Open settings', group: 'Account', icon: <Settings size={15} />, onRun: () => setLast('Open settings') },
    { id: 'signout', label: 'Sign out', group: 'Account', icon: <LogOut size={15} />, keywords: ['logout', 'exit'], onRun: () => setLast('Sign out') },
  ];

  // The palette earns its keyboard shortcut — try Cmd/Ctrl+K anywhere on this page.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="demo">
      <div className="demo__stage">
        <Button onClick={() => setOpen(true)} iconStart={<Plus size={16} />}>
          Open palette
        </Button>
        <Text size="sm" tone="muted">
          or press <kbd>⌘K</kbd>
          {last ? ` — last run: ${last}` : ''}
        </Text>
        <CommandPalette open={open} onOpenChange={setOpen} commands={commands} />
      </div>
      <CodeBlock bare code={`<CommandPalette
  open={open}
  onOpenChange={setOpen}
  commands={[
    { id: 'invoice', label: 'New invoice', group: 'Create', shortcut: '⌘N', onRun: createInvoice },
    { id: 'signout', label: 'Sign out', keywords: ['logout'], onRun: signOut },
  ]}
/>`} />
    </div>
  );
}

export function ProgressDemo() {
  const [value, setValue] = useState(35);
  return (
    <div className="demo">
      <div className="demo__stage" data-layout="block">
        <Flex gap={5}>
          <Flex direction="row" gap={4} align="center">
            <Spin size="sm" />
            <Spin />
            <Spin size="lg" tone="neutral" />
            <Spin label="Loading invoices" />
          </Flex>

          <ProgressBar value={value} label="Upload progress" showValue />
          <ProgressBar value={value} max={100} tone="success" size="sm" label="Disk used" />
          <ProgressBar label="Syncing" />

          <Flex direction="row" gap={2}>
            <Button size="sm" variant="outline" tone="neutral" onClick={() => setValue((v) => Math.max(v - 15, 0))}>
              −15
            </Button>
            <Button size="sm" variant="outline" tone="neutral" onClick={() => setValue((v) => Math.min(v + 15, 100))}>
              +15
            </Button>
          </Flex>
        </Flex>
      </div>
      <CodeBlock bare code={`<Spin label="Loading invoices" />

<ProgressBar value={35} label="Upload progress" showValue />
<ProgressBar label="Syncing" />   {/* no value — indeterminate */}`} />
    </div>
  );
}

export function TimelineDemo() {
  return (
    <div className="demo">
      <div className="demo__stage" data-layout="block">
        <Surface padding="md" radius="lg">
          <Timeline
            entries={[
              { time: '09:12', title: 'Invoice created', description: 'INV-1043 for Sarah Chen.', icon: <FileText size={13} />, tone: 'brand' },
              { time: '09:20', title: 'Sent by email', description: 'Delivered to sarah@atlas.co.' },
              { time: '11:04', title: 'Payment failed', description: 'The bank declined the charge.', tone: 'danger' },
              { time: '11:31', title: 'Paid', description: 'Settled with a different card.', tone: 'success' },
            ]}
          />
        </Surface>
      </div>
      <CodeBlock bare code={`<Timeline entries={[
  { time: '09:12', title: 'Invoice created', description: 'INV-1043', tone: 'brand' },
  { time: '11:31', title: 'Paid', tone: 'success' },
]} />`} />
    </div>
  );
}

export function ChecklistDemo() {
  const [done, setDone] = useState<string[]>(['profile']);
  const tasks = [
    { id: 'profile', label: 'Complete your profile', description: 'Name, photo, timezone' },
    { id: 'workspace', label: 'Create a workspace', description: 'Invite the people you work with' },
    { id: 'billing', label: 'Add a payment method', description: 'Required before your first invoice' },
    { id: 'invoice', label: 'Send your first invoice' },
  ];

  return (
    <div className="demo">
      <div className="demo__stage" data-layout="block">
        <Flex gap={4}>
          <Checklist
            tasks={tasks.map((task) => ({
              ...task,
              done: done.includes(task.id),
              onSelect: () =>
                setDone((current) => (current.includes(task.id) ? current.filter((id) => id !== task.id) : [...current, task.id])),
            }))}
            completeSlot={
              <Flex gap={2}>
                <Text size="sm" weight="medium">
                  All set.
                </Text>
                <Button size="sm" variant="outline" tone="neutral" onClick={() => setDone([])}>
                  Reset the demo
                </Button>
              </Flex>
            }
          />
          <Text size="xs" tone="subtle">
            Click a task to toggle it — in a real product, the app decides what &quot;done&quot; means.
          </Text>
        </Flex>
      </div>
      <CodeBlock bare code={`<Checklist
  tasks={tasks.map((task) => ({ ...task, done: completed.includes(task.id), onSelect: () => go(task) }))}
  completeSlot={<Text>All set.</Text>}
/>`} />
    </div>
  );
}
