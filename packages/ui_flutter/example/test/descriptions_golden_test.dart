import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/descriptions_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key descriptionsGoldenKey = Key('descriptions-golden');

void main() {
  for (final (String name, ThemeData theme, Size size)
      in <(String, ThemeData, Size)>[
        ('wide_light', cbThemeData(), const Size(900, 900)),
        (
          'wide_dark',
          cbThemeData(brightness: Brightness.dark),
          const Size(900, 900),
        ),
        ('compact_light', cbThemeData(), const Size(420, 1350)),
        (
          'compact_dark',
          cbThemeData(brightness: Brightness.dark),
          const Size(420, 1350),
        ),
      ]) {
    testWidgets('Descriptions $name', (WidgetTester tester) async {
      tester.view.devicePixelRatio = 1;
      tester.view.physicalSize = size;
      addTearDown(tester.view.resetDevicePixelRatio);
      addTearDown(tester.view.resetPhysicalSize);
      await tester.pumpWidget(
        RepaintBoundary(
          key: descriptionsGoldenKey,
          child: MaterialApp(
            debugShowCheckedModeBanner: false,
            theme: _goldenTheme(theme),
            home: const Scaffold(
              body: SingleChildScrollView(
                padding: EdgeInsets.all(CbStructure.space5),
                child: DescriptionsGallery(motion: false),
              ),
            ),
          ),
        ),
      );
      await tester.pump();
      await expectLater(
        find.byKey(descriptionsGoldenKey),
        matchesGoldenFile('goldens/descriptions_$name.png'),
      );
    });
  }
}

ThemeData _goldenTheme(ThemeData theme) {
  final TextStyle? buttonText = theme.textTheme.labelLarge?.copyWith(
    fontFamily: 'Roboto',
  );
  final ButtonStyle? textButtonStyle = theme.textButtonTheme.style?.copyWith(
    textStyle: WidgetStatePropertyAll<TextStyle?>(buttonText),
  );
  return theme.copyWith(
    textTheme: theme.textTheme.apply(fontFamily: 'Roboto'),
    textButtonTheme: TextButtonThemeData(style: textButtonStyle),
  );
}
