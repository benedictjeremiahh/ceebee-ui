'use client';

import React from 'react';
import { DatePicker, Flex } from '@ceebee/ui/client';
import type { DatePickerProps, GetProp } from '@ceebee/ui/client';
import { createStyles } from 'antd-style';
import type { Dayjs } from 'dayjs';

const useStyles = createStyles(({ token }) => ({
  root: {
    border: `${token.lineWidth}px ${token.lineType} ${token.colorPrimary}`,
    width: 200,
  },
}));

const stylesObject: DatePickerProps<Dayjs>['styles'] = {
  input: { fontStyle: 'italic' },
  suffix: { opacity: 0.85 },
};

const stylesFn: DatePickerProps<Dayjs>['styles'] = (
  info,
): GetProp<DatePickerProps<Dayjs>, 'styles', 'Return'> => {
  if (info.props.size === 'large') {
    return {
      root: { borderColor: '#722ed1' },
      popup: {
        container: { border: '1px solid #722ed1', borderRadius: 8 },
      },
    };
  }
  return {};
};

const App: React.FC = () => {
  const { styles: classNames } = useStyles();
  return (
    <Flex vertical gap="medium">
      <DatePicker classNames={classNames} styles={stylesObject} placeholder="Object" />
      <DatePicker classNames={classNames} styles={stylesFn} placeholder="Function" size="large" />
    </Flex>
  );
};

export default App;
