'use client';

import React from 'react';
import { Affix, Button } from '@ceebee/ui/client';

const App: React.FC = () => (
  <Affix offsetTop={120} onChange={(affixed) => console.log(affixed)}>
    <Button>120px to affix top</Button>
  </Affix>
);

export default App;
