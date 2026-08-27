'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import CarouselBasic from './basic';
import CarouselPlacement from './placement';
import CarouselAutoplay from './autoplay';
import CarouselFade from './fade';
import CarouselArrows from './arrows';
import CarouselDotDuration from './dot-duration';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "Basic usage.", Component: CarouselBasic },
  { file: "placement", title: "Position", description: "There are 4 position options available.", Component: CarouselPlacement },
  { file: "autoplay", title: "Scroll automatically", description: "Timing of scrolling to the next card/picture.", Component: CarouselAutoplay },
  { file: "fade", title: "Fade in", description: "Slides use fade for transition.", Component: CarouselFade },
  { file: "arrows", title: "Arrows for switching", description: "Show the arrows for switching.", Component: CarouselArrows },
  { file: "dot-duration", title: "Progress of dots", description: "Show progress of dots.", Component: CarouselDotDuration },
];

export function CarouselShowcase() {
  return <Showcase section="data-display" component="carousel" demos={demos} sources={sources} cols={2} />;
}
