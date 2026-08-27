'use client';

import React, { useState } from 'react';
import { ColorPicker, Space } from '@ceebee/ui/client';
import type { ColorPickerProps, GetProp } from '@ceebee/ui/client';

type Color = GetProp<ColorPickerProps, 'value'>;

const Demo: React.FC = () => {
  const [color, setColor] = useState<Color>('#1677ff');

  return (
    <Space>
      <ColorPicker value={color} onChange={setColor} />
      <ColorPicker value={color} onChangeComplete={setColor} />
    </Space>
  );
};

export default Demo;
