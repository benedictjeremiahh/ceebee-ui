'use client';

import React from 'react';
import type { SliderSingleProps } from '@ceebee/ui/client';
import { Slider } from '@ceebee/ui/client';

const formatter: NonNullable<SliderSingleProps['tooltip']>['formatter'] = (value) => `${value}%`;

const App: React.FC = () => (
  <>
    <Slider tooltip={{ formatter }} />
    <Slider tooltip={{ formatter: null }} />
  </>
);

export default App;
