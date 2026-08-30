import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/skeleton_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('gallery composes all Skeleton shapes without semantics', (
    WidgetTester tester,
  ) async {
    final SemanticsHandle semantics = tester.ensureSemantics();
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Scaffold(
          body: SingleChildScrollView(
            padding: EdgeInsets.all(CbStructure.space5),
            child: SkeletonGallery(motion: false),
          ),
        ),
      ),
    );

    expect(find.byType(CbSkeleton), findsNWidgets(7));
    expect(
      find.descendant(
        of: find.byType(CbSkeleton),
        matching: find.byType(FadeTransition),
      ),
      findsNothing,
    );
    expect(tester.takeException(), isNull);
    semantics.dispose();
  });

  testWidgets('compact gallery remains within the viewport', (
    WidgetTester tester,
  ) async {
    tester.view.devicePixelRatio = 1;
    tester.view.physicalSize = const Size(360, 740);
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Scaffold(
          body: SingleChildScrollView(
            padding: EdgeInsets.all(CbStructure.space5),
            child: SkeletonGallery(motion: false),
          ),
        ),
      ),
    );

    expect(find.byKey(skeletonGalleryKey), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}
