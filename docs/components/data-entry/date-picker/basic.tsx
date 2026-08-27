'use client';

import React from 'react';
import type { DatePickerProps } from '@ceebee/ui/client';
import { DatePicker, Flex } from '@ceebee/ui/client';

const onChange: DatePickerProps['onChange'] = (date, dateString) => {
  console.log(date, dateString);
};

const Demo: React.FC = () => (
  <Flex gap="small" justify="flex-start" align="flex-start" vertical>
    <DatePicker onChange={onChange} />
    <DatePicker onChange={onChange} picker="week" />
    <DatePicker onChange={onChange} picker="month" />
    <DatePicker onChange={onChange} picker="quarter" />
    <DatePicker onChange={onChange} picker="year" />
  </Flex>
);

export default Demo;
