import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/native_overlay_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key nativeOverlayGoldenKey = Key('native-overlay-golden');

void main() {
  testWidgets('Native popover wide — light', (WidgetTester tester) async {
    await _pumpOpenPopover(tester, cbThemeData(), const Size(900, 850));
    await expectLater(
      find.byKey(nativeOverlayGoldenKey),
      matchesGoldenFile('goldens/native_popover_wide_light.png'),
    );
  });

  testWidgets('Native popover wide — dark', (WidgetTester tester) async {
    await _pumpOpenPopover(
      tester,
      cbThemeData(brightness: Brightness.dark),
      const Size(900, 850),
    );
    await expectLater(
      find.byKey(nativeOverlayGoldenKey),
      matchesGoldenFile('goldens/native_popover_wide_dark.png'),
    );
  });

  testWidgets('Native popover compact — light', (WidgetTester tester) async {
    await _pumpOpenPopover(tester, cbThemeData(), const Size(420, 1300));
    await expectLater(
      find.byKey(nativeOverlayGoldenKey),
      matchesGoldenFile('goldens/native_popover_compact_light.png'),
    );
  });

  testWidgets('Native popover compact — dark', (WidgetTester tester) async {
    await _pumpOpenPopover(
      tester,
      cbThemeData(brightness: Brightness.dark),
      const Size(420, 1300),
    );
    await expectLater(
      find.byKey(nativeOverlayGoldenKey),
      matchesGoldenFile('goldens/native_popover_compact_dark.png'),
    );
  });
}

Future<void> _pumpOpenPopover(
  WidgetTester tester,
  ThemeData theme,
  Size size,
) async {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = size;
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);

  await tester.pumpWidget(
    RepaintBoundary(
      key: nativeOverlayGoldenKey,
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: _goldenTheme(theme),
        home: const Scaffold(
          body: SingleChildScrollView(
            padding: EdgeInsets.all(CbStructure.space5),
            child: NativeOverlayGallery(),
          ),
        ),
      ),
    ),
  );
  await tester.pump();
  await tester.tap(find.byKey(galleryPopoverPortalTriggerKey));
  await tester.pump();
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
