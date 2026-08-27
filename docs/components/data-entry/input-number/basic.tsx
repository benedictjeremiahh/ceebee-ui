'use client';

import React from 'react';
import type { InputNumberProps } from '@ceebee/ui/client';
import { InputNumber } from '@ceebee/ui/client';

const onChange: InputNumberProps['onChange'] = (value) => {
  console.log('changed', value);
};

const App: React.FC = () => <InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />;

export default App;
