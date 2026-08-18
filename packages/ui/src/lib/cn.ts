/** Joins class names, dropping falsy values. No merge logic: the library never emits
 *  conflicting utility classes, so the "last wins" problem tailwind-merge solves does not exist. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export type Tone = 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger';
export type Size = 'sm' | 'md' | 'lg';
export type DecorHue = 'violet' | 'blue' | 'teal' | 'green' | 'amber' | 'rose';
