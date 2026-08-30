import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/motion_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Replay remounts the sequence and component opt-out skips it', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Scaffold(
          body: SingleChildScrollView(
            padding: EdgeInsets.all(CbStructure.space5),
            child: MotionGallery(),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('Token checks passed'), findsOneWidget);

    await tester.tap(find.byKey(motionReplayKey));
    await tester.pump();
    expect(
      find.descendant(
        of: find.byKey(motionGalleryKey),
        matching: find.byType(FadeTransition),
      ),
      findsWidgets,
    );
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(motionToggleKey));
    await tester.pump();
    expect(
      find.descendant(
        of: find.byType(CbReveal),
        matching: find.byType(FadeTransition),
      ),
      findsNothing,
    );
    expect(find.text('Visual review completed'), findsOneWidget);
  });

  testWidgets('compact gallery stacks reveal before staggered activity', (
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
            child: MotionGallery(),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(
      tester.getBottomLeft(find.byKey(motionRevealStoryKey)).dy,
      lessThan(tester.getTopLeft(find.byKey(motionFirstActivityKey)).dy),
    );
    expect(tester.takeException(), isNull);
  });
}
