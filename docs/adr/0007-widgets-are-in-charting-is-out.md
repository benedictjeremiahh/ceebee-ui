# Small SVG widgets ship with the library; charting does not

`ProgressRing`, `Donut`, `Sparkline`, `BarMini`, `StatCard`, and `Leaderboard` are hand-written SVG
inside the library, because they are what make a dashboard look considered and they need no
dependency. Anything requiring an axis, a scale, or a tooltip over a series is a Chart and belongs to
the consuming app's charting library.

## Consequences

- The boundary is stated as a test — *does it need an axis?* — so the next "just add a small line
  chart with dates" request has an answer that does not depend on mood.
- Widgets are themed by Tokens like everything else; a Widget never takes a hex.
