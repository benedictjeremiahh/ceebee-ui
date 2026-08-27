'use client';

import React from 'react';
import { Select } from '@ceebee/ui/client';

const onChange = (value: string) => {
  console.log(`selected ${value}`);
};

const onSearch = (value: string) => {
  console.log('search:', value);
};

const App: React.FC = () => (
  <Select
    showSearch={{ optionFilterProp: 'label', onSearch }}
    placeholder="Select a person"
    onChange={onChange}
    options={[
      {
        value: 'jack',
        label: 'Jack',
      },
      {
        value: 'lucy',
        label: 'Lucy',
      },
      {
        value: 'tom',
        label: 'Tom',
      },
    ]}
  />
);

export default App;
