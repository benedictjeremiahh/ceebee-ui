import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/motion_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key motionGoldenKey = Key('motion-golden');

void main() {
  testWidgets('Motion final state wide — light', (WidgetTester tester) async {
    await _pumpGallery(tester, cbThemeData(), const Size(900, 700));
    await expectLater(
      find.byKey(motionGoldenKey),
      matchesGoldenFile('goldens/motion_wide_light.png'),
    );
  });

  testWidgets('Motion final state wide — dark', (WidgetTester tester) async {
    await _pumpGallery(
      tester,
      cbThemeData(brightness: Brightness.dark),
      const Size(900, 700),
    );
    await expectLater(
      find.byKey(motionGoldenKey),
      matchesGoldenFile('goldens/motion_wide_dark.png'),
    );
  });

  testWidgets('Motion final state compact — light', (
    WidgetTester tester,
  ) async {
    await _pumpGallery(tester, cbThemeData(), const Size(420, 1100));
    await expectLater(
      find.byKey(motionGoldenKey),
      matchesGoldenFile('goldens/motion_compact_light.png'),
    );
  });

  testWidgets('Motion final state compact — dark', (WidgetTester tester) async {
    await _pumpGallery(
      tester,
      cbThemeData(brightness: Brightness.dark),
      const Size(420, 1100),
    );
    await expectLater(
      find.byKey(motionGoldenKey),
      matchesGoldenFile('goldens/motion_compact_dark.png'),
    );
  });
}

Future<void> _pumpGallery(
  WidgetTester tester,
  ThemeData theme,
  Size size,
) async {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = size;
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);

  final ThemeData goldenTheme = _goldenTheme(theme);
  await tester.pumpWidget(
    RepaintBoundary(
      key: motionGoldenKey,
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: goldenTheme,
        home: const Scaffold(
          body: SingleChildScrollView(
            padding: EdgeInsets.all(CbStructure.space5),
            child: MotionGallery(),
          ),
        ),
      ),
    ),
  );
  await tester.pumpAndSettle();
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
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: buttonStyle(theme.elevatedButtonTheme.style),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: buttonStyle(theme.outlinedButtonTheme.style),
    ),
    textButtonTheme: TextButtonThemeData(
      style: buttonStyle(theme.textButtonTheme.style),
    ),
  );
}
