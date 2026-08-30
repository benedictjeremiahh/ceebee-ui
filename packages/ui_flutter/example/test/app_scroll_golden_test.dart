import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/app_scroll_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key appScrollGoldenKey = Key('app-scroll-golden');

void main() {
  testWidgets('App composition wide — light', (WidgetTester tester) async {
    await _pumpScene(tester, cbThemeData(), const Size(1000, 1100));
    await expectLater(
      find.byKey(appScrollGoldenKey),
      matchesGoldenFile('goldens/app_composition_wide_light.png'),
    );
  });

  testWidgets('App composition wide — dark', (WidgetTester tester) async {
    await _pumpScene(
      tester,
      cbThemeData(brightness: Brightness.dark),
      const Size(1000, 1100),
    );
    await expectLater(
      find.byKey(appScrollGoldenKey),
      matchesGoldenFile('goldens/app_composition_wide_dark.png'),
    );
  });

  testWidgets('App composition compact — light', (WidgetTester tester) async {
    await _pumpScene(tester, cbThemeData(), const Size(420, 1300));
    await expectLater(
      find.byKey(appScrollGoldenKey),
      matchesGoldenFile('goldens/app_composition_compact_light.png'),
    );
  });

  testWidgets('App composition compact — dark', (WidgetTester tester) async {
    await _pumpScene(
      tester,
      cbThemeData(brightness: Brightness.dark),
      const Size(420, 1300),
    );
    await expectLater(
      find.byKey(appScrollGoldenKey),
      matchesGoldenFile('goldens/app_composition_compact_dark.png'),
    );
  });
}

Future<void> _pumpScene(WidgetTester tester, ThemeData theme, Size size) async {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = size;
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);

  final TextStyle? buttonText = theme.textTheme.labelLarge?.copyWith(
    fontFamily: 'Roboto',
  );
  ButtonStyle? buttonStyle(ButtonStyle? style) => style?.copyWith(
    textStyle: WidgetStatePropertyAll<TextStyle?>(buttonText),
  );
  final ThemeData goldenTheme = theme.copyWith(
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
    appBarTheme: theme.appBarTheme.copyWith(
      titleTextStyle: theme.appBarTheme.titleTextStyle?.copyWith(
        fontFamily: 'Roboto',
      ),
      toolbarTextStyle: theme.appBarTheme.toolbarTextStyle?.copyWith(
        fontFamily: 'Roboto',
      ),
    ),
  );

  await tester.pumpWidget(
    MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: goldenTheme,
      home: Scaffold(
        body: SafeArea(
          child: RepaintBoundary(
            key: appScrollGoldenKey,
            child: ColoredBox(
              color: goldenTheme.scaffoldBackgroundColor,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(CbStructure.space5),
                child: const AppScrollGallery(),
              ),
            ),
          ),
        ),
      ),
    ),
  );
  await tester.pump();
}
