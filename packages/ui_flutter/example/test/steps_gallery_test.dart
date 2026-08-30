import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/steps_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Steps gallery keeps navigation and validation app-owned', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_gallery());

    expect(
      find.text(
        'Recipient bank code needs attention before this transfer can continue.',
      ),
      findsOneWidget,
    );
    await tester.tap(find.byKey(stepsResolveKey));
    await tester.pump();
    expect(
      find.text(
        'The application supplies the content and decides when this stage is complete.',
      ),
      findsOneWidget,
    );

    await tester.tap(find.text('Sender').first);
    await tester.pump();
    expect(find.text('Sender details'), findsOneWidget);
  });

  testWidgets('compact Steps composition has no overflow', (
    WidgetTester tester,
  ) async {
    tester.view.devicePixelRatio = 1;
    tester.view.physicalSize = const Size(390, 1400);
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPhysicalSize);
    await tester.pumpWidget(_gallery());

    expect(find.byKey(stepsGalleryKey), findsOneWidget);
    expect(find.byType(CbSteps), findsOneWidget);
    expect(find.byType(CbStepsSkeleton), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}

Widget _gallery() => MaterialApp(
  theme: cbThemeData(),
  home: const Scaffold(
    body: SingleChildScrollView(
      padding: EdgeInsets.all(CbStructure.space5),
      child: StepsGallery(motion: false),
    ),
  ),
);
