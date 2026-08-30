import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/painting.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('converts the CSS Color 4 red vector to sRGB', () {
    const CbOklch red = CbOklch(0.62796, 0.25768, 29.234);
    final Color color = red.toColor();

    expect(color.r, closeTo(1, 0.001));
    expect(color.g, closeTo(0, 0.001));
    expect(color.b, closeTo(0, 0.001));
  });

  test('converts the CSS Color 4 green vector to sRGB', () {
    const CbOklch green = CbOklch(0.86644, 0.29483, 142.495);

    expectColor(green.toColor(), red: 0, green: 1, blue: 0);
  });

  test('converts the CSS Color 4 blue vector to sRGB', () {
    const CbOklch blue = CbOklch(0.45201, 0.31321, 264.052);

    expectColor(blue.toColor(), red: 0, green: 0, blue: 1);
  });

  test('matches the browser sRGB rendering of an out-of-gamut brand color', () {
    const CbOklch brand = CbOklch(0.62, 0.2, 274);

    expect(brand.toColor().toARGB32(), 0xff6574fc);
  });

  test('keeps the chromatic hue when mixing with an achromatic surface', () {
    const CbOklch success = CbOklch(0.62, 0.15, 145);
    const CbOklch white = CbOklch(1, 0, 0);

    expect(success.mix(white, 0.12).hue, 145);
  });
}

void expectColor(
  Color actual, {
  required double red,
  required double green,
  required double blue,
}) {
  // Published CSS Color 4 vectors are rounded, so allow less than one 8-bit channel step.
  expect(actual.r, closeTo(red, 0.003));
  expect(actual.g, closeTo(green, 0.003));
  expect(actual.b, closeTo(blue, 0.003));
}
