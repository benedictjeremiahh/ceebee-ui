import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/* A dropdown pinned to its anchor's width is a dropdown that cannot show its
   own options. On a phone the anchor is often half a filter row — 175px — and
   the options are place names, so they wrapped to two and three lines each and
   the list read as a column of broken phrases.
   
   The anchor's width is the floor now, not the value, and the ceiling is the
   room the positioner measured. Both popups answer it the same way, so both are
   pinned here: one of them quietly going back to a fixed width is exactly the
   drift this catches. */

const popups = [
  ['select.css', '.cb-select__popup'],
  ['autocomplete.css', '.cb-autocomplete__popup'],
] as const;

function rule(file: string, selector: string) {
  const css = readFileSync(join(process.cwd(), 'packages/ui/src/form', file), 'utf8');
  const match = css.match(new RegExp(`\\${selector}\\s*\\{([^}]*)\\}`));
  if (!match) throw new Error(`missing rule: ${selector} in ${file}`);
  return match[1];
}

describe('a dropdown sizes to its options, within the room it has', () => {
  for (const [file, selector] of popups) {
    it(`${selector} takes the anchor as a floor and the viewport as a ceiling`, () => {
      const popup = rule(file, selector);

      expect(popup, 'as wide as the longest option').toMatch(/width:\s*max-content/);
      /* Never narrower than the field: a popup narrower than what it drops from
         reads as belonging to something else. */
      expect(popup, 'never narrower than its anchor').toMatch(/min-width:\s*var\(--anchor-width/);
      /* And never off the screen. --available-width is what the positioner
         measured, so this moves with the viewport rather than being a number
         written down here. */
      expect(popup, 'never wider than the room it has').toMatch(/max-width:\s*var\(--available-width/);
      expect(popup, 'never taller than the room it has').toMatch(/max-height:\s*min\(18rem, var\(--available-height/);
    });
  }
});
