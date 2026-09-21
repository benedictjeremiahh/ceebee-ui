import { afterEach, describe, expect, it } from 'vitest';
import { createCssProbe } from './css-probe';

/**
 * jsdom does not implement CSS Custom Property resolution: `getComputedStyle` hands back the
 * `var(--cb-…)` text unchanged, whatever the property is set to. So the *resolved* half of this
 * helper cannot be proven here — only a real browser can do that, and the docs site is where it is
 * seen. What is proven here is the half that jsdom exercises for free, which happens to be the half
 * that is dangerous: every path where resolution fails must return `undefined`, because the
 * alternative is `var(--cb-tone-brand)` being handed to a canvas API that ignores it without
 * complaint and draws the chart in black.
 */
function host(styles: Record<string, string>) {
  const element = document.createElement('div');
  for (const [name, value] of Object.entries(styles)) element.style.setProperty(name, value);
  document.body.append(element);
  return element;
}

afterEach(() => {
  document.body.replaceChildren();
});

describe('createCssProbe', () => {
  it('says undefined rather than handing back an unresolved var()', () => {
    const probe = createCssProbe(host({ '--cb-tone-brand': 'rgb(1, 2, 3)' }));
    expect(probe.color('--cb-tone-brand')).toBeUndefined();
    expect(probe.color('--cb-not-defined-anywhere')).toBeUndefined();
    probe.done();
  });

  it('says undefined rather than NaN when a length does not resolve', () => {
    const probe = createCssProbe(host({ '--cb-space-4': '16px' }));
    expect(probe.length('--cb-space-4')).toBeUndefined();
    expect(probe.length('--cb-font-sans')).toBeUndefined();
    probe.done();
  });

  it('reads through the element it was given, so a subtree override is what it would see', () => {
    const outer = host({});
    const inner = document.createElement('div');
    outer.append(inner);
    const probe = createCssProbe(inner);
    expect(inner.childElementCount).toBe(1);
    expect(outer.childElementCount).toBe(1);
    probe.done();
  });

  // A probe that outlives its read is a stray node inside a consumer's component tree.
  it('leaves nothing behind', () => {
    const element = host({});
    const probe = createCssProbe(element);
    expect(element.childElementCount).toBe(1);
    probe.done();
    expect(element.childElementCount).toBe(0);
  });

  it('does not throw when the probe is already gone', () => {
    const element = host({});
    const probe = createCssProbe(element);
    probe.done();
    expect(() => probe.done()).not.toThrow();
  });
});
