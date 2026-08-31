# CI reliability

The repository measures GitHub Actions reliability from job and step results, not from the colour of
an individual workflow run. Generate the same report locally with:

```bash
pnpm report:ci-reliability -- --since 2026-08-01 --until 2026-08-31
```

The command needs an authenticated GitHub CLI session. Add `--json` for machine-readable output or
`--repo owner/name` when the current directory is not the target repository.

## August 2026 baseline

At 2026-08-31T03:43Z, GitHub retained 127 completed runs containing 197 jobs for 2026-08-01 through
2026-08-31. Of those, 85 jobs failed: **43.1%**. The issue that triggered this work recorded 99 of 219
jobs from an earlier query. Those totals no longer reproduce against the retained API data, so this
document records both the discrepancy and a timestamped reproducible result rather than silently
rewriting history. The reporter prints its generation time because an inclusive current-day window
continues changing as new jobs finish.

All 85 retained failures were on `push`; no retained pull-request job failed. The failures were
deterministic, not random infrastructure noise:

| Failed step or job | Jobs | Cause | Resolution |
| --- | ---: | --- | --- |
| `verify / check:flutter-tokens` | 27 | Generated Flutter tokens were not updated with their CSS source. | The generator owns web Ant seeds and Flutter outputs; CI verifies the checked-in artefacts. |
| Flutter current-stable package tests | 17 | macOS golden baselines were compared on Linux. | Linux runs exclude golden tests; a dedicated macOS job owns all golden comparisons. |
| Flutter minimum-SDK jobs | 17 | The matrix claimed support for Flutter 3.35 while the public API used 3.47-only APIs. | The declared and tested baseline is now Flutter 3.47.1. |
| `Release / changesets/action` | 16 | Mixed causes: Actions lacked pull-request permission, changesets named a non-workspace Dart package, and CI attempted an interactive npm publish/tag push. | PR permission is enabled; changesets cover npm packages only; the workflow now maintains the version PR but does not publish. |
| `pnpm/action-setup` | 8 | Workflow and `packageManager` declared two different pnpm versions. | Workflows defer to the single version in `package.json`. |

The counts above overlap the reporter's step view only where a job exposed a failed step. They are an
attribution of the retained failures, not a claim that every historical log still exists forever.

## Policy

- A deterministic failure is fixed at its owner or the check is removed when it does not represent a
  supported contract.
- Golden tests run only on the platform that owns the checked-in baseline.
- Generated artefacts are checked, never regenerated implicitly by CI.
- Network retries require evidence of a transient network failure. None of the August failures met
  that bar, so adding retries would only hide defects.
- The Release workflow versions packages. npm publication remains an explicit operator action until
  trusted publishing is configured and proven in this repository.

## Follow-up window

The acceptance window is 2026-08-31 through 2026-09-14. It cannot be evaluated before the end of that
period. Run:

```bash
pnpm report:ci-reliability -- --since 2026-08-31 --until 2026-09-14
```

Record the completed-job failure rate on the tracking issue. A materially lower result means below
10%, with every remaining failure attributed; the target is not achieved by cancelling or skipping
jobs.
