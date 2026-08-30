import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('Astra keeps the canonical light high-contrast border', () {
    final CbSkinTokens tokens = CbSkinTokens.resolve(
      skin: CbSkin.astra,
      brightness: Brightness.light,
      highContrast: true,
    );

    expect(tokens.border, const CbOklch(0.7, 0.014, 280));
  });

  test('Clarity keeps the canonical dark high-contrast border', () {
    final CbSkinTokens tokens = CbSkinTokens.resolve(
      skin: CbSkin.clarity,
      brightness: Brightness.dark,
      highContrast: true,
    );

    expect(tokens.border, const CbOklch(0.58, 0.026, 280));
  });
}
