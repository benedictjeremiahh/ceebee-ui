import 'dart:ui' show lerpDouble;

import 'package:flutter/foundation.dart';

import 'package:ceebee_ui/src/tokens/oklch.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

part 'package:ceebee_ui/src/tokens/generated/skins.g.dart';

/// The Skins this package ships. Swapping brands means selecting a different [CbSkin], never
/// editing a component — the same contract the CSS Skin files hold on the web.
enum CbSkin {
  /// The default Ceebee Skin.
  ceebee,

  /// The violet-to-blue gradient dashboard look.
  astra,

  /// The content-first glass Skin.
  clarity,
}

/// Which rendering of a Skin is in force: the resolved Theme, plus the reader's contrast setting.
enum _CbVariantKey { light, lightHighContrast, dark, darkHighContrast }

/// The resolved skin Tokens for one Skin, Theme, and contrast preference.
///
/// Every field here corresponds to one `--cb-*` custom property. The class is generated-adjacent
/// on purpose: the values come from the CSS, this only gives them names and a type.
@immutable
class CbSkinTokens {
  const CbSkinTokens({
    required this.brand50,
    required this.brand100,
    required this.brand200,
    required this.brand300,
    required this.brand400,
    required this.brand500,
    required this.brand600,
    required this.brand700,
    required this.bg,
    required this.bgSubtle,
    required this.surface,
    required this.surfaceRaised,
    required this.border,
    required this.borderStrong,
    required this.fg,
    required this.fgMuted,
    required this.fgSubtle,
    required this.fgOnBrand,
    required this.toneNeutral,
    required this.toneBrand,
    required this.toneInfo,
    required this.toneSuccess,
    required this.toneWarning,
    required this.toneDanger,
    required this.decorViolet,
    required this.decorBlue,
    required this.decorTeal,
    required this.decorGreen,
    required this.decorAmber,
    required this.decorRose,
    required this.scrim,
    required this.scrimStrong,
    required this.onWarning,
    required this.shadowNone,
    required this.shadowSm,
    required this.shadowMd,
    required this.shadowLg,
    required this.glassBg,
    required this.glassBgOpaque,
    required this.glassBorder,
    required this.glassBorderStrong,
    required this.glassBlur,
    required this.glassSaturation,
    required this.glassSpecular,
    required this.glassInset,
    required this.glassClearBg,
    required this.glassClearBorder,
    required this.glassClearBlur,
    required this.glassClearSaturation,
    required this.glassClearSpecular,
    required this.glassClearInset,
    required this.tintStrength,
    required this.gradientAngle,
    required this.fontSans,
    required this.fontMono,
  });

  final CbOklch brand50;
  final CbOklch brand100;
  final CbOklch brand200;
  final CbOklch brand300;
  final CbOklch brand400;
  final CbOklch brand500;
  final CbOklch brand600;
  final CbOklch brand700;

  final CbOklch bg;
  final CbOklch bgSubtle;
  final CbOklch surface;
  final CbOklch surfaceRaised;
  final CbOklch border;
  final CbOklch borderStrong;

  final CbOklch fg;
  final CbOklch fgMuted;
  final CbOklch fgSubtle;
  final CbOklch fgOnBrand;

  final CbOklch toneNeutral;
  final CbOklch toneBrand;
  final CbOklch toneInfo;
  final CbOklch toneSuccess;
  final CbOklch toneWarning;
  final CbOklch toneDanger;

  final CbOklch decorViolet;
  final CbOklch decorBlue;
  final CbOklch decorTeal;
  final CbOklch decorGreen;
  final CbOklch decorAmber;
  final CbOklch decorRose;

  final CbOklch scrim;
  final CbOklch scrimStrong;

  /// Text on the warning ramp, which is too light to carry white.
  final CbOklch onWarning;

  final List<CbShadow> shadowNone;
  final List<CbShadow> shadowSm;
  final List<CbShadow> shadowMd;
  final List<CbShadow> shadowLg;

  final CbOklch glassBg;

  /// What glass falls back to when transparency is unavailable or unwanted.
  final CbOklch glassBgOpaque;
  final CbOklch glassBorder;
  final CbOklch glassBorderStrong;
  final double glassBlur;
  final double glassSaturation;
  final CbGradient glassSpecular;
  final List<CbShadow> glassInset;

  final CbOklch glassClearBg;
  final CbOklch glassClearBorder;
  final double glassClearBlur;
  final double glassClearSaturation;
  final CbGradient glassClearSpecular;
  final List<CbShadow> glassClearInset;

  final double tintStrength;
  final double gradientAngle;

  final List<String> fontSans;
  final List<String> fontMono;

  /// The accent a Surface wears, resolved the way the CSS does: a decorative hue wins over a Tone.
  CbOklch accent({CbTone tone = CbTone.neutral, CbDecorHue? hue}) {
    if (hue != null) {
      return switch (hue) {
        CbDecorHue.violet => decorViolet,
        CbDecorHue.blue => decorBlue,
        CbDecorHue.teal => decorTeal,
        CbDecorHue.green => decorGreen,
        CbDecorHue.amber => decorAmber,
        CbDecorHue.rose => decorRose,
      };
    }
    return switch (tone) {
      CbTone.neutral => toneNeutral,
      CbTone.brand => toneBrand,
      CbTone.info => toneInfo,
      CbTone.success => toneSuccess,
      CbTone.warning => toneWarning,
      CbTone.danger => toneDanger,
    };
  }

  /// Readable text on a filled [tone], mirroring the CSS pairing: the warning ramp is the one
  /// that cannot carry white.
  CbOklch onTone(CbTone tone) => tone == CbTone.warning ? onWarning : fgOnBrand;

  /// Interpolates every Token, so a Theme or Skin change animates instead of snapping.
  static CbSkinTokens lerp(CbSkinTokens a, CbSkinTokens b, double t) =>
      _lerpCbSkinTokens(a, b, t);

  static CbSkinTokens resolve({
    required CbSkin skin,
    required Brightness brightness,
    bool highContrast = false,
  }) {
    final _CbVariantKey key = switch ((brightness, highContrast)) {
      (Brightness.light, false) => _CbVariantKey.light,
      (Brightness.light, true) => _CbVariantKey.lightHighContrast,
      (Brightness.dark, false) => _CbVariantKey.dark,
      (Brightness.dark, true) => _CbVariantKey.darkHighContrast,
    };
    return _cbSkinRegistry[skin]![key]!;
  }
}
