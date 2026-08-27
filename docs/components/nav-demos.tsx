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
import { Sidebar, TopBar } from '@ceebee/ui/client';
import { Flex, Surface, Text } from '@ceebee/ui';
import { Demo } from './demo';

import { Avatar, Badge, Breadcrumb, Button, Dropdown, Input, Steps as StaticSteps } from '@ceebee/ui/client';
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
          adornment: <Badge count={6} color="var(--cb-tone-brand)" />,
          items: [
            { label: 'All invoices', active: active === 'All invoices', onClick: () => setActive('All invoices') },
            { label: 'Drafts', active: active === 'Drafts', onClick: () => setActive('Drafts') },
            { label: 'Overdue', adornment: <Badge count={2} color="var(--cb-tone-danger)" />, active: active === 'Overdue', onClick: () => setActive('Overdue') },
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
    <Demo layout="block" code={`<Sidebar
  sections={sections}
  collapsed={collapsed}
  onCollapsedChange={setCollapsed}
  header={<Logo />}
  footer={<Avatar name={user.name} />}
/>

<TopBar title={<Breadcrumb items={trail} />} center={<Search />} actions={<Actions />} />`}>
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
              <Avatar size="small">SC</Avatar>
            ) : (
              <Flex direction="row" gap={2} align="center">
                <Avatar size="small">SC</Avatar>
                <Text size="xs" tone="muted" as="span">Sarah Chen</Text>
              </Flex>
            )
          }
        />

        <div className="shell-demo__main">
          <TopBar
            sticky={false}
            title={<Breadcrumb items={[{ title: 'Workspace', href: '#' }, { title: active }]} />}
            subtitle="Updated 4 minutes ago"
            center={<Input placeholder="Search invoices…" aria-label="Search invoices" size="small" />}
            actions={
              <>
                <Button type="text" size="small" icon={<Bell size={16} />} aria-label="Notifications" />
                <Dropdown
                  menu={{
                    items: [
                      { key: 'profile', label: 'Profile', icon: <Users size={14} /> },
                      { key: 'preferences', label: 'Preferences', icon: <Settings size={14} /> },
                      { type: 'divider' },
                      { key: 'sign-out', label: 'Sign out', icon: <LogOut size={14} />, danger: true },
                    ],
                  }}
                >
                  <Button type="text" size="small" icon={<Avatar size="small">SC</Avatar>} aria-label="Account" />
                </Dropdown>
              </>
            }
          />
          <div className="shell-demo__body">
            <Text tone="muted">{active} lives here.</Text>
          </div>
        </div>
      </div>
    </Demo>
  );
}
