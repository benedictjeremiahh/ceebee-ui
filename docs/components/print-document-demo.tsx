'use client';

import { useState } from 'react';
import { Flex, Heading, Surface, Text } from '@ceebee/ui';
import { Button, PrintDocument } from '@ceebee/ui/client';
import { Demo } from './demo';

export function PrintDocumentDemo() {
  const [active, setActive] = useState(true);
  const [colorMode, setColorMode] = useState<'light' | 'current'>('light');

  return (
    <Demo
      layout="block"
      code={`<PrintDocument active={active} colorMode={colorMode}>
  <Report />
</PrintDocument>

<Button onClick={() => window.print()}>Print in browser</Button>`}
    >
      <Flex direction="column" gap={3}>
        <Flex wrap gap={2}>
          <Button size="small" aria-pressed={active} onClick={() => setActive((value) => !value)}>
            Active: {active ? 'on' : 'off'}
          </Button>
          <Button
            size="small"
            aria-pressed={colorMode === 'light'}
            onClick={() => setColorMode('light')}
          >
            Light print
          </Button>
          <Button
            size="small"
            aria-pressed={colorMode === 'current'}
            onClick={() => setColorMode('current')}
          >
            Current theme
          </Button>
          <Button type="primary" onClick={() => window.print()}>
            Print in browser
          </Button>
        </Flex>
        <PrintDocument active={active} colorMode={colorMode}>
          <Surface variant="tinted" hue="violet" padding="lg" radius="lg">
            <Flex direction="column" gap={2}>
              <Heading level={3} size="lg">Monthly statement</Heading>
              <Text>This content is the only document selected for native printing.</Text>
              <Text>Its live copy stays mounted after the print dialog closes.</Text>
            </Flex>
          </Surface>
        </PrintDocument>
      </Flex>
    </Demo>
  );
}
