import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key _statusItemKey = Key('descriptions-status-item');
const Key _actionKey = Key('descriptions-action');
const Key _firstItemKey = Key('descriptions-first-item');
const Key _secondItemKey = Key('descriptions-second-item');
const Key _fullItemKey = Key('descriptions-full-item');

void main() {
  testWidgets(
    'Descriptions groups item labels with app-owned values and action',
    (WidgetTester tester) async {
      final SemanticsHandle semantics = tester.ensureSemantics();
      int presses = 0;
      await tester.pumpWidget(
        MaterialApp(
          theme: cbThemeData(),
          home: Scaffold(
            body: CbDescriptions(
              title: 'Transfer details',
              action: TextButton(
                key: _actionKey,
                onPressed: () => presses += 1,
                child: const Text('Edit details'),
              ),
              items: <CbDescriptionItem>[
                const CbDescriptionItem(
                  label: 'Recipient',
                  value: Text('Ari Putra'),
                ),
                CbDescriptionItem(
                  key: _statusItemKey,
                  label: 'Status',
                  semanticValue: 'Completed',
                  value: Semantics(
                    label: 'Decorative status content',
                    child: Chip(label: Text('Completed')),
                  ),
                ),
              ],
            ),
          ),
        ),
      );

      final status = tester.getSemantics(find.byKey(_statusItemKey));
      expect(status.label, 'Status');
      expect(status.value, 'Completed');
      expect(find.bySemanticsLabel('Decorative status content'), findsNothing);
      expect(find.bySemanticsLabel('Edit details'), findsOneWidget);

      await tester.tap(find.byKey(_actionKey));
      expect(presses, 1);
      semantics.dispose();
    },
  );

  testWidgets(
    'Descriptions adapts from two columns to one without reordering',
    (WidgetTester tester) async {
      Future<void> pumpAt(double width) => tester.pumpWidget(
        MaterialApp(
          theme: cbThemeData(),
          home: Scaffold(
            body: SizedBox(width: width, child: _responsiveSample()),
          ),
        ),
      );

      await pumpAt(CbStructure.space8 * 10);
      final Offset wideFirst = tester.getTopLeft(find.byKey(_firstItemKey));
      final Offset wideSecond = tester.getTopLeft(find.byKey(_secondItemKey));
      expect(wideFirst.dy, wideSecond.dy);
      expect(wideFirst.dx, lessThan(wideSecond.dx));

      await pumpAt(CbStructure.space8 * 6);
      final Offset compactFirst = tester.getTopLeft(find.byKey(_firstItemKey));
      final Offset compactSecond = tester.getTopLeft(
        find.byKey(_secondItemKey),
      );
      expect(compactFirst.dx, compactSecond.dx);
      expect(compactFirst.dy, lessThan(compactSecond.dy));
    },
  );

  testWidgets('full-width item spans the wide record after preceding items', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: Scaffold(
          body: SizedBox(
            width: CbStructure.space8 * 10,
            child: _responsiveSample(),
          ),
        ),
      ),
    );

    final Size regular = tester.getSize(find.byKey(_firstItemKey));
    final Size full = tester.getSize(find.byKey(_fullItemKey));
    expect(full.width, greaterThan(regular.width));
    expect(
      tester.getTopLeft(find.byKey(_fullItemKey)).dy,
      greaterThan(tester.getTopLeft(find.byKey(_firstItemKey)).dy),
    );
  });

  testWidgets(
    'Descriptions Skeleton mirrors header, action, and item anatomy',
    (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: cbThemeData(),
          home: const Scaffold(
            body: CbDescriptionsSkeleton(
              itemCount: 3,
              title: true,
              action: true,
              motion: false,
            ),
          ),
        ),
      );

      expect(find.byType(CbSkeleton), findsNWidgets(8));
      expect(
        find.descendant(
          of: find.byType(CbDescriptionsSkeleton),
          matching: find.byType(FadeTransition),
        ),
        findsNothing,
      );
    },
  );

  testWidgets('OS reduced motion keeps Descriptions Skeleton static', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Scaffold(
          body: MediaQuery(
            data: MediaQueryData(disableAnimations: true),
            child: CbDescriptionsSkeleton(itemCount: 1),
          ),
        ),
      ),
    );

    expect(find.byType(CbDescriptionsSkeleton), findsOneWidget);
    expect(
      find.descendant(
        of: find.byType(CbDescriptionsSkeleton),
        matching: find.byType(FadeTransition),
      ),
      findsNothing,
    );
  });
}

Widget _responsiveSample() => const CbDescriptions(
  items: <CbDescriptionItem>[
    CbDescriptionItem(
      key: _firstItemKey,
      label: 'Product',
      value: Text('Cloud database'),
    ),
    CbDescriptionItem(
      key: _secondItemKey,
      label: 'Billing',
      value: Text('Prepaid'),
    ),
    CbDescriptionItem(
      key: _fullItemKey,
      label: 'Configuration',
      value: Text('MongoDB 7.0, six cores, 10 GB storage'),
      fullWidth: true,
    ),
  ],
);
