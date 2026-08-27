'use client';

import React, { useMemo } from 'react';
import {
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
} from '@ant-design/icons';
import { Button, Divider, notification, Space } from '@ceebee/ui/client';
import type { NotificationArgsProps } from '@ceebee/ui/client';

type NotificationPlacement = NotificationArgsProps['placement'];

const Context = React.createContext({ name: 'Default' });

const App: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (placement: NotificationPlacement) => {
    api.info({
      title: `Notification ${placement}`,
      description: <Context.Consumer>{({ name }) => `Hello, ${name}!`}</Context.Consumer>,
      placement,
    });
  };

  const contextValue = useMemo(() => ({ name: 'Ceebee UI' }), []);

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
      <Space>
        <Button
          type="primary"
          onClick={() => openNotification('topLeft')}
          icon={<RadiusUpleftOutlined />}
        >
          topLeft
        </Button>
        <Button
          type="primary"
          onClick={() => openNotification('topRight')}
          icon={<RadiusUprightOutlined />}
        >
          topRight
        </Button>
      </Space>
      <Divider />
      <Space>
        <Button
          type="primary"
          onClick={() => openNotification('bottomLeft')}
          icon={<RadiusBottomleftOutlined />}
        >
          bottomLeft
        </Button>
        <Button
          type="primary"
          onClick={() => openNotification('bottomRight')}
          icon={<RadiusBottomrightOutlined />}
        >
          bottomRight
        </Button>
      </Space>
    </Context.Provider>
  );
};

export default App;
