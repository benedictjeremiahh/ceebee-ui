'use client';

import { useState } from 'react';
import { Button } from '@ceebee/ui/client';
import { Stack, Surface, Text } from '@ceebee/ui';

const VARIANTS = ['solid', 'soft', 'outline', 'ghost'] as const;
const TONES = ['brand', 'neutral', 'info', 'success', 'warning', 'danger'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;

/** Knob-driven rather than code-editable: the props are the API, so those are what you try. */
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
      <Surface radius="sm" padding="sm" bordered={false} elevation="none">
        <Stack direction="row" gap={4} wrap align="center">
          <Knob label="variant" value={variant} options={VARIANTS} onChange={setVariant} />
          <Knob label="tone" value={tone} options={TONES} onChange={setTone} />
          <Knob label="size" value={size} options={SIZES} onChange={setSize} />
          <label>
            <Text size="xs" tone="subtle" as="span">
              loading{' '}
            </Text>
            <input type="checkbox" checked={loading} onChange={(e) => setLoading(e.target.checked)} />
          </label>
        </Stack>
      </Surface>
      <pre className="demo__code">
        <code>{code}</code>
      </pre>
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
    <label>
      <Text size="xs" tone="subtle" as="span">
        {label}{' '}
      </Text>
      <select value={value} onChange={(event) => onChange(event.target.value as T)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
