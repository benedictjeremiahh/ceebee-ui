'use client';

import React from 'react';
import { Switch } from '@ceebee/ui/client';

const App: React.FC = () => (
  <>
    <Switch loading defaultChecked />
    <br />
    <Switch size="small" loading />
  </>
);

export default App;
