import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/structure.g.dart';

typedef CbColorPickerValueBuilder = String Function(HSVColor value);

/// A controlled, mobile-first HSV colour input built from native sliders.
///
/// [HSVColor] is product data here, not a styling escape hatch. Ceebee still
/// owns the geometry and localized adjustable semantics while Material owns
/// touch and keyboard interaction.
class CbColorPicker extends StatelessWidget {
  const CbColorPicker({
    super.key,
    required this.value,
    required this.semanticLabel,
    required this.hueLabel,
    required this.saturationLabel,
    required this.brightnessLabel,
    this.onChanged,
    this.valueBuilder,
  });

  final HSVColor value;
  final String semanticLabel;
  final String hueLabel;
  final String saturationLabel;
  final String brightnessLabel;

  /// Application callback. When absent, the complete input is disabled.
  final ValueChanged<HSVColor>? onChanged;
  final CbColorPickerValueBuilder? valueBuilder;

  @override
  Widget build(BuildContext context) {
    final bool enabled = onChanged != null;
    final String semanticValue =
        valueBuilder?.call(value) ??
        '${value.hue.round()}°, '
            '${(value.saturation * 100).round()}%, '
            '${(value.value * 100).round()}%';

    return Semantics(
      container: true,
      explicitChildNodes: true,
      label: semanticLabel,
      value: semanticValue,
      enabled: enabled,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          ExcludeSemantics(
            child: Container(
              height: CbStructure.controlHeightLg,
              decoration: BoxDecoration(
                color: value.toColor(),
                border: Border.all(
                  color: context.cb.borderStrong.toColor(),
                  width: CbStructure.borderWidth,
                ),
                borderRadius: BorderRadius.circular(CbStructure.radiusMd),
              ),
            ),
          ),
          const SizedBox(height: CbStructure.space4),
          _ColorChannel(
            label: hueLabel,
            value: value.hue,
            max: 360,
            semanticValue: '${value.hue.round()}°',
            onChanged: enabled
                ? (double channel) => onChanged!(value.withHue(channel))
                : null,
          ),
          const SizedBox(height: CbStructure.space2),
          _ColorChannel(
            label: saturationLabel,
            value: value.saturation,
            max: 1,
            semanticValue: '${(value.saturation * 100).round()}%',
            onChanged: enabled
                ? (double channel) => onChanged!(value.withSaturation(channel))
                : null,
          ),
          const SizedBox(height: CbStructure.space2),
          _ColorChannel(
            label: brightnessLabel,
            value: value.value,
            max: 1,
            semanticValue: '${(value.value * 100).round()}%',
            onChanged: enabled
                ? (double channel) => onChanged!(value.withValue(channel))
                : null,
          ),
        ],
      ),
    );
  }
}

class _ColorChannel extends StatelessWidget {
  const _ColorChannel({
    required this.label,
    required this.value,
    required this.max,
    required this.semanticValue,
    required this.onChanged,
  });

  final String label;
  final double value;
  final double max;
  final String semanticValue;
  final ValueChanged<double>? onChanged;

  double get _step => max == 1 ? 0.01 : 1;

  @override
  Widget build(BuildContext context) {
    final bool enabled = onChanged != null;
    final double increased = (value + _step).clamp(0, max);
    final double decreased = (value - _step).clamp(0, max);

    return Row(
      children: <Widget>[
        ExcludeSemantics(
          child: SizedBox(
            width: CbStructure.space8 * 2,
            child: Text(label, style: Theme.of(context).textTheme.labelLarge),
          ),
        ),
        const SizedBox(width: CbStructure.space2),
        Expanded(
          child: Semantics(
            label: label,
            value: semanticValue,
            slider: true,
            enabled: enabled,
            increasedValue: enabled && value < max
                ? _formatSemanticValue(increased)
                : null,
            decreasedValue: enabled && value > 0
                ? _formatSemanticValue(decreased)
                : null,
            onIncrease: enabled && value < max
                ? () => onChanged!(increased)
                : null,
            onDecrease: enabled && value > 0
                ? () => onChanged!(decreased)
                : null,
            child: ExcludeSemantics(
              child: Slider(
                value: value,
                max: max,
                divisions: max == 1 ? 100 : 360,
                label: semanticValue,
                onChanged: onChanged,
              ),
            ),
          ),
        ),
        const SizedBox(width: CbStructure.space2),
        ExcludeSemantics(
          child: SizedBox(
            width: CbStructure.space7,
            child: Text(
              semanticValue,
              textAlign: TextAlign.end,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ),
        ),
      ],
    );
  }

  String _formatSemanticValue(double candidate) =>
      max == 1 ? '${(candidate * 100).round()}%' : '${candidate.round()}°';
}
