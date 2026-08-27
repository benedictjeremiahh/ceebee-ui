'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import TableBasic from './basic';
import TableJsx from './jsx';
import TableRowSelection from './row-selection';
import TableRowSelectionAndOperation from './row-selection-and-operation';
import TableRowSelectionCustom from './row-selection-custom';
import TableHead from './head';
import TableFilterInTree from './filter-in-tree';
import TableFilterSearch from './filter-search';
import TableMultipleSorter from './multiple-sorter';
import TableResetFilter from './reset-filter';
import TableCustomFilterPanel from './custom-filter-panel';
import TableAjax from './ajax';
import TableSize from './size';
import TableBordered from './bordered';
import TableExpand from './expand';
import TableOrderColumn from './order-column';
import TableColspanRowspan from './colspan-rowspan';
import TableTreeData from './tree-data';
import TableFixedHeader from './fixed-header';
import TableAutoHeight from './auto-height';
import TableFixedColumns from './fixed-columns';
import TableFixedGappedColumns from './fixed-gapped-columns';
import TableFixedColumnsHeader from './fixed-columns-header';
import TableHiddenColumns from './hidden-columns';
import TableGroupingColumns from './grouping-columns';
import TableEditCell from './edit-cell';
import TableEditRow from './edit-row';
import TableNestedTable from './nested-table';
import TableDragSorting from './drag-sorting';
import TableDragColumnSorting from './drag-column-sorting';
import TableDragSortingHandler from './drag-sorting-handler';
import TableEllipsis from './ellipsis';
import TableColumnDefaults from './column-defaults';
import TableEllipsisCustomTooltip from './ellipsis-custom-tooltip';
import TableCustomEmpty from './custom-empty';
import TableSummary from './summary';
import TableVirtualList from './virtual-list';
import TableResponsive from './responsive';
import TablePagination from './pagination';
import TableSticky from './sticky';
import TableDynamicSettings from './dynamic-settings';
import TableStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic Usage", description: "Simple table with actions.", Component: TableBasic },
  { file: "jsx", title: "JSX style API", description: "Using JSX style API (introduced in 2.5.0) > Since this is just a syntax sugar for the prop columns, you can't compose Column and ColumnGroup with other Components.", Component: TableJsx },
  { file: "row-selection", title: "selection", description: "Rows can be selectable by making first column as a selectable column. You can use rowSelection.type to set selection type. Default is checkbox. > selection happens when clicking checkbox by default. You can see <https://codesandbox.io/s/000vqw38rl> if you need row-click selection behavior.", Component: TableRowSelection },
  { file: "row-selection-and-operation", title: "Selection and operation", description: "To perform operations and clear selections after selecting some rows, use rowSelection.selectedRowKeys to control selected rows.", Component: TableRowSelectionAndOperation },
  { file: "row-selection-custom", title: "Custom selection", description: "Use rowSelection.selections custom selections, default no select dropdown, show default selections via setting to true.", Component: TableRowSelectionCustom },
  { file: "head", title: "Filter and sorter", description: "Use filters to generate filter menu in columns, onFilter to determine filtered result, and filterMultiple to indicate whether it's multiple or single selection, filterOnClose to specify whether to trigger filter when the filter menu closes. Use defaultFilteredValue to make a column filtered by default. Use sorter to make a column sortable. sorter can be a function of the type sorter: function(rowA, rowB) { ... } for sorting data locally. sortDirections: ['ascend', 'descend'] defines available sort methods for each columns, effective for all columns when set on table props. You can set as ['ascend', 'descend', 'ascend'] to prevent sorter back to default status. Use defaultSortOrder to make a column sorted by default. If a sortOrder or defaultSortOrder is specified with the value ascend or descend, you can access this value from within the function passed to the sorter as explained above. Such a function can take the form: function(a, b, sortOrder) { ... }.", Component: TableHead },
  { file: "filter-in-tree", title: "Filter in Tree", description: "You can use filterMode to change default filter interface, options: menu(default) and tree. > filterSearch is used for making filter dropdown items searchable.", Component: TableFilterInTree },
  { file: "filter-search", title: "Filter search", description: "filterSearch is used to enable search of filter items, and you can set a custom filter method through filterSearch:(input, record) => boolean.", Component: TableFilterSearch },
  { file: "multiple-sorter", title: "Multiple sorter", description: "column.sorter support multiple to config the priority of sort columns. Though sorter.compare to customize compare function. You can also leave it empty to use the interactive only.", Component: TableMultipleSorter },
  { file: "reset-filter", title: "Reset filters and sorters", description: "Control filters and sorters by filteredValue and sortOrder. > 1. Defining filteredValue or sortOrder means that it is in the controlled mode. > 2. Make sure sortOrder is assigned for only one column. > 3. column.key is required.", Component: TableResetFilter },
  { file: "custom-filter-panel", title: "Customized filter panel", description: "Implement a customized column search example via filterDropdown. Add the boolean type parameter closeDropdown to the function clearFilters. Whether to close the filter menu is true by default. Add the boolean type parameter confirm to clear whether to submit the option during filtering. The default is true.", Component: TableCustomFilterPanel },
  { file: "ajax", title: "Ajax", description: "This example shows how to fetch and present data from a remote server, and how to implement filtering and sorting in server side by sending related parameters to server. Setting rowSelection.preserveSelectedRowKeys to keep the key when enable selection. **Note, this example use Mock API that you can look up in Network Console.**", Component: TableAjax },
  { file: "size", title: "size", description: "There are two compacted table sizes: medium and small. The small size is used in Modals only.", Component: TableSize },
  { file: "bordered", title: "border, title and footer", description: "Add border, title and footer for table.", Component: TableBordered },
  { file: "expand", title: "Expandable Row", description: "When there's too much information to show and the table can't display all at once.", Component: TableExpand },
  { file: "order-column", title: "Order Specific Column", description: "You can control the order of the expand and select columns by using Table.EXPAND_COLUMN and Table.SELECTION_COLUMN.", Component: TableOrderColumn },
  { file: "colspan-rowspan", title: "colSpan and rowSpan", description: "Table column title supports colSpan that set in column. Table cell supports colSpan and rowSpan that set in onCell return object. When each of them is set to 0, the cell will not be rendered.", Component: TableColspanRowspan },
  { file: "tree-data", title: "Tree data", description: "Display tree structure data in Table when there is field key children in dataSource, try to customize childrenColumnName property to avoid tree table structure. You can control the indent width by setting indentSize.", Component: TableTreeData },
  { file: "fixed-header", title: "Fixed Header", description: "Display large amounts of data in scrollable view. > Specify width of columns if header and cell do not align properly. If specified width is not working or have gutter between columns, please try to leave one column at least without width to fit fluid layout, or make sure no long word to break table layout.", Component: TableFixedHeader },
  { file: "auto-height", title: "Auto height", description: "Wrap Table to make it always fill the container height automatically.", Component: TableAutoHeight },
  { file: "fixed-columns", title: "Fixed Columns", description: "To fix some columns and scroll inside other columns, and you must set scroll.x meanwhile. > Specify the width of columns if header and cell do not align properly. If specified width is not working or have gutter between columns, please try to leave one column at least without width to fit fluid layout, or make sure no long word to break table layout. > > A fixed value which is greater than table width for scroll.x is recommended. The sum of unfixed columns should not greater than scroll.x. **Note: v4 using sticky to implement fixed effect. IE 11 will downgrade to horizontal scroll.**", Component: TableFixedColumns },
  { file: "fixed-gapped-columns", title: "Stack Fixed Columns", description: "Fixed column only when scroll some distance, and scroll to stack other columns. Recommend use with bordered.", Component: TableFixedGappedColumns },
  { file: "fixed-columns-header", title: "Fixed Columns and Header", description: "A Solution for displaying large amounts of data with long columns. > Specify the width of columns if header and cell do not align properly. If specified width is not working or have gutter between columns, please try to leave one column at least without width to fit fluid layout, or make sure no long word to break table layout. > > A fixed value which is greater than table width for scroll.x is recommended. The sum of unfixed columns should not greater than scroll.x.", Component: TableFixedColumnsHeader },
  { file: "hidden-columns", title: "Hidden Columns", description: "Hide columns with hidden.", Component: TableHiddenColumns },
  { file: "grouping-columns", title: "Grouping table head", description: "Group table head with columns[n].children.", Component: TableGroupingColumns },
  { file: "edit-cell", title: "Editable Cells", description: "Table with editable cells. When work with shouldCellUpdate, please take care of closure.", Component: TableEditCell },
  { file: "edit-row", title: "Editable Rows", description: "Table with editable rows.", Component: TableEditRow },
  { file: "nested-table", title: "Nested tables", description: "Showing more detailed info of every row.", Component: TableNestedTable },
  { file: "drag-sorting", title: "Drag sorting", description: "By using components, we can integrate table with dnd-kit to implement drag sorting function.", Component: TableDragSorting },
  { file: "drag-column-sorting", title: "Drag Column sorting", description: "By using components, we can integrate table with dnd-kit to implement column drag sorting function.", Component: TableDragColumnSorting },
  { file: "drag-sorting-handler", title: "Drag sorting with handler", description: "Alternatively you can implement drag sorting with handler using dnd-kit.", Component: TableDragSortingHandler },
  { file: "ellipsis", title: "ellipsis column", description: "Ellipsis cell content via setting column.ellipsis. > Cannot ellipsis table header with sorters and filters for now.", Component: TableEllipsis },
  { file: "column-defaults", title: "Shared column props", description: "Use column to set shared column props on the table and override them per column when needed.", Component: TableColumnDefaults },
  { file: "ellipsis-custom-tooltip", title: "ellipsis column custom tooltip", description: "Ellipsis cell content via setting column.ellipsis.showTitle, use Tooltip instead of the html title attribute.", Component: TableEllipsisCustomTooltip },
  { file: "custom-empty", title: "Custom empty", description: "Custom empty status.", Component: TableCustomEmpty },
  { file: "summary", title: "Summary", description: "Set summary content by summary prop. Sync column fixed status with Table.Summary.Cell. You can fixed it by set Table.Summary fixed prop(since 4.16.0).", Component: TableSummary },
  { file: "virtual-list", title: "Virtual list", description: "Set virtual to enable virtual scroll, and scroll.x and scroll.y must be set at the same time with number type.", Component: TableVirtualList },
  { file: "responsive", title: "Responsive", description: "Responsive columns.", Component: TableResponsive },
  { file: "pagination", title: "Pagination Settings", description: "Table pagination settings.", Component: TablePagination },
  { file: "sticky", title: "Fixed header and scroll bar with the page", description: "For long table\uff0cneed to scroll to view the header and scroll bar\uff0cthen you can now set the fixed header and scroll bar to follow the page.", Component: TableSticky },
  { file: "dynamic-settings", title: "Dynamic Settings", description: "Select different settings to see the result.", Component: TableDynamicSettings },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Table by passing objects/functions through classNames and styles.", Component: TableStyleClass },
];

export function TableShowcase() {
  return <Showcase section="data-display" component="table" demos={demos} sources={sources} />;
}
