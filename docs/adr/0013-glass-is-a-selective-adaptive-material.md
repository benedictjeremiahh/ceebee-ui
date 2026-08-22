# Glass is a selective adaptive material, not the default container

`Surface variant="glass"` represents an elevated interface layer: navigation, controls, toolbars,
and temporary overlays that sit above meaningful content. It is not the default treatment for
ordinary content cards. A screen should keep a clear hierarchy between the content plane and the
small number of glass controls above it, and it should avoid glass nested inside glass.

On the web we approximate the optical character of Apple's Liquid Glass with a translucent fill,
specular light, an illuminated edge, backdrop blur and saturation, and a grounding shadow. Those
values are Skin Tokens so a product can tune the material without changing `Surface`. This is an
inspired web material, not a claim that CSS reproduces Apple's native rendering, lensing, or
system-aware behaviour one-for-one.

The public API exposes the same semantic density distinction as Apple's guidance: `regular` is the
default material, while `clear` is an explicit opt-in for compact, bold controls over visually rich
content. The distinction is not a light/dark colour choice. Both styles still adapt through Skin
Tokens, and both converge on the legible opaque fallback when transparency or contrast preferences
require it.

The material adapts to light and dark themes. It becomes opaque when the browser cannot blur the
backdrop or the user asks for reduced transparency, and it strengthens boundaries for increased
contrast and forced-colour modes. These fallbacks are part of the material contract, not optional
consumer work.

We deliberately do not add pointer-tracking or a JavaScript animation loop. The small optical gain
would make a server-safe primitive more expensive, introduce motion that must be managed, and make
the result less predictable inside product layouts. Visual quality is reviewed in the docs recipe;
tests continue to cover behaviour rather than freezing subjective CSS values per
[ADR 0012](./0012-test-what-can-be-wrong-not-what-is-merely-ugly.md).

This direction follows Apple's guidance that the material belongs primarily to controls and
navigation above content and must preserve legibility and accessibility:
[Human Interface Guidelines: Materials](https://developer.apple.com/design/human-interface-guidelines/materials),
[Liquid Glass overview](https://developer.apple.com/documentation/technologyoverviews/liquid-glass).
