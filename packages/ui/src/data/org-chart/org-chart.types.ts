import type { ReactNode } from 'react';

export interface OrgChartNode {
  id: string;
  name: string;
  description?: ReactNode;
  children?: OrgChartNode[];
}

export interface OrgChartProps {
  nodes: OrgChartNode[];
  label: string;
  loadingLabel?: string;
  getCountLabel?: (count: number) => string;
  getToggleLabel?: (node: OrgChartNode, expanded: boolean) => string;
}
