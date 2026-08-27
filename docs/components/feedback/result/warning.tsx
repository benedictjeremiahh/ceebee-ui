'use client';

import React from 'react';
import { Button, Result } from '@ceebee/ui/client';

const App: React.FC = () => (
  <Result
    status="warning"
    title="There are some problems with your operation."
    extra={
      <Button type="primary" key="console">
        Go Console
      </Button>
    }
  />
);

export default App;
