import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/* An overlay whose body scrolls draws the scrollbar at the body's own inline
   edge. Where the body runs to the content edge, that bar lands on the right
   edge of every field inside it: drawn over them where the platform overlays
   its bar, and squeezing them where it reserves width instead.
   
   Both cases are answered by the same pair, so both are pinned here — one
   without the other leaves half the platforms wrong. */

const bodies = [
  ['modal.css', '.cb-modal__body'],
  ['drawer.css', '.cb-drawer__body'],
] as const;

function rule(file: string, selector: string) {
  const css = readFileSync(join(process.cwd(), 'packages/ui/src/overlay', file), 'utf8');
  const match = css.match(new RegExp(`\\${selector}\\s*\\{([^}]*)\\}`));
  if (!match) throw new Error(`missing rule: ${selector} in ${file}`);
  return match[1];
}

describe('a scrolling overlay body keeps its scrollbar off the content', () => {
  for (const [file, selector] of bodies) {
    it(`${selector} scrolls, reserves the bar, and holds the content away from it`, () => {
      const body = rule(file, selector);

      expect(body, 'the body is the part that scrolls').toMatch(/overflow-y:\s*auto/);

      /* Where the platform reserves width for the bar, this keeps that width out
         of the content box whether or not the content happens to overflow — so a
         field appearing does not shift everything sideways. */
      expect(body, 'reserve the classic scrollbar').toMatch(/scrollbar-gutter:\s*stable/);

      /* Where the platform overlays the bar instead, the gutter is zero and only
         padding keeps the bar off the content. The body bleeds back out into the
         dialog's own padding so that padding costs no width. */
      expect(body, 'pad the overlay scrollbar away from the content').toMatch(
        /padding-inline:\s*var\(--cb-space-5\)/,
      );
      expect(body, 'and give the padding back to the dialog').toMatch(
        /margin-inline:\s*calc\(-1 \* var\(--cb-space-5\)\)/,
      );
    });
  }
});
