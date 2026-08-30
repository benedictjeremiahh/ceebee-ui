# Ceebee UI for Flutter

This application is the Flutter documentation and visual gallery for `ceebee_ui`. It intentionally
lives separately from the React documentation, while both products share the vocabulary in the
repository's `CONTEXT.md` and the canonical CSS Token source.

The published interactive gallery is available at
[ui-flutter.ceebee.biz.id](https://ui-flutter.ceebee.biz.id). The web component documentation is
available at [ui.ceebee.biz.id](https://ui.ceebee.biz.id).

On the web, the gallery includes a layout-only device preview with phone and tablet presets,
orientation, text scaling, and safe-area simulation. Rendering, gestures, keyboard behavior,
platform dialogs, and performance can still differ from native Android and iOS builds, so release
validation remains a device responsibility.

Run locally:

```sh
flutter run
```

The gallery links to the published web documentation by default. Override the reciprocal link for
local development when needed:

```sh
flutter run --dart-define=CEEBEE_WEB_DOCS_URL=http://localhost:4100
```

The same gallery runs on web, Android, and iOS. Its application lockfile is committed for
reproducible builds; the parent reusable package's lockfile is not.
