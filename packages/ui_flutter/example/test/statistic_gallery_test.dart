import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/statistic_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Statistic gallery keeps locale formatting app-owned', (
    WidgetTester tester,
  ) async {
    final SemanticsHandle semantics = tester.ensureSemantics();
    await tester.pumpWidget(_gallery());

    expect(find.text(r'$128,930'), findsOneWidget);
    await tester.tap(find.text('IDR'));
    await tester.pump();
    expect(find.text('Rp 2.145.000.000'), findsOneWidget);
    final Finder revenue = find.byWidgetPredicate(
      (Widget widget) =>
          widget is CbStatistic && widget.value == 'Rp 2.145.000.000',
    );
    expect(
      tester.getSemantics(revenue).value,
      'two billion one hundred forty-five million rupiah',
    );
    semantics.dispose();
  });

  testWidgets('compact Statistic composition has no overflow', (
    WidgetTester tester,
  ) async {
    tester.view.devicePixelRatio = 1;
    tester.view.physicalSize = const Size(390, 900);
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPhysicalSize);
    await tester.pumpWidget(_gallery());

    expect(find.byKey(statisticGalleryKey), findsOneWidget);
    expect(find.byType(CbStatistic), findsNWidgets(3));
    expect(find.byType(CbStatisticSkeleton), findsOneWidget);
    await tester.tap(find.text('IDR'));
    await tester.pump();
    expect(find.text('Rp 2.145.000.000'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}

Widget _gallery() => MaterialApp(
  theme: cbThemeData(),
  home: const Scaffold(
    body: SingleChildScrollView(
      padding: EdgeInsets.all(CbStructure.space5),
      child: StatisticGallery(motion: false),
    ),
  ),
);
