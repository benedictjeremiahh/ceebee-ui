'use client';

import React from 'react';
import { Select } from '@ceebee/ui/client';
import type { SelectProps } from '@ceebee/ui/client';

type LabelRender = SelectProps['labelRender'];

const options = [
  { label: 'gold', value: 'gold' },
  { label: 'lime', value: 'lime' },
  { label: 'green', value: 'green' },
  { label: 'cyan', value: 'cyan' },
];

const labelRender: LabelRender = (props) => {
  const { label, value } = props;

  if (label) {
    return value;
  }
  return <span>No option match</span>;
};

const App: React.FC = () => (
  <Select labelRender={labelRender} defaultValue="1" style={{ width: '100%' }} options={options} />
);

export default App;
