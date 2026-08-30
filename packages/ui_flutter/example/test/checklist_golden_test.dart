import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/checklist_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key checklistGoldenKey = Key('checklist-golden');

void main() {
  for (final (String name, ThemeData theme, Size size)
      in <(String, ThemeData, Size)>[
        ('wide_light', cbThemeData(), const Size(900, 650)),
        (
          'wide_dark',
          cbThemeData(brightness: Brightness.dark),
          const Size(900, 650),
        ),
        ('compact_light', cbThemeData(), const Size(420, 1050)),
        (
          'compact_dark',
          cbThemeData(brightness: Brightness.dark),
          const Size(420, 1050),
        ),
      ]) {
    testWidgets('Checklist $name', (WidgetTester tester) async {
      tester.view.devicePixelRatio = 1;
      tester.view.physicalSize = size;
      addTearDown(tester.view.resetDevicePixelRatio);
      addTearDown(tester.view.resetPhysicalSize);
      await tester.pumpWidget(
        RepaintBoundary(
          key: checklistGoldenKey,
          child: MaterialApp(
            debugShowCheckedModeBanner: false,
            theme: _goldenTheme(theme),
            home: const Scaffold(
              body: SingleChildScrollView(
                padding: EdgeInsets.all(CbStructure.space5),
                child: ChecklistGallery(),
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();
      await expectLater(
        find.byKey(checklistGoldenKey),
        matchesGoldenFile('goldens/checklist_$name.png'),
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
    textButtonTheme: TextButtonThemeData(
      style: buttonStyle(theme.textButtonTheme.style),
    ),
  );
}
