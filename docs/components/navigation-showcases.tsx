'use client';

import { useEffect, useState, type ComponentType } from 'react';
import { App } from '@ceebee/ui/client';
import { ExampleGrid, Demo } from './demo';

import AnchorBasic from './navigation/anchor/basic';
import AnchorHorizontal from './navigation/anchor/horizontal';
import AnchorStatic from './navigation/anchor/static';
import AnchorOnClick from './navigation/anchor/onClick';
import AnchorCustomizeHighlight from './navigation/anchor/customizeHighlight';
import AnchorTargetOffset from './navigation/anchor/targetOffset';
import AnchorOnChange from './navigation/anchor/onChange';
import AnchorReplace from './navigation/anchor/replace';
import AnchorStyleClass from './navigation/anchor/style-class';

import BreadcrumbBasic from './navigation/breadcrumb/basic';
import BreadcrumbWithIcon from './navigation/breadcrumb/withIcon';
import BreadcrumbWithParams from './navigation/breadcrumb/withParams';
import BreadcrumbSeparator from './navigation/breadcrumb/separator';
import BreadcrumbOverlay from './navigation/breadcrumb/overlay';
import BreadcrumbSeparatorComponent from './navigation/breadcrumb/separator-component';
import BreadcrumbDebugRoutes from './navigation/breadcrumb/debug-routes';
import BreadcrumbStyleClass from './navigation/breadcrumb/style-class';

import DropdownBasic from './navigation/dropdown/basic';
import DropdownExtra from './navigation/dropdown/extra';
import DropdownPlacement from './navigation/dropdown/placement';
import DropdownArrow from './navigation/dropdown/arrow';
import DropdownItem from './navigation/dropdown/item';
import DropdownArrowCenter from './navigation/dropdown/arrow-center';
import DropdownTrigger from './navigation/dropdown/trigger';
import DropdownEvent from './navigation/dropdown/event';
import DropdownDropdownButton from './navigation/dropdown/dropdown-button';
import DropdownCustomDropdown from './navigation/dropdown/custom-dropdown';
import DropdownSubMenu from './navigation/dropdown/sub-menu';
import DropdownOverlayOpen from './navigation/dropdown/overlay-open';
import DropdownContextMenu from './navigation/dropdown/context-menu';
import DropdownLoading from './navigation/dropdown/loading';
import DropdownSelectable from './navigation/dropdown/selectable';
import DropdownSelection from './navigation/dropdown/selection';
import DropdownStyleClass from './navigation/dropdown/style-class';

import MenuHorizontal from './navigation/menu/horizontal';
import MenuInline from './navigation/menu/inline';
import MenuInlineCollapsed from './navigation/menu/inline-collapsed';
import MenuTooltip from './navigation/menu/tooltip';
import MenuSiderCurrent from './navigation/menu/sider-current';
import MenuVertical from './navigation/menu/vertical';
import MenuTheme from './navigation/menu/theme';
import MenuSubmenuTheme from './navigation/menu/submenu-theme';
import MenuSwitchMode from './navigation/menu/switch-mode';
import MenuStyleClass from './navigation/menu/style-class';
import MenuCustomPopupRender from './navigation/menu/custom-popup-render';

import PaginationBasic from './navigation/pagination/basic';
import PaginationAlign from './navigation/pagination/align';
import PaginationMore from './navigation/pagination/more';
import PaginationChanger from './navigation/pagination/changer';
import PaginationJump from './navigation/pagination/jump';
import PaginationMini from './navigation/pagination/mini';
import PaginationSimple from './navigation/pagination/simple';
import PaginationControlled from './navigation/pagination/controlled';
import PaginationTotal from './navigation/pagination/total';
import PaginationAll from './navigation/pagination/all';
import PaginationItemRender from './navigation/pagination/itemRender';
import PaginationComponents from './navigation/pagination/components';
import PaginationStyleClass from './navigation/pagination/style-class';

import StepsSimple from './navigation/steps/simple';
import StepsError from './navigation/steps/error';
import StepsVertical from './navigation/steps/vertical';
import StepsClickable from './navigation/steps/clickable';
import StepsPanel from './navigation/steps/panel';
import StepsIcon from './navigation/steps/icon';
import StepsTitlePlacement from './navigation/steps/title-placement';
import StepsMaxCount from './navigation/steps/max-count';
import StepsProgressDot from './navigation/steps/progress-dot';
import StepsNav from './navigation/steps/nav';
import StepsInline from './navigation/steps/inline';
import StepsInlineVariant from './navigation/steps/inline-variant';
import StepsStyleClass from './navigation/steps/style-class';

import TabsBasic from './navigation/tabs/basic';
import TabsDisabled from './navigation/tabs/disabled';
import TabsCentered from './navigation/tabs/centered';
import TabsIcon from './navigation/tabs/icon';
import TabsCustomIndicator from './navigation/tabs/custom-indicator';
import TabsSlide from './navigation/tabs/slide';
import TabsExtra from './navigation/tabs/extra';
import TabsSize from './navigation/tabs/size';
import TabsPlacement from './navigation/tabs/placement';
import TabsPopupRenderSearch from './navigation/tabs/popupRender-Search';
import TabsCard from './navigation/tabs/card';
import TabsEditableCard from './navigation/tabs/editable-card';
import TabsCustomAddTrigger from './navigation/tabs/custom-add-trigger';
import TabsCustomTabBar from './navigation/tabs/custom-tab-bar';
import TabsCustomTabBarNode from './navigation/tabs/custom-tab-bar-node';
import TabsStyleClass from './navigation/tabs/style-class';

import { sources as anchorSources } from './navigation/anchor/sources.generated';
import { sources as breadcrumbSources } from './navigation/breadcrumb/sources.generated';
import { sources as dropdownSources } from './navigation/dropdown/sources.generated';
import { sources as menuSources } from './navigation/menu/sources.generated';
import { sources as paginationSources } from './navigation/pagination/sources.generated';
import { sources as stepsSources } from './navigation/steps/sources.generated';
import { sources as tabsSources } from './navigation/tabs/sources.generated';

/**
 * The vendored demo files themselves. A source pane has to show the code that is running, and these
 * demos are copied into this repository rather than generated, so the listing is the file itself.
 */
const sourcesByComponent: Record<string, Record<string, string>> = {
  'anchor': anchorSources,
  'breadcrumb': breadcrumbSources,
  'dropdown': dropdownSources,
  'menu': menuSources,
  'pagination': paginationSources,
  'steps': stepsSources,
  'tabs': tabsSources,
};

interface OfficialNavigationDemo {
  file: string;
  title: string;
  description: string;
  Component: ComponentType;
  contain?: boolean;
}

const anchorDemos: OfficialNavigationDemo[] = [
  { ...{"file":"basic","title":"Basic","description":"The simplest usage.","contain":true}, Component: AnchorBasic },
  { ...{"file":"horizontal","title":"Horizontal Anchor","description":"Horizontally aligned anchors","contain":true}, Component: AnchorHorizontal },
  { ...{"file":"static","title":"Static Anchor","description":"Do not change state when page is scrolling.","contain":false}, Component: AnchorStatic },
  { ...{"file":"onClick","title":"Customize the onClick event","description":"Clicking on an anchor does not record history.","contain":false}, Component: AnchorOnClick },
  { ...{"file":"customizeHighlight","title":"Customize the anchor highlight","description":"Customize the anchor highlight.","contain":false}, Component: AnchorCustomizeHighlight },
  { ...{"file":"targetOffset","title":"Set Anchor scroll offset","description":"Anchor target scroll to screen center.","contain":true}, Component: AnchorTargetOffset },
  { ...{"file":"onChange","title":"Listening for anchor link change","description":"Listening for anchor link change.","contain":false}, Component: AnchorOnChange },
  { ...{"file":"replace","title":"Replace href in history","description":"Replace path in browser history, so back button returns to previous page instead of previous anchor item.","contain":true}, Component: AnchorReplace },
  { ...{"file":"style-class","title":"Custom semantic dom styling","description":"You can customize the semantic dom style of Anchor by passing objects/functions through classNames and styles.","contain":true}, Component: AnchorStyleClass },
];

const breadcrumbDemos: OfficialNavigationDemo[] = [
  { ...{"file":"basic","title":"Basic Usage","description":"The simplest use.","contain":false}, Component: BreadcrumbBasic },
  { ...{"file":"withIcon","title":"With an Icon","description":"The icon should be placed in front of the text. A bare from a third-party icon library (e.g. lucide, react-icons) stays vertically centred with, and spaced from, the text.","contain":false}, Component: BreadcrumbWithIcon },
  { ...{"file":"withParams","title":"With Params","description":"With route params.","contain":false}, Component: BreadcrumbWithParams },
  { ...{"file":"separator","title":"Configuring the Separator","description":"The separator can be customized by setting the separator property: separator=\"\".","contain":false}, Component: BreadcrumbSeparator },
  { ...{"file":"overlay","title":"Bread crumbs with drop down menu","description":"Breadcrumbs support drop down menu.","contain":false}, Component: BreadcrumbOverlay },
  { ...{"file":"separator-component","title":"Configuring the Separator Independently","description":"Customize separator for each other.","contain":false}, Component: BreadcrumbSeparatorComponent },
  { ...{"file":"debug-routes","title":"Debug Routes","description":"Origin routes debug.","contain":false}, Component: BreadcrumbDebugRoutes },
  { ...{"file":"style-class","title":"Custom semantic dom styling","description":"You can customize the semantic dom style of Breadcrumb by passing objects/functions through classNames and styles.","contain":false}, Component: BreadcrumbStyleClass },
];

const dropdownDemos: OfficialNavigationDemo[] = [
  { ...{"file":"basic","title":"Basic","description":"The most basic dropdown menu.","contain":false}, Component: DropdownBasic },
  { ...{"file":"extra","title":"Extra node","description":"The dropdown menu with shortcut.","contain":false}, Component: DropdownExtra },
  { ...{"file":"placement","title":"Placement","description":"Support 12 placements.","contain":false}, Component: DropdownPlacement },
  { ...{"file":"arrow","title":"Arrow","description":"You could display an arrow.","contain":false}, Component: DropdownArrow },
  { ...{"file":"item","title":"Other elements","description":"Divider and disabled menu item.","contain":false}, Component: DropdownItem },
  { ...{"file":"arrow-center","title":"Arrow pointing at the center","description":"By specifying arrow prop with { pointAtCenter: true }, the arrow will point to the center of the target element.","contain":false}, Component: DropdownArrowCenter },
  { ...{"file":"trigger","title":"Trigger mode","description":"The default trigger mode is hover, you can change it to click.","contain":false}, Component: DropdownTrigger },
  { ...{"file":"event","title":"Click event","description":"An event will be triggered when you click menu items, in which you can make different operations according to item's key.","contain":false}, Component: DropdownEvent },
  { ...{"file":"dropdown-button","title":"Button with dropdown menu","description":"A button is on the left, and a related functional menu is on the right. You can set the icon property to modify the icon of right.","contain":false}, Component: DropdownDropdownButton },
  { ...{"file":"custom-dropdown","title":"Custom dropdown","description":"Customize the dropdown menu via popupRender. If you don't need the Menu content, use the Popover component directly.","contain":false}, Component: DropdownCustomDropdown },
  { ...{"file":"sub-menu","title":"Cascading menu","description":"The menu has multiple levels.","contain":false}, Component: DropdownSubMenu },
  { ...{"file":"overlay-open","title":"The way of hiding menu.","description":"The default is to close the menu when you click on menu items, this feature can be turned off.","contain":false}, Component: DropdownOverlayOpen },
  { ...{"file":"context-menu","title":"Context Menu","description":"The default trigger mode is hover, you can change it to contextMenu. The pop-up menu position will follow the right-click position.","contain":false}, Component: DropdownContextMenu },
  { ...{"file":"loading","title":"Loading","description":"A loading indicator can be added to a button by setting the loading property.","contain":false}, Component: DropdownLoading },
  { ...{"file":"selectable","title":"Selectable Menu","description":"Configure the selectable property in menu to enable selectable ability.","contain":false}, Component: DropdownSelectable },
  { ...{"file":"selection","title":"Selection actions","description":"Use Dropdown with the browser Selection API to show custom actions after selecting text.","contain":false}, Component: DropdownSelection },
  { ...{"file":"style-class","title":"Custom semantic dom styling","description":"You can customize the semantic dom style of the Dropdown by passing objects/functions through classNames and styles.","contain":false}, Component: DropdownStyleClass },
];

const menuDemos: OfficialNavigationDemo[] = [
  { ...{"file":"horizontal","title":"Top Navigation","description":"Horizontal top navigation menu.","contain":false}, Component: MenuHorizontal },
  { ...{"file":"inline","title":"Inline menu","description":"Vertical menu with inline submenus.","contain":false}, Component: MenuInline },
  { ...{"file":"inline-collapsed","title":"Collapsed inline menu","description":"Inline menu could be collapsed. Here is a complete demo with sider layout.","contain":false}, Component: MenuInlineCollapsed },
  { ...{"file":"tooltip","title":"Menu tooltip","description":"Configure tooltip in inline collapsed mode, or disable it.","contain":false}, Component: MenuTooltip },
  { ...{"file":"sider-current","title":"Open current submenu only","description":"Click the menu and you will see that all the other menus gets collapsed to keep the entire menu compact.","contain":false}, Component: MenuSiderCurrent },
  { ...{"file":"vertical","title":"Vertical menu","description":"Submenus open as pop-ups.","contain":false}, Component: MenuVertical },
  { ...{"file":"theme","title":"Menu Themes","description":"There are two built-in themes: light and dark. The default value is light.","contain":false}, Component: MenuTheme },
  { ...{"file":"submenu-theme","title":"Sub-menu theme","description":"You can config SubMenu theme with theme prop to enable different theme color effect. This sample is dark for root and light for SubMenu.","contain":false}, Component: MenuSubmenuTheme },
  { ...{"file":"switch-mode","title":"Switch the menu type","description":"Show the dynamic switching mode (between inline and vertical).","contain":false}, Component: MenuSwitchMode },
  { ...{"file":"style-class","title":"Custom semantic dom styling","description":"You can customize the semantic dom style of Menu by passing objects/functions through classNames and styles.","contain":false}, Component: MenuStyleClass },
  { ...{"file":"custom-popup-render","title":"Custom Submenu Render","description":"Use the popupRender prop to customize submenu popup rendering.","contain":false}, Component: MenuCustomPopupRender },
];

const paginationDemos: OfficialNavigationDemo[] = [
  { ...{"file":"basic","title":"Basic","description":"Basic pagination.","contain":false}, Component: PaginationBasic },
  { ...{"file":"align","title":"Align","description":"","contain":false}, Component: PaginationAlign },
  { ...{"file":"more","title":"More","description":"More pages.","contain":false}, Component: PaginationMore },
  { ...{"file":"changer","title":"Changer","description":"Change pageSize.","contain":false}, Component: PaginationChanger },
  { ...{"file":"jump","title":"Jumper","description":"Jump to a page directly.","contain":false}, Component: PaginationJump },
  { ...{"file":"mini","title":"Size","description":"Small and large size pagination.","contain":false}, Component: PaginationMini },
  { ...{"file":"simple","title":"Simple mode","description":"Simple mode.","contain":false}, Component: PaginationSimple },
  { ...{"file":"controlled","title":"Controlled","description":"Controlled page number.","contain":false}, Component: PaginationControlled },
  { ...{"file":"total","title":"Total number","description":"You can show the total number of data by setting showTotal.","contain":false}, Component: PaginationTotal },
  { ...{"file":"all","title":"Show All","description":"Show all configured prop.","contain":false}, Component: PaginationAll },
  { ...{"file":"itemRender","title":"Prev and next","description":"Use text link for prev and next button.","contain":false}, Component: PaginationItemRender },
  { ...{"file":"components","title":"Custom component","description":"Replace the page size changer with components.","contain":false}, Component: PaginationComponents },
  { ...{"file":"style-class","title":"Custom semantic dom styling","description":"You can customize the semantic dom style of Pagination by passing objects/functions through classNames and styles.","contain":false}, Component: PaginationStyleClass },
];

const stepsDemos: OfficialNavigationDemo[] = [
  { ...{"file":"simple","title":"Basic","description":"The most basic step bar. Use the variant property to set different styles and size to control the size.","contain":false}, Component: StepsSimple },
  { ...{"file":"error","title":"Error status","description":"By using status of Steps, you can specify the state for current step.","contain":false}, Component: StepsError },
  { ...{"file":"vertical","title":"Vertical","description":"A simple step bar in the vertical orientation.","contain":false}, Component: StepsVertical },
  { ...{"file":"clickable","title":"Clickable","description":"Setting onChange makes Steps clickable.","contain":false}, Component: StepsClickable },
  { ...{"file":"panel","title":"Panel Steps","description":"Panel style steps.","contain":false}, Component: StepsPanel },
  { ...{"file":"icon","title":"With icon","description":"You can use your own custom icons by setting the property icon for items.","contain":false}, Component: StepsIcon },
  { ...{"file":"title-placement","title":"Title Placement and Progress","description":"Use titlePlacement to set the label position and display the progress through percent.","contain":false}, Component: StepsTitlePlacement },
  { ...{"file":"max-count","title":"Max Count","description":"Use maxCount to limit visible steps. Hidden ranges are collapsed into ellipsis steps.","contain":false}, Component: StepsMaxCount },
  { ...{"file":"progress-dot","title":"Dot Style","description":"Steps with progress dot style.","contain":false}, Component: StepsProgressDot },
  { ...{"file":"nav","title":"Navigation Steps","description":"Navigation steps.","contain":false}, Component: StepsNav },
  { ...{"file":"inline","title":"Inline Steps","description":"Inline type steps, suitable for displaying the process and current state of the object in the list content scene.","contain":false}, Component: StepsInline },
  { ...{"file":"inline-variant","title":"Inline Style Combination","description":"Inline step bar modifies the style and aligns through offset.","contain":false}, Component: StepsInlineVariant },
  { ...{"file":"style-class","title":"Custom semantic dom styling","description":"You can customize the semantic dom style of Steps by passing objects/functions through classNames and styles.","contain":false}, Component: StepsStyleClass },
];


const tabsDemos: OfficialNavigationDemo[] = [
  { ...{"file":"basic","title":"Basic","description":"Default activate first tab.","contain":false}, Component: TabsBasic },
  { ...{"file":"disabled","title":"Disabled","description":"Disabled a tab.","contain":false}, Component: TabsDisabled },
  { ...{"file":"centered","title":"Centered","description":"Centered tabs.","contain":false}, Component: TabsCentered },
  { ...{"file":"icon","title":"Icon","description":"The Tab with Icon. icon also accepts a bare <svg> element from a third-party icon library, which stays vertically centred with the label.","contain":false}, Component: TabsIcon },
  { ...{"file":"custom-indicator","title":"Indicator","description":"Set indicator prop to custom indicator size and align.","contain":false}, Component: TabsCustomIndicator },
  { ...{"file":"slide","title":"Slide","description":"In order to fit in more tabs, they can slide left and right (or up and down).","contain":false}, Component: TabsSlide },
  { ...{"file":"extra","title":"Extra content","description":"You can add extra actions to the right or left or even both side of Tabs.","contain":false}, Component: TabsExtra },
  { ...{"file":"size","title":"Size","description":"Large size tabs are usually used in page header, and small size could be used in Modal.","contain":false}, Component: TabsSize },
  { ...{"file":"placement","title":"Placement","description":"Tab's placement: start, end, top or bottom. Will auto switch to top in mobile.","contain":false}, Component: TabsPlacement },
  { ...{"file":"popupRender-Search","title":"Custom Popup Search","description":"Customize the Tabs more dropdown menu via popupRender prop, supporting search and keyboard navigation.","contain":false}, Component: TabsPopupRenderSearch },
  { ...{"file":"card","title":"Card type tab","description":"Another type of Tabs, which doesn't support vertical mode.","contain":false}, Component: TabsCard },
  { ...{"file":"editable-card","title":"Add & close tab","description":"Only card type Tabs support adding & closable. Use closable={false} to disable close.","contain":false}, Component: TabsEditableCard },
  { ...{"file":"custom-add-trigger","title":"Customized trigger of new tab","description":"Hide default plus icon, and bind event for customized trigger.","contain":false}, Component: TabsCustomAddTrigger },
  { ...{"file":"custom-tab-bar","title":"Customized bar of tab","description":"Use react-sticky-box and renderTabBar.","contain":false}, Component: TabsCustomTabBar },
  { ...{"file":"custom-tab-bar-node","title":"Draggable Tabs","description":"Use dnd-kit to make tabs draggable.","contain":false}, Component: TabsCustomTabBarNode },
  { ...{"file":"style-class","title":"Custom semantic dom styling","description":"You can customize the semantic dom style of Tabs by passing objects/functions through classNames and styles.","contain":false}, Component: TabsStyleClass },
];

function Showcase({ component, demos }: { component: string; demos: OfficialNavigationDemo[] }) {
  const examples = demos.map(({ file, title, description, Component, contain }) => (
    <Demo
      key={file}
      title={title}
      description={description}
      code={sourcesByComponent[component]?.[file] ?? ''}
      layout="block"
      contain={contain}
      iframeSrc={component === 'anchor' && contain ? `/internal/demo/anchor/${file}` : undefined}
    >
      {component === 'anchor' && contain ? null : <ClientOnly Component={Component} />}
    </Demo>
  ));
  return (
    // Every demo renders inside <App>, whose element carries the theme hash and CSS-variable classes
    // the runtime's reset is scoped to. Without it a bare demo anchor loses its link colour and
    // pointer cursor and falls back to the browser default.
    <App className="docs__app-frame">
      <div className={`docs__navigation-examples docs__navigation-${component}`}>
        {component === 'breadcrumb' || component === 'dropdown'
          ? <ExampleGrid>{examples}</ExampleGrid>
          : <div className="docs__example-stack">{examples}</div>}
      </div>
    </App>
  );
}

function ClientOnly({ Component }: { Component: ComponentType }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <Component /> : null;
}

export function AnchorShowcase() { return <Showcase component="anchor" demos={anchorDemos} />; }
export function BreadcrumbShowcase() { return <Showcase component="breadcrumb" demos={breadcrumbDemos} />; }
export function DropdownShowcase() { return <Showcase component="dropdown" demos={dropdownDemos} />; }
export function MenuShowcase() { return <Showcase component="menu" demos={menuDemos} />; }
export function PaginationShowcase() { return <Showcase component="pagination" demos={paginationDemos} />; }
export function StepsShowcase() { return <Showcase component="steps" demos={stepsDemos} />; }
export function TabsShowcase() { return <Showcase component="tabs" demos={tabsDemos} />; }
