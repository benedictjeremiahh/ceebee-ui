'use client';

import React from 'react';
import { Watermark } from '@ceebee/ui/client';

const App: React.FC = () => (
  <Watermark content="Ceebee UI">
    <div style={{ height: 500 }} />
  </Watermark>
);

export default App;
