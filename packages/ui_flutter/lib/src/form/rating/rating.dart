import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/structure.g.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

enum CbRatingPrecision { whole, half }

typedef CbRatingSemanticValueBuilder =
    String Function(double value, int itemCount);

/// A controlled touch rating input with tap, drag, RTL, and adjustable semantics.
class CbRating extends StatelessWidget {
  const CbRating({
    super.key,
    required this.value,
    required this.semanticLabel,
    this.onChanged,
    this.itemCount = 5,
    this.precision = CbRatingPrecision.whole,
    this.allowClear = true,
    this.tone = CbTone.warning,
    this.semanticValueBuilder,
    this.icon = Icons.star_rounded,
    this.emptyIcon = Icons.star_border_rounded,
  }) : assert(itemCount > 0),
       assert(value >= 0 && value <= itemCount),
       assert(precision == CbRatingPrecision.half || value % 1 == 0);

  final double value;
  final String semanticLabel;

  /// Application callback. When absent, the input is disabled.
  final ValueChanged<double>? onChanged;
  final int itemCount;
  final CbRatingPrecision precision;
  final bool allowClear;
  final CbTone tone;
  final CbRatingSemanticValueBuilder? semanticValueBuilder;
  final IconData icon;
  final IconData emptyIcon;

  double get _step => precision == CbRatingPrecision.half ? 0.5 : 1;

  @override
  Widget build(BuildContext context) {
    final bool enabled = onChanged != null;
    final bool rtl = Directionality.of(context) == TextDirection.rtl;
    final String semanticValue = _semanticValue(value);
    final double increased = (value + _step).clamp(0, itemCount.toDouble());
    final double decreased = (value - _step).clamp(0, itemCount.toDouble());

    void selectAt(Offset position, Size size, {required bool clear}) {
      final double physical = rtl ? size.width - position.dx : position.dx;
      final double raw = physical / size.width * itemCount;
      final double selected = ((raw / _step).ceil() * _step).clamp(
        _step,
        itemCount.toDouble(),
      );
      onChanged!(clear && allowClear && selected == value ? 0 : selected);
    }

    return Semantics(
      container: true,
      slider: true,
      enabled: enabled,
      label: semanticLabel,
      value: semanticValue,
      increasedValue: enabled && value < itemCount
          ? _semanticValue(increased)
          : null,
      decreasedValue: enabled && value > 0 ? _semanticValue(decreased) : null,
      onIncrease: enabled && value < itemCount
          ? () => onChanged!(increased)
          : null,
      onDecrease: enabled && value > 0 ? () => onChanged!(decreased) : null,
      child: ExcludeSemantics(
        child: LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
            final Size gestureSize = Size(
              CbStructure.controlHeightLg * itemCount,
              CbStructure.controlHeightLg,
            );
            return GestureDetector(
              behavior: HitTestBehavior.opaque,
              onTapUp: enabled
                  ? (TapUpDetails details) => selectAt(
                      details.localPosition,
                      gestureSize,
                      clear: true,
                    )
                  : null,
              onHorizontalDragStart: enabled
                  ? (DragStartDetails details) => selectAt(
                      details.localPosition,
                      gestureSize,
                      clear: false,
                    )
                  : null,
              onHorizontalDragUpdate: enabled
                  ? (DragUpdateDetails details) => selectAt(
                      details.localPosition,
                      gestureSize,
                      clear: false,
                    )
                  : null,
              child: SizedBox.fromSize(
                size: gestureSize,
                child: Row(
                  children: <Widget>[
                    for (int index = 0; index < itemCount; index++)
                      _RatingItem(
                        fill: (value - index).clamp(0, 1),
                        enabled: enabled,
                        tone: tone,
                        icon: icon,
                        emptyIcon: emptyIcon,
                      ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  String _semanticValue(double candidate) =>
      semanticValueBuilder?.call(candidate, itemCount) ??
      '${_formatValue(candidate)} / $itemCount';
}

class _RatingItem extends StatelessWidget {
  const _RatingItem({
    required this.fill,
    required this.enabled,
    required this.tone,
    required this.icon,
    required this.emptyIcon,
  });

  final double fill;
  final bool enabled;
  final CbTone tone;
  final IconData icon;
  final IconData emptyIcon;

  @override
  Widget build(BuildContext context) {
    final Color active = enabled
        ? context.cb.accent(tone: tone).toColor()
        : context.cb.fgMuted.toColor();
    final Color inactive = enabled
        ? context.cb.borderStrong.toColor()
        : context.cb.border.toColor();
    return SizedBox.square(
      dimension: CbStructure.controlHeightLg,
      child: Stack(
        children: <Widget>[
          Center(
            child: Icon(emptyIcon, size: CbStructure.space6, color: inactive),
          ),
          if (fill > 0)
            Positioned.fill(
              child: Align(
                alignment: AlignmentDirectional.centerStart,
                child: ClipRect(
                  child: Align(
                    alignment: AlignmentDirectional.centerStart,
                    widthFactor: fill,
                    child: SizedBox.square(
                      dimension: CbStructure.controlHeightLg,
                      child: Center(
                        child: Icon(
                          icon,
                          size: CbStructure.space6,
                          color: active,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

String _formatValue(double value) => value == value.roundToDouble()
    ? value.toInt().toString()
    : value.toString();
