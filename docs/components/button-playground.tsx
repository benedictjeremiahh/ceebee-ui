'use client';

import { useState } from 'react';
import { Button, Select, Switch } from '@ceebee/ui/client';
import { Flex, Text } from '@ceebee/ui';
import { Demo } from './demo';

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
    <Demo code={code}>
      <Button variant={variant} tone={tone} size={size} loading={loading}>
        Save changes
      </Button>
    </Demo>
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
    <Flex gap={1} className="demo__knob">
      <Text size="xs" tone="subtle">
        {label}
      </Text>
      <Select<T> items={asItems(options)} value={value} onValueChange={onChange} size="sm" />
    </Flex>
  );
}
