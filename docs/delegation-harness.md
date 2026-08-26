# Delegation harness

The root agent owns architecture, public contracts, shared exports and Tokens, integration, and
the final verification gate. Cheaper agents accelerate bounded mapping, implementation, and review;
they do not replace root judgment.

## Routing

| Work | Agent | Writes | Root gate |
|---|---|---|---|
| Locate contracts, files, and acceptance criteria | `ceebee-mapper` (`gpt-5.6-luna`, low) | None | Check cited evidence and approve the packet |
| Implement one settled contract in an explicit allowlist | `ceebee-bounded-builder` (`gpt-5.6-luna`, medium) | Packet paths only | Review the diff and integrate shared files |
| Review a completed diff for semantic and regression defects | `ceebee-reviewer` (`gpt-5.6-terra`, medium) | None | Resolve findings and run integration checks |
| Make a boundary, Base UI, API, dependency, Token, or cross-component decision | Root (`gpt-5.6-sol`, high) | As required | Full verification |

Parallel builders must have disjoint path allowlists. The project caps one session at three
concurrent subagents so the root can still review every result without creating an unbounded queue.

## Required task packet

Every builder request includes all of the following:

1. Goal and explicit non-goals.
2. Exact write allowlist.
3. Interaction contract: semantic role, keyboard and focus behavior, state ownership, dismissal,
   positioning, and gestures.
4. Acceptance criteria for behavior, Tokens, accessibility, reduced motion, Skeleton, tests, and
   docs as applicable.
5. Commands the builder must run.
6. A stop condition and escalation triggers.

If any field is missing, the builder stops before editing. Path allowlists are enforced by the task
packet and root diff review; Codex custom-agent TOML does not provide a path-allowlist field.

## Escalation gates

The builder stops and returns evidence when work requires a shared export or Token, dependency or
configuration change, new client boundary, new public contract, cross-component edit, overlay or
focus decision, or an edit outside its allowlist. After one narrow repair attempt it also stops on a
failing check. It never converts a material interaction difference into a visual `variant`.

Root integration runs the focused spec plus `pnpm typecheck`, `pnpm test`, `pnpm build`, the docs
build when documentation changes, and `git diff --check`.

## Reliability evaluation

The initial A/B research test gave Luna and Terra the same open-ended harness-design prompt. Terra
used the documented Codex fields and current model names. Luna proposed an outdated model and
invented TOML keys for permissions and path allowlists. The result establishes a deliberate limit:
Luna receives a complete packet and never owns agent configuration or architectural research.

The first live implementation trial assigned `Space` to Luna and its independent review to Terra.
The initial build respected its allowlist and passed six focused checks, but review found broken
vertical separators, empty items for conditional children, and incomplete docs; it scored 57/100
and auto-failed. A finding-specific repair pass cleared the contract defects and raised the score to
87/100. Root then closed two geometry/docs details and ran integration checks. This is the intended
loop: focused tests are evidence, not acceptance, and a cheap result is never merged before an
independent semantic review.

The next `Descriptions` and `Result` trials repeated the pattern: both builders stayed within their
allowlists, reviewers found span, semantic-heading, and Token defects, and one bounded repair pass
raised `Descriptions` from 63 to 94 and `Result` from 58 to 85 before root integration. One reviewer
also treated a deliberately root-owned shared export as a builder failure. Root overruled that false
positive from the original packet, demonstrating that reviewer output is evidence rather than an
automatic merge or rejection decision.

The third wave added a browser gate to the evaluation. Reviewers correctly rejected Watermark's
fixed mark budget, focus clipping, invalid SVG pattern lengths, and duplicate IDs; root moved it to
the client boundary for `useId` and verified every density/direction pair in a real browser. The
same browser pass then found a BorderBeam defect that both its focused tests and a high-scoring
review missed: rotating a non-square overlay sent the border rectangle far outside its content.
Root changed the animation to rotate only a typed conic-gradient angle. The harness therefore never
treats reviewer score as a substitute for browser verification when layout or paint is the risk.

The fifth wave tested three interaction-heavy Terra builder packets in parallel. Their focused
suites all passed, yet independent review initially scored Menu 72, Calendar 72, and Slider 61.
Review found recursive key collisions and misleading disabled links in Menu, a CSS namespace
collision with DatePicker plus controlled-focus gaps in Calendar, and missing Field wiring,
step-alignment validation, and a motion-off API in Slider. Bounded repair packets raised coverage
to 8, 13, and 10 focused tests respectively before root integration. Review also caught raw Token
violations in root-built Popconfirm while root-built server-safe Notification scored 96. The useful
unit is therefore not “one cheaper agent produced code”; it is a narrow builder, an independent
reviewer, and a root-owned integration gate with enough separation that every layer can catch the
previous layer—including root work.

The sixth and seventh waves exercised the same harness through the final catalog closure. Parallel
bounded agents delivered TreeSelect, Cascader, ColorPicker, Listy, and PageContainer without
touching shared exports or the roadmap. Independent reviews scored the first TreeSelect and
ColorPicker passes 70 and 62, catching controlled-empty state, disabled-open behavior, invalid ARIA
grid ownership, unavailable values, and an undefined Token. Finding-specific repairs plus root
integration raised TreeSelect to 100, PageContainer to 97 before its docs fix, and ColorPicker to 94
before its final docs/regression fix. Listy scored 95 with one browser-containment geometry detail,
which root closed with a token-derived intrinsic size. This confirms the harness remains useful at
catalog scale: cheaper agents produce bounded throughput, while independent review and root gates
remain mandatory for semantic acceptance.

Evaluate routing with these objective cases:

1. Map `Space` without merging its item-spacing contract into `Flex`.
2. Reject folding anchored `Popconfirm` into modal confirmation.
3. Keep a server-safe `Card` visual change out of the client export.
4. Require Tokens, `motion={false}`, reduced-motion rendering, and a focused test for `BorderBeam`.
5. Stop on an out-of-scope edit or unresolved failing check instead of modifying unrelated files.

Score contract correctness at 40%, scope adherence at 25%, verification at 20%, and evidence/docs at
15%. A cheaper route is trusted only after it passes at least four of five cases twice without the
root rewriting its conclusion. Any schema fabrication, allowlist violation, or interaction-contract
error is an automatic failure regardless of total score.

Run `pnpm check:delegation-harness` after changing the custom-agent files. This validator catches
unknown keys, unsupported project model names, missing instructions, and invalid sandbox modes.

## Sources

- [Codex subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)
- [GPT-5.6 model guidance](https://developers.openai.com/api/docs/guides/latest-model)
- [Responses API multi-agent guide](https://developers.openai.com/api/docs/guides/responses-multi-agent)
