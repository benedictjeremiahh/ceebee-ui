'use client';

import React from 'react';
import { Segmented } from '@ceebee/ui/client';

const Demo: React.FC = () => (
  <Segmented<string | number> options={[123, 456, 'longtext-longtext-longtext-longtext']} block />
);

export default Demo;
