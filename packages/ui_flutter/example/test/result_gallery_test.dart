import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/result_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Result gallery switches status and keeps actions app-owned', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_gallery());

    expect(find.text('Transfer complete'), findsOneWidget);
    await tester.tap(find.byKey(resultStatusKey(CbResultStatus.error)));
    await tester.pump();
    expect(find.text('Transfer failed'), findsOneWidget);
    expect(find.byIcon(Icons.error_outline_rounded), findsOneWidget);

    await tester.tap(find.byKey(resultPrimaryActionKey));
    await tester.pump();
    expect(find.text('Retry started by the app.'), findsOneWidget);
  });

  testWidgets('compact Result and Skeleton stack without overflow', (
    WidgetTester tester,
  ) async {
    tester.view.devicePixelRatio = 1;
    tester.view.physicalSize = const Size(390, 1200);
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPhysicalSize);
    await tester.pumpWidget(_gallery());

    expect(find.byKey(resultGalleryKey), findsOneWidget);
    expect(find.byType(CbResultSkeleton), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}

Widget _gallery() => MaterialApp(
  theme: cbThemeData(),
  home: const Scaffold(
    body: SingleChildScrollView(
      padding: EdgeInsets.all(CbStructure.space5),
      child: ResultGallery(motion: false),
    ),
  ),
);
