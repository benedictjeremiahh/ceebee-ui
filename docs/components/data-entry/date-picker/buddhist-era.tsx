'use client';

import React from 'react';
import { ConfigProvider, DatePicker, Space, Typography } from '@ceebee/ui/client';
import type { DatePickerProps } from '@ceebee/ui/client';
// These locales are published as subpath modules upstream; `@ceebee/ui/client` re-exports them.
import { enUSDatePickerLocale as en, enUSLocale as enUS } from '@ceebee/ui/client';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';

dayjs.extend(buddhistEra);

const { Title } = Typography;

// Component level locale
const buddhistLocale: typeof en = {
  ...en,
  lang: {
    ...en.lang,
    fieldDateFormat: 'BBBB-MM-DD',
    fieldDateTimeFormat: 'BBBB-MM-DD HH:mm:ss',
    yearFormat: 'BBBB',
    cellYearFormat: 'BBBB',
  },
};

// ConfigProvider level locale
const globalBuddhistLocale: typeof enUS = {
  ...enUS,
  DatePicker: {
    ...enUS.DatePicker!,
    lang: buddhistLocale.lang,
  },
};

const defaultValue = dayjs('2024-01-01');

const App: React.FC = () => {
  const onChange: DatePickerProps['onChange'] = (_, dateStr) => {
    console.log('onChange:', dateStr);
  };

  return (
    <Space vertical>
      <Title level={4}>By locale props</Title>
      <DatePicker defaultValue={defaultValue} locale={buddhistLocale} onChange={onChange} />
      <DatePicker
        defaultValue={defaultValue}
        showTime
        locale={buddhistLocale}
        onChange={onChange}
      />

      <Title level={4}>By ConfigProvider</Title>
      <ConfigProvider locale={globalBuddhistLocale}>
        <Space vertical>
          <DatePicker defaultValue={defaultValue} onChange={onChange} />
          <DatePicker defaultValue={defaultValue} showTime onChange={onChange} />
        </Space>
      </ConfigProvider>
    </Space>
  );
};

export default App;
