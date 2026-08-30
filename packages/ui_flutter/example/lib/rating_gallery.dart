import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';

const Key ratingGalleryKey = Key('rating-gallery');
const Key deliveryRatingKey = Key('delivery-rating');

class RatingGallery extends StatefulWidget {
  const RatingGallery({super.key});

  @override
  State<RatingGallery> createState() => _RatingGalleryState();
}

class _RatingGalleryState extends State<RatingGallery> {
  double _value = 3.5;

  @override
  Widget build(BuildContext context) => Column(
    key: ratingGalleryKey,
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: <Widget>[
      Text('Delivery rating', style: Theme.of(context).textTheme.displaySmall),
      const SizedBox(height: CbStructure.space2),
      Text(
        'Rating is a controlled touch input with whole or half steps, drag selection, and adjustable semantics.',
        style: Theme.of(context).textTheme.bodyLarge,
      ),
      const SizedBox(height: CbStructure.space5),
      CbSurface(
        child: LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
            final Widget editable = _RatingSample(
              title: 'How was your delivery?',
              supportingText: '${_formatValue(_value)} of 5 stars',
              rating: CbRating(
                key: deliveryRatingKey,
                value: _value,
                precision: CbRatingPrecision.half,
                semanticLabel: 'Delivery rating',
                semanticValueBuilder: _semanticValue,
                onChanged: (double value) => setState(() => _value = value),
              ),
            );
            const Widget locked = _RatingSample(
              title: 'Submitted courier score',
              supportingText: 'Locked after submission',
              rating: CbRating(
                value: 4,
                semanticLabel: 'Submitted courier score',
              ),
            );
            if (constraints.maxWidth >= CbStructure.space8 * 10) {
              return Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Expanded(child: editable),
                  const SizedBox(width: CbStructure.space5),
                  SizedBox(
                    height: CbStructure.space8 * 2,
                    child: VerticalDivider(color: context.cb.border.toColor()),
                  ),
                  const SizedBox(width: CbStructure.space5),
                  const Expanded(child: locked),
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
                locked,
              ],
            );
          },
        ),
      ),
    ],
  );
}

class _RatingSample extends StatelessWidget {
  const _RatingSample({
    required this.title,
    required this.supportingText,
    required this.rating,
  });

  final String title;
  final String supportingText;
  final Widget rating;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: <Widget>[
      Text(title, style: Theme.of(context).textTheme.titleMedium),
      const SizedBox(height: CbStructure.space3),
      rating,
      const SizedBox(height: CbStructure.space2),
      Text(
        supportingText,
        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
          color: context.cb.fgMuted.toColor(),
          fontFeatures: const <FontFeature>[FontFeature.tabularFigures()],
        ),
      ),
    ],
  );
}

String _formatValue(double value) => value == value.roundToDouble()
    ? value.toInt().toString()
    : value.toString();

String _semanticValue(double value, int itemCount) =>
    '${_formatValue(value)} of $itemCount stars';
