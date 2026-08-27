'use client';

import React from 'react';
import { Flex, Radio } from '@ceebee/ui/client';
import type { RadioGroupProps } from '@ceebee/ui/client';

// This options type is not on the published surface upstream. Radio.Group's own public props
// expose the same `options` shape.

const options: RadioGroupProps['options'] = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' },
];

const App: React.FC = () => (
  <Flex vertical gap="medium">
    <Radio.Group block options={options} defaultValue="Apple" />
    <Radio.Group
      block
      options={options}
      defaultValue="Apple"
      optionType="button"
      buttonStyle="solid"
    />
    <Radio.Group block options={options} defaultValue="Pear" optionType="button" />
  </Flex>
);

export default App;
