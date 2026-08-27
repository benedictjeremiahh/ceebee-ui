'use client';

import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Plus, Split } from 'lucide-react';

import { Avatar, Badge, Button, Form, InputNumber, Modal, Switch, Timeline } from '@ceebee/ui/client';
import { Flex, Sparkline, Surface, Text } from '@ceebee/ui';

const BALANCE_TREND = [18, 22, 19, 26, 24, 31, 29, 36, 34, 41];
const money = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

/** Reproduces the fintech pins: balance card, split bill, and a transaction history. */
export function FintechRecipe() {
  const [splitOpen, setSplitOpen] = useState(false);
  const [amount, setAmount] = useState<number | null>(750_860);
  const [evenSplit, setEvenSplit] = useState(true);
  const people = ['Chris', 'Ada Putri', 'Rio Hakim', 'Sarah Chen'];
  const share = amount === null ? 0 : Math.round(amount / people.length);

  return (
    <div className="recipe recipe--fintech">
      <Flex gap={4}>
        <Surface variant="gradient" hue="violet" radius="xl" padding="lg" elevation="lg">
          <Flex gap={4}>
            <Flex direction="row" justify="between" align="start">
              <Flex gap={1}>
                <Text size="xs" tone="muted">Total balance</Text>
                <Text size="lg" weight="semibold" numeric className="recipe__balance">
                  {money.format(120_456_500)}
                </Text>
              </Flex>
              <Badge count="+2.4%" color="var(--cb-tone-success)" />
            </Flex>

            <Sparkline values={BALANCE_TREND} filled hue="violet" width={260} height={44} label="Balance over ten weeks" />

            <Flex direction="row" gap={2} wrap>
              <Button size="small" type="primary" icon={<Plus size={15} />}>Top up</Button>
              <Button size="small" variant="filled" color="primary" icon={<Split size={15} />} onClick={() => setSplitOpen(true)}>
                Split a bill
              </Button>
            </Flex>
          </Flex>
        </Surface>

        <Surface padding="md" radius="lg">
          <Flex gap={3}>
            <Flex direction="row" justify="between" align="center">
              <Text size="sm" weight="semibold">Shared with</Text>
              <Avatar.Group max={{ count: 2 }}>
                {people.slice(0, 3).map((name) => (
                  <Avatar key={name} size="small">{name.slice(0, 1)}</Avatar>
                ))}
              </Avatar.Group>
            </Flex>
            <Timeline
              mode="left"
              items={[
                { label: '08:41', color: 'var(--cb-tone-danger)', dot: <ArrowUpRight size={13} />, children: 'Grocery run — split four ways' },
                { label: 'Yesterday', color: 'var(--cb-tone-success)', dot: <ArrowDownLeft size={13} />, children: 'Salary — monthly payout' },
                { label: 'Mon', dot: <ArrowUpRight size={13} />, children: 'Dinner at Kopi Nako — Chris paid, you owe 187,715' },
              ]}
            />
          </Flex>
        </Surface>
      </Flex>

      <Modal
        open={splitOpen}
        onCancel={() => setSplitOpen(false)}
        title={`Split a bill · ${people.length} people, ${evenSplit ? 'evenly' : 'by share'}`}
        footer={
          <>
            <Button type="text" onClick={() => setSplitOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={() => setSplitOpen(false)}>Request {money.format(share)}</Button>
          </>
        }
      >
        <Flex gap={4}>
          <Form layout="vertical">
            <Form.Item label="Total" extra="What the bill came to.">
              <InputNumber value={amount} onChange={(next) => setAmount(next ?? 0)} min={0} step={1000} suffix="IDR" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Split evenly" extra="Everyone pays the same share">
              <Switch checked={evenSplit} onChange={setEvenSplit} />
            </Form.Item>
          </Form>
          <Surface variant="tinted" hue="violet" padding="md" radius="md">
            <Flex direction="row" justify="between" align="center">
              <Text size="sm" tone="muted">Each person</Text>
              <Text size="sm" weight="semibold" numeric as="span">{money.format(share)}</Text>
            </Flex>
          </Surface>
        </Flex>
      </Modal>
    </div>
  );
}
