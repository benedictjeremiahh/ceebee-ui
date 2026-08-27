'use client';

import React from 'react';
import { Button, Card, Flex, Typography } from '@ceebee/ui/client';

const cardStyle: React.CSSProperties = {
  width: 620,
};

const imgStyle: React.CSSProperties = {
  display: 'block',
  width: 273,
};

const App: React.FC = () => (
  <Card hoverable style={cardStyle} styles={{ body: { padding: 0, overflow: 'hidden' } }}>
    <Flex justify="space-between">
      <img
        draggable={false}
        alt="avatar"
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        style={imgStyle}
      />
      <Flex vertical align="flex-end" justify="space-between" style={{ padding: 32 }}>
        <Typography.Title level={3}>
          “Ceebee UI is an enterprise-class design language and React component library.”
        </Typography.Title>
        <Button type="primary" href="https://ceebee.dev" target="_blank">
          Get Started
        </Button>
      </Flex>
    </Flex>
  </Card>
);

export default App;

