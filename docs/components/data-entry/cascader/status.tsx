'use client';

import React from 'react';
import { Cascader, Space } from '@ceebee/ui/client';

const App: React.FC = () => (
  <Space vertical>
    <Cascader status="error" placeholder="Error" />
    <Cascader status="warning" multiple placeholder="Warning multiple" />
  </Space>
);

export default App;
