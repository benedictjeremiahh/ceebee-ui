'use client';

import React from 'react';
import { Divider, Flex, Steps } from '@ceebee/ui/client';
import type { StepsProps } from '@ceebee/ui/client';

const items = [
  {
    title: 'Finished',
    content: 'This is a content.',
  },
  {
    title: 'In Progress',
    content: 'This is a content.',
  },
  {
    title: 'Waiting',
    content: 'This is a content.',
  },
];

const sharedProps: StepsProps = {
  type: 'dot',
  current: 1,
  items,
};

const sharedVerticalProps = {
  ...sharedProps,
  orientation: 'vertical',
  style: {
    flex: 'auto',
  },
} as const;

const App: React.FC = () => (
  <Flex vertical gap="medium">
    <Steps {...sharedProps} />
    <Steps {...sharedProps} variant="outlined" />
    <Divider />
    <Flex gap="medium">
      <Steps {...sharedVerticalProps} />
      <Steps {...sharedVerticalProps} variant="outlined" />
    </Flex>
  </Flex>
);

export default App;

