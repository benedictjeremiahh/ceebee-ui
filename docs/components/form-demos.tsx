'use client';

import { useState } from 'react';
import {
  Checkbox,
  ColorPicker,
  Field,
  InputNumber,
  RadioGroup,
  Rate,
  Select,
  Switch,
} from '@ceebee/ui/client';
import type { Tone } from '@ceebee/ui';
import { Flex, Surface, Text } from '@ceebee/ui';
import { Demo } from './demo';

const CURRENCIES = [
  { value: 'idr', label: 'Indonesian rupiah' },
  { value: 'usd', label: 'US dollar' },
  { value: 'eur', label: 'Euro' },
  { value: 'jpy', label: 'Japanese yen', disabled: true },
];

export function SelectDemo() {
  const [value, setValue] = useState<string>('idr');
  return (
    <Demo
      layout="block"
      code={`<Field label="Settlement currency" hint="Payouts convert at the daily rate.">
  <Select
    items={[{ value: 'idr', label: 'Indonesian rupiah' }, …]}
    value={value}
    onValueChange={setValue}
  />
</Field>`}
    >
      <Flex gap={4}>
        <Field label="Settlement currency" hint="Payouts convert at the daily rate.">
          <Select items={CURRENCIES} value={value} onValueChange={setValue} />
        </Field>
        <Field label="Disabled">
          <Select items={CURRENCIES} defaultValue="usd" disabled />
        </Field>
        <Field label="With an error" error="This currency is not supported in your region.">
          <Select items={CURRENCIES} defaultValue="eur" />
        </Field>
      </Flex>
    </Demo>
  );
}

export function ChoiceDemo() {
  const [plan, setPlan] = useState('monthly');
  const [terms, setTerms] = useState(false);
  return (
    <Demo
      layout="block"
      code={`<RadioGroup
  value={plan}
  onValueChange={setPlan}
  options={[
    { value: 'monthly', label: 'Monthly', description: 'Billed on the 1st.' },
    { value: 'yearly', label: 'Yearly', description: 'Two months free.' },
  ]}
/>

<Checkbox label="Email me receipts" description="One message per payment." defaultChecked />
<Switch justified label="Reduce motion" description="Turns off transforms." />`}
    >
      <Flex gap={5}>
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

        <Flex gap={3}>
          <Checkbox
            label="Email me receipts"
            description="One message per payment, nothing else."
            defaultChecked
          />
          <Checkbox label="I accept the terms" checked={terms} onCheckedChange={setTerms} />
          <Checkbox label="Partially selected" indeterminate />
        </Flex>

        <Surface padding="md" radius="md">
          <Flex gap={3}>
            <Switch
              justified
              label="Reduce motion"
              description="Turns off transforms across the interface."
              defaultChecked
            />
            <Switch justified label="Weekly digest" description="Sent every Monday morning." />
          </Flex>
        </Surface>
      </Flex>
    </Demo>
  );
}

export function NumberDemo() {
  const [seats, setSeats] = useState<number | null>(3);
  return (
    <Demo
      layout="block"
      code={`<Field label="Seats" hint="Between 1 and 10.">
  <InputNumber value={seats} onValueChange={setSeats} min={1} max={10} />
</Field>`}
    >
      <Flex gap={4}>
        <Field label="Seats" hint="Between 1 and 10.">
          <InputNumber value={seats} onValueChange={setSeats} min={1} max={10} />
        </Field>
        <Field label="Rate" hint="Steps of 0.25 — no floating point crumbs.">
          <InputNumber defaultValue={1} step={0.25} min={0} suffix="×" />
        </Field>
        <Field label="Weight">
          <InputNumber defaultValue={null} step={0.5} suffix="kg" placeholder="0" />
        </Field>
        <Text size="sm" tone="muted">
          Current value: <code>{seats === null ? 'null' : seats}</code>
        </Text>
      </Flex>
    </Demo>
  );
}

export function RateDemo() {
  const [rating, setRating] = useState(3);
  return (
    <Demo
      layout="block"
      code={`<Rate value={rating} onValueChange={setRating} label="Rating" />`}
    >
      <Flex gap={4}>
        <Rate value={rating} onValueChange={setRating} label="Rating" />
        <Text size="sm" tone="muted">
          Current value: <code>{rating}</code> — press the current score again to clear it.
        </Text>
      </Flex>
    </Demo>
  );
}

export function RateReadOnlyDemo() {
  return (
    <Demo
      layout="block"
      code={`<Rate value={visit.rating} readOnly label="Rating" />`}
    >
      <Flex gap={3}>
        <Rate value={4} readOnly label="Charné Ribroom rating" />
        <Rate value={2} readOnly label="Kopi Tuku rating" />
        <Rate value={0} readOnly label="Unvisited rating" />
      </Flex>
    </Demo>
  );
}

export function RateCountDemo() {
  const [score, setScore] = useState(2);
  return (
    <Demo
      layout="block"
      code={`<Rate value={score} onValueChange={setScore} count={3} label="Difficulty" />`}
    >
      <Flex gap={4}>
        <Rate value={score} onValueChange={setScore} count={3} label="Difficulty" />
        <Rate value={score} onValueChange={setScore} count={3} size={28} label="Difficulty, larger" />
      </Flex>
    </Demo>
  );
}

export function ColorPickerDemo() {
  const [tone, setTone] = useState<Tone>('brand');
  return (
    <Demo
      layout="block"
      code={`<ColorPicker label="Accent tone" value={tone} onValueChange={setTone} />`}
    >
      <Flex gap={4}>
        <ColorPicker label="Accent tone" value={tone} onValueChange={setTone} />
        <Text size="sm" tone="muted">
          Selected tone: <code>{tone}</code> — a named Token, never a colour value.
        </Text>
      </Flex>
    </Demo>
  );
}
