'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import SliderBasic from './basic';
import SliderInputNumber from './input-number';
import SliderIconSlider from './icon-slider';
import SliderTipFormatter from './tip-formatter';
import SliderEvent from './event';
import SliderMark from './mark';
import SliderVertical from './vertical';
import SliderShowTooltip from './show-tooltip';
import SliderReverse from './reverse';
import SliderDraggableTrack from './draggableTrack';
import SliderMultiple from './multiple';
import SliderEditable from './editable';
import SliderDisabledHandle from './disabled-handle';
import SliderStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "Basic slider. When range is true, display as dual thumb mode. When disable is true, the slider will not be interactable.", Component: SliderBasic },
  { file: "input-number", title: "Slider with InputNumber", description: "Synchronize with InputNumber component.", Component: SliderInputNumber },
  { file: "icon-slider", title: "Slider with icon", description: "You can add an icon beside the slider to make it meaningful.", Component: SliderIconSlider },
  { file: "tip-formatter", title: "Customize tooltip", description: "Use tooltip.formatter to format content of Tooltip. If tooltip.formatter is null, hide it.", Component: SliderTipFormatter },
  { file: "event", title: "Event", description: "The onChange callback function will fire when the user changes the slider's value. The onChangeComplete callback function will fire when mouseup or keyup fired.", Component: SliderEvent },
  { file: "mark", title: "Graduated slider", description: "Using marks property to mark a graduated slider, use value or defaultValue to specify the position of thumb. When included is false, means that different thumbs are coordinative. when step is null, valid points will only be marks, min and max.", Component: SliderMark },
  { file: "vertical", title: "Vertical", description: "The vertical Slider.", Component: SliderVertical },
  { file: "show-tooltip", title: "Control visibility of Tooltip", description: "When tooltip.open is true, ToolTip will always show, if set to false the ToolTip will not show, even if dragging or hovering.", Component: SliderShowTooltip },
  { file: "reverse", title: "Reverse", description: "Using reverse to render slider reversely.", Component: SliderReverse },
  { file: "draggableTrack", title: "Draggable track", description: "Make range track draggable by setting range.draggableTrack.", Component: SliderDraggableTrack },
  { file: "multiple", title: "Multiple handles", description: "Multiple handles combination.", Component: SliderMultiple },
  { file: "editable", title: "Dynamic edit nodes", description: "Click to add a node, drag out or press the key to delete the node.", Component: SliderEditable },
  { file: "disabled-handle", title: "Disabled per handle", description: "Set disabled to an array to individually disable specific handles in range mode. Disabled handles act as movement boundaries that other handles cannot cross.", Component: SliderDisabledHandle },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Sliders by passing objects/functions through classNames and styles.", Component: SliderStyleClass },
];

export function SliderShowcase() {
  return <Showcase section="data-entry" component="slider" demos={demos} sources={sources} cols={2} />;
}
