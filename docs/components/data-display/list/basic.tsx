'use client';

import React from 'react';
import { Avatar, List } from '@ceebee/ui/client';

const data = [
  {
    title: 'Ceebee UI Title 1',
  },
  {
    title: 'Ceebee UI Title 2',
  },
  {
    title: 'Ceebee UI Title 3',
  },
  {
    title: 'Ceebee UI Title 4',
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
      </List.Item>
    )}
  />
);

export default App;
