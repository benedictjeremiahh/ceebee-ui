'use client';

import { StyleProvider } from '@ant-design/cssinjs';
import type { ReactNode } from 'react';

import type { CeebeeAntStyleCache } from './ant-style-cache.js';

export interface CeebeeAntStyleProviderProps {
  cache: CeebeeAntStyleCache;
  children: ReactNode;
}

/** Binds Ant rendering to the cache owned by the consumer's framework adapter. */
export function CeebeeAntStyleProvider({ cache, children }: CeebeeAntStyleProviderProps) {
  return <StyleProvider cache={cache}>{children}</StyleProvider>;
}
