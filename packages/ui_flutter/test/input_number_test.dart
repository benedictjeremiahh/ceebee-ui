import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key _inputNumberKey = Key('input-number');

void main() {
  testWidgets('numeric editing emits controlled values and supports empty', (
    WidgetTester tester,
  ) async {
    final List<double?> values = <double?>[];
    await tester.pumpWidget(
      _app(
        CbInputNumber(
          key: _inputNumberKey,
          value: 4,
          label: 'Quantity',
          incrementSemanticLabel: 'Increase quantity',
          decrementSemanticLabel: 'Decrease quantity',
          onChanged: values.add,
        ),
      ),
    );

    await tester.enterText(find.byType(TextField), '12');
    await tester.enterText(find.byType(TextField), '');

    expect(values, <double?>[12, null]);
  });

  testWidgets('invalid draft preserves the controlled value after focus loss', (
    WidgetTester tester,
  ) async {
    final FocusNode focusNode = FocusNode();
    addTearDown(focusNode.dispose);
    double? changed;
    await tester.pumpWidget(
      _app(
        CbInputNumber(
          key: _inputNumberKey,
          value: 8,
          focusNode: focusNode,
          label: 'Quantity',
          incrementSemanticLabel: 'Increase quantity',
          decrementSemanticLabel: 'Decrease quantity',
          onChanged: (double? value) => changed = value,
        ),
      ),
    );

    await tester.enterText(find.byType(TextField), 'not a number');
    expect(changed, isNull);
    focusNode.unfocus();
    await tester.pump();

    expect(
      tester.widget<EditableText>(find.byType(EditableText)).controller.text,
      '8',
    );
  });

  testWidgets('step controls clamp to bounds and disable at endpoints', (
    WidgetTester tester,
  ) async {
    double value = 2;
    await tester.pumpWidget(
      _app(
        StatefulBuilder(
          builder: (BuildContext context, StateSetter setState) =>
              CbInputNumber(
                key: _inputNumberKey,
                value: value,
                min: 1,
                max: 3,
                label: 'Quantity',
                incrementSemanticLabel: 'Increase quantity',
                decrementSemanticLabel: 'Decrease quantity',
                onChanged: (double? next) {
                  if (next != null) setState(() => value = next);
                },
              ),
        ),
      ),
    );

    await tester.tap(find.byTooltip('Increase quantity'));
    await tester.pump();
    expect(value, 3);
    expect(
      tester
          .widget<IconButton>(find.widgetWithIcon(IconButton, Icons.add))
          .onPressed,
      isNull,
    );

    await tester.tap(find.byTooltip('Decrease quantity'));
    await tester.pump();
    expect(value, 2);
  });

  testWidgets('custom parser and formatter keep locale ownership in the app', (
    WidgetTester tester,
  ) async {
    double? changed;
    await tester.pumpWidget(
      _app(
        CbInputNumber(
          key: _inputNumberKey,
          value: 2.5,
          label: 'Hours',
          incrementSemanticLabel: 'Add half an hour',
          decrementSemanticLabel: 'Remove half an hour',
          formatter: (double value) =>
              value.toStringAsFixed(1).replaceAll('.', ','),
          parser: (String text) => double.tryParse(text.replaceAll(',', '.')),
          onChanged: (double? value) => changed = value,
        ),
      ),
    );

    expect(
      tester.widget<EditableText>(find.byType(EditableText)).controller.text,
      '2,5',
    );
    await tester.enterText(find.byType(TextField), '3,5');
    expect(changed, 3.5);
  });

  testWidgets('read-only and disabled states remain distinct', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const Column(
          children: <Widget>[
            CbInputNumber(
              value: 4,
              readOnly: true,
              label: 'Committed quantity',
              incrementSemanticLabel: 'Increase committed quantity',
              decrementSemanticLabel: 'Decrease committed quantity',
            ),
            CbInputNumber(
              value: 6,
              label: 'Unavailable quantity',
              incrementSemanticLabel: 'Increase unavailable quantity',
              decrementSemanticLabel: 'Decrease unavailable quantity',
            ),
          ],
        ),
      ),
    );

    final List<TextField> fields = tester
        .widgetList<TextField>(find.byType(TextField))
        .toList();
    expect(fields.first.readOnly, isTrue);
    expect(fields.first.enabled, isTrue);
    expect(fields.last.readOnly, isFalse);
    expect(fields.last.enabled, isFalse);
    expect(find.byIcon(Icons.lock_outline), findsOneWidget);
  });

  testWidgets('step controls meet the mobile touch-target floor', (
    WidgetTester tester,
  ) async {
    final SemanticsHandle semantics = tester.ensureSemantics();
    await tester.pumpWidget(
      _app(
        CbInputNumber(
          key: _inputNumberKey,
          value: 4,
          label: 'Quantity',
          incrementSemanticLabel: 'Increase quantity',
          decrementSemanticLabel: 'Decrease quantity',
          onChanged: (_) {},
        ),
      ),
    );

    for (final Element button in find.byType(IconButton).evaluate()) {
      final Size size = tester.getSize(find.byWidget(button.widget));
      expect(size.width, greaterThanOrEqualTo(CbStructure.controlHeightLg));
      expect(size.height, greaterThanOrEqualTo(CbStructure.controlHeightLg));
    }
    expect(find.bySemanticsLabel('Increase quantity'), findsOneWidget);
    expect(find.bySemanticsLabel('Decrease quantity'), findsOneWidget);
    semantics.dispose();
  });
}

Widget _app(Widget child) => MaterialApp(
  theme: cbThemeData(),
  home: Scaffold(
    body: Center(
      child: SizedBox(width: CbStructure.space8 * 6, child: child),
    ),
  ),
);
