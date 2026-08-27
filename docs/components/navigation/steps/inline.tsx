'use client';

import React from 'react';
import type { StepsProps } from '@ceebee/ui/client';
import { Avatar, List, Steps } from '@ceebee/ui/client';

const data = [
  {
    title: 'Ceebee UI Title 1',
    current: 0,
  },
  {
    title: 'Ceebee UI Title 2',
    current: 1,
    status: 'error',
  },
  {
    title: 'Ceebee UI Title 3',
    current: 2,
  },
  {
    title: 'Ceebee UI Title 4',
    current: 1,
  },
];

const items = [
  {
    title: 'Step 1',
    content: 'This is Step 1',
  },
  {
    title: 'Step 2',
    content: 'This is Step 2',
  },
  {
    title: 'Step 3',
    content: 'This is Step 3',
  },
];

const App: React.FC = () => (
  <List
    itemLayout="horizontal"
    dataSource={data}
    renderItem={(item, index) => (
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar src={`https://api.dicebear.com/10.x/lorelei/svg?seed=${index}`} />}
          title={<a href="https://ceebee.dev">{item.title}</a>}
          description="Ceebee UI, a design language for background applications, is refined by the Ceebee team"
        />
        <Steps
          style={{ marginTop: 8 }}
          type="inline"
          current={item.current}
          status={item.status as StepsProps['status']}
          items={items}
        />
      </List.Item>
    )}
  />
);

export default App;

