'use client';

import React, { useState } from 'react';
import { Button, Tooltip } from '@ceebee/ui/client';

const App: React.FC = () => {
  const [disabled, setDisabled] = useState(true);

  return (
    <Tooltip title={disabled ? null : 'prompt text'}>
      <Button onClick={() => setDisabled(!disabled)}>{disabled ? 'Enable' : 'Disable'}</Button>
    </Tooltip>
  );
};

export default App;
