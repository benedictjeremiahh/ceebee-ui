'use client';

import React from 'react';
import { Button, Popover, QRCode } from '@ceebee/ui/client';

const App: React.FC = () => (
  <Popover content={<QRCode value="https://ceebee.dev" bordered={false} />}>
    <Button type="primary">Hover me</Button>
  </Popover>
);

export default App;
