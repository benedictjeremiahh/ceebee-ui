'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import RadioBasic from './basic';
import RadioDisabled from './disabled';
import RadioRadiogroup from './radiogroup';
import RadioRadiogroupMore from './radiogroup-more';
import RadioRadiogroupBlock from './radiogroup-block';
import RadioRadiogroupOptions from './radiogroup-options';
import RadioRadiobutton from './radiobutton';
import RadioRadiogroupWithName from './radiogroup-with-name';
import RadioSize from './size';
import RadioRadiobuttonSolid from './radiobutton-solid';
import RadioStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "The simplest use.", Component: RadioBasic },
  { file: "disabled", title: "disabled", description: "Radio unavailable.", Component: RadioDisabled },
  { file: "radiogroup", title: "Radio Group", description: "A group of radio components.", Component: RadioRadiogroup },
  { file: "radiogroup-more", title: "Vertical Radio.Group", description: "Vertical Radio.Group, with more radios.", Component: RadioRadiogroupMore },
  { file: "radiogroup-block", title: "Block Radio.Group", description: "The block property will make a Radio.Group fit to its parent width.", Component: RadioRadiogroupBlock },
  { file: "radiogroup-options", title: "Radio.Group group - optional", description: "Render radios by configuring options. Radio type can also be set through the optionType parameter.", Component: RadioRadiogroupOptions },
  { file: "radiobutton", title: "radio style", description: "The combination of radio button style.", Component: RadioRadiobutton },
  { file: "radiogroup-with-name", title: "Radio.Group with name", description: "Passing the name property to all input[type=\"radio\"] that are in the same Radio.Group. It is usually used to let the browser see your Radio.Group as a real \"group\" and keep the default behavior.", Component: RadioRadiogroupWithName },
  { file: "size", title: "Size", description: "There are three sizes available: large, medium, and small. It can coordinate with input box.", Component: RadioSize },
  { file: "radiobutton-solid", title: "Solid radio button", description: "Solid radio button style.", Component: RadioRadiobuttonSolid },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of radio by passing objects/functions through classNames and styles.", Component: RadioStyleClass },
];

export function RadioShowcase() {
  return <Showcase section="data-entry" component="radio" demos={demos} sources={sources} cols={2} />;
}
