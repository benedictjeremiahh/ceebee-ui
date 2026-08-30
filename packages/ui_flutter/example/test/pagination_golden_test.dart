import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/pagination_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key paginationGoldenKey = Key('pagination-golden');

void main() {
  for (final (String name, ThemeData theme, Size size)
      in <(String, ThemeData, Size)>[
        ('wide_light', cbThemeData(), const Size(900, 520)),
        (
          'wide_dark',
          cbThemeData(brightness: Brightness.dark),
          const Size(900, 520),
        ),
        ('compact_light', cbThemeData(), const Size(420, 680)),
        (
          'compact_dark',
          cbThemeData(brightness: Brightness.dark),
          const Size(420, 680),
        ),
      ]) {
    testWidgets('Pagination $name', (WidgetTester tester) async {
      tester.view.devicePixelRatio = 1;
      tester.view.physicalSize = size;
      addTearDown(tester.view.resetDevicePixelRatio);
      addTearDown(tester.view.resetPhysicalSize);
      await tester.pumpWidget(
        RepaintBoundary(
          key: paginationGoldenKey,
          child: MaterialApp(
            debugShowCheckedModeBanner: false,
            theme: theme.copyWith(
              textTheme: theme.textTheme.apply(fontFamily: 'Roboto'),
            ),
            home: const Scaffold(
              body: SingleChildScrollView(
                padding: EdgeInsets.all(CbStructure.space5),
                child: PaginationGallery(motion: false),
              ),
            ),
          ),
        ),
      );
      await tester.pump();
      await expectLater(
        find.byKey(paginationGoldenKey),
        matchesGoldenFile('goldens/pagination_$name.png'),
      );
    });
  }
}
