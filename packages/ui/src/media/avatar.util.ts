import type { DecorHue } from '../lib/cn.js';

const HUES: DecorHue[] = ['violet', 'blue', 'teal', 'green', 'amber', 'rose'];

/**
 * First letter of the first and last word. Two letters at most, because three stop fitting
 * in the small size and a clipped initial reads as a rendering bug.
 */
export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = words[0]![0] ?? '';
  const last = words.length > 1 ? (words[words.length - 1]![0] ?? '') : '';
  return (first + last).toUpperCase();
}

/** Stable hue per name, so the same person keeps their colour across sessions and devices. */
export function hueForName(name: string): DecorHue {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return HUES[hash % HUES.length]!;
}
