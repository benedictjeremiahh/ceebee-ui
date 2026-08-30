import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/mini_charts_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('gallery keeps all three visual contracts and their summaries', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Scaffold(
          body: SingleChildScrollView(
            padding: EdgeInsets.all(CbStructure.space5),
            child: MiniChartsGallery(),
          ),
        ),
      ),
    );

    expect(find.byType(CbDonut), findsOneWidget);
    expect(find.byType(CbSparkline), findsOneWidget);
    expect(find.byType(CbBarMini), findsOneWidget);
    expect(find.text('42 changes reviewed'), findsOneWidget);
    expect(find.text('18 → 31 per day'), findsOneWidget);
    expect(find.text('UI leads with 12'), findsOneWidget);
  });

  testWidgets('compact gallery stacks the release stories', (
    WidgetTester tester,
  ) async {
    tester.view.devicePixelRatio = 1;
    tester.view.physicalSize = const Size(420, 1000);
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Scaffold(
          body: SingleChildScrollView(
            padding: EdgeInsets.all(CbStructure.space5),
            child: MiniChartsGallery(),
          ),
        ),
      ),
    );

    expect(find.byType(VerticalDivider), findsNothing);
    expect(find.byType(Divider), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}
