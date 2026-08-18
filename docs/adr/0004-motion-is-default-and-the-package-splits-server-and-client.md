# Animation is on by default, so the package splits into a server-safe entry and a client entry

Motion is part of this library's identity, not a garnish, so animated components use `motion` and
animate without being asked, with timings drawn only from Motion Tokens and a `MotionProvider` able
to scale or kill everything at once. Because animation forces `"use client"`, the package splits:
`@ceebee/ui` holds server-safe primitives (typography, layout, static Surface, Badge, Divider,
Skeleton) and `@ceebee/ui/client` holds everything that moves or listens.

## Consequences

- A content-heavy page can be built entirely from the server-safe entry and ship no Motion runtime.
- Two entries is a rule an author must remember; the authoring contract in AGENTS.md states which
  side a new component belongs to, and the build fails if a `"use client"` file is exported from the
  server entry.
- Components whose mount and unmount belong to Base UI (Dialog, and later Popover and Coachmark)
  animate with CSS transitions driven by its `data-starting-style` / `data-ending-style` attributes
  rather than with `motion`. Motion is for elements whose lifecycle we own; wrapping Base UI's in
  `AnimatePresence` would mean fighting it for control of the unmount.
- esbuild drops module-level directives when bundling and tsup's banner does not survive it, so the
  `"use client"` directive is stamped onto `dist/client.js` by a build step that also fails the
  build if the directive ever appears in the server entry.
- `prefers-reduced-motion` is not optional: transforms drop, opacity stays, and every animated
  component has a defined reduced-motion rendering.
