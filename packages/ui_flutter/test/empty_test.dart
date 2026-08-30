import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key _illustrationKey = Key('empty-illustration');
const Key _actionKey = Key('empty-action');

void main() {
  testWidgets(
    'Empty exposes content and action while hiding its illustration',
    (WidgetTester tester) async {
      final SemanticsHandle semantics = tester.ensureSemantics();
      int presses = 0;
      await tester.pumpWidget(
        MaterialApp(
          theme: cbThemeData(),
          home: Scaffold(
            body: CbEmpty(
              title: 'No saved views',
              description: 'Create a view to keep this filter nearby.',
              illustration: Semantics(
                label: 'Decorative folder',
                child: const Icon(Icons.folder_outlined, key: _illustrationKey),
              ),
              action: FilledButton(
                key: _actionKey,
                onPressed: () => presses += 1,
                child: const Text('Create view'),
              ),
            ),
          ),
        ),
      );

      expect(find.text('No saved views'), findsOneWidget);
      expect(
        find.text('Create a view to keep this filter nearby.'),
        findsOneWidget,
      );
      expect(find.byKey(_illustrationKey), findsOneWidget);
      expect(find.bySemanticsLabel('Decorative folder'), findsNothing);
      expect(find.bySemanticsLabel('No saved views'), findsOneWidget);
      expect(find.bySemanticsLabel('Create view'), findsOneWidget);

      await tester.tap(find.byKey(_actionKey));
      expect(presses, 1);
      semantics.dispose();
    },
  );

  testWidgets('default Empty remains useful without description or action', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Scaffold(body: CbEmpty(title: 'Nothing scheduled')),
      ),
    );

    expect(find.byIcon(Icons.inbox_outlined), findsOneWidget);
    expect(find.text('Nothing scheduled'), findsOneWidget);
    expect(find.byType(ButtonStyleButton), findsNothing);
  });

  testWidgets(
    'Empty Skeleton mirrors optional description and action anatomy',
    (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: cbThemeData(),
          home: const Scaffold(
            body: CbEmptySkeleton(
              descriptionLines: 2,
              action: true,
              motion: false,
            ),
          ),
        ),
      );

      expect(find.byType(CbSkeleton), findsNWidgets(5));
      expect(
        find.descendant(
          of: find.byType(CbEmptySkeleton),
          matching: find.byType(FadeTransition),
        ),
        findsNothing,
      );
    },
  );

  testWidgets('OS reduced motion keeps the Empty Skeleton static', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Scaffold(
          body: MediaQuery(
            data: MediaQueryData(disableAnimations: true),
            child: CbEmptySkeleton(descriptionLines: 1),
          ),
        ),
      ),
    );

    expect(find.byType(CbEmptySkeleton), findsOneWidget);
    expect(
      find.descendant(
        of: find.byType(CbEmptySkeleton),
        matching: find.byType(FadeTransition),
      ),
      findsNothing,
    );
  });
}
