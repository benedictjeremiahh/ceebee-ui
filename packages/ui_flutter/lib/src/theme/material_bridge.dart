import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/structure.g.dart';
import 'package:ceebee_ui/src/tokens/oklch.dart';
import 'package:ceebee_ui/src/tokens/skin_tokens.dart';

/// Translates Ceebee's Tokens into Material's theme, the way `ThemeBridge` translates them into
/// Ant's on the web.
///
/// Material still owns component geometry, interaction, accessibility, and every derived value it
/// computes for itself; Ceebee owns the Skin, the Theme, and the Surface variants. Nothing here
/// writes a raw value — every number comes from a Token.
ThemeData cbThemeData({
  CbSkin skin = CbSkin.ceebee,
  Brightness brightness = Brightness.light,
  bool highContrast = false,
  bool reduceTransparency = false,
}) {
  final CbSkinTokens tokens = CbSkinTokens.resolve(
    skin: skin,
    brightness: brightness,
    highContrast: highContrast,
  );
  final ColorScheme scheme = cbColorScheme(tokens, brightness);
  final TextTheme text = cbTextTheme(tokens);

  return ThemeData(
    useMaterial3: true,
    brightness: brightness,
    colorScheme: scheme,
    textTheme: text,
    scaffoldBackgroundColor: tokens.bg.toColor(),
    canvasColor: tokens.bg.toColor(),
    dividerColor: tokens.border.toColor(),
    fontFamilyFallback: tokens.fontSans,
    extensions: <ThemeExtension<dynamic>>[
      CbTheme(
        skin: skin,
        tokens: tokens,
        highContrast: highContrast,
        // High contrast drops the material, exactly as the CSS does.
        reduceTransparency: reduceTransparency || highContrast,
      ),
    ],
    appBarTheme: AppBarTheme(
      backgroundColor: tokens.bg.toColor(),
      foregroundColor: tokens.fg.toColor(),
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      scrolledUnderElevation: 0,
      titleTextStyle: text.titleLarge,
    ),
    cardTheme: CardThemeData(
      color: tokens.surface.toColor(),
      surfaceTintColor: Colors.transparent,
    ),
    dividerTheme: DividerThemeData(
      color: tokens.border.toColor(),
      thickness: CbStructure.borderWidth,
      space: CbStructure.space4,
    ),
    iconTheme: IconThemeData(color: tokens.fg.toColor()),
    filledButtonTheme: FilledButtonThemeData(style: _buttonTypeStyle(text)),
    elevatedButtonTheme: ElevatedButtonThemeData(style: _buttonTypeStyle(text)),
    outlinedButtonTheme: OutlinedButtonThemeData(style: _buttonTypeStyle(text)),
    textButtonTheme: TextButtonThemeData(style: _buttonTypeStyle(text)),
    inputDecorationTheme: InputDecorationThemeData(
      hintStyle: text.bodyMedium?.copyWith(color: tokens.fgSubtle.toColor()),
    ),
  );
}

/// Maps skin Tokens onto Material's colour roles.
///
/// The container roles have no Token of their own: they are the accent mixed into the Surface at
/// `--cb-tint-strength`, which is the same construction `Surface variant="tinted"` uses. One
/// strength Token therefore retunes both.
ColorScheme cbColorScheme(CbSkinTokens tokens, Brightness brightness) {
  final bool isLight = brightness == Brightness.light;
  CbOklch container(CbOklch accent) =>
      accent.mix(tokens.surface, tokens.tintStrength);

  return ColorScheme(
    brightness: brightness,
    primary: tokens.toneBrand.toColor(),
    onPrimary: tokens.fgOnBrand.toColor(),
    primaryContainer: container(tokens.toneBrand).toColor(),
    onPrimaryContainer: (isLight ? tokens.brand700 : tokens.brand100).toColor(),
    secondary: tokens.toneInfo.toColor(),
    onSecondary: tokens.fgOnBrand.toColor(),
    secondaryContainer: container(tokens.toneInfo).toColor(),
    onSecondaryContainer: tokens.fg.toColor(),
    tertiary: tokens.decorTeal.toColor(),
    onTertiary: tokens.fgOnBrand.toColor(),
    tertiaryContainer: container(tokens.decorTeal).toColor(),
    onTertiaryContainer: tokens.fg.toColor(),
    error: tokens.toneDanger.toColor(),
    onError: tokens.fgOnBrand.toColor(),
    errorContainer: container(tokens.toneDanger).toColor(),
    onErrorContainer: tokens.fg.toColor(),
    surface: tokens.surface.toColor(),
    onSurface: tokens.fg.toColor(),
    onSurfaceVariant: tokens.fgMuted.toColor(),
    surfaceDim: tokens.bgSubtle.toColor(),
    surfaceBright: tokens.surfaceRaised.toColor(),
    surfaceContainerLowest: tokens.bg.toColor(),
    surfaceContainerLow: tokens.bgSubtle.toColor(),
    surfaceContainer: tokens.surface.toColor(),
    surfaceContainerHigh: tokens.surfaceRaised.toColor(),
    surfaceContainerHighest: tokens.surfaceRaised.toColor(),
    outline: tokens.borderStrong.toColor(),
    outlineVariant: tokens.border.toColor(),
    // The inverse pair is the foreground and background swapped, which is what a snackbar or a
    // selected-text highlight actually needs.
    inverseSurface: tokens.fg.toColor(),
    onInverseSurface: tokens.bg.toColor(),
    inversePrimary: (isLight ? tokens.brand300 : tokens.brand600).toColor(),
    surfaceTint: tokens.toneBrand.toColor(),
    scrim: tokens.scrim.toColor(),
    shadow: tokens.shadowMd.isEmpty
        ? tokens.fg.toColor()
        : tokens.shadowMd.first.color.toColor(),
  );
}

/// The type scale, built from the structure Tokens rather than Material's own.
///
/// Sizes stay in logical pixels: a reader's own scaling arrives through `MediaQuery.textScaler`,
/// which is a preference, not a Token.
TextTheme cbTextTheme(CbSkinTokens tokens) {
  final Color fg = tokens.fg.toColor();
  final Color muted = tokens.fgMuted.toColor();

  TextStyle heading(double size) => TextStyle(
    fontSize: size,
    height: CbStructure.leadingTight,
    fontWeight: CbStructure.weightSemibold,
    color: fg,
    fontFamilyFallback: tokens.fontSans,
  );

  TextStyle body(double size, {FontWeight? weight, Color? color}) => TextStyle(
    fontSize: size,
    height: CbStructure.leadingNormal,
    fontWeight: weight ?? CbStructure.weightRegular,
    color: color ?? fg,
    fontFamilyFallback: tokens.fontSans,
  );

  return TextTheme(
    displayLarge: heading(CbStructure.text3xl),
    displayMedium: heading(CbStructure.text3xl),
    displaySmall: heading(CbStructure.text2xl),
    headlineLarge: heading(CbStructure.text3xl),
    headlineMedium: heading(CbStructure.text2xl),
    headlineSmall: heading(CbStructure.textXl),
    titleLarge: heading(CbStructure.textXl),
    titleMedium: body(CbStructure.textLg, weight: CbStructure.weightMedium),
    titleSmall: body(CbStructure.textMd, weight: CbStructure.weightMedium),
    bodyLarge: body(CbStructure.textLg),
    bodyMedium: body(CbStructure.textMd),
    bodySmall: body(CbStructure.textSm, color: muted),
    labelLarge: body(CbStructure.textMd, weight: CbStructure.weightMedium),
    labelMedium: body(CbStructure.textSm, weight: CbStructure.weightMedium),
    labelSmall: body(
      CbStructure.textXs,
      weight: CbStructure.weightMedium,
      color: muted,
    ),
  );
}

ButtonStyle _buttonTypeStyle(TextTheme text) {
  return ButtonStyle(
    // Foreground is state-aware and remains owned by each Material button class.
    // Carrying the Typography colour here would override disabled, tonal, and
    // destructive foreground roles.
    textStyle: WidgetStatePropertyAll<TextStyle?>(_typeOnly(text.labelLarge)),
  );
}

TextStyle _typeOnly(TextStyle? style) => TextStyle(
  fontSize: style?.fontSize,
  height: style?.height,
  fontWeight: style?.fontWeight,
  fontFamily: style?.fontFamily,
  fontFamilyFallback: style?.fontFamilyFallback,
);
