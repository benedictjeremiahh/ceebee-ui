'use client';

import React from 'react';
import { Typography } from '@ceebee/ui/client';

const { Title } = Typography;

const App: React.FC = () => (
  <>
    <Title>h1. Ceebee UI</Title>
    <Title level={2}>h2. Ceebee UI</Title>
    <Title level={3}>h3. Ceebee UI</Title>
    <Title level={4}>h4. Ceebee UI</Title>
    <Title level={5}>h5. Ceebee UI</Title>
  </>
);

export default App;

