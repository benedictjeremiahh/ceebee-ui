'use client';

import { useState } from 'react';
import {
  Checkbox,
  Field,
  NumberInput,
  RadioGroup,
  Select,
  Switch,
  TextInput,
} from '@ceebee/ui/client';
import { Stack, Surface, Text } from '@ceebee/ui';
import { CodeBlock } from './code-block';

const CURRENCIES = [
  { value: 'idr', label: 'Indonesian rupiah' },
  { value: 'usd', label: 'US dollar' },
  { value: 'eur', label: 'Euro' },
  { value: 'jpy', label: 'Japanese yen', disabled: true },
];

export function SelectDemo() {
  const [value, setValue] = useState<string>('idr');
  return (
    <div className="demo">
      <div className="demo__stage" data-layout="block">
        <Stack gap={4}>
          <Field label="Settlement currency" hint="Payouts convert at the daily rate.">
            <Select items={CURRENCIES} value={value} onValueChange={setValue} />
          </Field>
          <Field label="Disabled" >
            <Select items={CURRENCIES} defaultValue="usd" disabled />
          </Field>
          <Field label="With an error" error="This currency is not supported in your region.">
            <Select items={CURRENCIES} defaultValue="eur" />
          </Field>
        </Stack>
      </div>
      <CodeBlock bare code={`<Field label="Settlement currency" hint="Payouts convert at the daily rate.">
  <Select
    items={[{ value: 'idr', label: 'Indonesian rupiah' }, …]}
    value={value}
    onValueChange={setValue}
  />
</Field>`} />
    </div>
  );
}

export function ChoiceDemo() {
  const [plan, setPlan] = useState('monthly');
  const [terms, setTerms] = useState(false);
  return (
    <div className="demo">
      <div className="demo__stage" data-layout="block">
        <Stack gap={5}>
          <Field label="Billing period">
            <RadioGroup
              value={plan}
              onValueChange={setPlan}
              options={[
                { value: 'monthly', label: 'Monthly', description: 'Billed on the 1st, cancel anytime.' },
                { value: 'yearly', label: 'Yearly', description: 'Two months free, billed today.' },
                { value: 'invoice', label: 'By invoice', description: 'Available on Business plans.', disabled: true },
              ]}
            />
          </Field>

          <Stack gap={3}>
            <Checkbox
              label="Email me receipts"
              description="One message per payment, nothing else."
              defaultChecked
            />
            <Checkbox
              label="I accept the terms"
              checked={terms}
              onCheckedChange={setTerms}
            />
            <Checkbox label="Partially selected" indeterminate />
          </Stack>

          <Surface padding="md" radius="md">
            <Stack gap={3}>
              <Switch
                justified
                label="Reduce motion"
                description="Turns off transforms across the interface."
                defaultChecked
              />
              <Switch justified label="Weekly digest" description="Sent every Monday morning." />
            </Stack>
          </Surface>
        </Stack>
      </div>
      <CodeBlock bare code={`<RadioGroup
  value={plan}
  onValueChange={setPlan}
  options={[
    { value: 'monthly', label: 'Monthly', description: 'Billed on the 1st.' },
    { value: 'yearly', label: 'Yearly', description: 'Two months free.' },
  ]}
/>

<Checkbox label="Email me receipts" description="One message per payment." defaultChecked />
<Switch justified label="Reduce motion" description="Turns off transforms." />`} />
    </div>
  );
}

export function NumberDemo() {
  const [seats, setSeats] = useState<number | null>(3);
  return (
    <div className="demo">
      <div className="demo__stage" data-layout="block">
        <Stack gap={4}>
          <Field label="Seats" hint="Between 1 and 10.">
            <NumberInput value={seats} onValueChange={setSeats} min={1} max={10} />
          </Field>
          <Field label="Rate" hint="Steps of 0.25 — no floating point crumbs.">
            <NumberInput defaultValue={1} step={0.25} min={0} suffix="×" />
          </Field>
          <Field label="Weight">
            <NumberInput defaultValue={null} step={0.5} suffix="kg" placeholder="0" />
          </Field>
          <Text size="sm" tone="muted">
            Current value: <code>{seats === null ? 'null' : seats}</code>
          </Text>
        </Stack>
      </div>
      <CodeBlock bare code={`<Field label="Seats" hint="Between 1 and 10.">
  <NumberInput value={seats} onValueChange={setSeats} min={1} max={10} />
</Field>`} />
    </div>
  );
}
