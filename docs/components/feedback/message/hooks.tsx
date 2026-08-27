'use client';

import React from 'react';
import { Button, message } from '@ceebee/ui/client';

const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const info = () => {
    messageApi.info('Hello, Ceebee UI!');
  };

  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={info}>
        Display normal message
      </Button>
    </>
  );
};

export default App;
