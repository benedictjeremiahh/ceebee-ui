'use client';

import React from 'react';
import { Flex, Spin } from '@ceebee/ui/client';

const App: React.FC = () => (
  <Flex align="center" gap="medium">
    <Spin size="small" />
    <Spin />
    <Spin size="large" />
  </Flex>
);

export default App;
