'use client';

import React from 'react';
import { Button, Result } from '@ceebee/ui/client';

const App: React.FC = () => (
  <Result
    status="500"
    title="500"
    subTitle="Sorry, something went wrong."
    extra={<Button type="primary">Back Home</Button>}
  />
);

export default App;
