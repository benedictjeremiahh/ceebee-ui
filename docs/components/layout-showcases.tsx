'use client';

import { useEffect, useState, type ComponentType } from 'react';
import { App } from '@ceebee/ui/client';
import { ExampleGrid, Demo } from './demo';

import DividerHorizontal from './layout/divider/horizontal';
import DividerWithText from './layout/divider/with-text';
import DividerSize from './layout/divider/size';
import DividerPlain from './layout/divider/plain';
import DividerVertical from './layout/divider/vertical';
import DividerVariant from './layout/divider/variant';
import DividerStyleClass from './layout/divider/style-class';

import FlexBasic from './layout/flex/basic';
import FlexAlign from './layout/flex/align';
import FlexGap from './layout/flex/gap';
import FlexWrap from './layout/flex/wrap';
import FlexCombination from './layout/flex/combination';

import GridBasic from './layout/grid/basic';
import GridGutter from './layout/grid/gutter';
import GridOffset from './layout/grid/offset';
import GridSort from './layout/grid/sort';
import GridFlex from './layout/grid/flex';
import GridFlexAlign from './layout/grid/flex-align';
import GridFlexOrder from './layout/grid/flex-order';
import GridFlexStretch from './layout/grid/flex-stretch';
import GridResponsive from './layout/grid/responsive';
import GridResponsiveFlex from './layout/grid/responsive-flex';
import GridResponsiveMore from './layout/grid/responsive-more';
import GridPlayground from './layout/grid/playground';
import GridUseBreakpoint from './layout/grid/useBreakpoint';

import LayoutBasic from './layout/layout/basic';
import LayoutTop from './layout/layout/top';
import LayoutTopSide from './layout/layout/top-side';
import LayoutTopSide2 from './layout/layout/top-side-2';
import LayoutSide from './layout/layout/side';
import LayoutCustomTrigger from './layout/layout/custom-trigger';
import LayoutCollapsibleOverlay from './layout/layout/collapsible-overlay';
import LayoutResponsive from './layout/layout/responsive';
import LayoutFixed from './layout/layout/fixed';
import LayoutFixedSider from './layout/layout/fixed-sider';

import MasonryBasic from './layout/masonry/basic';
import MasonryResponsive from './layout/masonry/responsive';
import MasonryImage from './layout/masonry/image';
import MasonryDynamic from './layout/masonry/dynamic';
import MasonryStyleClass from './layout/masonry/style-class';

import SpaceBase from './layout/space/base';
import SpaceVertical from './layout/space/vertical';
import SpaceSize from './layout/space/size';
import SpaceAlign from './layout/space/align';
import SpaceWrap from './layout/space/wrap';
import SpaceSeparator from './layout/space/separator';
import SpaceCompact from './layout/space/compact';
import SpaceCompactButtons from './layout/space/compact-buttons';
import SpaceCompactButtonVertical from './layout/space/compact-button-vertical';
import SpaceStyleClass from './layout/space/style-class';

import SplitterSize from './layout/splitter/size';
import SplitterControl from './layout/splitter/control';
import SplitterVertical from './layout/splitter/vertical';
import SplitterCollapsible from './layout/splitter/collapsible';
import SplitterCollapsibleIcon from './layout/splitter/collapsibleIcon';
import SplitterMultiple from './layout/splitter/multiple';
import SplitterGroup from './layout/splitter/group';
import SplitterLazy from './layout/splitter/lazy';
import SplitterCustomize from './layout/splitter/customize';
import SplitterStyleClass from './layout/splitter/style-class';
import SplitterReset from './layout/splitter/reset';

import { sources as dividerSources } from './layout/divider/sources.generated';
import { sources as flexSources } from './layout/flex/sources.generated';
import { sources as gridSources } from './layout/grid/sources.generated';
import { sources as layoutSources } from './layout/layout/sources.generated';
import { sources as masonrySources } from './layout/masonry/sources.generated';
import { sources as spaceSources } from './layout/space/sources.generated';
import { sources as splitterSources } from './layout/splitter/sources.generated';

/**
 * The vendored demo files themselves. A source pane has to show the code that is running, and these
 * demos are copied into this repository rather than generated, so the listing is the file itself.
 */
const sourcesByComponent: Record<string, Record<string, string>> = {
  'divider': dividerSources,
  'flex': flexSources,
  'grid': gridSources,
  'layout': layoutSources,
  'masonry': masonrySources,
  'space': spaceSources,
  'splitter': splitterSources,
};

interface OfficialLayoutDemo {
  /** Frame height when the upstream documentation marks the demo `iframe`. */
  iframe?: number;
  /** Upstream's `background="grey"` and `compact` stage treatments. */
  background?: 'grey';
  compact?: boolean;
  file: string;
  title: string;
  description: string;
  Component: ComponentType;
  contain?: boolean;
}

const dividerDemos: OfficialLayoutDemo[] = [
  { ...{"file":"horizontal","title":"Horizontal","description":"A Divider is horizontal by default. You can add text within Divider.","contain":false}, Component: DividerHorizontal },
  { ...{"file":"with-text","title":"Divider with title","description":"Divider with inner title, set titlePlacement=\"start/end\" to align it.","contain":false}, Component: DividerWithText },
  { ...{"file":"size","title":"Set the spacing size of the divider","description":"The size of the spacing.","contain":false}, Component: DividerSize },
  { ...{"file":"plain","title":"Text without heading style","description":"You can use non-heading style of divider text by setting the plain property.","contain":false}, Component: DividerPlain },
  { ...{"file":"vertical","title":"Vertical","description":"Use orientation=\"vertical\" or vertical to make the divider vertical.","contain":false}, Component: DividerVertical },
  { ...{"file":"variant","title":"Variant","description":"Divider is of solid variant by default. You can change that to either dashed or dotted.","contain":false}, Component: DividerVariant },
  { ...{"file":"style-class","title":"Custom semantic dom styling","description":"You can customize the semantic dom style of divider by passing objects/functions through classNames and styles.","contain":false}, Component: DividerStyleClass },
];

const flexDemos: OfficialLayoutDemo[] = [
  { ...{"file":"basic","title":"Basic","description":"The basic usage.","contain":false}, Component: FlexBasic },
  { ...{"file":"align","title":"align","description":"Set align.","contain":false}, Component: FlexAlign },
  { ...{"file":"gap","title":"gap","description":"Set the gap between elements, which has three preset sizes: small, medium, and large. You can also customize the gap size.","contain":false}, Component: FlexGap },
  { ...{"file":"wrap","title":"Wrap","description":"Auto wrap line.","contain":false}, Component: FlexWrap },
  { ...{"file":"combination","title":"combination","description":"Nesting can achieve more complex layouts.","contain":false}, Component: FlexCombination },
];

const gridDemos: OfficialLayoutDemo[] = [
  { ...{"file":"basic","title":"Basic Grid","description":"From the stack to the horizontal arrangement. You can create a basic grid system by using a single set of Row and Col grid assembly, all of the columns (Col) must be placed in Row.","contain":false}, Component: GridBasic },
  { ...{"file":"gutter","title":"Grid Gutter","description":"You can use the gutter property of Row as grid spacing, we recommend set it to (16 + 8n) px (n stands for natural number). You can set it to a object like { xs: 8, sm: 16, md: 24, lg: 32 } for responsive design. You can use an array to set vertical spacing, [horizontal, vertical] [16, { xs: 8, sm: 16, md: 24, lg: 32 }]. You can set gutter to a string CSS units, for example: px, rem, vw, vh etc. vertical gutter was supported after 3.24.0. string type was supported after 5.28.0.","contain":false}, Component: GridGutter },
  { ...{"file":"offset","title":"Column offset","description":"offset can set the column to the right side. For example, using offset = {4} can set the element shifted to the right four columns width.","contain":false}, Component: GridOffset },
  { ...{"file":"sort","title":"Grid sort","description":"By using push and pull class you can easily change column order.","contain":false}, Component: GridSort },
  { ...{"file":"flex","title":"Typesetting","description":"Child elements depending on the value of the start, center, end, space-between, space-around and space-evenly, which are defined in its parent node typesetting mode.","contain":false}, Component: GridFlex },
  { ...{"file":"flex-align","title":"Alignment","description":"Child elements vertically aligned.","contain":false}, Component: GridFlexAlign },
  { ...{"file":"flex-order","title":"Order","description":"To change the element sort by order.","contain":false}, Component: GridFlexOrder },
  { ...{"file":"flex-stretch","title":"Flex Stretch","description":"Col provides flex prop to support fill rest.","contain":false}, Component: GridFlexStretch },
  { ...{"file":"responsive","title":"Responsive","description":"Referring to the Bootstrap responsive design, here preset seven dimensions: xs sm md lg xl xxl xxxl.","contain":false}, Component: GridResponsive, background: 'grey', compact: true },
  { ...{"file":"responsive-flex","title":"Flex Responsive","description":"Support much more flexible responsive flex ratio, which requires CSS Variables supported by browser.","contain":false}, Component: GridResponsiveFlex },
  { ...{"file":"responsive-more","title":"More responsive","description":"span pull push offset order property can be embedded into xs sm md lg xl xxl properties to use, where xs={6} is equivalent to xs={{span: 6}}.","contain":false}, Component: GridResponsiveMore },
  { ...{"file":"playground","title":"Playground","description":"A simple playground for column count and gutter.","contain":false}, Component: GridPlayground },
  { ...{"file":"useBreakpoint","title":"useBreakpoint Hook","description":"Use useBreakpoint Hook provide personalized layout. xs only takes effect when the screen match the min width.","contain":false}, Component: GridUseBreakpoint },
];

const layoutDemos: OfficialLayoutDemo[] = [
  { ...{"file":"basic","title":"Basic Structure","description":"Classic page layouts.","contain":false}, Component: LayoutBasic },
  { ...{"file":"top","title":"Header-Content-Footer","description":"The most basic \"header-content-footer\" layout. Generally, the mainnav is placed at the top of the page, and includes the logo, the first level navigation, and the secondary menu (users, settings, notifications) from left to right in it. We always put contents in a fixed size navigation (eg: 1200px), the layout of the whole page is stable, it's not affected by the viewing area. Top-bottom structure is conformed with the top-bottom viewing habit, it's a classical navigation pattern of websites. This pattern demonstrates efficiency in the main workarea, while using some vertical space. And because the horizontal space of the navigation is limited, this pattern is not suitable for cases when the first level navigation contains many elements or links.","contain":false}, Component: LayoutTop, background: 'grey', compact: true },
  { ...{"file":"top-side","title":"Header-Sider","description":"Both the top navigation and the sidebar, commonly used in documentation site.","contain":false}, Component: LayoutTopSide, background: 'grey', compact: true },
  { ...{"file":"top-side-2","title":"Header Sider 2","description":"Both the top navigation and the sidebar, commonly used in application site.","contain":false}, Component: LayoutTopSide2, background: 'grey', compact: true },
  { ...{"file":"side","title":"Sider","description":"Two-columns layout. The sider menu can be collapsed when horizontal space is limited. Generally, the mainnav is placed on the left side of the page, and the secondary menu is placed on the top of the working area. Contents will adapt the layout to the viewing area to improve the horizontal space usage, while the layout of the whole page is not stable. The level of the aside navigation is scalable. The first, second, and third level navigations could be present more fluently and relevantly, and aside navigation can be fixed, allowing the user to quickly switch and spot the current position, improving the user experience. However, this navigation occupies some horizontal space of the contents.","contain":true}, Component: LayoutSide, iframe: 360 },
  { ...{"file":"custom-trigger","title":"Custom trigger","description":"If you want to use a customized trigger, you can hide the default one by setting trigger={null}.","contain":false}, Component: LayoutCustomTrigger, background: 'grey', compact: true },
  { ...{"file":"collapsible-overlay","title":"Collapsible overlay","description":"Use a custom trigger attached to the Sider edge to collapse or expand it. The expanded Sider can leave the document flow and overlay the content with business styles to avoid squeezing the content area.","contain":false}, Component: LayoutCollapsibleOverlay, background: 'grey', compact: true },
  { ...{"file":"responsive","title":"Responsive","description":"Layout.Sider supports responsive layout. Note: You can get a responsive layout by setting breakpoint, the Sider will collapse to the width of collapsedWidth when window width is below the breakpoint. And a special trigger will appear if the collapsedWidth is set to 0.","contain":false}, Component: LayoutResponsive, background: 'grey', compact: true },
  { ...{"file":"fixed","title":"Fixed Header","description":"Sticky Header is generally used to fix the top navigation to facilitate page switching.","contain":true}, Component: LayoutFixed, iframe: 360 },
  { ...{"file":"fixed-sider","title":"Fixed Sider","description":"When dealing with long content, a sticky sider can provide a better user experience.","contain":true}, Component: LayoutFixedSider, iframe: 360 },
];

const masonryDemos: OfficialLayoutDemo[] = [
  { ...{"file":"basic","title":"Basic","description":"Basic usage. Set number of columns with columns and spacing with gutter.","contain":false}, Component: MasonryBasic },
  { ...{"file":"responsive","title":"Responsive","description":"Responsive layout adapts to different screen widths. Use columns to specify the number of columns at different breakpoints, and gutter to adjust spacing between items.","contain":false}, Component: MasonryResponsive },
  { ...{"file":"image","title":"Image","description":"Dynamically adjust the height of images as they load.","contain":false}, Component: MasonryImage },
  { ...{"file":"dynamic","title":"Dynamic","description":"Demonstrate how masonry layout updates dynamically. Use item.column to keep items in place.","contain":false}, Component: MasonryDynamic },
  { ...{"file":"style-class","title":"Custom semantic dom styling","description":"You can customize the semantic dom style of Masonry by passing objects/functions through classNames and styles.","contain":false}, Component: MasonryStyleClass },
];

const spaceDemos: OfficialLayoutDemo[] = [
  { ...{"file":"base","title":"Basic Usage","description":"Crowded components horizontal spacing.","contain":false}, Component: SpaceBase },
  { ...{"file":"vertical","title":"Vertical Space","description":"Crowded components vertical spacing.","contain":false}, Component: SpaceVertical },
  { ...{"file":"size","title":"Space Size","description":"Use size to set the spacing. Three sizes are preset: small, medium, large. You can also customize the spacing. If size is not set, the spacing is small.","contain":false}, Component: SpaceSize },
  { ...{"file":"align","title":"Align","description":"Config item align.","contain":false}, Component: SpaceAlign },
  { ...{"file":"wrap","title":"Wrap","description":"Auto wrap line.","contain":false}, Component: SpaceWrap },
  { ...{"file":"separator","title":"separator","description":"Crowded components separator.","contain":false}, Component: SpaceSeparator },
  { ...{"file":"compact","title":"Compact Mode for form component","description":"Compact Mode for form component.","contain":false}, Component: SpaceCompact },
  { ...{"file":"compact-buttons","title":"Button Compact Mode","description":"Button component compact example.","contain":false}, Component: SpaceCompactButtons },
  { ...{"file":"compact-button-vertical","title":"Vertical Compact Mode","description":"Vertical Mode for Space.Compact, support Button only.","contain":false}, Component: SpaceCompactButtonVertical },
  { ...{"file":"style-class","title":"Custom semantic dom styling","description":"You can customize the semantic dom style of Space by passing objects/functions through classNames and styles.","contain":false}, Component: SpaceStyleClass },
];

const splitterDemos: OfficialLayoutDemo[] = [
  { ...{"file":"size","title":"Basic","description":"Initialize panel size, panel size limit.","contain":false}, Component: SplitterSize },
  { ...{"file":"control","title":"Control mode","description":"Control the size of the splitter. When one of the panels disables resizable, dragging will be disabled.","contain":false}, Component: SplitterControl },
  { ...{"file":"vertical","title":"Vertical","description":"Use vertical layout.","contain":false}, Component: SplitterVertical },
  { ...{"file":"collapsible","title":"Collapsible","description":"Set collapsible to enable collapse. Can through min to limit dragging to expand when collapsed.","contain":false}, Component: SplitterCollapsible },
  { ...{"file":"collapsibleIcon","title":"\n  Control collapsible icons\n","description":"Set collapsible.showCollapsibleIcon to control the display mode of collapsible icons.","contain":false}, Component: SplitterCollapsibleIcon },
  { ...{"file":"multiple","title":"Multiple panels","description":"Multiple panels.","contain":false}, Component: SplitterMultiple },
  { ...{"file":"group","title":"Complex combination","description":"Complex combination panel, quick folding, prohibited from changing size","contain":false}, Component: SplitterGroup },
  { ...{"file":"lazy","title":"Lazy","description":"Lazy mode, dragging does not update the size immediately, but updates when released.","contain":false}, Component: SplitterLazy },
  { ...{"file":"customize","title":"Customize","description":"customize handle elements and style","contain":false}, Component: SplitterCustomize },
  { ...{"file":"style-class","title":"Custom semantic dom styling","description":"You can customize the semantic dom style of Splitter by passing objects/functions through classNames and styles.","contain":false}, Component: SplitterStyleClass },
  { ...{"file":"reset","title":"Double-clicked reset","description":"Double-click the dragger to reset the Splitter.Panel to its default size.","contain":false}, Component: SplitterReset },
];

function Showcase({ component, demos }: { component: string; demos: OfficialLayoutDemo[] }) {
  const examples = demos.map(({ file, title, description, Component, contain, iframe, background, compact }) => (
    <Demo
      key={file}
      title={title.trim()}
      description={description}
      code={sourcesByComponent[component]?.[file] ?? ''}
      layout="block"
      contain={contain && !iframe}
      iframeSrc={iframe ? `/internal/demo/${component}/${file}` : undefined}
      iframeHeight={iframe}
      background={background}
      compact={compact}
    >
      {iframe ? null : <ClientOnly Component={Component} />}
    </Demo>
  ));
  return (
    // Every demo renders inside <App>, whose element carries the theme hash and CSS-variable classes
    // the runtime's reset is scoped to. Without it a bare demo anchor loses its link colour and
    // pointer cursor and falls back to the browser default.
    <App className="docs__app-frame">
      <div className={`docs__layout-examples docs__layout-${component}`}>
        {component === 'divider'
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

export function DividerShowcase() { return <Showcase component="divider" demos={dividerDemos} />; }
export function FlexShowcase() { return <Showcase component="flex" demos={flexDemos} />; }
export function GridShowcase() { return <Showcase component="grid" demos={gridDemos} />; }
export function LayoutShowcase() { return <Showcase component="layout" demos={layoutDemos} />; }
export function MasonryShowcase() { return <Showcase component="masonry" demos={masonryDemos} />; }
export function SpaceShowcase() { return <Showcase component="space" demos={spaceDemos} />; }
export function SplitterShowcase() { return <Showcase component="splitter" demos={splitterDemos} />; }
