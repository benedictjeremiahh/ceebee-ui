'use client';

import React from 'react';
import { QRCode, Space } from '@ceebee/ui/client';

const App: React.FC = () => (
  <Space>
    <QRCode type="canvas" value="https://ceebee.dev/" />
    <QRCode type="svg" value="https://ceebee.dev/" />
  </Space>
);

export default App;
