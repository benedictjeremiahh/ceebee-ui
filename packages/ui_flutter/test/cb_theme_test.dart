import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('theme data exposes high contrast to Ceebee materials', () {
    final CbTheme theme = cbThemeData(highContrast: true).extension<CbTheme>()!;

    expect(theme.highContrast, isTrue);
  });

  test('theme interpolation enables reduced transparency immediately', () {
    final CbSkinTokens tokens = CbSkinTokens.resolve(
      skin: CbSkin.ceebee,
      brightness: Brightness.light,
    );
    final CbTheme from = CbTheme(
      skin: CbSkin.ceebee,
      tokens: tokens,
      highContrast: false,
      reduceTransparency: false,
    );
    final CbTheme to = CbTheme(
      skin: CbSkin.ceebee,
      tokens: tokens,
      highContrast: false,
      reduceTransparency: true,
    );

    expect(from.lerp(to, 0.1).reduceTransparency, isTrue);
  });
}
