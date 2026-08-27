'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import TreeBasic from './basic';
import TreeBasicControlled from './basic-controlled';
import TreeDraggable from './draggable';
import TreeDynamic from './dynamic';
import TreeSearch from './search';
import TreeLine from './line';
import TreeCustomizedIcon from './customized-icon';
import TreeDirectory from './directory';
import TreeSwitcherIcon from './switcher-icon';
import TreeVirtualScroll from './virtual-scroll';
import TreeScrollTo from './scroll-to';
import TreeBlockNode from './block-node';
import TreeStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "The most basic usage, tell you how to use checkable, selectable, disabled, defaultExpandKeys, and etc.", Component: TreeBasic },
  { file: "basic-controlled", title: "Controlled Tree", description: "Controlled mode lets parent nodes reflect the status of child nodes more intelligently.", Component: TreeBasicControlled },
  { file: "draggable", title: "draggable", description: "Drag treeNode to insert after the other treeNode or insert into the other parent TreeNode.", Component: TreeDraggable },
  { file: "dynamic", title: "load data asynchronously", description: "To load data asynchronously when click to expand a treeNode.", Component: TreeDynamic },
  { file: "search", title: "Searchable", description: "Searchable Tree.", Component: TreeSearch },
  { file: "line", title: "Tree with line", description: "Tree with connected line between nodes, turn on by showLine, customize the preset icon by switcherIcon.", Component: TreeLine },
  { file: "customized-icon", title: "Customize Icon", description: "You can customize icons for different nodes.", Component: TreeCustomizedIcon },
  { file: "directory", title: "directory", description: "Built-in directory tree. multiple support ctrl(Windows) / command(Mac) selection.", Component: TreeDirectory },
  { file: "switcher-icon", title: "Customize collapse/expand icon", description: "customize collapse/expand icon of tree node", Component: TreeSwitcherIcon },
  { file: "virtual-scroll", title: "Virtual scroll", description: "Use virtual list through height prop.", Component: TreeVirtualScroll },
  { file: "scroll-to", title: "Scroll to nested node", description: "In controlled mode, use Tree.useTree to get the node path and update expandedKeys before scrolling to the target node.", Component: TreeScrollTo },
  { file: "block-node", title: "Block Node", description: "", Component: TreeBlockNode },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Tree by passing objects/functions through classNames and styles.", Component: TreeStyleClass },
];

export function TreeShowcase() {
  return <Showcase section="data-display" component="tree" demos={demos} sources={sources} cols={2} />;
}
