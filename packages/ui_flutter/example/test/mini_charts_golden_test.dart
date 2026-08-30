import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/mini_charts_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key miniChartsGoldenKey = Key('mini-charts-golden');

void main() {
  testWidgets('Mini charts wide — light', (WidgetTester tester) async {
    await _pumpGallery(tester, cbThemeData(), const Size(900, 700));
    await expectLater(
      find.byKey(miniChartsGoldenKey),
      matchesGoldenFile('goldens/mini_charts_wide_light.png'),
    );
  });

  testWidgets('Mini charts wide — dark', (WidgetTester tester) async {
    await _pumpGallery(
      tester,
      cbThemeData(brightness: Brightness.dark),
      const Size(900, 700),
    );
    await expectLater(
      find.byKey(miniChartsGoldenKey),
      matchesGoldenFile('goldens/mini_charts_wide_dark.png'),
    );
  });

  testWidgets('Mini charts compact — light', (WidgetTester tester) async {
    await _pumpGallery(tester, cbThemeData(), const Size(420, 1000));
    await expectLater(
      find.byKey(miniChartsGoldenKey),
      matchesGoldenFile('goldens/mini_charts_compact_light.png'),
    );
  });

  testWidgets('Mini charts compact — dark', (WidgetTester tester) async {
    await _pumpGallery(
      tester,
      cbThemeData(brightness: Brightness.dark),
      const Size(420, 1000),
    );
    await expectLater(
      find.byKey(miniChartsGoldenKey),
      matchesGoldenFile('goldens/mini_charts_compact_dark.png'),
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

  final ThemeData goldenTheme = theme.copyWith(
    textTheme: theme.textTheme.apply(fontFamily: 'Roboto'),
  );
  await tester.pumpWidget(
    RepaintBoundary(
      key: miniChartsGoldenKey,
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: goldenTheme,
        home: const Scaffold(
          body: SingleChildScrollView(
            padding: EdgeInsets.all(CbStructure.space5),
            child: MiniChartsGallery(),
          ),
        ),
      ),
    ),
  );
  await tester.pump();
}
