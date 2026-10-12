'use client';

import { useRef, useState } from 'react';
import { Flex, Heading, Text } from '@ceebee/ui';
import { Button, FocusRecovery } from '@ceebee/ui/client';

/** The application chooses the destination; the primitive owns removal recovery. */
export function FocusRecoveryDemo() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [visible, setVisible] = useState(true);
  return (
    <FocusRecovery targetRef={headingRef}>
      <Flex direction="column" gap={3}>
        <Heading level={3} size="lg" ref={headingRef} tabIndex={-1}>Entries</Heading>
        {visible
          ? <Button onClick={() => setVisible(false)}>Remove entry</Button>
          : <Text>The entry was removed. Focus returns to this section.</Text>}
        <Button disabled={visible} onClick={() => setVisible(true)}>Restore entry</Button>
      </Flex>
    </FocusRecovery>
  );
}
