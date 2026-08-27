'use client';

import React from 'react';
import { Pagination } from '@ceebee/ui/client';

const App: React.FC = () => (
  <Pagination
    total={85}
    showSizeChanger
    showQuickJumper
    showTotal={(total) => `Total ${total} items`}
  />
);

export default App;

