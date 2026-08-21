import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * A hit-area pseudo-element is absolutely positioned and sized in percentages, so it belongs to
 * the nearest positioned ancestor. Give it a host that is not positioned and it grows to whatever
 * container it lands in and swallows clicks across the page — which is what a `.cb-switch::before`
 * rule did, turning every click on the Button page into a toggle of the loading switch.
 *
 * jsdom has no layout, so no rendered test can catch it. The invariant is checked in the CSS.
 */
const ROOT = existsSync('packages/ui/src') ? 'packages/ui/src' : 'src';

function cssFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'tokens' || entry.name === 'skins' ? [] : cssFiles(path);
    return entry.name.endsWith('.css') ? [path] : [];
  });
}

interface Rule {
  selectors: string[];
  body: string;
}

function rulesIn(css: string): Rule[] {
  return [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)].map((match) => ({
    selectors: match[1]!.split(',').map((selector) => selector.trim()),
    body: match[2]!,
  }));
}

describe('hit-area pseudo-elements', () => {
  it('are only declared on hosts that establish their own containing block', () => {
    const offenders: string[] = [];

    for (const file of cssFiles(ROOT)) {
      const rules = rulesIn(readFileSync(file, 'utf8'));

      // A host counts as positioned only through a rule of its own — never through the
      // pseudo-element's `position: absolute`, which is what made the first version of this
      // test pass while the bug was in the file.
      const positionedHosts = new Set(
        rules
          .filter((rule) => /position:\s*(relative|absolute|fixed|sticky)/.test(rule.body))
          .flatMap((rule) => rule.selectors)
          .filter((selector) => !selector.includes('::'))
          .map((selector) => selector.split(':')[0]!.split('[')[0]!.trim()),
      );

      for (const rule of rules) {
        const spansItsBox = /width:\s*(max\(\s*)?100%/.test(rule.body) || /inset:\s*0/.test(rule.body);
        if (!rule.body.includes('position: absolute') || !spansItsBox) continue;

        for (const selector of rule.selectors) {
          if (!selector.includes('::')) continue;
          const host = selector.split('::')[0]!.split(':')[0]!.split('[')[0]!.trim();
          if (host.startsWith('.cb-') && !positionedHosts.has(host)) {
            offenders.push(`${selector} — ${host} is not positioned (${file.slice(ROOT.length + 1)})`);
          }
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
