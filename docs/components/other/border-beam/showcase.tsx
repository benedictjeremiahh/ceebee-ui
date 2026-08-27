'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import BorderBeamBasic from './basic';
import BorderBeamHover from './hover';
import BorderBeamCount from './count';
import BorderBeamCustomContainer from './custom-container';
import BorderBeamCustomizedColor from './customized-color';
import BorderBeamDuration from './duration';
import BorderBeamSize from './size';
import BorderBeamLineWidth from './line-width';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "Basic usage. Wrap any container with BorderBeam to add a continuous decorative beam effect along its border.", Component: BorderBeamBasic },
  { file: "hover", title: "Show on hover", description: "Hide the border beam by default, and reveal it when hovering over the container.", Component: BorderBeamHover },
  { file: "count", title: "Multiple beams", description: "Use count to set the number of beams. Multiple beams are evenly distributed around the container border. It should be a positive integer, and the default value is 1.", Component: BorderBeamCount },
  { file: "custom-container", title: "Custom container", description: "A custom container can also host BorderBeam. The beam layer is inserted into the child node and positioned with position: absolute along the container edge, so the host element needs to provide a positioning context. In most cases, set position: relative.", Component: BorderBeamCustomContainer },
  { file: "customized-color", title: "Gradients", description: "Display six gradient beam palettes and switch between them.", Component: BorderBeamCustomizedColor },
  { file: "duration", title: "Duration", description: "Use duration to control how many seconds the beam takes to complete one loop. The default is 6 seconds.", Component: BorderBeamDuration },
  { file: "size", title: "Size", description: "Use size to control the size of the visible beam segment. The default is 100px, and numbers are treated as pixels.", Component: BorderBeamSize },
  { file: "line-width", title: "Line width", description: "Use lineWidth to adjust the beam width of an individual BorderBeam. The default value is 1px, and numbers are treated as pixels.", Component: BorderBeamLineWidth },
];

export function BorderBeamShowcase() {
  return <Showcase section="other" component="border-beam" demos={demos} sources={sources} cols={2} />;
}
