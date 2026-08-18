'use client';

import { Info } from 'lucide-react';
import { Button, Popover, Tooltip } from '@ceebee/ui/client';
import { Stack, Text } from '@ceebee/ui';

const CODE = `<Popover trigger={<Button variant="outline">Details</Button>} side="bottom">
  <Text weight="semibold">Billing period</Text>
  <Text size="sm" tone="muted">Charges run from the 1st to the last day of the month.</Text>
</Popover>

<Tooltip label="Copy invoice number">
  <button aria-label="Copy invoice number"><Copy size={16} /></button>
</Tooltip>`;

export function PopoverDemo() {
  return (
    <div className="demo">
      <div className="demo__stage">
        <Popover trigger={<Button variant="outline" tone="neutral">Details</Button>}>
          <Stack gap={2}>
            <Text weight="semibold" size="sm">
              Billing period
            </Text>
            <Text size="sm" tone="muted">
              Charges run from the 1st to the last day of the month.
            </Text>
          </Stack>
        </Popover>

        <Tooltip label="This is a tooltip">
          <button className="demo-chrome" aria-label="What is this">
            <Info size={16} /> Hover me
          </button>
        </Tooltip>
      </div>
      <pre className="demo__code">
        <code>{CODE}</code>
      </pre>
    </div>
  );
}
