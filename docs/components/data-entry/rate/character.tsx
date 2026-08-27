'use client';

import React from 'react';
import { HeartOutlined } from '@ant-design/icons';
import { Flex, Rate } from '@ceebee/ui/client';

const App: React.FC = () => (
  <Flex vertical gap="medium">
    <Rate character={<HeartOutlined />} allowHalf />
    <Rate character="A" allowHalf style={{ fontSize: 36 }} />
    <Rate character="★" allowHalf />
  </Flex>
);

export default App;
