'use client';

import React, { useState } from 'react';
import type { PaginationProps } from '@ceebee/ui/client';
import { Pagination } from '@ceebee/ui/client';

const App: React.FC = () => {
  const [current, setCurrent] = useState(3);

  const onChange: PaginationProps['onChange'] = (page) => {
    console.log(page);
    setCurrent(page);
  };

  return <Pagination current={current} onChange={onChange} total={50} />;
};

export default App;

