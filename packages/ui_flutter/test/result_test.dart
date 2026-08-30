import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key _customIconKey = Key('result-custom-icon');
const Key _actionKey = Key('result-action');

void main() {
  testWidgets(
    'Result announces the app-owned outcome and preserves injected actions',
    (WidgetTester tester) async {
      final SemanticsHandle semantics = tester.ensureSemantics();
      int presses = 0;
      await tester.pumpWidget(
        MaterialApp(
          theme: cbThemeData(),
          home: Scaffold(
            body: CbResult(
              status: CbResultStatus.success,
              title: 'Payment completed',
              semanticLabel: 'Success: payment completed',
              description: 'Receipt 1842 is ready.',
              icon: Semantics(
                label: 'Decorative custom icon',
                child: const Icon(Icons.celebration, key: _customIconKey),
              ),
              actions: <Widget>[
                FilledButton(
                  key: _actionKey,
                  onPressed: () => presses += 1,
                  child: const Text('View receipt'),
                ),
              ],
              details: const Text('Paid with card ending in 4242.'),
            ),
          ),
        ),
      );

      expect(
        find.bySemanticsLabel('Success: payment completed'),
        findsOneWidget,
      );
      expect(find.bySemanticsLabel('Decorative custom icon'), findsNothing);
      expect(find.text('Receipt 1842 is ready.'), findsOneWidget);
      expect(find.text('Paid with card ending in 4242.'), findsOneWidget);
      expect(find.bySemanticsLabel('View receipt'), findsOneWidget);

      await tester.tap(find.byKey(_actionKey));
      expect(presses, 1);
      semantics.dispose();
    },
  );

  testWidgets('Result statuses use distinct icons and semantic Tones', (
    WidgetTester tester,
  ) async {
    const Map<CbResultStatus, (IconData, CbTone)> expected =
        <CbResultStatus, (IconData, CbTone)>{
          CbResultStatus.info: (Icons.info_outline_rounded, CbTone.info),
          CbResultStatus.success: (
            Icons.check_circle_outline_rounded,
            CbTone.success,
          ),
          CbResultStatus.warning: (Icons.warning_amber_rounded, CbTone.warning),
          CbResultStatus.error: (Icons.error_outline_rounded, CbTone.danger),
        };

    for (final MapEntry<CbResultStatus, (IconData, CbTone)> entry
        in expected.entries) {
      await tester.pumpWidget(
        MaterialApp(
          theme: cbThemeData(),
          home: Scaffold(
            body: CbResult(status: entry.key, title: entry.key.name),
          ),
        ),
      );

      expect(find.byIcon(entry.value.$1), findsOneWidget);
      final Icon icon = tester.widget<Icon>(find.byIcon(entry.value.$1));
      final BuildContext context = tester.element(find.byType(CbResult));
      expect(icon.color, context.cb.accent(tone: entry.value.$2).toColor());
    }
  });

  testWidgets('Result Skeleton mirrors optional actions and detail anatomy', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Scaffold(
          body: CbResultSkeleton(
            descriptionLines: 2,
            actionCount: 2,
            detailLines: 2,
            motion: false,
          ),
        ),
      ),
    );

    expect(find.byType(CbSkeleton), findsNWidgets(8));
    expect(
      find.descendant(
        of: find.byType(CbResultSkeleton),
        matching: find.byType(FadeTransition),
      ),
      findsNothing,
    );
  });

  testWidgets('OS reduced motion keeps the Result Skeleton static', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Scaffold(
          body: MediaQuery(
            data: MediaQueryData(disableAnimations: true),
            child: CbResultSkeleton(descriptionLines: 1),
          ),
        ),
      ),
    );

    expect(find.byType(CbResultSkeleton), findsOneWidget);
    expect(
      find.descendant(
        of: find.byType(CbResultSkeleton),
        matching: find.byType(FadeTransition),
      ),
      findsNothing,
    );
  });
}
