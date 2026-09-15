import type { ReactNode } from 'react';
import type { Tone } from '../../lib/cn.js';

export interface DiagramPosition {
  x: number;
  y: number;
}

export type DiagramShape = 'rect' | 'pill' | 'diamond';

export interface DiagramNode {
  id: string;
  label: string;
  /** Grid cells from the diagram's origin. The caller owns and stores positions. */
  position: DiagramPosition;
  shape?: DiagramShape;
  tone?: Tone;
  /** Static supplementary content under the label. It must not be interactive. */
  content?: ReactNode;
}

export interface DiagramEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  tone?: Tone;
}

/** What a node carries into the React Flow renderer. Internal; the public shape is `DiagramNode`. */
export interface DiagramFlowNodeData extends Record<string, unknown> {
  label: string;
  content?: ReactNode;
  shape: DiagramShape;
  tone?: Tone;
  connecting: boolean;
  connectable: boolean;
}
