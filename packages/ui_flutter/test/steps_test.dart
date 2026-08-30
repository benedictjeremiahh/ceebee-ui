import 'dart:ui' as ui;

import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key _firstStepKey = Key('steps-first');
const Key _secondStepKey = Key('steps-second');
const Key _thirdStepKey = Key('steps-third');
const Key _disabledStepKey = Key('steps-disabled');

void main() {
  testWidgets('Steps derives complete active and waiting states', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_app(_steps(current: 1)));

    expect(find.byIcon(Icons.check_rounded), findsOneWidget);
    expect(find.text('2'), findsOneWidget);
    expect(find.text('3'), findsOneWidget);
    expect(
      tester
          .getSemantics(find.byKey(_secondStepKey))
          .flagsCollection
          .isSelected,
      ui.Tristate.isTrue,
    );
  });

  testWidgets(
    'explicit error status and localized semantics override visuals',
    (WidgetTester tester) async {
      final SemanticsHandle semantics = tester.ensureSemantics();
      await tester.pumpWidget(
        _app(
          const CbSteps(
            current: 1,
            items: <CbStepItem>[
              CbStepItem(title: 'Account'),
              CbStepItem(
                key: _secondStepKey,
                title: 'Verification',
                status: CbStepStatus.error,
                semanticLabel: 'Verification, error, step 2 of 3',
              ),
              CbStepItem(title: 'Confirmation'),
            ],
          ),
        ),
      );

      expect(find.byIcon(Icons.close_rounded), findsOneWidget);
      expect(
        tester.getSemantics(find.byKey(_secondStepKey)).label,
        'Verification, error, step 2 of 3',
      );
      semantics.dispose();
    },
  );

  testWidgets('optional selection callback respects disabled steps', (
    WidgetTester tester,
  ) async {
    int? selected;
    await tester.pumpWidget(
      _app(
        CbSteps(
          current: 0,
          onStepSelected: (int value) => selected = value,
          items: const <CbStepItem>[
            CbStepItem(key: _firstStepKey, title: 'Account'),
            CbStepItem(key: _secondStepKey, title: 'Verification'),
            CbStepItem(
              key: _disabledStepKey,
              title: 'Confirmation',
              disabled: true,
            ),
          ],
        ),
      ),
    );

    await tester.tap(find.byKey(_secondStepKey));
    expect(selected, 1);
    await tester.tap(find.byKey(_disabledStepKey));
    expect(selected, 1);
    expect(
      tester.getSize(find.byKey(_secondStepKey)).height,
      greaterThanOrEqualTo(CbStructure.controlHeightLg),
    );
  });

  testWidgets(
    'adaptive Steps changes from horizontal to vertical by container',
    (WidgetTester tester) async {
      Future<void> pumpAt(double width) => tester.pumpWidget(
        _app(SizedBox(width: width, child: _steps(current: 1))),
      );

      await pumpAt(CbStructure.space8 * 10);
      final Offset wideFirst = tester.getTopLeft(find.byKey(_firstStepKey));
      final Offset wideSecond = tester.getTopLeft(find.byKey(_secondStepKey));
      expect(
        (wideFirst.dy - wideSecond.dy).abs(),
        lessThan(CbStructure.space2),
      );
      expect(wideFirst.dx, lessThan(wideSecond.dx));

      await pumpAt(CbStructure.space8 * 6);
      final Offset compactFirst = tester.getTopLeft(find.byKey(_firstStepKey));
      final Offset compactSecond = tester.getTopLeft(
        find.byKey(_secondStepKey),
      );
      expect(compactFirst.dx, compactSecond.dx);
      expect(compactFirst.dy, lessThan(compactSecond.dy));
    },
  );

  testWidgets('reduced motion makes step state transitions immediate', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      _app(
        MediaQuery(
          data: const MediaQueryData(disableAnimations: true),
          child: _steps(current: 1),
        ),
      ),
    );

    final Iterable<AnimatedContainer> transitions = tester.widgetList(
      find.descendant(
        of: find.byType(CbSteps),
        matching: find.byType(AnimatedContainer),
      ),
    );
    expect(transitions, isNotEmpty);
    expect(
      transitions.every(
        (AnimatedContainer item) => item.duration == Duration.zero,
      ),
      isTrue,
    );
  });

  testWidgets('Steps Skeleton mirrors marker title and content anatomy', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      _app(const CbStepsSkeleton(itemCount: 3, content: true, motion: false)),
    );

    expect(find.byType(CbSkeleton), findsNWidgets(9));
    expect(
      find.descendant(
        of: find.byType(CbStepsSkeleton),
        matching: find.byType(FadeTransition),
      ),
      findsNothing,
    );
  });
}

Widget _steps({required int current}) => CbSteps(
  current: current,
  items: const <CbStepItem>[
    CbStepItem(
      key: _firstStepKey,
      title: 'Account',
      content: Text('Add sender details.'),
    ),
    CbStepItem(
      key: _secondStepKey,
      title: 'Verification',
      content: Text('Review transfer limits.'),
    ),
    CbStepItem(
      key: _thirdStepKey,
      title: 'Confirmation',
      content: Text('Confirm and send.'),
    ),
  ],
);

Widget _app(Widget child) => MaterialApp(
  theme: cbThemeData(),
  home: Scaffold(body: child),
);
