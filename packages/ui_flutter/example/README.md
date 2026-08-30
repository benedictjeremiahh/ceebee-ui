# Ceebee UI for Flutter

This application is the Flutter documentation and visual gallery for `ceebee_ui`. It intentionally
lives separately from the React documentation, while both products share the vocabulary in the
repository's `CONTEXT.md` and the canonical CSS Token source.

Run locally:

```sh
flutter run
```

Provide the reciprocal web documentation link at build or run time:

```sh
flutter run --dart-define=CEEBEE_WEB_DOCS_URL=http://localhost:4100
```

The same gallery runs on web, Android, and iOS. Its application lockfile is committed for
reproducible builds; the parent reusable package's lockfile is not.
