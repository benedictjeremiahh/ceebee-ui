'use client';

import React from 'react';
import { Steps } from '@ceebee/ui/client';

const content = 'This is a content';
const items = [
  {
    title: 'Finished',
    content,
  },
  {
    title: 'In Process',
    content,
  },
  {
    title: 'Waiting',
    content,
  },
];

const App: React.FC = () => <Steps current={1} status="error" items={items} />;

export default App;

