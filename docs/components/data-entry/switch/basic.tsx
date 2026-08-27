'use client';

import React from 'react';
import { Switch } from '@ceebee/ui/client';

const onChange = (checked: boolean) => {
  console.log(`switch to ${checked}`);
};

const App: React.FC = () => <Switch defaultChecked onChange={onChange} />;

export default App;
