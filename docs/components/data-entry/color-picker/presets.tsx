'use client';

import React from 'react';
import { generate, green, presetPalettes, red } from '@ant-design/colors';
import { ColorPicker, theme } from '@ceebee/ui/client';
import type { ColorPickerProps } from '@ceebee/ui/client';

type Presets = Required<ColorPickerProps>['presets'][number];

function genPresets(presets = presetPalettes) {
  return Object.entries(presets).map<Presets>(([label, colors]) => ({ label, colors, key: label }));
}

const Demo: React.FC = () => {
  const { token } = theme.useToken();
  const presets = genPresets({ primary: generate(token.colorPrimary), red, green });
  return <ColorPicker presets={presets} defaultValue="#1677ff" />;
};

export default Demo;
