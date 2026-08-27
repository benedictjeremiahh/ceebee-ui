'use client';

import React, { useState } from 'react';
import { Avatar, List, Radio, Space } from '@ceebee/ui/client';

type PaginationPosition = 'top' | 'bottom' | 'both';

type PaginationAlign = 'start' | 'center' | 'end';

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

const positionOptions = ['top', 'bottom', 'both'];

const alignOptions = ['start', 'center', 'end'];

const App: React.FC = () => {
  const [position, setPosition] = useState<PaginationPosition>('bottom');
  const [align, setAlign] = useState<PaginationAlign>('center');

  return (
    <>
      <Space vertical style={{ marginBottom: '20px' }} size="medium">
        <Space>
          <span>Pagination Position:</span>
          <Radio.Group
            optionType="button"
            value={position}
            onChange={(e) => {
              setPosition(e.target.value);
            }}
          >
            {positionOptions.map((item) => (
              <Radio.Button key={item} value={item}>
                {item}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Space>
        <Space>
          <span>Pagination Align:</span>
          <Radio.Group
            optionType="button"
            value={align}
            onChange={(e) => {
              setAlign(e.target.value);
            }}
          >
            {alignOptions.map((item) => (
              <Radio.Button key={item} value={item}>
                {item}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Space>
      </Space>
      <List
        pagination={{ position, align }}
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
    </>
  );
};

export default App;
