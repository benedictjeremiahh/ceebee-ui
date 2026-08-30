import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/steps_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key stepsGoldenKey = Key('steps-golden');

void main() {
  for (final (String name, ThemeData theme, Size size)
      in <(String, ThemeData, Size)>[
        ('wide_light', cbThemeData(), const Size(900, 650)),
        (
          'wide_dark',
          cbThemeData(brightness: Brightness.dark),
          const Size(900, 650),
        ),
        ('compact_light', cbThemeData(), const Size(420, 1100)),
        (
          'compact_dark',
          cbThemeData(brightness: Brightness.dark),
          const Size(420, 1100),
        ),
      ]) {
    testWidgets('Steps $name', (WidgetTester tester) async {
      tester.view.devicePixelRatio = 1;
      tester.view.physicalSize = size;
      addTearDown(tester.view.resetDevicePixelRatio);
      addTearDown(tester.view.resetPhysicalSize);
      await tester.pumpWidget(
        RepaintBoundary(
          key: stepsGoldenKey,
          child: MaterialApp(
            debugShowCheckedModeBanner: false,
            theme: _goldenTheme(theme),
            home: const Scaffold(
              body: SingleChildScrollView(
                padding: EdgeInsets.all(CbStructure.space5),
                child: StepsGallery(motion: false),
              ),
            ),
          ),
        ),
      );
      await tester.pump();
      await expectLater(
        find.byKey(stepsGoldenKey),
        matchesGoldenFile('goldens/steps_$name.png'),
      );
    });
  }
}

ThemeData _goldenTheme(ThemeData theme) {
  final TextStyle? buttonText = theme.textTheme.labelLarge?.copyWith(
    fontFamily: 'Roboto',
  );
  final ButtonStyle? filledButtonStyle = theme.filledButtonTheme.style
      ?.copyWith(textStyle: WidgetStatePropertyAll<TextStyle?>(buttonText));
  return theme.copyWith(
    textTheme: theme.textTheme.apply(fontFamily: 'Roboto'),
    filledButtonTheme: FilledButtonThemeData(style: filledButtonStyle),
  );
}
