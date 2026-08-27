'use client';

import React, { useState } from 'react';
import type { QRCodeProps } from '@ceebee/ui/client';
import { QRCode, Segmented } from '@ceebee/ui/client';

const App: React.FC = () => {
  const [level, setLevel] = useState<QRCodeProps['errorLevel']>('L');
  return (
    <>
      <QRCode
        style={{ marginBottom: 16 }}
        errorLevel={level}
        value="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
      />
      <Segmented options={['L', 'M', 'Q', 'H']} value={level} onChange={setLevel} />
    </>
  );
};

export default App;
