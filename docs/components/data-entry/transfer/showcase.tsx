'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import TransferBasic from './basic';
import TransferOneWay from './oneWay';
import TransferSearch from './search';
import TransferAdvanced from './advanced';
import TransferCustomItem from './custom-item';
import TransferActions from './actions';
import TransferLargeData from './large-data';
import TransferTableTransfer from './table-transfer';
import TransferTreeTransfer from './tree-transfer';
import TransferStatus from './status';
import TransferStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "The most basic usage of Transfer involves providing the source data and target keys arrays, plus the rendering and some callback functions.", Component: TransferBasic },
  { file: "oneWay", title: "One Way", description: "Use oneWay to make Transfer the one way style.", Component: TransferOneWay },
  { file: "search", title: "Search", description: "Transfer with a search box.", Component: TransferSearch },
  { file: "advanced", title: "Advanced", description: "Advanced Usage of Transfer. You can customize the labels of the transfer buttons, the width and height of the columns, and what should be displayed in the footer.", Component: TransferAdvanced },
  { file: "custom-item", title: "Custom datasource", description: "Customize each Transfer Item, allowing you to render a complex datasource.", Component: TransferCustomItem },
  { file: "actions", title: "Custom Actions", description: "You can customize operations with the actions prop. This example demonstrates how to customize actions, including handling disabled and loading states. When actions is an array of strings, it will use the default Button component and set the strings as button text. When actions is an array of React elements, it will use these elements directly as action buttons, allowing you to use custom button components, such as buttons with loading state in this example. Note: 1. When using custom buttons, the Transfer component will automatically handle the button's disabled state and click events. 2. You can add a disabled property to your custom button to control its disabled state. 3. You can add an onClick event handler to your custom button, which will be merged with the Transfer component's internal handler.", Component: TransferActions },
  { file: "large-data", title: "Pagination", description: "Store a large amount of items with pagination.", Component: TransferLargeData },
  { file: "table-transfer", title: "Table Transfer", description: "Customize the render list with a Table component.", Component: TransferTableTransfer },
  { file: "tree-transfer", title: "Tree Transfer", description: "Customize the render list with a Tree component.", Component: TransferTreeTransfer },
  { file: "status", title: "Status", description: "Add status to Transfer with status, which could be error or warning.", Component: TransferStatus },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Transfers by passing objects/functions through classNames and styles.", Component: TransferStyleClass },
];

export function TransferShowcase() {
  return <Showcase section="data-entry" component="transfer" demos={demos} sources={sources} />;
}
