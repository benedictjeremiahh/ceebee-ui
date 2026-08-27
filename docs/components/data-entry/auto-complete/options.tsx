'use client';

import React from 'react';
import { AutoComplete } from '@ceebee/ui/client';
import type { AutoCompleteProps } from '@ceebee/ui/client';

const App: React.FC = () => {
  const [options, setOptions] = React.useState<AutoCompleteProps['options']>([]);
  const handleSearch = (value: string) => {
    setOptions(() => {
      if (!value || value.includes('@')) {
        return [];
      }
      return ['gmail.com', '163.com', 'qq.com'].map((domain) => ({
        label: `${value}@${domain}`,
        value: `${value}@${domain}`,
      }));
    });
  };
  return (
    <AutoComplete
      style={{ width: 200 }}
      showSearch={{ onSearch: handleSearch }}
      placeholder="input here"
      options={options}
    />
  );
};

export default App;
