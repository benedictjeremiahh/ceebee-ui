'use client';

import React from 'react';
import { SmileOutlined } from '@ant-design/icons';
import { Button, Result } from '@ceebee/ui/client';

const App: React.FC = () => (
  <Result
    icon={<SmileOutlined />}
    title="Great, we have done all the operations!"
    extra={<Button type="primary">Next</Button>}
  />
);

export default App;
