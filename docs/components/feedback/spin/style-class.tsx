'use client';

import React from 'react';
import { Flex, Spin } from '@ceebee/ui/client';
import type { GetProp, SpinProps } from '@ceebee/ui/client';
import { createStaticStyles } from 'antd-style';

const classNames = createStaticStyles(({ css }) => ({
  root: css`
    padding: 8px;
  `,
}));

const stylesObject: SpinProps['styles'] = {
  indicator: {
    color: '#00d4ff',
  },
};

const stylesFn: SpinProps['styles'] = ({ props }): GetProp<SpinProps, 'styles', 'Return'> => {
  if (props.size === 'small') {
    return {
      indicator: {
        color: '#722ed1',
      },
    };
  }
  return {};
};

const App: React.FC = () => {
  const sharedProps: SpinProps = {
    spinning: true,
    percent: 0,
    classNames: { root: classNames.root },
  };

  return (
    <Flex align="center" gap="medium">
      <Spin {...sharedProps} styles={stylesObject} />
      <Spin {...sharedProps} styles={stylesFn} size="small" />
    </Flex>
  );
};

export default App;
