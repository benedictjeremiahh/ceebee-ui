import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/statistic_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key statisticGoldenKey = Key('statistic-golden');

void main() {
  for (final (String name, ThemeData theme, Size size)
      in <(String, ThemeData, Size)>[
        ('wide_light', cbThemeData(), const Size(900, 700)),
        (
          'wide_dark',
          cbThemeData(brightness: Brightness.dark),
          const Size(900, 700),
        ),
        ('compact_light', cbThemeData(), const Size(420, 900)),
        (
          'compact_dark',
          cbThemeData(brightness: Brightness.dark),
          const Size(420, 900),
        ),
      ]) {
    testWidgets('Statistic $name', (WidgetTester tester) async {
      tester.view.devicePixelRatio = 1;
      tester.view.physicalSize = size;
      addTearDown(tester.view.resetDevicePixelRatio);
      addTearDown(tester.view.resetPhysicalSize);
      await tester.pumpWidget(
        RepaintBoundary(
          key: statisticGoldenKey,
          child: MaterialApp(
            debugShowCheckedModeBanner: false,
            theme: theme.copyWith(
              textTheme: theme.textTheme.apply(fontFamily: 'Roboto'),
            ),
            home: const Scaffold(
              body: SingleChildScrollView(
                padding: EdgeInsets.all(CbStructure.space5),
                child: StatisticGallery(motion: false),
              ),
            ),
          ),
        ),
      );
      await tester.pump();
      await expectLater(
        find.byKey(statisticGoldenKey),
        matchesGoldenFile('goldens/statistic_$name.png'),
      );
    });
  }
}
