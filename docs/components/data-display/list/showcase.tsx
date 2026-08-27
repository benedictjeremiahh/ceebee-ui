'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import ListSimple from './simple';
import ListBasic from './basic';
import ListLoadmore from './loadmore';
import ListVertical from './vertical';
import ListPagination from './pagination';
import ListGrid from './grid';
import ListResponsive from './responsive';
import ListInfiniteLoad from './infinite-load';
import ListDragSorting from './drag-sorting';
import ListDragSortingHandler from './drag-sorting-handler';
import ListGridDragSorting from './grid-drag-sorting';
import ListGridDragSortingHandler from './grid-drag-sorting-handler';
import ListVirtualList from './virtual-list';

const demos: OfficialDemo[] = [
  { file: "simple", title: "Simple list", description: "Ceebee UI supports a default list size as well as a large and small size. If a large or small list is desired, set the size property to either large or small respectively. Omit the size property for a list with the default size. Customizing the header and footer of list by setting header and footer property.", Component: ListSimple },
  { file: "basic", title: "Basic list", description: "Basic list.", Component: ListBasic },
  { file: "loadmore", title: "Load more", description: "Load more list with loadMore property.", Component: ListLoadmore },
  { file: "vertical", title: "Vertical", description: "Set the itemLayout property to vertical to create a vertical list.", Component: ListVertical },
  { file: "pagination", title: "Pagination Settings", description: "List pagination can be used and set through the pagination property.", Component: ListPagination },
  { file: "grid", title: "Grid", description: "Create a grid layout by setting the grid property of List.", Component: ListGrid },
  { file: "responsive", title: "Responsive grid list", description: "Responsive grid list. The size property the is as same as Layout Grid.", Component: ListResponsive },
  { file: "infinite-load", title: "Scrolling loaded", description: "The example of infinite load with react-infinite-scroll-component.", Component: ListInfiniteLoad },
  { file: "drag-sorting", title: "Drag sorting", description: "By using components, we can integrate List with dnd-kit to implement drag sorting function.", Component: ListDragSorting },
  { file: "drag-sorting-handler", title: "Drag sorting with handler", description: "Alternatively you can implement drag sorting with handler using dnd-kit.", Component: ListDragSortingHandler },
  { file: "grid-drag-sorting", title: "Grid Drag sorting", description: "By using custom components, we can integrate List with dnd-kit to implement drag sorting function for grid layout.", Component: ListGridDragSorting },
  { file: "grid-drag-sorting-handler", title: "Grid Drag sorting with handler", description: "By using custom components and drag handles, we can integrate List with dnd-kit to implement drag sorting function for grid layout.", Component: ListGridDragSortingHandler },
  { file: "virtual-list", title: "virtual list", description: "An example of infinite & virtualized list via using @rc-component/virtual-list.", Component: ListVirtualList },
];

export function ListShowcase() {
  return <Showcase section="data-display" component="list" demos={demos} sources={sources} />;
}
