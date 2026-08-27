'use client';

import React from 'react';
import { Segmented } from '@ceebee/ui/client';

const Demo: React.FC = () => (
  <Segmented<string> options={['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']} name="group" />
);

export default Demo;
