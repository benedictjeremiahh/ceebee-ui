'use client';

import React from 'react';
import { Tooltip } from '@ceebee/ui/client';

const App: React.FC = () => (
  <Tooltip title="prompt text">
    <span>Tooltip will show on mouse enter.</span>
  </Tooltip>
);

export default App;
