import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/descriptions_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Descriptions gallery keeps its header action app-owned', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_gallery());

    expect(find.text('Ready for review'), findsOneWidget);
    await tester.tap(find.byKey(descriptionsEditKey));
    await tester.pump();
    expect(find.text('Reviewed'), findsOneWidget);
    expect(find.text('Reset'), findsOneWidget);
  });

  testWidgets('compact Descriptions composition has no overflow', (
    WidgetTester tester,
  ) async {
    tester.view.devicePixelRatio = 1;
    tester.view.physicalSize = const Size(390, 1050);
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPhysicalSize);
    await tester.pumpWidget(_gallery());

    expect(find.byKey(descriptionsGalleryKey), findsOneWidget);
    expect(find.byType(CbDescriptions), findsOneWidget);
    expect(find.byType(CbDescriptionsSkeleton), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}

Widget _gallery() => MaterialApp(
  theme: cbThemeData(),
  home: const Scaffold(
    body: SingleChildScrollView(
      padding: EdgeInsets.all(CbStructure.space5),
      child: DescriptionsGallery(motion: false),
    ),
  ),
);
