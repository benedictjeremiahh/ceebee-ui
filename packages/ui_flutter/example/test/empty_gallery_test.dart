import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/empty_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Empty gallery action is app-owned and reversible', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_gallery());

    expect(find.byType(CbEmpty), findsOneWidget);
    await tester.tap(find.byKey(emptyCreateKey));
    await tester.pump();
    expect(find.text('View created'), findsOneWidget);
    expect(find.byType(CbEmpty), findsNothing);

    await tester.tap(find.byKey(emptyResetKey));
    await tester.pump();
    expect(find.byType(CbEmpty), findsOneWidget);
  });

  testWidgets('compact Empty and Skeleton stack without overflow', (
    WidgetTester tester,
  ) async {
    tester.view.devicePixelRatio = 1;
    tester.view.physicalSize = const Size(390, 960);
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPhysicalSize);
    await tester.pumpWidget(_gallery());

    expect(find.byKey(emptyGalleryKey), findsOneWidget);
    expect(find.byType(CbEmptySkeleton), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}

Widget _gallery() => MaterialApp(
  theme: cbThemeData(),
  home: const Scaffold(
    body: SingleChildScrollView(
      padding: EdgeInsets.all(CbStructure.space5),
      child: EmptyGallery(motion: false),
    ),
  ),
);
