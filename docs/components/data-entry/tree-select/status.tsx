'use client';

import React from 'react';
import { Space, TreeSelect } from '@ceebee/ui/client';

const App: React.FC = () => (
  <Space vertical style={{ width: '100%' }}>
    <TreeSelect status="error" style={{ width: '100%' }} placeholder="Error" />
    <TreeSelect
      status="warning"
      style={{ width: '100%' }}
      multiple
      placeholder="Warning multiple"
    />
  </Space>
);

export default App;
