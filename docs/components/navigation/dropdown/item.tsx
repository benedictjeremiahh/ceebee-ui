'use client';

import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from '@ceebee/ui/client';
import { Dropdown, Space } from '@ceebee/ui/client';

const items: MenuProps['items'] = [
  {
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://ceebee.dev">
        1st menu item
      </a>
    ),
    key: '0',
  },
  {
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://ceebee.dev/docs">
        2nd menu item
      </a>
    ),
    key: '1',
  },
  {
    type: 'divider',
  },
  {
    label: '3rd menu item (disabled)',
    key: '3',
    disabled: true,
  },
];

const App: React.FC = () => (
  <Dropdown menu={{ items }}>
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        Hover me
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
);

export default App;

