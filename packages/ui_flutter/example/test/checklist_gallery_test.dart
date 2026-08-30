import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/checklist_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('checklist gallery reaches completion and can reset', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Scaffold(
          body: SingleChildScrollView(
            padding: EdgeInsets.all(CbStructure.space5),
            child: ChecklistGallery(),
          ),
        ),
      ),
    );

    await tester.tap(find.text('Invite your first teammate'));
    await tester.pump();
    await tester.tap(find.text('Publish a release'));
    await tester.pump();
    expect(find.text('Workspace ready'), findsOneWidget);

    await tester.tap(find.byKey(galleryChecklistResetKey));
    await tester.pump();
    expect(find.text('1 of 3'), findsOneWidget);
    expect(find.text('Invite your first teammate'), findsOneWidget);
  });

  testWidgets('compact checklist and skeleton stack without overflow', (
    WidgetTester tester,
  ) async {
    tester.view.devicePixelRatio = 1;
    tester.view.physicalSize = const Size(420, 1100);
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Scaffold(
          body: SingleChildScrollView(
            padding: EdgeInsets.all(CbStructure.space5),
            child: ChecklistGallery(),
          ),
        ),
      ),
    );

    expect(find.byType(CbChecklist), findsOneWidget);
    expect(find.byType(CbChecklistSkeleton), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}
