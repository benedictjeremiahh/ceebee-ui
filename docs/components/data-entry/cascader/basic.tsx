'use client';

import React from 'react';
import type { CascaderProps } from '@ceebee/ui/client';
import { Cascader } from '@ceebee/ui/client';

// This type is not part of the published surface upstream. Restating it here keeps the demo on the
// public entry without changing what the options carry.
type HTMLAriaDataAttributes = React.AriaAttributes & {
  [key: `data-${string}`]: unknown;
} & Pick<React.HTMLAttributes<HTMLDivElement>, 'role'>;

type Option = {
  value: string;
  label: string;
  children?: Option[];
} & HTMLAriaDataAttributes;

const options: Option[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    'aria-label': 'Zhejiang',
    'data-title': 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        'aria-label': 'Hangzhou',
        'data-title': 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
            'aria-label': 'West Lake',
            'data-title': 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    'aria-label': 'Jiangsu',
    'data-title': 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        'aria-label': 'Nanjing',
        'data-title': 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
            'aria-label': 'Zhong Hua Men',
            'data-title': 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const onChange: CascaderProps<Option>['onChange'] = (value) => {
  console.log(value);
};

const App: React.FC = () => (
  <Cascader options={options} onChange={onChange} placeholder="Please select" />
);

export default App;
