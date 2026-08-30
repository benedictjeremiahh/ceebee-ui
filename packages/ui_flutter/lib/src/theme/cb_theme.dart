import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/tokens/generated/structure.g.dart';
import 'package:ceebee_ui/src/tokens/oklch.dart';
import 'package:ceebee_ui/src/tokens/skin_tokens.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

/// The resolved Skin, carried on [ThemeData] so any widget can read a Token without a second
/// provider in the tree — and so `AnimatedTheme` interpolates the Skin along with everything else.
@immutable
class CbTheme extends ThemeExtension<CbTheme> {
  const CbTheme({
    required this.skin,
    required this.tokens,
    required this.highContrast,
    required this.reduceTransparency,
  });

  final CbSkin skin;
  final CbSkinTokens tokens;

  /// Whether high-contrast material edges are active.
  final bool highContrast;

  /// Whether glass renders as its opaque fallback.
  ///
  /// The web reads `prefers-reduced-transparency`. Flutter surfaces no such flag, so the app
  /// states it — and high contrast forces it on regardless, as the CSS does.
  final bool reduceTransparency;

  static CbTheme of(BuildContext context) {
    final CbTheme? theme = Theme.of(context).extension<CbTheme>();
    assert(
      theme != null,
      'No CbTheme found. Add cbThemeData(...) to MaterialApp theme configuration.',
    );
    return theme!;
  }

  /// The accent a Surface wears for this Tone and decorative hue.
  CbOklch accent({CbTone tone = CbTone.neutral, CbDecorHue? hue}) =>
      tokens.accent(tone: tone, hue: hue);

  @override
  CbTheme copyWith({
    CbSkin? skin,
    CbSkinTokens? tokens,
    bool? highContrast,
    bool? reduceTransparency,
  }) => CbTheme(
    skin: skin ?? this.skin,
    tokens: tokens ?? this.tokens,
    highContrast: highContrast ?? this.highContrast,
    reduceTransparency: reduceTransparency ?? this.reduceTransparency,
  );

  @override
  CbTheme lerp(ThemeExtension<CbTheme>? other, double t) {
    if (other is! CbTheme) return this;
    if (t <= 0) return this;
    if (t >= 1) return other;
    return CbTheme(
      // A Skin is an identity, not a scale: it changes over once the interpolation is past half.
      skin: t < 0.5 ? skin : other.skin,
      tokens: CbSkinTokens.lerp(tokens, other.tokens, t),
      highContrast: highContrast || other.highContrast,
      // Accessibility wins throughout an in-flight transition. Blur disappears immediately when
      // requested and returns only once a transition away from the preference has completed.
      reduceTransparency: reduceTransparency || other.reduceTransparency,
    );
  }

  @override
  bool operator ==(Object other) =>
      other is CbTheme &&
      other.skin == skin &&
      other.tokens == tokens &&
      other.highContrast == highContrast &&
      other.reduceTransparency == reduceTransparency;

  @override
  int get hashCode =>
      Object.hash(skin, tokens, highContrast, reduceTransparency);
}

/// Reads a Token off the nearest [CbTheme].
extension CbThemeContext on BuildContext {
  /// The resolved Skin Tokens.
  CbSkinTokens get cb => CbTheme.of(this).tokens;

  /// The resolved Skin itself, and the flags that change how a material renders.
  CbTheme get cbTheme => CbTheme.of(this);
}

/// The radius steps a Surface accepts. Never a number.
enum CbRadius { none, sm, md, lg, xl }

extension CbRadiusValue on CbRadius {
  double get value => switch (this) {
    CbRadius.none => CbStructure.radiusNone,
    CbRadius.sm => CbStructure.radiusSm,
    CbRadius.md => CbStructure.radiusMd,
    CbRadius.lg => CbStructure.radiusLg,
    CbRadius.xl => CbStructure.radiusXl,
  };

  BorderRadius get borderRadius => BorderRadius.circular(value);
}

/// The padding steps a Surface accepts, matching `.cb-pad--*`.
enum CbPad { none, sm, md, lg }

extension CbPadValue on CbPad {
  double get value => switch (this) {
    CbPad.none => CbStructure.space0,
    CbPad.sm => CbStructure.space3,
    CbPad.md => CbStructure.space5,
    CbPad.lg => CbStructure.space6,
  };

  EdgeInsets get insets => EdgeInsets.all(value);
}

/// The elevation steps a Surface accepts, matching `.cb-elevation--*`.
enum CbElevation { none, sm, md, lg }

extension CbElevationShadows on CbElevation {
  List<CbShadow> shadows(CbSkinTokens tokens) => switch (this) {
    CbElevation.none => tokens.shadowNone,
    CbElevation.sm => tokens.shadowSm,
    CbElevation.md => tokens.shadowMd,
    CbElevation.lg => tokens.shadowLg,
  };
}
