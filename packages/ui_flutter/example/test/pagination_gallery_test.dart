import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/pagination_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Pagination gallery keeps page state application-owned', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_gallery());

    expect(find.text('Transactions 111–120'), findsOneWidget);
    await tester.tap(find.byKey(const ValueKey<String>('cb-pagination-next')));
    await tester.pump();
    expect(find.text('Transactions 121–130'), findsOneWidget);
    expect(find.text('Page 13 of 24 · 240 transactions'), findsOneWidget);
  });

  testWidgets('compact Pagination composition has no overflow', (
    WidgetTester tester,
  ) async {
    tester.view.devicePixelRatio = 1;
    tester.view.physicalSize = const Size(390, 900);
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPhysicalSize);
    await tester.pumpWidget(_gallery());

    expect(find.byKey(paginationGalleryKey), findsOneWidget);
    expect(find.byType(CbPagination), findsOneWidget);
    expect(find.byType(CbPaginationSkeleton), findsOneWidget);
    expect(find.text('12 / 24'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}

Widget _gallery() => MaterialApp(
  theme: cbThemeData(),
  home: const Scaffold(
    body: SingleChildScrollView(
      padding: EdgeInsets.all(CbStructure.space5),
      child: PaginationGallery(motion: false),
    ),
  ),
);
