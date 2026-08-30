import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/timeline_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Timeline gallery keeps event state app-owned', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_gallery());

    expect(find.text('Risk review in progress'), findsOneWidget);
    await tester.tap(find.byKey(timelineCompleteKey));
    await tester.pump();
    expect(find.text('Risk review completed'), findsOneWidget);
    expect(find.text('Reset'), findsOneWidget);
  });

  testWidgets('compact Timeline composition has no overflow', (
    WidgetTester tester,
  ) async {
    tester.view.devicePixelRatio = 1;
    tester.view.physicalSize = const Size(390, 1250);
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPhysicalSize);
    await tester.pumpWidget(_gallery());

    expect(find.byKey(timelineGalleryKey), findsOneWidget);
    expect(find.byType(CbTimeline), findsOneWidget);
    expect(find.byType(CbTimelineSkeleton), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}

Widget _gallery() => MaterialApp(
  theme: cbThemeData(),
  home: const Scaffold(
    body: SingleChildScrollView(
      padding: EdgeInsets.all(CbStructure.space5),
      child: TimelineGallery(motion: false),
    ),
  ),
);
