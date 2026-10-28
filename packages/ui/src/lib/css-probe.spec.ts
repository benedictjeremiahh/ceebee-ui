import { afterEach, describe, expect, it, vi } from 'vitest';
import { createCssProbe, watchTokens } from './css-probe';

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
  vi.restoreAllMocks();
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

  it('does not turn an absent token into the empty probe width', () => {
    const element = host({});
    element.style.width = '0px';
    vi.spyOn(window, 'getComputedStyle').mockReturnValue(element.style);
    const probe = createCssProbe(element);

    expect(probe.length('--missing-length')).toBeUndefined();
    probe.done();
  });

  it('preserves a deliberately configured zero length', () => {
    const element = host({ '--zero-length': '0px' });
    element.style.width = '0px';
    vi.spyOn(window, 'getComputedStyle').mockReturnValue(element.style);
    const probe = createCssProbe(element);

    expect(probe.length('--zero-length')).toBe(0);
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

describe('responsive token changes', () => {
  it('watches the canonical coarse-or-compact token query and removes its listener on cleanup', () => {
    const original = window.matchMedia;
    const compact = original('(pointer: coarse), (max-width: 48rem)');
    const add = vi.spyOn(compact, 'addEventListener');
    const remove = vi.spyOn(compact, 'removeEventListener');
    vi.spyOn(window, 'matchMedia').mockImplementation(query => query === compact.media ? compact : original(query));
    const refresh = vi.fn();

    const stop = watchTokens(refresh);
    expect(window.matchMedia).toHaveBeenCalledWith('(pointer: coarse), (max-width: 48rem)');
    const listener = add.mock.calls.find(call => call[0] === 'change')?.[1];
    expect(listener).toBeDefined();
    if (typeof listener === 'function') listener.call(compact, new Event('change'));
    expect(refresh).toHaveBeenCalledTimes(1);

    stop();
    expect(remove).toHaveBeenCalledWith('change', listener);
  });
});
