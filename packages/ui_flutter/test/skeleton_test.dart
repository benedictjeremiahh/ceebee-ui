import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key _textKey = Key('skeleton-text');
const Key _circleKey = Key('skeleton-circle');
const Key _rectKey = Key('skeleton-rect');

void main() {
  testWidgets('shape constructors map CbSize to tokenized geometry', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Scaffold(
          body: SizedBox(
            width: CbStructure.space8 * 4,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                CbSkeleton.text(key: _textKey, size: CbSize.sm, motion: false),
                CbSkeleton.circle(
                  key: _circleKey,
                  size: CbSize.md,
                  motion: false,
                ),
                CbSkeleton.rect(key: _rectKey, size: CbSize.lg, motion: false),
              ],
            ),
          ),
        ),
      ),
    );

    expect(tester.getSize(find.byKey(_textKey)).height, CbStructure.textSm);
    expect(
      tester.getSize(find.byKey(_circleKey)),
      const Size.square(CbStructure.controlHeightMd),
    );
    expect(
      tester.getSize(find.byKey(_rectKey)),
      const Size(CbStructure.space8 * 4, CbStructure.controlHeightLg),
    );
  });

  testWidgets('Skeleton is decorative and excluded from semantics', (
    WidgetTester tester,
  ) async {
    final SemanticsHandle semantics = tester.ensureSemantics();
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: Scaffold(
          body: Semantics(
            label: 'Loading account',
            child: const CbSkeleton.rect(motion: false),
          ),
        ),
      ),
    );

    expect(find.bySemanticsLabel('Loading account'), findsOneWidget);
    expect(
      find.descendant(
        of: find.byType(CbSkeleton),
        matching: find.byType(ExcludeSemantics),
      ),
      findsOneWidget,
    );
    semantics.dispose();
  });

  testWidgets('motion pulses opacity using Tokens', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Scaffold(body: CbSkeleton.text()),
      ),
    );
    await tester.pump();

    expect(_skeletonFades, findsOneWidget);
    final double initial = _opacity(tester);
    await tester.pump(CbMotionTokens.deliberate ~/ 2);
    final double middle = _opacity(tester);
    expect(middle, isNot(initial));
    expect(
      middle,
      inInclusiveRange(
        CbSkeletonTokens.opacityMin,
        CbSkeletonTokens.opacityMax,
      ),
    );
  });

  testWidgets('component and OS motion opt-outs render a static shape', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Column(
          children: <Widget>[
            CbSkeleton.text(motion: false),
            MediaQuery(
              data: MediaQueryData(disableAnimations: true),
              child: CbSkeleton.circle(),
            ),
          ],
        ),
      ),
    );

    expect(_skeletonFades, findsNothing);
    expect(find.byType(CbSkeleton), findsNWidgets(2));
  });
}

double _opacity(WidgetTester tester) {
  final FadeTransition transition = tester.widget<FadeTransition>(
    _skeletonFades,
  );
  return transition.opacity.value;
}

Finder get _skeletonFades => find.descendant(
  of: find.byType(CbSkeleton),
  matching: find.byType(FadeTransition),
);
