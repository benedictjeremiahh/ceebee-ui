'use client';

import React from 'react';
import { Calendar, theme } from '@ceebee/ui/client';
import type { CalendarProps } from '@ceebee/ui/client';
import type { Dayjs } from 'dayjs';

const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
  console.log(value.format('YYYY-MM-DD'), mode);
};

const App: React.FC = () => {
  const { token } = theme.useToken();

  const wrapperStyle: React.CSSProperties = {
    width: 300,
    border: `${token.lineWidth}px ${token.lineType} ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  return (
    <div style={wrapperStyle}>
      <Calendar fullscreen={false} onPanelChange={onPanelChange} />
    </div>
  );
};

export default App;
