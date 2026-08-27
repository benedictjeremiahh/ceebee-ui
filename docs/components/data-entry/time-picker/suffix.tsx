'use client';

import React from 'react';
import { SmileOutlined } from '@ant-design/icons';
import { Space, TimePicker } from '@ceebee/ui/client';
import type { TimePickerProps } from '@ceebee/ui/client';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const onChange: TimePickerProps['onChange'] = (time, timeString) => {
  console.log(time, timeString);
};

const App: React.FC = () => (
  <Space vertical size={12}>
    <TimePicker
      suffixIcon={<SmileOutlined />}
      onChange={onChange}
      defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')}
    />
    <TimePicker prefix={<SmileOutlined />} />
    <TimePicker.RangePicker prefix={<SmileOutlined />} />
  </Space>
);

export default App;
