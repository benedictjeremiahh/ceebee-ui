'use client';

import { useState } from 'react';
import { Button, Select, Switch } from '@ceebee/ui/client';
import { Stack, Text } from '@ceebee/ui';
import { CodeBlock } from './code-block';

const VARIANTS = ['solid', 'soft', 'outline', 'ghost'] as const;
const TONES = ['brand', 'neutral', 'info', 'success', 'warning', 'danger'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;

const asItems = <T extends string>(values: readonly T[]) => values.map((value) => ({ value, label: value }));

/** Knob-driven rather than code-editable: the props are the API, so those are what you try.
 *  The knobs themselves are library controls — the docs eat their own cooking. */
export function ButtonPlayground() {
  const [variant, setVariant] = useState<(typeof VARIANTS)[number]>('solid');
  const [tone, setTone] = useState<(typeof TONES)[number]>('brand');
  const [size, setSize] = useState<(typeof SIZES)[number]>('md');
  const [loading, setLoading] = useState(false);

  const code = `<Button variant="${variant}" tone="${tone}" size="${size}"${loading ? ' loading' : ''}>\n  Save changes\n</Button>`;

  return (
    <div className="demo">
      <div className="demo__stage">
        <Button variant={variant} tone={tone} size={size} loading={loading}>
          Save changes
        </Button>
      </div>

      <div className="demo__knobs">
        <Knob label="variant" value={variant} options={VARIANTS} onChange={setVariant} />
        <Knob label="tone" value={tone} options={TONES} onChange={setTone} />
        <Knob label="size" value={size} options={SIZES} onChange={setSize} />
        <Switch label="loading" checked={loading} onCheckedChange={setLoading} />
      </div>

      <CodeBlock bare code={code} />
    </div>
  );
}

function Knob<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <Stack gap={1} className="demo__knob">
      <Text size="xs" tone="subtle">
        {label}
      </Text>
      <Select<T> items={asItems(options)} value={value} onValueChange={onChange} size="sm" />
    </Stack>
  );
}
