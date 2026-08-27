'use client';

import React from 'react';
import { Flex, Input } from '@ceebee/ui/client';

const App: React.FC = () => (
  <Flex vertical gap={12}>
    <Input placeholder="Outlined" />
    <Input placeholder="Filled" variant="filled" />
    <Input placeholder="Borderless" variant="borderless" />
    <Input placeholder="Underlined" variant="underlined" />
    <Input.Search placeholder="Filled" variant="filled" />
  </Flex>
);

export default App;
