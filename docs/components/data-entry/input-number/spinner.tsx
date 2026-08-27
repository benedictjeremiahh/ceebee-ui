'use client';

import React from 'react';
import type { InputNumberProps } from '@ceebee/ui/client';
import { Flex, InputNumber } from '@ceebee/ui/client';

const onChange: InputNumberProps['onChange'] = (value) => {
  console.log('changed', value);
};

const sharedProps = {
  mode: 'spinner' as const,
  min: 1,
  max: 10,
  defaultValue: 3,
  onChange,
  style: { width: 150 },
};

const App: React.FC = () => (
  <Flex vertical gap="medium">
    <InputNumber {...sharedProps} placeholder="Outlined" />
    <InputNumber {...sharedProps} variant="filled" placeholder="Filled" />
  </Flex>
);

export default App;
