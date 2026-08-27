'use client';

import React from 'react';
import { DatePicker, Space } from '@ceebee/ui/client';

const { RangePicker } = DatePicker;

const App: React.FC = () => (
  <Space vertical size={12}>
    <DatePicker renderExtraFooter={() => 'extra footer'} />
    <DatePicker renderExtraFooter={() => 'extra footer'} showTime />
    <RangePicker renderExtraFooter={() => 'extra footer'} />
    <RangePicker renderExtraFooter={() => 'extra footer'} showTime />
    <DatePicker renderExtraFooter={() => 'extra footer'} picker="month" />
  </Space>
);

export default App;
