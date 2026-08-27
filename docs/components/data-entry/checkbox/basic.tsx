'use client';

import React from 'react';
import { Checkbox } from '@ceebee/ui/client';
import type { CheckboxProps } from '@ceebee/ui/client';

const onChange: CheckboxProps['onChange'] = (e) => {
  console.log(`checked = ${e.target.checked}`);
};

const App: React.FC = () => <Checkbox onChange={onChange}>Checkbox</Checkbox>;

export default App;
