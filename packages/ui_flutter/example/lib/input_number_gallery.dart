import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';

const Key inputNumberGalleryKey = Key('input-number-gallery');
const Key quantityInputKey = Key('quantity-input');
const Key reviewHoursInputKey = Key('review-hours-input');

class InputNumberGallery extends StatefulWidget {
  const InputNumberGallery({super.key});

  @override
  State<InputNumberGallery> createState() => _InputNumberGalleryState();
}

class _InputNumberGalleryState extends State<InputNumberGallery> {
  double? _quantity = 4;
  double? _reviewHours = 2.5;

  @override
  Widget build(BuildContext context) => Column(
    key: inputNumberGalleryKey,
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: <Widget>[
      Text('Numeric input', style: Theme.of(context).textTheme.displaySmall),
      const SizedBox(height: CbStructure.space2),
      Text(
        'Type an exact value or use touch-sized step controls. The application owns formatting, validation, and persistence.',
        style: Theme.of(context).textTheme.bodyLarge,
      ),
      const SizedBox(height: CbStructure.space5),
      CbSurface(
        child: LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
            final Widget editable = _InputNumberSection(
              title: 'Editable values',
              children: <Widget>[
                CbInputNumber(
                  key: quantityInputKey,
                  value: _quantity,
                  min: 1,
                  max: 12,
                  label: 'Package quantity',
                  suffixText: 'units',
                  helperText: 'Between 1 and 12 packages',
                  incrementSemanticLabel: 'Add one package',
                  decrementSemanticLabel: 'Remove one package',
                  onChanged: (double? value) =>
                      setState(() => _quantity = value),
                ),
                const SizedBox(height: CbStructure.space4),
                CbInputNumber(
                  key: reviewHoursInputKey,
                  value: _reviewHours,
                  min: 0,
                  max: 8,
                  step: 0.5,
                  label: 'Review time',
                  suffixText: 'hours',
                  helperText: 'Half-hour increments',
                  formatter: _formatDecimalComma,
                  parser: _parseDecimalComma,
                  incrementSemanticLabel: 'Add half an hour',
                  decrementSemanticLabel: 'Remove half an hour',
                  onChanged: (double? value) =>
                      setState(() => _reviewHours = value),
                ),
              ],
            );
            const Widget guarded = _InputNumberSection(
              title: 'Guarded states',
              children: <Widget>[
                CbInputNumber(
                  value: 24,
                  readOnly: true,
                  label: 'Approved seats',
                  suffixText: 'seats',
                  helperText: 'Locked after approval',
                  incrementSemanticLabel: 'Add an approved seat',
                  decrementSemanticLabel: 'Remove an approved seat',
                ),
                SizedBox(height: CbStructure.space4),
                CbInputNumber(
                  value: 50,
                  label: 'Storage allocation',
                  suffixText: 'GB',
                  helperText: 'Available after plan upgrade',
                  incrementSemanticLabel: 'Increase storage allocation',
                  decrementSemanticLabel: 'Decrease storage allocation',
                ),
              ],
            );
            if (constraints.maxWidth >= CbStructure.space8 * 10) {
              return Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Expanded(child: editable),
                  const SizedBox(width: CbStructure.space5),
                  SizedBox(
                    height: CbStructure.space8 * 4,
                    child: VerticalDivider(color: context.cb.border.toColor()),
                  ),
                  const SizedBox(width: CbStructure.space5),
                  const Expanded(child: guarded),
                ],
              );
            }
            return Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                editable,
                const SizedBox(height: CbStructure.space4),
                Divider(color: context.cb.border.toColor()),
                const SizedBox(height: CbStructure.space4),
                guarded,
              ],
            );
          },
        ),
      ),
    ],
  );
}

class _InputNumberSection extends StatelessWidget {
  const _InputNumberSection({required this.title, required this.children});

  final String title;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: <Widget>[
      Text(title, style: Theme.of(context).textTheme.titleMedium),
      const SizedBox(height: CbStructure.space4),
      ...children,
    ],
  );
}

String _formatDecimalComma(double value) =>
    value.toStringAsFixed(1).replaceAll('.', ',');

double? _parseDecimalComma(String text) =>
    double.tryParse(text.trim().replaceAll(',', '.'));
