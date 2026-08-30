import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key _firstItemKey = Key('timeline-first-item');
const Key _secondItemKey = Key('timeline-second-item');
const Key _thirdItemKey = Key('timeline-third-item');
const Key _complexItemKey = Key('timeline-complex-item');
const Key _decorativeMarkerKey = Key('timeline-decorative-marker');

void main() {
  testWidgets(
    'Timeline groups ordered event semantics and excludes marker art',
    (WidgetTester tester) async {
      final SemanticsHandle semantics = tester.ensureSemantics();
      await tester.pumpWidget(
        MaterialApp(
          theme: cbThemeData(),
          home: Scaffold(
            body: CbTimeline(
              items: <CbTimelineItem>[
                const CbTimelineItem(
                  key: _firstItemKey,
                  title: 'Transfer created',
                  timestamp: '09:32',
                  content: Text('The request passed validation.'),
                ),
                CbTimelineItem(
                  key: _complexItemKey,
                  title: 'Risk review',
                  semanticLabel: 'Risk review completed at 09:41',
                  marker: Semantics(
                    key: _decorativeMarkerKey,
                    label: 'Decorative shield',
                    child: const Icon(Icons.shield_outlined),
                  ),
                  content: const Chip(label: Text('Completed')),
                ),
              ],
            ),
          ),
        ),
      );

      final event = tester.getSemantics(find.byKey(_complexItemKey));
      expect(event.label, 'Risk review completed at 09:41');
      expect(find.bySemanticsLabel('Decorative shield'), findsNothing);
      expect(
        tester.getTopLeft(find.byKey(_firstItemKey)).dy,
        lessThan(tester.getTopLeft(find.byKey(_complexItemKey)).dy),
      );
      semantics.dispose();
    },
  );

  testWidgets(
    'Timeline moves timestamps beside content only in wide containers',
    (WidgetTester tester) async {
      Future<void> pumpAt(double width) => tester.pumpWidget(
        MaterialApp(
          theme: cbThemeData(),
          home: Scaffold(
            body: SizedBox(width: width, child: _responsiveTimeline()),
          ),
        ),
      );

      await pumpAt(CbStructure.space8 * 10);
      final Offset wideTime = tester.getTopLeft(find.text('09:32'));
      final Offset wideTitle = tester.getTopLeft(find.text('Transfer created'));
      expect(wideTime.dx, lessThan(wideTitle.dx));
      expect((wideTime.dy - wideTitle.dy).abs(), lessThan(CbStructure.space2));

      await pumpAt(CbStructure.space8 * 6);
      final Offset compactTime = tester.getTopLeft(find.text('09:32'));
      final Offset compactTitle = tester.getTopLeft(
        find.text('Transfer created'),
      );
      expect(compactTime.dx, compactTitle.dx);
      expect(compactTime.dy, lessThan(compactTitle.dy));
    },
  );

  testWidgets('Timeline preserves application source order', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: Scaffold(body: _responsiveTimeline()),
      ),
    );

    final double first = tester.getTopLeft(find.byKey(_firstItemKey)).dy;
    final double second = tester.getTopLeft(find.byKey(_secondItemKey)).dy;
    final double third = tester.getTopLeft(find.byKey(_thirdItemKey)).dy;
    expect(first, lessThan(second));
    expect(second, lessThan(third));
  });

  testWidgets('pending marker animates only when motion is allowed', (
    WidgetTester tester,
  ) async {
    Widget pending({required bool motion, bool disableAnimations = false}) =>
        MaterialApp(
          theme: cbThemeData(),
          home: Scaffold(
            body: MediaQuery(
              data: MediaQueryData(disableAnimations: disableAnimations),
              child: CbTimeline(
                motion: motion,
                items: const <CbTimelineItem>[
                  CbTimelineItem(title: 'Processing', pending: true),
                ],
              ),
            ),
          ),
        );

    await tester.pumpWidget(pending(motion: true));
    expect(find.byType(CircularProgressIndicator), findsOneWidget);

    await tester.pumpWidget(pending(motion: false));
    expect(find.byType(CircularProgressIndicator), findsNothing);
    expect(find.byIcon(Icons.more_horiz_rounded), findsOneWidget);

    await tester.pumpWidget(pending(motion: true, disableAnimations: true));
    expect(find.byType(CircularProgressIndicator), findsNothing);
    expect(find.byIcon(Icons.more_horiz_rounded), findsOneWidget);
  });

  testWidgets('Timeline Skeleton mirrors timestamp and item anatomy', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Scaffold(
          body: CbTimelineSkeleton(
            itemCount: 3,
            timestamps: true,
            motion: false,
          ),
        ),
      ),
    );

    expect(find.byType(CbSkeleton), findsNWidgets(12));
    expect(
      find.descendant(
        of: find.byType(CbTimelineSkeleton),
        matching: find.byType(FadeTransition),
      ),
      findsNothing,
    );
  });

  testWidgets('Timeline Skeleton connectors stop at marker edges', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Scaffold(
          body: CbTimelineSkeleton(
            itemCount: 3,
            timestamps: true,
            motion: false,
          ),
        ),
      ),
    );

    final Finder timeline = find.byType(CbTimelineSkeleton);
    final List<Rect> markerRects = tester
        .widgetList<FittedBox>(
          find.descendant(of: timeline, matching: find.byType(FittedBox)),
        )
        .map((FittedBox marker) => tester.getRect(find.byWidget(marker)))
        .toList();
    final List<Rect> connectorRects = tester
        .widgetList<ColoredBox>(
          find.descendant(of: timeline, matching: find.byType(ColoredBox)),
        )
        .map((ColoredBox connector) => tester.getRect(find.byWidget(connector)))
        .toList();

    expect(markerRects, hasLength(3));
    expect(connectorRects, hasLength(4));
    for (final Rect connector in connectorRects) {
      expect(
        markerRects.every((Rect marker) => !connector.overlaps(marker)),
        isTrue,
      );
    }
  });
}

Widget _responsiveTimeline() => const CbTimeline(
  items: <CbTimelineItem>[
    CbTimelineItem(
      key: _firstItemKey,
      title: 'Transfer created',
      timestamp: '09:32',
      content: Text('The request passed validation.'),
    ),
    CbTimelineItem(
      key: _secondItemKey,
      title: 'Risk review completed',
      timestamp: '09:41',
      tone: CbTone.success,
    ),
    CbTimelineItem(
      key: _thirdItemKey,
      title: 'Recipient notified',
      timestamp: '09:45',
    ),
  ],
);
