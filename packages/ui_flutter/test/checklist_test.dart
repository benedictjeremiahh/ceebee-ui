import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('checklist reports progress and selects an actionable task', (
    WidgetTester tester,
  ) async {
    final SemanticsHandle semantics = tester.ensureSemantics();
    var selected = false;
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: Scaffold(
          body: CbChecklist(
            tasks: <CbChecklistTask>[
              const CbChecklistTask(
                id: 'profile',
                label: 'Create profile',
                done: true,
              ),
              CbChecklistTask(
                id: 'team',
                label: 'Invite your team',
                description: 'Add at least one collaborator',
                onSelect: () => selected = true,
              ),
            ],
          ),
        ),
      ),
    );

    expect(find.text('1 of 2'), findsOneWidget);
    expect(
      tester.getSemantics(find.byType(LinearProgressIndicator)),
      matchesSemantics(label: '1 of 2 tasks done', value: '50 percent'),
    );
    expect(
      tester.getSemantics(find.text('Invite your team')),
      matchesSemantics(
        label: 'Invite your team, Add at least one collaborator',
        isButton: true,
        hasEnabledState: true,
        isEnabled: true,
        hasCheckedState: true,
        isChecked: false,
      ),
    );

    await tester.tap(find.text('Invite your team'));
    expect(selected, isTrue);
    expect(
      tester
          .getSize(
            find.ancestor(
              of: find.text('Invite your team'),
              matching: find.byType(InkWell),
            ),
          )
          .height,
      greaterThanOrEqualTo(CbStructure.controlHeightLg),
    );
    semantics.dispose();
  });

  testWidgets('complete slot replaces task rows only when every task is done', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Scaffold(
          body: CbChecklist(
            tasks: <CbChecklistTask>[
              CbChecklistTask(id: 'one', label: 'First', done: true),
              CbChecklistTask(id: 'two', label: 'Second', done: true),
            ],
            completeSlot: Text('Setup complete'),
          ),
        ),
      ),
    );

    expect(find.text('Setup complete'), findsOneWidget);
    expect(find.text('First'), findsNothing);
    expect(find.text('2 of 2'), findsOneWidget);
  });

  testWidgets('skeleton is static and excluded from semantics', (
    WidgetTester tester,
  ) async {
    final SemanticsHandle semantics = tester.ensureSemantics();
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Scaffold(body: CbChecklistSkeleton(taskCount: 2)),
      ),
    );

    expect(find.byType(AnimationController), findsNothing);
    expect(find.bySemanticsLabel(RegExp('.+')), findsNothing);
    expect(find.byType(CbChecklistSkeleton), findsOneWidget);
    semantics.dispose();
  });
}
