'use client';

import React from 'react';
import type { DatePickerProps } from '@ceebee/ui/client';
import { DatePicker } from '@ceebee/ui/client';
import type { Dayjs } from 'dayjs';

const onChange: DatePickerProps<Dayjs, false>['onChange'] = (date, dateString) => {
  console.log(date, dateString);
};

const App: React.FC = () => <DatePicker onChange={onChange} needConfirm />;

export default App;
