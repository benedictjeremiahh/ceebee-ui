'use client';

import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from '@ceebee/ui/client';
import { Dropdown, Space } from '@ceebee/ui/client';

const items: MenuProps['items'] = [
  {
    label: (
      <a href="https://ceebee.dev" target="_blank" rel="noopener noreferrer">
        1st menu item
      </a>
    ),
    key: '0',
  },
  {
    label: (
      <a href="https://ceebee.dev/docs" target="_blank" rel="noopener noreferrer">
        2nd menu item
      </a>
    ),
    key: '1',
  },
  {
    type: 'divider',
  },
  {
    label: '3rd menu item',
    key: '3',
  },
];

const App: React.FC = () => (
  <Dropdown menu={{ items }} trigger={['click']}>
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        Click me
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
);

export default App;

