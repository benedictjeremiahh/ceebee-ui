'use client';

import React from 'react';
import { QRCode } from '@ceebee/ui/client';

const App: React.FC = () => (
  <QRCode
    errorLevel="H"
    value="https://ceebee.dev/"
    icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
  />
);

export default App;
