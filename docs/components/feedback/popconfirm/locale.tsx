'use client';

import React from 'react';
import { Button, Popconfirm } from '@ceebee/ui/client';

const App: React.FC = () => (
  <Popconfirm
    title="Delete the task"
    description="Are you sure to delete this task?"
    okText="Yes"
    cancelText="No"
  >
    <Button danger>Delete</Button>
  </Popconfirm>
);

export default App;
