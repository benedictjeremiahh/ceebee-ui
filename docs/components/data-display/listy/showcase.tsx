'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import ListyBasic from './basic';
import ListyVirtual from './virtual';
import ListyGroup from './group';
import ListyRich from './rich';
import ListyDragSorting from './drag-sorting';
import ListyInfinite from './infinite';
import ListyStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "Basic example.", Component: ListyBasic },
  { file: "virtual", title: "Virtual scrolling", description: "A long list of 10,000 rows. Set virtual and height to enable virtual scrolling, so only the rows in view are rendered.", Component: ListyVirtual },
  { file: "group", title: "Grouping and sticky headers", description: "Use group to derive a group key from each item and render group headers. With sticky enabled, the current group header sticks to the top while scrolling.", Component: ListyGroup },
  { file: "rich", title: "Rich content", description: "itemRender can render arbitrarily rich content, and rows do not need the same height.", Component: ListyRich },
  { file: "drag-sorting", title: "Drag sorting", description: "Implement drag sorting for list items by integrating the third-party library dnd-kit.", Component: ListyDragSorting },
  { file: "infinite", title: "Infinite loading", description: "Detect in onScroll that the list is about to reach the bottom, then load the next page on demand for endless scrolling. Combined with virtual, only the rows in view are rendered no matter how much data piles up.", Component: ListyInfinite },
  { file: "style-class", title: "Custom semantic dom styling", description: "Customize the semantic DOM styles of Listy with classNames and styles.", Component: ListyStyleClass },
];

export function ListyShowcase() {
  return <Showcase section="data-display" component="listy" demos={demos} sources={sources} />;
}
