'use client';

import React from 'react';
import { Switch } from '@ceebee/ui/client';

const App: React.FC = () => (
  <>
    <Switch defaultChecked />
    <br />
    <Switch size="small" defaultChecked />
  </>
);

export default App;
