import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';
import 'package:flutter_test/flutter_test.dart';

const Key _ratingKey = Key('rating');

void main() {
  testWidgets('Rating selects a whole value from a native tap target', (
    WidgetTester tester,
  ) async {
    double? selected;
    await tester.pumpWidget(
      _app(
        CbRating(
          key: _ratingKey,
          value: 0,
          semanticLabel: 'Rating',
          onChanged: (double value) => selected = value,
        ),
      ),
    );

    final Rect rect = tester.getRect(find.byKey(_ratingKey));
    expect(rect.height, greaterThanOrEqualTo(CbStructure.controlHeightLg));
    await tester.tapAt(rect.topLeft + const Offset(120, 24));
    expect(selected, 3);
  });

  testWidgets('half precision Rating follows horizontal drag position', (
    WidgetTester tester,
  ) async {
    double? selected;
    await tester.pumpWidget(
      _app(
        CbRating(
          key: _ratingKey,
          value: 0,
          semanticLabel: 'Rating',
          precision: CbRatingPrecision.half,
          onChanged: (double value) => selected = value,
        ),
      ),
    );

    final Rect rect = tester.getRect(find.byKey(_ratingKey));
    await tester.dragFrom(
      rect.centerLeft + const Offset(4, 0),
      const Offset(164, 0),
    );
    expect(selected, 3.5);
  });

  testWidgets('tapping the selected value clears when allowed', (
    WidgetTester tester,
  ) async {
    double? selected;
    await tester.pumpWidget(
      _app(
        CbRating(
          key: _ratingKey,
          value: 3,
          semanticLabel: 'Rating',
          onChanged: (double value) => selected = value,
        ),
      ),
    );

    final Rect rect = tester.getRect(find.byKey(_ratingKey));
    await tester.tapAt(rect.topLeft + const Offset(120, 24));
    expect(selected, 0);
  });

  testWidgets('Rating exposes localized adjustable semantics', (
    WidgetTester tester,
  ) async {
    final SemanticsHandle semantics = tester.ensureSemantics();
    double? selected;
    await tester.pumpWidget(
      _app(
        CbRating(
          key: _ratingKey,
          value: 3.5,
          precision: CbRatingPrecision.half,
          semanticLabel: 'Product rating',
          semanticValueBuilder: _semanticValue,
          onChanged: (double value) => selected = value,
        ),
      ),
    );

    expect(
      tester.getSemantics(find.byKey(_ratingKey)),
      matchesSemantics(
        label: 'Product rating',
        value: '3.5 of 5 stars',
        increasedValue: '4 of 5 stars',
        decreasedValue: '3 of 5 stars',
        isSlider: true,
        hasEnabledState: true,
        isEnabled: true,
        hasIncreaseAction: true,
        hasDecreaseAction: true,
      ),
    );
    tester.semantics.performAction(
      find.semantics.byLabel('Product rating'),
      SemanticsAction.increase,
    );
    expect(selected, 4);
    semantics.dispose();
  });

  testWidgets('disabled Rating is non-adjustable and visually muted', (
    WidgetTester tester,
  ) async {
    final SemanticsHandle semantics = tester.ensureSemantics();
    await tester.pumpWidget(
      _app(
        const CbRating(
          key: _ratingKey,
          value: 4,
          semanticLabel: 'Locked rating',
        ),
      ),
    );

    expect(
      tester.getSemantics(find.byKey(_ratingKey)),
      matchesSemantics(
        label: 'Locked rating',
        value: '4 / 5',
        isSlider: true,
        hasEnabledState: true,
        isEnabled: false,
      ),
    );
    semantics.dispose();
  });

  testWidgets('RTL Rating maps the leading edge to the highest value', (
    WidgetTester tester,
  ) async {
    double? selected;
    await tester.pumpWidget(
      _app(
        Directionality(
          textDirection: TextDirection.rtl,
          child: CbRating(
            key: _ratingKey,
            value: 0,
            semanticLabel: 'Rating',
            onChanged: (double value) => selected = value,
          ),
        ),
      ),
    );

    final Rect rect = tester.getRect(find.byKey(_ratingKey));
    await tester.tapAt(rect.centerLeft + const Offset(4, 0));
    expect(selected, 5);
  });

  testWidgets('fractional value clips exactly one filled item', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const CbRating(
          key: _ratingKey,
          value: 3.5,
          semanticLabel: 'Rating',
          precision: CbRatingPrecision.half,
        ),
      ),
    );

    final Iterable<Align> fills = tester.widgetList<Align>(
      find.descendant(
        of: find.byKey(_ratingKey),
        matching: find.byWidgetPredicate(
          (Widget widget) => widget is Align && widget.widthFactor != null,
        ),
      ),
    );
    expect(fills.where((Align fill) => fill.widthFactor == 0.5), hasLength(1));
  });
}

Widget _app(Widget child) => MaterialApp(
  theme: cbThemeData(),
  home: Scaffold(body: Center(child: child)),
);

String _semanticValue(double value, int itemCount) =>
    '${value == value.roundToDouble() ? value.toInt() : value} of $itemCount stars';
