import 'dart:ui' as ui;

import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_test/flutter_test.dart';

const Key volumeSliderKey = Key('volume-slider');
const Key rangeSliderKey = Key('range-slider');
const Key updatesSwitchKey = Key('updates-switch');
const Key archiveCheckboxKey = Key('archive-checkbox');
const Key compactRadioKey = Key('compact-radio');
const Key comfortableRadioKey = Key('comfortable-radio');
const Key comfortableSegmentKey = Key('comfortable-segment');
const Key disabledSwitchKey = Key('disabled-switch');

void main() {
  testWidgets('selection controls update through native gestures', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(theme: cbThemeData(), home: const _SelectionHarness()),
    );

    expect(find.text('Volume 25%'), findsOneWidget);
    await tester.drag(find.byKey(volumeSliderKey), const Offset(220, 0));
    await tester.pump();
    expect(find.text('Volume 25%'), findsNothing);

    final RangeValues initialRange = tester
        .widget<RangeSlider>(find.byKey(rangeSliderKey))
        .values;
    await tester.dragFrom(
      tester.getCenter(find.byKey(rangeSliderKey)) - const Offset(80, 0),
      const Offset(48, 0),
    );
    await tester.pump();
    expect(
      tester.widget<RangeSlider>(find.byKey(rangeSliderKey)).values,
      isNot(initialRange),
    );

    await tester.tap(find.byKey(updatesSwitchKey));
    await tester.tap(find.byKey(archiveCheckboxKey));
    await tester.tap(find.byKey(comfortableRadioKey));
    await tester.tap(find.byKey(comfortableSegmentKey));
    await tester.pump();

    expect(
      tester.widget<SwitchListTile>(find.byKey(updatesSwitchKey)).value,
      isTrue,
    );
    expect(
      tester.widget<CheckboxListTile>(find.byKey(archiveCheckboxKey)).value,
      isTrue,
    );
    expect(
      tester
          .widget<RadioGroup<String>>(find.byType(RadioGroup<String>))
          .groupValue,
      'comfortable',
    );
    expect(
      tester
          .widget<SegmentedButton<String>>(find.byType(SegmentedButton<String>))
          .selected,
      <String>{'comfortable'},
    );
  });

  testWidgets('disabled controls retain names and disabled semantics', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(theme: cbThemeData(), home: const _SelectionHarness()),
    );

    final SemanticsNode semantics = tester.getSemantics(
      find.byKey(disabledSwitchKey),
    );
    expect(semantics.label, contains('Managed by your organization'));
    expect(semantics.flagsCollection.isEnabled, ui.Tristate.isFalse);
  });
}

class _SelectionHarness extends StatefulWidget {
  const _SelectionHarness();

  @override
  State<_SelectionHarness> createState() => _SelectionHarnessState();
}

class _SelectionHarnessState extends State<_SelectionHarness> {
  double _volume = 0.25;
  RangeValues _range = const RangeValues(0.2, 0.7);
  bool _updates = false;
  bool _archive = false;
  String _density = 'compact';
  String _spacing = 'compact';

  @override
  Widget build(BuildContext context) => Scaffold(
    body: SingleChildScrollView(
      child: Column(
        children: <Widget>[
          Text('Volume ${(_volume * 100).round()}%'),
          Slider(
            key: volumeSliderKey,
            value: _volume,
            semanticFormatterCallback: (double value) =>
                '${(value * 100).round()} percent',
            onChanged: (double value) => setState(() => _volume = value),
          ),
          RangeSlider(
            key: rangeSliderKey,
            values: _range,
            onChanged: (RangeValues values) => setState(() => _range = values),
          ),
          SwitchListTile(
            key: updatesSwitchKey,
            title: const Text('Automatic updates'),
            value: _updates,
            onChanged: (bool value) => setState(() => _updates = value),
          ),
          const SwitchListTile(
            key: disabledSwitchKey,
            title: Text('Managed by your organization'),
            value: false,
            onChanged: null,
          ),
          CheckboxListTile(
            key: archiveCheckboxKey,
            title: const Text('Archive completed items'),
            value: _archive,
            onChanged: (bool? value) =>
                setState(() => _archive = value ?? false),
          ),
          RadioGroup<String>(
            groupValue: _spacing,
            onChanged: (String? value) =>
                setState(() => _spacing = value ?? _spacing),
            child: const Column(
              children: <Widget>[
                RadioListTile<String>(
                  key: compactRadioKey,
                  title: Text('Compact'),
                  value: 'compact',
                ),
                RadioListTile<String>(
                  key: comfortableRadioKey,
                  title: Text('Comfortable'),
                  value: 'comfortable',
                ),
              ],
            ),
          ),
          SegmentedButton<String>(
            segments: const <ButtonSegment<String>>[
              ButtonSegment<String>(value: 'compact', label: Text('Compact')),
              ButtonSegment<String>(
                value: 'comfortable',
                label: Text('Comfortable', key: comfortableSegmentKey),
              ),
            ],
            selected: <String>{_density},
            onSelectionChanged: (Set<String> values) =>
                setState(() => _density = values.single),
          ),
        ],
      ),
    ),
  );
}
