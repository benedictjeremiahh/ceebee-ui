'use client';

import React from 'react';
import { Input, QRCode, Space } from '@ceebee/ui/client';

const App: React.FC = () => {
  const [text, setText] = React.useState('https://ceebee.dev/');

  return (
    <Space vertical align="center">
      <QRCode value={text || '-'} />
      <Input
        placeholder="-"
        maxLength={60}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </Space>
  );
};

export default App;
