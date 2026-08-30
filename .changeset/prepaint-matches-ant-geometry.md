---
'@ceebee/ui': patch
---

The Ant pre-paint layer now matches Ant's own size and spacing, so controls no longer resize at hydration.

1.4.1 stated colour and radius but left geometry to Ant, which meant an `Input` was 30px tall before hydration and 48px after. Sizes are now Ant's own derived values, read out of rendered controls and expressed in Tokens rather than guessed: Ant lands on a spacing Token less its own border width, so `space-4 - border-width` is the button's 15px and `space-3 - border-width` is the input's 11px. Measured result for `Button`, icon-only `Button`, and a large `Input`: identical geometry before and after hydration.

Two fixes found while measuring. `.ant-select-selector` never matched anything — this runtime puts the box on `.ant-select` itself — so the rule was dead. And `allowClear` renders its clear control on an empty field and hides it from JavaScript-built CSS, so a stray clear icon was painted inside every such input until hydration; the hidden state is now stated in the layer.

Where a variant's geometry has not been measured this way, the layer still states no size for it. A wrong size flickers as badly as no size and pretends to be right.

**Consumers:** a blanket `button, input { font: inherit }` reset defeats this layer's type scale. An element selector outranks the `:where()` these rules are wrapped in, so a control Ant renders at 14px is laid out at 16px until hydration and then resizes. Inherit `font-family` alone and let the control own its size.
