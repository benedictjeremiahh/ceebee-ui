'use client';

import { Showcase, type OfficialDemo } from './showcase-frame';

import ButtonBasic from './general/button/basic';
import ButtonBlock from './general/button/block';
import ButtonColorVariant from './general/button/color-variant';
import ButtonCustomDisabled from './general/button/custom-disabled-bg';
import ButtonDanger from './general/button/danger';
import ButtonDisabled from './general/button/disabled';
import ButtonGhost from './general/button/ghost';
import ButtonIcon from './general/button/icon';
import ButtonIconPlacement from './general/button/icon-placement';
import ButtonGradient from './general/button/linear-gradient';
import ButtonLoading from './general/button/loading';
import ButtonMultiple from './general/button/multiple';
import ButtonSize from './general/button/size';
import ButtonSemantic from './general/button/style-class';
import ButtonWave from './general/button/wave';

import FloatBasic from './general/float-button/basic';
import FloatBackTop from './general/float-button/back-top';
import FloatBadge from './general/float-button/badge';
import FloatContent from './general/float-button/content';
import FloatControlled from './general/float-button/controlled';
import FloatDraggable from './general/float-button/draggable';
import FloatGroup from './general/float-button/group';
import FloatGroupMenu from './general/float-button/group-menu';
import FloatPlacement from './general/float-button/placement';
import FloatProgress from './general/float-button/progress-ring';
import FloatSemantic from './general/float-button/style-class';
import FloatShape from './general/float-button/shape';
import FloatTooltip from './general/float-button/tooltip';
import FloatType from './general/float-button/type';

import TypographyBasic from './general/typography/basic';
import TypographyCopyable from './general/typography/copyable';
import TypographyEditable from './general/typography/editable';
import TypographyEllipsis from './general/typography/ellipsis';
import TypographyEllipsisControlled from './general/typography/ellipsis-controlled';
import TypographyEllipsisMiddle from './general/typography/ellipsis-middle';
import TypographySuffix from './general/typography/suffix';
import TypographyTable from './general/typography/table';
import TypographyText from './general/typography/text';
import TypographyTitle from './general/typography/title';

import IconBasic from './general/icon/basic';
import IconCustom from './general/icon/custom';
import IconFont from './general/icon/iconfont';
import IconScriptUrl from './general/icon/scriptUrl';
import IconTwoTone from './general/icon/two-tone';

import { sources as buttonSources } from './general/button/sources.generated';
import { sources as floatButtonSources } from './general/float-button/sources.generated';
import { sources as iconSources } from './general/icon/sources.generated';
import { sources as typographySources } from './general/typography/sources.generated';

const buttonDemos: OfficialDemo[] = [
  { file: 'basic', title: 'Syntactic sugar', description: 'Use the preset primary, default, dashed, text, and link button styles through the type syntactic sugar.', Component: ButtonBasic },
  { file: 'color-variant', title: 'Color & Variant', description: 'Set color and variant together to derive the supported button treatments.', Component: ButtonColorVariant },
  { file: 'icon', title: 'Icon', description: 'Add an icon with the icon property.', Component: ButtonIcon },
  { file: 'icon-placement', title: 'Icon Placement', description: 'Set iconPlacement to start or end.', Component: ButtonIconPlacement },
  { file: 'size', title: 'Size', description: 'Small, medium, and large buttons.', Component: ButtonSize },
  { file: 'disabled', title: 'Disabled', description: 'Add disabled to mark a button unavailable.', Component: ButtonDisabled },
  { file: 'loading', title: 'Loading', description: 'Use loading or loading.icon to display and customize pending state.', Component: ButtonLoading },
  { file: 'multiple', title: 'Multiple Buttons', description: 'Prefer one primary action and group overflow operations into a dropdown.', Component: ButtonMultiple },
  { file: 'ghost', title: 'Ghost Button', description: 'Ghost buttons keep a transparent background for use on colored surfaces.', Component: ButtonGhost },
  { file: 'danger', title: 'Danger Buttons', description: 'Use danger for destructive actions.', Component: ButtonDanger },
  { file: 'block', title: 'Block Button', description: 'The block property makes a button fit its parent width.', Component: ButtonBlock },
  { file: 'linear-gradient', title: 'Gradient Button', description: 'Buttons with a gradient background.', Component: ButtonGradient },
  { file: 'wave', title: 'Custom Wave', description: 'Customize the interaction wave with HappyProvider.', Component: ButtonWave },
  { file: 'custom-disabled-bg', title: 'Custom disabled backgroundColor', description: 'Customize disabled default and dashed button backgrounds.', Component: ButtonCustomDisabled },
  { file: 'style-class', title: 'Custom semantic dom styling', description: 'Customize semantic slots with classNames and styles.', Component: ButtonSemantic },
];

const floatButtonDemos: OfficialDemo[] = [
  { file: 'basic', title: 'Basic', description: 'The most basic usage.', Component: FloatBasic, iframe: 360 },
  { file: 'type', title: 'Type', description: 'Change the FloatButton type.', Component: FloatType, iframe: 360 },
  { file: 'shape', title: 'Shape', description: 'Change the FloatButton shape.', Component: FloatShape, iframe: 360 },
  { file: 'content', title: 'Content', description: 'Show a short description on a square FloatButton.', Component: FloatContent, iframe: 360 },
  { file: 'tooltip', title: 'FloatButton with tooltip', description: 'Set tooltip to explain an icon-only action.', Component: FloatTooltip, iframe: 360 },
  { file: 'group', title: 'FloatButton Group', description: 'Group related floating actions and share their shape.', Component: FloatGroup, iframe: 360 },
  { file: 'group-menu', title: 'Menu mode', description: 'Open grouped actions on hover or click.', Component: FloatGroupMenu, iframe: 360 },
  { file: 'controlled', title: 'Controlled mode', description: 'Control a triggered group through open.', Component: FloatControlled, iframe: 360 },
  { file: 'placement', title: 'placement', description: 'Choose top, right, bottom, or left group expansion.', Component: FloatPlacement, iframe: 380 },
  { file: 'draggable', title: 'draggable', description: 'Integrate FloatButton with a third-party drag engine.', Component: FloatDraggable, iframe: 380 },
  { file: 'back-top', title: 'BackTop', description: 'Return to the top of the page.', Component: FloatBackTop, iframe: 360 },
  { file: 'progress-ring', title: 'Progress ring', description: 'Display scroll progress around the BackTop edge.', Component: FloatProgress, iframe: 360 },
  { file: 'badge', title: 'badge', description: 'FloatButton with Badge.', Component: FloatBadge, iframe: 360 },
  { file: 'style-class', title: 'Custom semantic dom styling', description: 'Customize FloatButton semantic slots.', Component: FloatSemantic, iframe: 360 },
];

const typographyDemos: OfficialDemo[] = [
  { file: 'basic', title: 'Basic', description: 'Display a document sample.', Component: TypographyBasic },
  { file: 'title', title: 'Title Component', description: 'Display titles at different levels.', Component: TypographyTitle },
  { file: 'text', title: 'Text and Link Component', description: 'Use the supported text states and links.', Component: TypographyText },
  { file: 'editable', title: 'Editable', description: 'Make Typography editable.', Component: TypographyEditable },
  { file: 'copyable', title: 'Copyable', description: 'Make Typography copyable with configuration options.', Component: TypographyCopyable },
  { file: 'ellipsis', title: 'Ellipsis', description: 'Use multi-line ellipsis, tooltips, and expandable content.', Component: TypographyEllipsis },
  { file: 'ellipsis-controlled', title: 'Controlled ellipsis expand/collapse', description: 'Control multi-line text omission.', Component: TypographyEllipsisControlled },
  { file: 'ellipsis-middle', title: 'Ellipsis from middle', description: 'Preserve a suffix while truncating the middle.', Component: TypographyEllipsisMiddle },
  { file: 'suffix', title: 'suffix', description: 'Add suffix-aware ellipsis.', Component: TypographySuffix },
  { file: 'table', title: 'Table', description: 'Use Typography document styles for native tables.', Component: TypographyTable },
];

const iconDemos: OfficialDemo[] = [
  { file: 'basic', title: 'Basic', description: 'Import outlined, filled, and two-tone icons and use spin for animation.', Component: IconBasic },
  { file: 'two-tone', title: 'Two-tone icon and colorful icon', description: 'Set twoToneColor to a specific primary color.', Component: IconTwoTone },
  { file: 'custom', title: 'Custom Icon', description: 'Create reusable icons from SVG components.', Component: IconCustom },
  { file: 'iconfont', title: 'Use iconfont.cn', description: 'Use iconfont.cn resources through createFromIconfontCN.', Component: IconFont },
  { file: 'scriptUrl', title: 'Multiple resources from iconfont.cn', description: 'Compose multiple iconfont resources in array order.', Component: IconScriptUrl },
];

export function ButtonShowcase() {
  return <Showcase section="general" component="button" demos={buttonDemos} sources={buttonSources} cols={2} />;
}

export function FloatButtonShowcase() {
  return <Showcase section="general" component="float-button" demos={floatButtonDemos} sources={floatButtonSources} cols={2} />;
}

export function TypographyShowcase() {
  return <Showcase section="general" component="typography" demos={typographyDemos} sources={typographySources} />;
}

export function IconShowcase() {
  return <Showcase section="general" component="icon" demos={iconDemos} sources={iconSources} />;
}
