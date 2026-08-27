'use client';

import React from 'react';
import { Radio } from '@ceebee/ui/client';

const App: React.FC = () => (
  <Radio.Group
    name="radiogroup"
    defaultValue={1}
    options={[
      { value: 1, label: 'A' },
      { value: 2, label: 'B' },
      { value: 3, label: 'C' },
      { value: 4, label: 'D' },
    ]}
  />
);

export default App;
