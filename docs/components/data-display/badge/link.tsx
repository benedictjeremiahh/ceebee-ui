'use client';

import React from 'react';
import { Avatar, Badge } from '@ceebee/ui/client';

const App: React.FC = () => (
  <a href="#">
    <Badge count={5}>
      <Avatar shape="square" size="large" />
    </Badge>
  </a>
);

export default App;
