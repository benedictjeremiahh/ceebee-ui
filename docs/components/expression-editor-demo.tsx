"use client";
import { useState } from 'react';
import { ExpressionEditor } from '@ceebee/ui/client';

export function ExpressionEditorDemo() {
  const [value, setValue] = useState('length * width * 0.5');
  return <ExpressionEditor label="Expression" value={value} onChange={setValue} variables={['length', 'width']} constants={['pi']} maxLength={500} />;
}
