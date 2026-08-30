import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key _firstKey = Key('motion-first');
const Key _secondKey = Key('motion-second');
const Key _thirdKey = Key('motion-third');
const Key _fourthKey = Key('motion-fourth');

void main() {
  testWidgets('Reveal fades and translates to its stable final layout', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Center(
          child: CbReveal(
            child: SizedBox(key: _firstKey, width: 80, height: 40),
          ),
        ),
      ),
    );
    await tester.pump();

    expect(_opacityFor(tester, _firstKey), 0);
    expect(_translationFor(tester, _firstKey).dy, CbStructure.space3);
    expect(tester.getSize(find.byKey(_firstKey)), const Size(80, 40));

    await tester.pump(CbMotionTokens.base ~/ 2);
    expect(_opacityFor(tester, _firstKey), greaterThan(0));
    expect(_opacityFor(tester, _firstKey), lessThan(1));
    expect(_translationFor(tester, _firstKey).dy, greaterThan(0));

    await tester.pumpAndSettle();
    expect(_opacityFor(tester, _firstKey), 1);
    expect(_translationFor(tester, _firstKey), Offset.zero);
  });

  testWidgets(
    'component and OS motion opt-outs render the final state instantly',
    (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: cbThemeData(),
          home: const Column(
            children: <Widget>[
              CbReveal(
                motion: false,
                child: Text('Component opt-out', key: _firstKey),
              ),
              MediaQuery(
                data: MediaQueryData(disableAnimations: true),
                child: CbReveal(child: Text('OS opt-out', key: _secondKey)),
              ),
            ],
          ),
        ),
      );
      await tester.pump();

      expect(
        find.descendant(
          of: find
              .ancestor(
                of: find.byKey(_firstKey),
                matching: find.byType(CbReveal),
              )
              .first,
          matching: find.byType(FadeTransition),
        ),
        findsNothing,
      );
      expect(
        find.descendant(
          of: find
              .ancestor(
                of: find.byKey(_secondKey),
                matching: find.byType(CbReveal),
              )
              .first,
          matching: find.byType(FadeTransition),
        ),
        findsNothing,
      );
      expect(find.text('Component opt-out'), findsOneWidget);
      expect(find.text('OS opt-out'), findsOneWidget);
    },
  );

  testWidgets('Reveal directions use tokenized compositor offsets', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Row(
          children: <Widget>[
            CbReveal(
              from: CbRevealFrom.above,
              distance: CbRevealDistance.sm,
              child: SizedBox(key: _firstKey),
            ),
            CbReveal(
              from: CbRevealFrom.left,
              distance: CbRevealDistance.lg,
              child: SizedBox(key: _secondKey),
            ),
            CbReveal(
              from: CbRevealFrom.right,
              distance: CbRevealDistance.md,
              child: SizedBox(key: _thirdKey),
            ),
            CbReveal(
              from: CbRevealFrom.none,
              child: SizedBox(key: _fourthKey),
            ),
          ],
        ),
      ),
    );
    await tester.pump();

    expect(
      _translationFor(tester, _firstKey),
      const Offset(0, -CbStructure.space1),
    );
    expect(
      _translationFor(tester, _secondKey),
      const Offset(-CbStructure.space5, 0),
    );
    expect(
      _translationFor(tester, _thirdKey),
      const Offset(CbStructure.space3, 0),
    );
    expect(
      find.ancestor(
        of: find.byKey(_fourthKey),
        matching: find.byType(Transform),
      ),
      findsNothing,
    );
    expect(_opacityFor(tester, _fourthKey), 0);
  });

  testWidgets('disabling motion mid-flight settles the mounted child', (
    WidgetTester tester,
  ) async {
    bool motion = true;
    late StateSetter update;
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: StatefulBuilder(
          builder: (BuildContext context, StateSetter setState) {
            update = setState;
            return CbReveal(
              motion: motion,
              child: const Text('Stable content', key: _firstKey),
            );
          },
        ),
      ),
    );
    await tester.pump();
    await tester.pump(CbMotionTokens.fast);
    expect(_opacityFor(tester, _firstKey), lessThan(1));

    update(() => motion = false);
    await tester.pump();
    expect(
      find.descendant(
        of: find.byType(CbReveal),
        matching: find.byType(FadeTransition),
      ),
      findsNothing,
    );
    expect(find.text('Stable content'), findsOneWidget);
  });

  testWidgets('Stagger delays children by tokenized steps', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const CbStagger(
          pace: CbStaggerPace.standard,
          children: <Widget>[
            Text('First', key: _firstKey),
            Text('Second', key: _secondKey),
            Text('Third', key: _thirdKey),
          ],
        ),
      ),
    );
    await tester.pump();

    expect(_opacityFor(tester, _firstKey), 0);
    expect(_opacityFor(tester, _secondKey), 0);
    expect(_opacityFor(tester, _thirdKey), 0);

    await tester.pump(
      CbMotionTokens.staggerStandard + CbMotionTokens.staggerStandard,
    );
    final double first = _opacityFor(tester, _firstKey);
    final double second = _opacityFor(tester, _secondKey);
    final double third = _opacityFor(tester, _thirdKey);
    expect(first, greaterThan(second));
    expect(second, greaterThanOrEqualTo(third));
    expect(first, greaterThan(0));

    await tester.pumpAndSettle();
    expect(_opacityFor(tester, _firstKey), 1);
    expect(_opacityFor(tester, _secondKey), 1);
    expect(_opacityFor(tester, _thirdKey), 1);
  });

  testWidgets('onView waits for the native viewport and fires once', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const SingleChildScrollView(
          child: Column(
            children: <Widget>[
              SizedBox(height: 900),
              CbReveal(
                onView: true,
                child: SizedBox(key: _firstKey, height: 80),
              ),
              SizedBox(height: 900),
            ],
          ),
        ),
      ),
    );
    await tester.pump();
    expect(_opacityFor(tester, _firstKey), 0);

    await tester.drag(
      find.byType(SingleChildScrollView),
      const Offset(0, -900),
    );
    await tester.pumpAndSettle();
    expect(_opacityFor(tester, _firstKey), 1);

    await tester.drag(find.byType(SingleChildScrollView), const Offset(0, 900));
    await tester.pumpAndSettle();
    await tester.drag(
      find.byType(SingleChildScrollView),
      const Offset(0, -900),
    );
    await tester.pump();
    expect(_opacityFor(tester, _firstKey), 1);
  });
}

double _opacityFor(WidgetTester tester, Key key) => tester
    .widget<FadeTransition>(
      find
          .ancestor(of: find.byKey(key), matching: find.byType(FadeTransition))
          .first,
    )
    .opacity
    .value;

Offset _translationFor(WidgetTester tester, Key key) {
  final Transform transform = tester.widget<Transform>(
    find.ancestor(of: find.byKey(key), matching: find.byType(Transform)).first,
  );
  final translation = transform.transform.getTranslation();
  return Offset(translation.x, translation.y);
}
