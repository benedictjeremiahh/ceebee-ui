import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/color_picker_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key colorPickerGoldenKey = Key('color-picker-golden');

void main() {
  for (final (String name, ThemeData theme, Size size)
      in <(String, ThemeData, Size)>[
        ('wide_light', cbThemeData(), const Size(900, 560)),
        (
          'wide_dark',
          cbThemeData(brightness: Brightness.dark),
          const Size(900, 560),
        ),
        ('compact_light', cbThemeData(), const Size(420, 980)),
        (
          'compact_dark',
          cbThemeData(brightness: Brightness.dark),
          const Size(420, 980),
        ),
      ]) {
    testWidgets('ColorPicker $name', (WidgetTester tester) async {
      tester.view.devicePixelRatio = 1;
      tester.view.physicalSize = size;
      addTearDown(tester.view.resetDevicePixelRatio);
      addTearDown(tester.view.resetPhysicalSize);
      await tester.pumpWidget(
        RepaintBoundary(
          key: colorPickerGoldenKey,
          child: MaterialApp(
            debugShowCheckedModeBanner: false,
            theme: theme.copyWith(
              textTheme: theme.textTheme.apply(fontFamily: 'Roboto'),
            ),
            home: const Scaffold(
              body: SingleChildScrollView(
                padding: EdgeInsets.all(CbStructure.space5),
                child: ColorPickerGallery(),
              ),
            ),
          ),
        ),
      );
      await tester.pump();
      await expectLater(
        find.byKey(colorPickerGoldenKey),
        matchesGoldenFile('goldens/color_picker_$name.png'),
      );
    });
  }
}
