'use client';

import React from 'react';
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';
import { InputNumber, Space } from '@ceebee/ui/client';

const App: React.FC = () => (
  <Space vertical style={{ width: '100%' }}>
    <InputNumber status="error" style={{ width: '100%' }} />
    <InputNumber status="warning" style={{ width: '100%' }} />
    <InputNumber status="error" style={{ width: '100%' }} prefix={<ClockCircleOutlined />} />
    <InputNumber status="warning" style={{ width: '100%' }} prefix={<ClockCircleOutlined />} />
  </Space>
);

export default App;
