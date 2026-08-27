'use client';

import React from 'react';
import { Flex, Mentions } from '@ceebee/ui/client';

const App: React.FC = () => (
  <Flex vertical gap="medium">
    <Mentions size="large" placeholder="large size" />
    <Mentions placeholder="default size" />
    <Mentions size="small" placeholder="small size" />
  </Flex>
);

export default App;
