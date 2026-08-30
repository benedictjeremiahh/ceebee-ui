# MaterialApp owns Flutter Theme selection

Flutter consumers install Ceebee-generated `ThemeData` into MaterialApp's light, dark, high-contrast, and high-contrast-dark slots; Flutter remains responsible for selecting the resolved Theme from system preferences. `CbTheme` is only a `ThemeExtension` inside that `ThemeData`, while the app explicitly supplies the active Skin and reduced-transparency preference. We reject a second `CeebeeTheme` provider because it would duplicate Flutter's Theme ownership and introduce library-owned preference state.
