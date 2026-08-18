'use client';

import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Plus, Split } from 'lucide-react';
import { Button, Dialog, NumberInput, Field, Switch } from '@ceebee/ui/client';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Sparkline,
  Stack,
  Surface,
  Text,
  Timeline,
} from '@ceebee/ui';

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
      <Stack gap={4}>
        <Surface variant="gradient" hue="violet" radius="xl" padding="lg" elevation="lg">
          <Stack gap={4}>
            <Stack direction="row" justify="between" align="start">
              <Stack gap={1}>
                <Text size="xs" tone="muted">Total balance</Text>
                <Text size="lg" weight="semibold" numeric className="recipe__balance">
                  {money.format(120_456_500)}
                </Text>
              </Stack>
              <Badge tone="success" size="sm" dot>+2.4%</Badge>
            </Stack>

            <Sparkline values={BALANCE_TREND} filled hue="violet" width={260} height={44} label="Balance over ten weeks" />

            <Stack direction="row" gap={2} wrap>
              <Button size="sm" iconStart={<Plus size={15} />}>Top up</Button>
              <Button size="sm" variant="soft" iconStart={<Split size={15} />} onClick={() => setSplitOpen(true)}>
                Split a bill
              </Button>
            </Stack>
          </Stack>
        </Surface>

        <Surface padding="md" radius="lg">
          <Stack gap={3}>
            <Stack direction="row" justify="between" align="center">
              <Text size="sm" weight="semibold">Shared with</Text>
              <AvatarGroup overflow={2}>
                {people.slice(0, 3).map((name) => (
                  <Avatar key={name} name={name} size="sm" />
                ))}
              </AvatarGroup>
            </Stack>
            <Timeline
              entries={[
                { time: '08:41', title: 'Grocery run', description: 'Split four ways', icon: <ArrowUpRight size={13} />, tone: 'danger' },
                { time: 'Yesterday', title: 'Salary', description: 'Monthly payout', icon: <ArrowDownLeft size={13} />, tone: 'success' },
                { time: 'Mon', title: 'Dinner at Kopi Nako', description: 'Chris paid, you owe 187,715', icon: <ArrowUpRight size={13} /> },
              ]}
            />
          </Stack>
        </Surface>
      </Stack>

      <Dialog
        open={splitOpen}
        onOpenChange={setSplitOpen}
        title="Split a bill"
        description={`${people.length} people, ${evenSplit ? 'evenly' : 'by share'}`}
        footer={
          <>
            <Button variant="ghost" tone="neutral" onClick={() => setSplitOpen(false)}>Cancel</Button>
            <Button onClick={() => setSplitOpen(false)}>Request {money.format(share)}</Button>
          </>
        }
      >
        <Stack gap={4}>
          <Field label="Total" hint="What the bill came to.">
            <NumberInput value={amount} onValueChange={setAmount} min={0} step={1000} suffix="IDR" />
          </Field>
          <Switch justified label="Split evenly" description="Everyone pays the same share" checked={evenSplit} onCheckedChange={setEvenSplit} />
          <Surface variant="tinted" hue="violet" padding="md" radius="md">
            <Stack direction="row" justify="between" align="center">
              <Text size="sm" tone="muted">Each person</Text>
              <Text size="sm" weight="semibold" numeric as="span">{money.format(share)}</Text>
            </Stack>
          </Surface>
        </Stack>
      </Dialog>
    </div>
  );
}
