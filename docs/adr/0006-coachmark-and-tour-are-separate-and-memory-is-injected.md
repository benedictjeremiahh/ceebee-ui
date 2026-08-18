# Coachmark and Tour are two layers, and the library never remembers who saw what

A `Coachmark` is one anchored bubble and a `Tour` is the controller that sequences them, so a single
bubble is usable without buying into a tour. Whether a person has already seen a Tour is answered by
a Seen Store the consuming app injects; the library ships the interface and no implementation,
because a library that reaches for `localStorage` has quietly decided what a user is and where their
state lives, and that is the assumption that makes onboarding libraries impossible to remove.

## Consequences

- The one-line convenience (`<Tour id="x" />` that just works) is deliberately absent; the app wires
  three lines instead and keeps ownership of its own user state.
- Sequencing is ours and therefore tested: target not yet mounted, target unmounted mid-tour,
  layout shift under the spotlight, skip, and resume.
