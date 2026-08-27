'use client';

import React from 'react';
import type { TimePickerProps } from '@ceebee/ui/client';
import { TimePicker } from '@ceebee/ui/client';

const onChange: TimePickerProps['onChange'] = (time, timeString) => {
  console.log(time, timeString);
};

const App: React.FC = () => <TimePicker onChange={onChange} needConfirm />;

export default App;
