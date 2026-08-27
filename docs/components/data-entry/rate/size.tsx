'use client';

import React from 'react';
import { Flex, Rate } from '@ceebee/ui/client';

const App: React.FC = () => (
  <Flex vertical gap="medium">
    <Rate size="large" />
    <Rate />
    <Rate size="small" />
  </Flex>
);

export default App;
