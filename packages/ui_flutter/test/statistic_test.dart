import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key _prefixKey = Key('statistic-prefix');
const Key _suffixKey = Key('statistic-suffix');

void main() {
  testWidgets(
    'Statistic exposes app-formatted label and semantic value as one group',
    (WidgetTester tester) async {
      final SemanticsHandle semantics = tester.ensureSemantics();
      await tester.pumpWidget(
        MaterialApp(
          theme: cbThemeData(),
          home: Scaffold(
            body: CbStatistic(
              label: 'Account balance',
              value: 'Rp 12.893.000',
              semanticValue:
                  'twelve million eight hundred ninety-three thousand rupiah',
              prefix: Semantics(
                label: 'Decorative wallet',
                child: Icon(
                  Icons.account_balance_wallet_outlined,
                  key: _prefixKey,
                ),
              ),
              suffix: Semantics(
                label: 'Decorative currency code',
                child: Text('IDR', key: _suffixKey),
              ),
              description: 'Available to spend',
            ),
          ),
        ),
      );

      final semanticsNode = tester.getSemantics(find.byType(CbStatistic));
      expect(semanticsNode.label, 'Account balance');
      expect(
        semanticsNode.value,
        'twelve million eight hundred ninety-three thousand rupiah',
      );
      expect(find.bySemanticsLabel('Decorative wallet'), findsNothing);
      expect(find.bySemanticsLabel('Decorative currency code'), findsNothing);
      expect(find.bySemanticsLabel('Available to spend'), findsOneWidget);
      semantics.dispose();
    },
  );

  testWidgets(
    'Statistic preserves formatted text and tabular number geometry',
    (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: cbThemeData(),
          home: const Scaffold(
            body: CbStatistic(label: 'Completion', value: '93.20%'),
          ),
        ),
      );

      final Text value = tester.widget<Text>(find.text('93.20%'));
      expect(value.data, '93.20%');
      expect(value.style?.fontFeatures, isNotEmpty);
    },
  );

  testWidgets('Statistic applies Tone only to its value content', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Scaffold(
          body: CbStatistic(
            label: 'Service health',
            value: '99.98%',
            tone: CbTone.success,
          ),
        ),
      ),
    );

    final BuildContext context = tester.element(find.byType(CbStatistic));
    final Text label = tester.widget<Text>(find.text('Service health'));
    final Text value = tester.widget<Text>(find.text('99.98%'));
    expect(value.style?.color, context.cb.toneSuccess.toColor());
    expect(label.style?.color, isNot(context.cb.toneSuccess.toColor()));
  });

  testWidgets(
    'Statistic Skeleton mirrors optional description without motion',
    (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: cbThemeData(),
          home: const Scaffold(
            body: CbStatisticSkeleton(description: true, motion: false),
          ),
        ),
      );

      expect(find.byType(CbSkeleton), findsNWidgets(3));
      expect(
        find.descendant(
          of: find.byType(CbStatisticSkeleton),
          matching: find.byType(FadeTransition),
        ),
        findsNothing,
      );
    },
  );

  testWidgets('OS reduced motion keeps the Statistic Skeleton static', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Scaffold(
          body: MediaQuery(
            data: MediaQueryData(disableAnimations: true),
            child: CbStatisticSkeleton(),
          ),
        ),
      ),
    );

    expect(find.byType(CbStatisticSkeleton), findsOneWidget);
    expect(
      find.descendant(
        of: find.byType(CbStatisticSkeleton),
        matching: find.byType(FadeTransition),
      ),
      findsNothing,
    );
  });
}
