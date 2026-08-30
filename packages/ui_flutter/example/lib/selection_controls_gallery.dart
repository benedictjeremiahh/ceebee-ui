import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';

const Key automaticUpdatesKey = Key('automatic-updates');
const Key archiveCompletedKey = Key('archive-completed');
const Key comfortableDensityKey = Key('comfortable-density');
const Key monthPeriodKey = Key('month-period');

class SelectionControlsGallery extends StatefulWidget {
  const SelectionControlsGallery({super.key});

  @override
  State<SelectionControlsGallery> createState() =>
      _SelectionControlsGalleryState();
}

class _SelectionControlsGalleryState extends State<SelectionControlsGallery> {
  double _volume = 0.35;
  RangeValues _temperature = const RangeValues(18, 26);
  bool _automaticUpdates = true;
  bool _archiveCompleted = false;
  bool? _includeDescendants;
  String _density = 'comfortable';
  String _period = 'week';

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Text('Selection controls', style: type.displaySmall),
        const SizedBox(height: CbStructure.space2),
        Text(
          'Material controls keep native gestures, focus, semantics, and state rendering. '
          'Ceebee supplies their color roles through the Theme bridge.',
          style: type.bodyLarge,
        ),
        const SizedBox(height: CbStructure.space5),
        CbSurface(
          elevation: CbElevation.sm,
          padding: CbPad.lg,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              Text('Continuous values', style: type.titleLarge),
              const Divider(),
              _ValueLabel(
                label: 'Volume',
                value: '${(_volume * 100).round()}%',
              ),
              Slider(
                value: _volume,
                onChanged: (double value) => setState(() => _volume = value),
              ),
              _ValueLabel(
                label: 'Comfortable temperature',
                value:
                    '${_temperature.start.round()}–${_temperature.end.round()}°C',
              ),
              RangeSlider(
                values: _temperature,
                min: 10,
                max: 35,
                divisions: 25,
                labels: RangeLabels(
                  '${_temperature.start.round()}°C',
                  '${_temperature.end.round()}°C',
                ),
                onChanged: (RangeValues values) =>
                    setState(() => _temperature = values),
              ),
              const _ValueLabel(label: 'Managed limit', value: 'Disabled'),
              const Slider(value: 0.6, onChanged: null),
            ],
          ),
        ),
        const SizedBox(height: CbStructure.space5),
        CbSurface(
          padding: CbPad.lg,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              Text('Immediate settings', style: type.titleLarge),
              const Divider(),
              SwitchListTile(
                key: automaticUpdatesKey,
                title: const Text('Automatic updates'),
                subtitle: Text(_automaticUpdates ? 'Enabled' : 'Disabled'),
                value: _automaticUpdates,
                onChanged: (bool value) =>
                    setState(() => _automaticUpdates = value),
              ),
              CheckboxListTile(
                key: archiveCompletedKey,
                title: const Text('Archive completed items'),
                value: _archiveCompleted,
                onChanged: (bool? value) =>
                    setState(() => _archiveCompleted = value ?? false),
              ),
              CheckboxListTile(
                title: const Text('Include descendants'),
                subtitle: const Text('Indeterminate until all items agree'),
                tristate: true,
                value: _includeDescendants,
                onChanged: (bool? value) =>
                    setState(() => _includeDescendants = value),
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
        const SizedBox(height: CbStructure.space5),
        CbSurface(
          padding: CbPad.lg,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              Text('One-of-many choices', style: type.titleLarge),
              const Divider(),
              RadioGroup<String>(
                groupValue: _density,
                onChanged: (String? value) {
                  if (value != null) setState(() => _density = value);
                },
                child: const Column(
                  children: <Widget>[
                    RadioListTile<String>(
                      title: Text('Compact'),
                      value: 'compact',
                    ),
                    RadioListTile<String>(
                      key: comfortableDensityKey,
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
                  ButtonSegment<String>(value: 'day', label: Text('Day')),
                  ButtonSegment<String>(value: 'week', label: Text('Week')),
                  ButtonSegment<String>(
                    value: 'month',
                    label: Text('Month', key: monthPeriodKey),
                  ),
                ],
                selected: <String>{_period},
                onSelectionChanged: (Set<String> values) =>
                    setState(() => _period = values.single),
              ),
              const SizedBox(height: CbStructure.space3),
              Text('Selected period: $_period', style: type.bodySmall),
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
              const SizedBox(height: CbStructure.space2),
              Text(
                'This view is locked by the current workflow.',
                style: type.bodySmall,
              ),
            ],
          ),
        ),
      ],
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
      Expanded(child: Text(label)),
      const SizedBox(width: CbStructure.space3),
      Text(value, style: Theme.of(context).textTheme.bodySmall),
    ],
  );
}
