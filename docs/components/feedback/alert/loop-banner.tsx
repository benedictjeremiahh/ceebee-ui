'use client';

import React from 'react';
import { Alert } from '@ceebee/ui/client';
import Marquee from 'react-fast-marquee';

const App: React.FC = () => (
  <Alert
    banner
    title={
      <Marquee pauseOnHover gradient={false}>
        I can be a React component, multiple React components, or just some text.
      </Marquee>
    }
  />
);

export default App;
