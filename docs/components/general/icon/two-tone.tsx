'use client';

import React from 'react';
import { CheckCircleTwoTone, HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { Space } from '@ceebee/ui/client';

const App: React.FC = () => (
  <Space>
    <SmileTwoTone />
    <HeartTwoTone twoToneColor="#eb2f96" />
    <CheckCircleTwoTone twoToneColor="#52c41a" />
  </Space>
);

export default App;

