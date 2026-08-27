'use client';

import { useEffect, useState } from 'react';
import { Alert, Button, Progress as ProgressBar, Spin, Timeline } from '@ceebee/ui/client';
import dayjs, { type Dayjs } from 'dayjs';
import { CreditCard, FileText, GitBranch, LogOut, Plus, Rocket, Settings, Upload as UploadGlyph, UserPlus } from 'lucide-react';
import { Checklist, CommandPalette, type PaletteCommand } from '@ceebee/ui/client';
import { Flex, Surface, Text } from '@ceebee/ui';
import { Demo } from './demo';

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
    <Demo code={`<CommandPalette
  open={open}
  onOpenChange={setOpen}
  commands={[
    { id: 'invoice', label: 'New invoice', group: 'Create', shortcut: '⌘N', onRun: createInvoice },
    { id: 'signout', label: 'Sign out', keywords: ['logout'], onRun: signOut },
  ]}
/>`}>
      <Button type="primary" onClick={() => setOpen(true)} icon={<Plus size={16} />}>
        Open palette
      </Button>
      <Text size="sm" tone="muted">
        or press <kbd>⌘K</kbd>
        {last ? ` — last run: ${last}` : ''}
      </Text>
      <CommandPalette open={open} onOpenChange={setOpen} commands={commands} />
    </Demo>
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
    <Demo layout="block" code={`<Checklist
  tasks={tasks.map((task) => ({ ...task, done: completed.includes(task.id), onSelect: () => go(task) }))}
  completeSlot={<Text>All set.</Text>}
/>`}>
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
              <Button size="small" onClick={() => setDone([])}>
                Reset the demo
              </Button>
            </Flex>
          }
        />
        <Text size="xs" tone="subtle">
          Click a task to toggle it — in a real product, the app decides what &quot;done&quot; means.
        </Text>
      </Flex>
    </Demo>
  );
}
