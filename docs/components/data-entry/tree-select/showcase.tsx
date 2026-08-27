'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import TreeSelectBasic from './basic';
import TreeSelectMultiple from './multiple';
import TreeSelectTreeData from './treeData';
import TreeSelectCheckable from './checkable';
import TreeSelectAsync from './async';
import TreeSelectTreeLine from './treeLine';
import TreeSelectPlacement from './placement';
import TreeSelectVariant from './variant';
import TreeSelectStatus from './status';
import TreeSelectMaxCount from './maxCount';
import TreeSelectSuffix from './suffix';
import TreeSelectStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "The most basic usage.", Component: TreeSelectBasic },
  { file: "multiple", title: "Multiple Selection", description: "Multiple selection usage.", Component: TreeSelectMultiple },
  { file: "treeData", title: "Generate from tree data", description: "The tree structure can be populated using treeData property. This is a quick and easy way to provide the tree content.", Component: TreeSelectTreeData },
  { file: "checkable", title: "Checkable", description: "Multiple and checkable.", Component: TreeSelectCheckable },
  { file: "async", title: "Asynchronous loading", description: "Asynchronous loading tree node.", Component: TreeSelectAsync },
  { file: "treeLine", title: "Show Tree Line", description: "Use treeLine to show the line style.", Component: TreeSelectTreeLine },
  { file: "placement", title: "Placement", description: "You can manually specify the position of the popup via placement.", Component: TreeSelectPlacement },
  { file: "variant", title: "Variants", description: "Variants of TreeSelect, there are four variants: outlined filled borderless and underlined.", Component: TreeSelectVariant },
  { file: "status", title: "Status", description: "Add status to TreeSelect with status, which could be error or warning.", Component: TreeSelectStatus },
  { file: "maxCount", title: "Max Count", description: "You can set the maxCount prop to control the max number of items can be selected. When the limit is exceeded, the options will become disabled.", Component: TreeSelectMaxCount },
  { file: "suffix", title: "Prefix and Suffix", description: "Custom prefix and suffixIcon.", Component: TreeSelectSuffix },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of TreeSelect by passing objects/functions through classNames and styles.", Component: TreeSelectStyleClass },
];

export function TreeSelectShowcase() {
  return <Showcase section="data-entry" component="tree-select" demos={demos} sources={sources} cols={2} />;
}
