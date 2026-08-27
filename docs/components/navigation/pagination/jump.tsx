'use client';

import React from 'react';
import type { PaginationProps } from '@ceebee/ui/client';
import { Pagination } from '@ceebee/ui/client';

const onChange: PaginationProps['onChange'] = (pageNumber) => {
  console.log('Page: ', pageNumber);
};

const App: React.FC = () => (
  <>
    <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={onChange} />
    <br />
    <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={onChange} disabled />
  </>
);

export default App;

