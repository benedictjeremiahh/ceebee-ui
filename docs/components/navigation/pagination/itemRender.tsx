'use client';

import React from 'react';
import type { PaginationProps } from '@ceebee/ui/client';
import { Pagination } from '@ceebee/ui/client';

const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
  if (type === 'prev') {
    return <a>Previous</a>;
  }
  if (type === 'next') {
    return <a>Next</a>;
  }
  return originalElement;
};

const App: React.FC = () => <Pagination total={500} itemRender={itemRender} />;

export default App;

