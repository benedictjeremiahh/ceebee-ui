'use client';

import React from 'react';
import { Divider, Flex, Timeline } from '@ceebee/ui/client';
import type { TimelineProps } from '@ceebee/ui/client';

const sharedProps: TimelineProps = {
  orientation: 'horizontal',
  items: [
    {
      content: 'Init',
    },
    {
      content: 'Start',
    },
    {
      content: 'Pending',
    },
    {
      content: 'Complete',
    },
  ],
};

const App: React.FC = () => (
  <Flex vertical>
    <Timeline {...sharedProps} mode="start" />
    <Divider />
    <Timeline {...sharedProps} mode="end" />
    <Divider />
    <Timeline {...sharedProps} mode="alternate" />
  </Flex>
);

export default App;
