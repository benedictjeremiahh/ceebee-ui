'use client';

import React from 'react';
import { Space, Typography } from '@ceebee/ui/client';

const { Text, Link } = Typography;

const App: React.FC = () => (
  <Space vertical>
    <Text>Ceebee UI (default)</Text>
    <Text type="secondary">Ceebee UI (secondary)</Text>
    <Text type="success">Ceebee UI (success)</Text>
    <Text type="warning">Ceebee UI (warning)</Text>
    <Text type="danger">Ceebee UI (danger)</Text>
    <Text disabled>Ceebee UI (disabled)</Text>
    <Text mark>Ceebee UI (mark)</Text>
    <Text code>Ceebee UI (code)</Text>
    <Text keyboard>Ceebee UI (keyboard)</Text>
    <Text underline>Ceebee UI (underline)</Text>
    <Text delete>Ceebee UI (delete)</Text>
    <Text strong>Ceebee UI (strong)</Text>
    <Text italic>Ceebee UI (italic)</Text>
    <Link href="https://ceebee.dev" target="_blank">
      Ceebee UI (Link)
    </Link>
  </Space>
);

export default App;

