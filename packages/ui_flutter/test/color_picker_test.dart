import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';
import 'package:flutter_test/flutter_test.dart';

const Key _pickerKey = Key('picker');

void main() {
  testWidgets('ColorPicker keeps all channel state application-owned', (
    WidgetTester tester,
  ) async {
    HSVColor? selected;
    await tester.pumpWidget(
      _app(
        CbColorPicker(
          key: _pickerKey,
          value: const HSVColor.fromAHSV(1, 200, 0.5, 0.75),
          semanticLabel: 'Brand colour',
          hueLabel: 'Hue',
          saturationLabel: 'Saturation',
          brightnessLabel: 'Brightness',
          onChanged: (HSVColor value) => selected = value,
        ),
      ),
    );

    final Finder hue = find
        .descendant(of: find.byKey(_pickerKey), matching: find.byType(Slider))
        .first;
    await tester.drag(hue, const Offset(120, 0));
    expect(selected, isNotNull);
    expect(selected!.hue, greaterThan(200));
    expect(selected!.saturation, 0.5);
    expect(selected!.value, 0.75);
  });

  testWidgets('ColorPicker exposes localized channel semantics', (
    WidgetTester tester,
  ) async {
    final SemanticsHandle semantics = tester.ensureSemantics();
    HSVColor? selected;
    await tester.pumpWidget(
      _app(
        CbColorPicker(
          key: _pickerKey,
          value: const HSVColor.fromAHSV(1, 120, 0.4, 0.8),
          semanticLabel: 'Accent colour',
          hueLabel: 'Hue',
          saturationLabel: 'Saturation',
          brightnessLabel: 'Brightness',
          valueBuilder: (HSVColor value) => 'Green accent',
          onChanged: (HSVColor value) => selected = value,
        ),
      ),
    );

    expect(find.bySemanticsLabel('Accent colour'), findsOneWidget);
    expect(find.bySemanticsLabel('Hue'), findsOneWidget);
    expect(find.bySemanticsLabel('Saturation'), findsOneWidget);
    expect(find.bySemanticsLabel('Brightness'), findsOneWidget);
    expect(
      tester.getSemantics(find.byKey(_pickerKey)).value,
      contains('Green accent'),
    );
    final SemanticsNode hueNode = tester.getSemantics(
      find.bySemanticsLabel('Hue'),
    );
    expect(
      hueNode.getSemanticsData().hasAction(SemanticsAction.increase),
      isTrue,
    );
    expect(
      hueNode.getSemanticsData().hasAction(SemanticsAction.decrease),
      isTrue,
    );
    tester.semantics.performAction(
      find.semantics.byLabel('Hue'),
      SemanticsAction.increase,
    );
    expect(selected, isNotNull);
    expect(selected!.hue, greaterThan(120));
    semantics.dispose();
  });

  testWidgets('white preview retains a tokenized visible boundary', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const CbColorPicker(
          value: HSVColor.fromAHSV(1, 0, 0, 1),
          semanticLabel: 'White colour',
          hueLabel: 'Hue',
          saturationLabel: 'Saturation',
          brightnessLabel: 'Brightness',
        ),
      ),
    );

    final BoxDecoration preview = tester
        .widgetList<Container>(find.byType(Container))
        .map((Container container) => container.decoration)
        .whereType<BoxDecoration>()
        .singleWhere(
          (BoxDecoration decoration) => decoration.color == Colors.white,
        );
    expect(preview.border, isNotNull);
  });

  testWidgets('null callback disables every native channel', (
    WidgetTester tester,
  ) async {
    final SemanticsHandle semantics = tester.ensureSemantics();
    await tester.pumpWidget(
      _app(
        const CbColorPicker(
          value: HSVColor.fromAHSV(1, 20, 0.5, 0.5),
          semanticLabel: 'Locked colour',
          hueLabel: 'Hue',
          saturationLabel: 'Saturation',
          brightnessLabel: 'Brightness',
        ),
      ),
    );

    for (final Slider slider in tester.widgetList<Slider>(
      find.byType(Slider),
    )) {
      expect(slider.onChanged, isNull);
    }
    final SemanticsData hue = tester
        .getSemantics(find.bySemanticsLabel('Hue'))
        .getSemanticsData();
    expect(hue.hasAction(SemanticsAction.increase), isFalse);
    expect(hue.hasAction(SemanticsAction.decrease), isFalse);
    semantics.dispose();
  });
}

Widget _app(Widget child) => MaterialApp(
  theme: cbThemeData(),
  home: Scaffold(
    body: Center(child: SizedBox(width: 420, child: child)),
  ),
);
