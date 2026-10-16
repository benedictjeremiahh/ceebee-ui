'use client';

import { Tree, TreeNode } from 'react-organizational-chart';
import { Button } from '../../form/button.js';
import type { OrgChartNode } from './org-chart.types.js';

interface OrgChartTreeProps {
  nodes: OrgChartNode[];
  collapsedIds: ReadonlySet<string>;
  onToggle: (id: string) => void;
  getCountLabel: (count: number) => string;
  getToggleLabel: (node: OrgChartNode, expanded: boolean) => string;
}

function PersonCard({ node, expanded, onToggle, getCountLabel, getToggleLabel }: {
  node: OrgChartNode;
  expanded: boolean;
  onToggle: (id: string) => void;
  getCountLabel: (count: number) => string;
  getToggleLabel: (node: OrgChartNode, expanded: boolean) => string;
}) {
  const reportCount = node.children?.length ?? 0;
  return <article className="cb-org-chart__person">
    <strong className="cb-org-chart__name">{node.name}</strong>
    {node.description ? <div className="cb-org-chart__description">{node.description}</div> : null}
    {reportCount > 0 ? <Button className="cb-org-chart__toggle" htmlType="button"
      aria-expanded={expanded} aria-label={getToggleLabel(node, expanded)} onClick={() => onToggle(node.id)}>
      {getCountLabel(reportCount)}
    </Button> : null}
  </article>;
}

function Descendants({ nodes, collapsedIds, onToggle, getCountLabel, getToggleLabel }: OrgChartTreeProps) {
  return <>{nodes.map((node) => {
    const expanded = !collapsedIds.has(node.id);
    const children = expanded && node.children?.length ? <Descendants nodes={node.children}
      collapsedIds={collapsedIds} onToggle={onToggle} getCountLabel={getCountLabel}
      getToggleLabel={getToggleLabel} /> : undefined;
    return <TreeNode key={node.id} label={<PersonCard node={node} expanded={expanded}
      onToggle={onToggle} getCountLabel={getCountLabel} getToggleLabel={getToggleLabel} />}>
      {children}
    </TreeNode>;
  })}</>;
}

export function OrgChartTree(props: OrgChartTreeProps) {
  return <div className="cb-org-chart__trees">{props.nodes.map((node) => {
    const expanded = !props.collapsedIds.has(node.id);
    const children = expanded && node.children?.length ? <Descendants
      nodes={node.children} collapsedIds={props.collapsedIds} onToggle={props.onToggle}
      getCountLabel={props.getCountLabel} getToggleLabel={props.getToggleLabel} /> : undefined;
    return <Tree key={node.id} label={<PersonCard node={node} expanded={expanded}
      onToggle={props.onToggle} getCountLabel={props.getCountLabel} getToggleLabel={props.getToggleLabel} />}
      lineHeight="var(--cb-space-6)" lineWidth="var(--cb-border-width)"
      lineColor="var(--cb-border-strong)" lineBorderRadius="var(--cb-radius-sm)"
      nodePadding="var(--cb-space-4)">
      {children}
    </Tree>;
  })}</div>;
}
