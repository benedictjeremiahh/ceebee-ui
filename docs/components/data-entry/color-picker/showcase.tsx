'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import ColorPickerBase from './base';
import ColorPickerSize from './size';
import ColorPickerControlled from './controlled';
import ColorPickerLineGradient from './line-gradient';
import ColorPickerTextRender from './text-render';
import ColorPickerDisabled from './disabled';
import ColorPickerDisabledAlpha from './disabled-alpha';
import ColorPickerAllowClear from './allowClear';
import ColorPickerTrigger from './trigger';
import ColorPickerTriggerEvent from './trigger-event';
import ColorPickerFormat from './format';
import ColorPickerPresets from './presets';
import ColorPickerPanelRender from './panel-render';
import ColorPickerStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "base", title: "Basic Usage", description: "Basic Usage.", Component: ColorPickerBase },
  { file: "size", title: "Trigger size", description: "Ceebee UI supports three trigger sizes: small, default and large. If a large or small trigger is desired, set the size property to either large or small respectively. Omit the size property for a trigger with the default size.", Component: ColorPickerSize },
  { file: "controlled", title: "controlled mode", description: "Set the component to controlled mode. Will lock the display color if controlled by onChangeComplete.", Component: ColorPickerControlled },
  { file: "line-gradient", title: "Line Gradient", description: "Set the color to a single or a gradient color via mode.", Component: ColorPickerLineGradient },
  { file: "text-render", title: "Rendering Trigger Text", description: "Renders the default text of the trigger, effective when showText is true. When customizing text, you can use showText as a function to return custom text.", Component: ColorPickerTextRender },
  { file: "disabled", title: "Disable", description: "Set to disabled state.", Component: ColorPickerDisabled },
  { file: "disabled-alpha", title: "Disabled Alpha", description: "Disabled color alpha.", Component: ColorPickerDisabledAlpha },
  { file: "allowClear", title: "Clear Color", description: "Clear Color.", Component: ColorPickerAllowClear },
  { file: "trigger", title: "Custom Trigger", description: "Triggers for customizing color panels.", Component: ColorPickerTrigger },
  { file: "trigger-event", title: "Custom Trigger Event", description: "Triggers event for customizing color panels, provide options click and hover.", Component: ColorPickerTriggerEvent },
  { file: "format", title: "Color Format", description: "Encoding formats, support HEX, HSB, RGB.", Component: ColorPickerFormat },
  { file: "presets", title: "Preset Colors", description: "Set the presets color of the color picker.", Component: ColorPickerPresets },
  { file: "panel-render", title: "Custom Render Panel", description: "Rendering of the free control panel via panelRender.", Component: ColorPickerPanelRender },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of ColorPicker by passing objects/functions through classNames and styles.", Component: ColorPickerStyleClass },
];

export function ColorPickerShowcase() {
  return <Showcase section="data-entry" component="color-picker" demos={demos} sources={sources} cols={2} />;
}
