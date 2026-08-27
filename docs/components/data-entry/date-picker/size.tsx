'use client';

import React, { useState } from 'react';
import type { ConfigProviderProps, RadioChangeEvent } from '@ceebee/ui/client';
import { DatePicker, Radio, Space } from '@ceebee/ui/client';

type SizeType = ConfigProviderProps['componentSize'];

const { RangePicker } = DatePicker;

const App: React.FC = () => {
  const [size, setSize] = useState<SizeType>('medium');

  const handleSizeChange = (e: RadioChangeEvent) => {
    setSize(e.target.value);
  };

  return (
    <Space vertical size={12}>
      <Radio.Group value={size} onChange={handleSizeChange}>
        <Radio.Button value="large">Large</Radio.Button>
        <Radio.Button value="medium">Medium</Radio.Button>
        <Radio.Button value="small">Small</Radio.Button>
      </Radio.Group>
      <DatePicker size={size} />
      <DatePicker size={size} picker="month" />
      <RangePicker size={size} />
      <DatePicker size={size} picker="week" />
    </Space>
  );
};

export default App;
