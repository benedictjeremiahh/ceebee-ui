import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/result_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key resultGoldenKey = Key('result-golden');

void main() {
  for (final (String name, ThemeData theme, Size size)
      in <(String, ThemeData, Size)>[
        ('wide_light', cbThemeData(), const Size(900, 900)),
        (
          'wide_dark',
          cbThemeData(brightness: Brightness.dark),
          const Size(900, 900),
        ),
        ('compact_light', cbThemeData(), const Size(420, 1200)),
        (
          'compact_dark',
          cbThemeData(brightness: Brightness.dark),
          const Size(420, 1200),
        ),
      ]) {
    testWidgets('Result $name', (WidgetTester tester) async {
      tester.view.devicePixelRatio = 1;
      tester.view.physicalSize = size;
      addTearDown(tester.view.resetDevicePixelRatio);
      addTearDown(tester.view.resetPhysicalSize);
      await tester.pumpWidget(
        RepaintBoundary(
          key: resultGoldenKey,
          child: MaterialApp(
            debugShowCheckedModeBanner: false,
            theme: _goldenTheme(theme),
            home: const Scaffold(
              body: SingleChildScrollView(
                padding: EdgeInsets.all(CbStructure.space5),
                child: ResultGallery(motion: false),
              ),
            ),
          ),
        ),
      );
      await tester.pump();
      await expectLater(
        find.byKey(resultGoldenKey),
        matchesGoldenFile('goldens/result_$name.png'),
      );
    });
  }
}

ThemeData _goldenTheme(ThemeData theme) {
  final TextStyle? buttonText = theme.textTheme.labelLarge?.copyWith(
    fontFamily: 'Roboto',
  );
  ButtonStyle? buttonStyle(ButtonStyle? style) => style?.copyWith(
    textStyle: WidgetStatePropertyAll<TextStyle?>(buttonText),
  );
  return theme.copyWith(
    textTheme: theme.textTheme.apply(fontFamily: 'Roboto'),
    filledButtonTheme: FilledButtonThemeData(
      style: buttonStyle(theme.filledButtonTheme.style),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: buttonStyle(theme.outlinedButtonTheme.style),
    ),
  );
}
