"use client";

import { OrgChart, type OrgChartNode } from '@ceebee/ui/client';
import { Demo } from './demo';

const nodes: OrgChartNode[] = [{
  id: 'director', name: 'Morgan Chen', description: 'Director', children: [
    { id: 'engineering', name: 'Avery Patel', description: 'Engineering', children: [
      { id: 'developer', name: 'Jordan Williams', description: 'Developer' },
    ] },
    { id: 'operations', name: 'Sam Rivera', description: 'Operations' },
  ],
}];

export function OrgChartDemo() {
  return <Demo layout="block" code={`const nodes = [{
  id: 'director', name: 'Morgan Chen', description: 'Director', children: [
    { id: 'engineering', name: 'Avery Patel', description: 'Engineering', children: [
      { id: 'developer', name: 'Jordan Williams', description: 'Developer' },
    ] },
    { id: 'operations', name: 'Sam Rivera', description: 'Operations' },
  ],
}];

<OrgChart nodes={nodes} label="Team structure" />`}>
    <OrgChart nodes={nodes} label="Team structure" />
  </Demo>;
}
