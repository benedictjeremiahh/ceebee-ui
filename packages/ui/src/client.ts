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
