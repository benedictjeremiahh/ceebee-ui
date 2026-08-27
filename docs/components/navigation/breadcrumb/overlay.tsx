'use client';

import React from 'react';
import { Breadcrumb } from '@ceebee/ui/client';

const menuItems = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://ceebee.dev/">
        General
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://ceebee.dev/">
        Layout
      </a>
    ),
  },
  {
    key: '3',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
        Navigation
      </a>
    ),
  },
];

const App: React.FC = () => (
  <Breadcrumb
    items={[
      {
        title: 'Ceebee UI',
      },
      {
        title: <a href="">Component</a>,
      },
      {
        title: <a href="">General</a>,
        menu: { items: menuItems },
      },
      {
        title: 'Button',
      },
    ]}
  />
);

export default App;

