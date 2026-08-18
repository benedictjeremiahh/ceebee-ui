'use client';

import { Info } from 'lucide-react';
import { Button, Popover, Tooltip } from '@ceebee/ui/client';
import { Stack, Text } from '@ceebee/ui';
import { CodeBlock } from './code-block';

const CODE = `<Popover trigger={<Button variant="outline">Details</Button>} side="bottom">
  <Text weight="semibold">Billing period</Text>
  <Text size="sm" tone="muted">Charges run from the 1st to the last day of the month.</Text>
</Popover>

<Tooltip label="Copy invoice number">
  <Button variant="ghost" iconStart={<Copy size={16} />} aria-label="Copy invoice number" />
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
          <Button variant="ghost" tone="neutral" iconStart={<Info size={16} />}>
            Hover me
          </Button>
        </Tooltip>
      </div>
      <CodeBlock bare code={CODE} />
    </div>
  );
}
