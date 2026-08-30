import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key timelineSkeletonGoldenKey = Key('timeline-skeleton-golden');

void main() {
  for (final (String name, ThemeData theme, Size size)
      in <(String, ThemeData, Size)>[
        ('wide_light', cbThemeData(), const Size(900, 420)),
        (
          'wide_dark',
          cbThemeData(brightness: Brightness.dark),
          const Size(900, 420),
        ),
        ('compact_light', cbThemeData(), const Size(420, 560)),
        (
          'compact_dark',
          cbThemeData(brightness: Brightness.dark),
          const Size(420, 560),
        ),
      ]) {
    testWidgets('Timeline Skeleton $name', (WidgetTester tester) async {
      tester.view.devicePixelRatio = 1;
      tester.view.physicalSize = size;
      addTearDown(tester.view.resetDevicePixelRatio);
      addTearDown(tester.view.resetPhysicalSize);
      await tester.pumpWidget(
        RepaintBoundary(
          key: timelineSkeletonGoldenKey,
          child: MaterialApp(
            debugShowCheckedModeBanner: false,
            theme: theme,
            home: const Scaffold(
              body: Padding(
                padding: EdgeInsets.all(CbStructure.space5),
                child: CbSurface(
                  variant: CbSurfaceVariant.tinted,
                  child: CbTimelineSkeleton(
                    itemCount: 4,
                    timestamps: true,
                    motion: false,
                  ),
                ),
              ),
            ),
          ),
        ),
      );
      await tester.pump();
      await expectLater(
        find.byKey(timelineSkeletonGoldenKey),
        matchesGoldenFile('goldens/timeline_skeleton_$name.png'),
      );
    });
  }
}
