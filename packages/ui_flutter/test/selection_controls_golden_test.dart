import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key selectionControlsGoldenKey = Key('selection-controls-golden');

void main() {
  testWidgets('Selection controls — light', (WidgetTester tester) async {
    await _pumpScene(tester, cbThemeData());

    await expectLater(
      find.byKey(selectionControlsGoldenKey),
      matchesGoldenFile('goldens/selection_controls_light.png'),
    );
  });

  testWidgets('Selection controls — dark', (WidgetTester tester) async {
    await _pumpScene(tester, cbThemeData(brightness: Brightness.dark));

    await expectLater(
      find.byKey(selectionControlsGoldenKey),
      matchesGoldenFile('goldens/selection_controls_dark.png'),
    );
  });
}

Future<void> _pumpScene(WidgetTester tester, ThemeData theme) async {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = const Size(840, 1024);
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);

  await tester.pumpWidget(
    MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: theme.copyWith(
        textTheme: theme.textTheme.apply(fontFamily: 'Roboto'),
      ),
      home: const RepaintBoundary(
        key: selectionControlsGoldenKey,
        child: _SelectionControlsScene(),
      ),
    ),
  );
  await tester.pumpAndSettle();
}

class _SelectionControlsScene extends StatelessWidget {
  const _SelectionControlsScene();

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;

    return Scaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(CbStructure.space6),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Text('Selection controls', style: type.displaySmall),
            const SizedBox(height: CbStructure.space2),
            Text(
              'Native state, focus, gestures, and disabled rendering.',
              style: type.bodyLarge,
            ),
            const SizedBox(height: CbStructure.space5),
            CbSurface(
              padding: CbPad.lg,
              elevation: CbElevation.sm,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  Text('Continuous values', style: type.titleLarge),
                  const Divider(),
                  const _ValueLabel(label: 'Volume', value: '35%'),
                  Slider(value: 0.35, onChanged: _ignoreDouble),
                  const _ValueLabel(label: 'Temperature range', value: '20–72'),
                  RangeSlider(
                    values: const RangeValues(0.2, 0.72),
                    onChanged: _ignoreRange,
                  ),
                  const _ValueLabel(label: 'Managed limit', value: 'Disabled'),
                  const Slider(value: 0.6, onChanged: null),
                ],
              ),
            ),
            const SizedBox(height: CbStructure.space5),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Expanded(
                  child: CbSurface(
                    padding: CbPad.lg,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: <Widget>[
                        Text('Immediate settings', style: type.titleLarge),
                        const Divider(),
                        SwitchListTile(
                          title: const Text('Automatic updates'),
                          subtitle: const Text('Applies immediately'),
                          value: true,
                          onChanged: _ignoreBool,
                        ),
                        CheckboxListTile(
                          title: const Text('Archive completed items'),
                          value: true,
                          onChanged: _ignoreNullableBool,
                        ),
                        CheckboxListTile(
                          title: const Text('Include descendants'),
                          tristate: true,
                          value: null,
                          onChanged: _ignoreNullableBool,
                        ),
                        const SwitchListTile(
                          title: Text('Organization policy'),
                          subtitle: Text('Managed by your administrator'),
                          value: false,
                          onChanged: null,
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: CbStructure.space5),
                Expanded(
                  child: CbSurface(
                    padding: CbPad.lg,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: <Widget>[
                        Text('One-of-many choices', style: type.titleLarge),
                        const Divider(),
                        RadioGroup<String>(
                          groupValue: 'comfortable',
                          onChanged: _ignoreNullableString,
                          child: const Column(
                            children: <Widget>[
                              RadioListTile<String>(
                                title: Text('Compact'),
                                value: 'compact',
                              ),
                              RadioListTile<String>(
                                title: Text('Comfortable'),
                                value: 'comfortable',
                              ),
                              RadioListTile<String>(
                                title: Text('Spacious'),
                                value: 'spacious',
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: CbStructure.space3),
                        SegmentedButton<String>(
                          showSelectedIcon: false,
                          segments: const <ButtonSegment<String>>[
                            ButtonSegment<String>(
                              value: 'day',
                              label: Text('Day'),
                            ),
                            ButtonSegment<String>(
                              value: 'week',
                              label: Text('Week'),
                            ),
                            ButtonSegment<String>(
                              value: 'month',
                              label: Text('Month'),
                            ),
                          ],
                          selected: const <String>{'week'},
                          onSelectionChanged: _ignoreStringSet,
                        ),
                        const SizedBox(height: CbStructure.space3),
                        SegmentedButton<String>(
                          segments: const <ButtonSegment<String>>[
                            ButtonSegment<String>(
                              value: 'locked',
                              label: Text('Locked view'),
                            ),
                          ],
                          selected: const <String>{'locked'},
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _ValueLabel extends StatelessWidget {
  const _ValueLabel({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) => Row(
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: <Widget>[
      Text(label),
      Text(value, style: Theme.of(context).textTheme.bodySmall),
    ],
  );
}

void _ignoreDouble(double value) {}
void _ignoreRange(RangeValues values) {}
void _ignoreBool(bool value) {}
void _ignoreNullableBool(bool? value) {}
void _ignoreNullableString(String? value) {}
void _ignoreStringSet(Set<String> values) {}
