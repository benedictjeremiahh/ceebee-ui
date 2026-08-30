import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';

const Key colorPickerGalleryKey = Key('color-picker-gallery');

class ColorPickerGallery extends StatefulWidget {
  const ColorPickerGallery({super.key});

  @override
  State<ColorPickerGallery> createState() => _ColorPickerGalleryState();
}

class _ColorPickerGalleryState extends State<ColorPickerGallery> {
  HSVColor _accent = const HSVColor.fromAHSV(1, 258, 0.58, 0.92);

  @override
  Widget build(BuildContext context) => Column(
    key: colorPickerGalleryKey,
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: <Widget>[
      Text('Colour input', style: Theme.of(context).textTheme.displaySmall),
      const SizedBox(height: CbStructure.space2),
      Text(
        'Choose an arbitrary product colour with native, touch-sized HSV controls. The application owns the selected value and localized labels.',
        style: Theme.of(context).textTheme.bodyLarge,
      ),
      const SizedBox(height: CbStructure.space5),
      CbSurface(
        child: LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
            final Widget editable = CbColorPicker(
              value: _accent,
              semanticLabel: 'Editable accent colour',
              hueLabel: 'Hue',
              saturationLabel: 'Saturation',
              brightnessLabel: 'Brightness',
              valueBuilder: _colorDescription,
              onChanged: (HSVColor value) => setState(() => _accent = value),
            );
            const Widget disabled = CbColorPicker(
              value: HSVColor.fromAHSV(1, 18, 0.72, 0.86),
              semanticLabel: 'Locked campaign colour',
              hueLabel: 'Hue',
              saturationLabel: 'Saturation',
              brightnessLabel: 'Brightness',
            );
            if (constraints.maxWidth >= CbStructure.space8 * 10) {
              return Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Expanded(child: editable),
                  const SizedBox(width: CbStructure.space5),
                  const Expanded(child: disabled),
                ],
              );
            }
            return Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                editable,
                const SizedBox(height: CbStructure.space5),
                const Divider(),
                const SizedBox(height: CbStructure.space5),
                disabled,
              ],
            );
          },
        ),
      ),
    ],
  );
}

String _colorDescription(HSVColor value) =>
    'Hue ${value.hue.round()} degrees, '
    'saturation ${(value.saturation * 100).round()} percent, '
    'brightness ${(value.value * 100).round()} percent';
