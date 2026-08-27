'use client';

import React from 'react';
import { Cascader, Flex } from '@ceebee/ui/client';

const App: React.FC = () => (
  <Flex vertical gap="medium">
    <Cascader placeholder="Please select" variant="borderless" />
    <Cascader placeholder="Please select" variant="filled" />
    <Cascader placeholder="Please select" variant="outlined" />
    <Cascader placeholder="Please select" variant="underlined" />
  </Flex>
);

export default App;
