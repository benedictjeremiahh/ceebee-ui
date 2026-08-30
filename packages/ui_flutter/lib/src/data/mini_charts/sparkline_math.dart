import 'package:flutter/widgets.dart';

import 'package:ceebee_ui/src/tokens/generated/data_visualization.g.dart';

/// Pure point geometry for a [CbSparkline].
class CbSparklineGeometry {
  const CbSparklineGeometry({required this.points});

  final List<Offset> points;
}

/// Maps finite values across the available width and inverted y-axis.
CbSparklineGeometry cbSparklineGeometry(
  Iterable<double> values,
  double width,
  double height, {
  double padding = CbDataVisualizationTokens.padding,
}) {
  final List<double> usable = values
      .where((double value) => value.isFinite)
      .toList(growable: false);
  if (usable.isEmpty) {
    return const CbSparklineGeometry(points: <Offset>[]);
  }

  final double min = usable.reduce((double a, double b) => a < b ? a : b);
  final double max = usable.reduce((double a, double b) => a > b ? a : b);
  final double span = max - min;
  final double innerHeight = height - padding * 2;
  final double step = usable.length > 1 ? width / (usable.length - 1) : 0;

  return CbSparklineGeometry(
    points: <Offset>[
      for (final (int index, double value) in usable.indexed)
        Offset(
          usable.length == 1 ? width / 2 : index * step,
          padding +
              (span == 0
                  ? innerHeight / 2
                  : innerHeight - ((value - min) / span) * innerHeight),
        ),
    ],
  );
}
