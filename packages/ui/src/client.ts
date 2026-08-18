/**
 * Client entry: everything that animates, listens, or holds state. Published with a
 * "use client" banner so a Next app never has to add one (ADR 0004).
 */
export { MotionProvider, useMotionSettings } from './motion/motion-provider.js';
export type { MotionProviderProps, MotionSettings, MotionHelpers, SpringPreset, DurationToken } from './motion/motion-provider.js';

export { ThemeProvider, useTheme } from './theme/theme-provider.js';
export type { ThemeChoice } from './theme/theme-provider.js';

export { Button } from './form/button.js';
export type { ButtonProps } from './form/button.js';
export { Field, useFieldWiring } from './form/field.js';
export type { FieldProps } from './form/field.js';
export { TextInput, Textarea } from './form/text-input.js';
export type { TextInputProps, TextareaProps } from './form/text-input.js';

export { Dialog, DialogClose } from './overlay/dialog.js';
export type { DialogProps } from './overlay/dialog.js';
export { Popover, Tooltip } from './overlay/popover.js';
export type { PopoverProps, TooltipProps, Side, Align } from './overlay/popover.js';

export { Carousel } from './media/carousel.js';
export type { CarouselProps, CarouselSlideProps, CarouselSkeletonProps } from './media/carousel.js';
export { shouldAutoplay } from './media/autoplay.js';
export type { AutoplayConditions } from './media/autoplay.js';

export { Coachmark } from './onboarding/coachmark.js';
export type { CoachmarkProps } from './onboarding/coachmark.js';
export { Tour } from './onboarding/tour.js';
export type { TourProps, TourStep } from './onboarding/tour.js';
export { tourReducer, initialTourState, resolveTarget, hasEnded } from './onboarding/tour-machine.js';
export type { TourState, TourAction, TourStatus, StepTarget } from './onboarding/tour-machine.js';
export type { SeenStore } from './onboarding/seen-store.js';

export { Reveal, Stagger } from './motion/reveal.js';
export type { RevealProps, StaggerProps } from './motion/reveal.js';
