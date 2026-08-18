# Carousel is built on Embla rather than native scroll-snap

Embla drives the carousel, with Motion layered on for slide presentation. CSS scroll-snap was the
lighter option and would have given touch momentum and keyboard behaviour for free, but desktop
drag, loop, alignment, and per-breakpoint behaviour are exactly the parts that get rewritten twice
when hand-rolled, and Embla is small and battle-tested.

## Consequences

- One more peer dependency, and scroll behaviour is JavaScript-driven rather than native — slides do
  not degrade gracefully if the script fails.
- What we test is our own: index and loop maths, autoplay pausing on hover *and* on focus, and the
  reduced-motion rendering.
