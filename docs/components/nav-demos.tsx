'use client';

import { useState } from 'react';
import {
  BarChart3,
  Bell,
  Copy,
  CreditCard,
  FileText,
  LogOut,
  MoreHorizontal,
  Search,
  Settings,
  Trash2,
  Users,
} from 'lucide-react';
import { Button, Dropdown, Sidebar, TopBar, Input } from '@ceebee/ui/client';
import { Avatar, Badge, Breadcrumb, Flex, Steps, Surface, Text } from '@ceebee/ui';
import { CodeBlock } from './code-block';

export function MenuDemo() {
  return (
    <div className="demo">
      <div className="demo__stage">
        <Dropdown
          trigger={<Button variant="outline" tone="neutral" iconStart={<MoreHorizontal size={16} />}>Actions</Button>}
          items={[
            { label: 'Rename', icon: <FileText size={14} />, shortcut: '⌘R' },
            { label: 'Duplicate', icon: <Copy size={14} />, shortcut: '⌘D' },
            { label: 'Move to…', icon: <BarChart3 size={14} />, disabled: true },
            { separator: true },
            { label: 'Compact view', checked: true },
            { separator: true },
            { label: 'Delete', icon: <Trash2 size={14} />, tone: 'danger' },
          ]}
        />
      </div>
      <CodeBlock bare code={`<Dropdown
  trigger={<Button variant="outline">Actions</Button>}
  items={[
    { label: 'Rename', icon: <FileText size={14} />, shortcut: '⌘R' },
    { separator: true },
    { label: 'Delete', icon: <Trash2 size={14} />, tone: 'danger' },
  ]}
/>`} />
    </div>
  );
}

export function BreadcrumbsDemo() {
  return (
    <div className="demo">
      <div className="demo__stage" data-layout="block">
        <Flex gap={4}>
          <Breadcrumb items={[{ label: 'Workspace', href: '#' }, { label: 'Billing', href: '#' }, { label: 'INV-1043' }]} />
          <Breadcrumb
            items={[
              { label: 'Workspace', href: '#' },
              { label: 'Projects', href: '#' },
              { label: 'Atlas', href: '#' },
              { label: 'Releases', href: '#' },
              { label: 'v2.4.0' },
            ]}
          />
        </Flex>
      </div>
      <CodeBlock bare code={`<Breadcrumb items={[
  { label: 'Workspace', href: '/' },
  { label: 'Billing', href: '/billing' },
  { label: 'INV-1043' },
]} />`} />
    </div>
  );
}

export function StepperDemo() {
  const [current, setCurrent] = useState(1);
  const steps = [
    { label: 'Account', description: 'Who is signing up' },
    { label: 'Workspace', description: 'Name and members' },
    { label: 'Billing', description: 'Plan and payment' },
    { label: 'Done' },
  ];

  return (
    <div className="demo">
      <div className="demo__stage" data-layout="block">
        <Flex gap={5}>
          <Steps steps={steps} current={current} />
          <Flex direction="row" gap={2}>
            <Button size="sm" variant="outline" tone="neutral" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>
              Back
            </Button>
            <Button size="sm" disabled={current === steps.length - 1} onClick={() => setCurrent((c) => c + 1)}>
              Next
            </Button>
          </Flex>
          <Surface padding="md" radius="md">
            <Steps orientation="vertical" current={2} steps={steps} />
          </Surface>
        </Flex>
      </div>
      <CodeBlock bare code={`<Steps current={1} steps={[
  { label: 'Account', description: 'Who is signing up' },
  { label: 'Workspace', description: 'Name and members' },
]} />`} />
    </div>
  );
}

export function ShellDemo() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState('Overview');

  const sections = [
    {
      title: 'Workspace',
      items: [
        { label: 'Overview', icon: <BarChart3 size={16} />, active: active === 'Overview', onClick: () => setActive('Overview') },
        {
          label: 'Invoices',
          icon: <FileText size={16} />,
          adornment: <Badge tone="brand" size="sm">6</Badge>,
          items: [
            { label: 'All invoices', active: active === 'All invoices', onClick: () => setActive('All invoices') },
            { label: 'Drafts', active: active === 'Drafts', onClick: () => setActive('Drafts') },
            { label: 'Overdue', adornment: <Badge tone="danger" size="sm">2</Badge>, active: active === 'Overdue', onClick: () => setActive('Overdue') },
          ],
        },
        { label: 'Customers', icon: <Users size={16} />, active: active === 'Customers', onClick: () => setActive('Customers') },
      ],
    },
    {
      title: 'Settings',
      items: [
        { label: 'Billing', icon: <CreditCard size={16} />, active: active === 'Billing', onClick: () => setActive('Billing') },
        { label: 'Preferences', icon: <Settings size={16} />, active: active === 'Preferences', onClick: () => setActive('Preferences') },
      ],
    },
  ];

  return (
    <div className="demo">
      <div className="demo__stage" data-layout="block">
        <div className="shell-demo">
          <Sidebar
            sections={sections}
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            header={
              <Flex direction="row" gap={2} align="center">
                <span className="docs__mark" />
                {collapsed ? null : <Text weight="semibold" as="span">Ceebee</Text>}
              </Flex>
            }
            footer={
              collapsed ? (
                <Avatar name="Sarah Chen" size="sm" />
              ) : (
                <Flex direction="row" gap={2} align="center">
                  <Avatar name="Sarah Chen" size="sm" status="online" />
                  <Text size="xs" tone="muted" as="span">Sarah Chen</Text>
                </Flex>
              )
            }
          />

          <div className="shell-demo__main">
            <TopBar
              sticky={false}
              title={<Breadcrumb items={[{ label: 'Workspace', href: '#' }, { label: active }]} />}
              subtitle="Updated 4 minutes ago"
              center={<Input placeholder="Search invoices…" aria-label="Search invoices" size="sm" />}
              actions={
                <>
                  <Button variant="ghost" tone="neutral" size="sm" iconStart={<Bell size={16} />} aria-label="Notifications" />
                  <Dropdown
                    trigger={<Button variant="ghost" tone="neutral" size="sm" iconStart={<Avatar name="Sarah Chen" size="sm" />} aria-label="Account" />}
                    items={[
                      { label: 'Profile', icon: <Users size={14} /> },
                      { label: 'Preferences', icon: <Settings size={14} /> },
                      { separator: true },
                      { label: 'Sign out', icon: <LogOut size={14} />, tone: 'danger' },
                    ]}
                  />
                </>
              }
            />
            <div className="shell-demo__body">
              <Text tone="muted">{active} lives here.</Text>
            </div>
          </div>
        </div>
      </div>
      <CodeBlock bare code={`<Sidebar
  sections={sections}
  collapsed={collapsed}
  onCollapsedChange={setCollapsed}
  header={<Logo />}
  footer={<Avatar name={user.name} />}
/>

<TopBar title={<Breadcrumb items={trail} />} center={<Search />} actions={<Actions />} />`} />
    </div>
  );
}
