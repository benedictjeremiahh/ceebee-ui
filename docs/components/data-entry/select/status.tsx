'use client';

import React from 'react';
import { Select, Space } from '@ceebee/ui/client';

const App: React.FC = () => (
  <Space vertical style={{ width: '100%' }}>
    <Select status="error" style={{ width: '100%' }} />
    <Select status="warning" style={{ width: '100%' }} />
  </Space>
);

export default App;
