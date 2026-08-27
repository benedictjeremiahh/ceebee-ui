'use client';

import React from 'react';
import { QRCode, Space, theme } from '@ceebee/ui/client';

const { useToken } = theme;

const App: React.FC = () => {
  const { token } = useToken();
  return (
    <Space>
      <QRCode value="https://ceebee.dev/" color={token.colorSuccessText} />
      <QRCode
        value="https://ceebee.dev/"
        color={token.colorInfoText}
        bgColor={token.colorBgLayout}
      />
    </Space>
  );
};

export default App;
