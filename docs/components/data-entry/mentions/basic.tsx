'use client';

import React from 'react';
import { Mentions } from '@ceebee/ui/client';
import type { GetProp, MentionProps } from '@ceebee/ui/client';

type MentionsOptionProps = GetProp<MentionProps, 'options'>[number];

const onChange = (value: string) => {
  console.log('Change:', value);
};

const onSelect = (option: MentionsOptionProps) => {
  console.log('select', option);
};

const App: React.FC = () => (
  <Mentions
    style={{ width: '100%' }}
    onChange={onChange}
    onSelect={onSelect}
    defaultValue="@afc163"
    options={[
      {
        value: 'afc163',
        label: 'afc163',
      },
      {
        value: 'zombieJ',
        label: 'zombieJ',
      },
      {
        value: 'yesmeck',
        label: 'yesmeck',
      },
    ]}
  />
);

export default App;
