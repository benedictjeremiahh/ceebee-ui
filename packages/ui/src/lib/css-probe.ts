/**
 * Reading a live Token value out of the DOM.
 *
 * A CSS Custom Property has no value until something resolves it, so anything that needs a Token as
 * a *number* or a *colour string* — rather than as `var(--cb-…)` in a stylesheet — has to ask the
 * browser. Two places need that: the Ant bridge, which turns Tokens into Ant's seed, and any
 * component drawn on a canvas, where CSS cannot reach the pixels at all.
 *
 * It lives here because those two grew the same twenty lines independently, and the subtle half —
 * the colour fallback below — is the half that is easy to get quietly wrong.
 */

export interface CssProbe {
  /** The resolved colour, or undefined where the environment cannot resolve it. */
  color(name: string): string | undefined;
  /** The resolved length in CSS pixels, or undefined when it is not a length. */
  length(name: string): number | undefined;
  /** Removes the probe element. Always call it; a probe left behind is a stray node in the tree. */
  done(): void;
}

/**
 * A probe inside `root`, so a Token overridden on that subtree is read at its overridden value
 * rather than at the document's.
 */
export function createCssProbe(root: HTMLElement): CssProbe {
  const probe = document.createElement('span');
  probe.style.position = 'fixed';
  probe.style.pointerEvents = 'none';
  probe.style.visibility = 'hidden';
  root.append(probe);

  return {
    color: (name) => resolveCssColor(probe, name),
    length: (name) => resolveCssLength(probe, name),
    done: () => probe.remove(),
  };
}

export function resolveCssLength(probe: HTMLElement, name: string): number | undefined {
  probe.style.width = `var(${name})`;
  const value = Number.parseFloat(getComputedStyle(probe).width);
  probe.style.removeProperty('width');
  return Number.isFinite(value) ? value : undefined;
}

export function resolveCssColor(probe: HTMLElement, name: string): string | undefined {
  probe.style.color = `var(${name})`;
  const value = getComputedStyle(probe).color;
  probe.style.removeProperty('color');
  if (!value) return undefined;
  // A DOM implementation without Custom Property resolution (notably jsdom) returns the var()
  // expression unchanged. It is not a colour and must not be sent through the canvas fallback.
  if (value.startsWith('var(')) return undefined;
  if (/^(?:#|rgb|hsl|hsv)/i.test(value)) return value;

  // Anything else is a colour the browser understands and this code does not — `oklch()`, a named
  // colour, `color-mix()`. Painting one pixel and reading it back is the only way to get a value a
  // canvas API will accept, and it costs nothing at the rate these are read.
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return undefined;
  context.clearRect(0, 0, 1, 1);
  context.fillStyle = value;
  context.fillRect(0, 0, 1, 1);
  const [red = 0, green = 0, blue = 0, alpha = 255] = context.getImageData(0, 0, 1, 1).data;
  return `rgba(${red}, ${green}, ${blue}, ${alpha / 255})`;
}

const SKIN_LINK_ID = 'cb-skin';

/**
 * Calls back whenever the resolved value of a Token could have changed, and returns the unsubscribe.
 *
 * Anything that reads a Token *once* — the Ant seed, a canvas palette — is stale the moment the page
 * changes mode or Skin, and stale in the most visible way: dark text on a dark ground. There are
 * three ways that happens, and missing any one of them leaves a component that is correct until
 * somebody touches the theme switch.
 */
export function watchTokens(onChange: () => void): () => void {
  const rootObserver = new MutationObserver(onChange);
  rootObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // A Skin is a stylesheet swapped in the head, so the Tokens change with no attribute changing.
  const headObserver = new MutationObserver((records) => {
    const skinChanged = records.some((record) => [...record.addedNodes, ...record.removedNodes]
      .some((node) => node instanceof HTMLElement && node.id === SKIN_LINK_ID));
    if (skinChanged) onChange();
  });
  headObserver.observe(document.head, { childList: true });

  // And the swapped-in stylesheet resolves nothing until it has loaded.
  const onSkinLoad = (event: Event) => {
    if (event.target instanceof HTMLElement && event.target.id === SKIN_LINK_ID) onChange();
  };
  document.addEventListener('load', onSkinLoad, true);

  // `data-theme` absent means the page follows the system, so the system changing is a theme change.
  const dark = window.matchMedia('(prefers-color-scheme: dark)');
  dark.addEventListener('change', onChange);

  return () => {
    rootObserver.disconnect();
    headObserver.disconnect();
    document.removeEventListener('load', onSkinLoad, true);
    dark.removeEventListener('change', onChange);
  };
}
