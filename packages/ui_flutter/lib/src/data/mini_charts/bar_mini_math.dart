import 'dart:math' as math;

import 'package:flutter/widgets.dart';

import 'package:ceebee_ui/src/tokens/generated/data_visualization.g.dart';

/// Produces zero-based bar geometry from every finite value.
List<RRect> cbBarMiniGeometry(
  Iterable<double> values,
  double width,
  double height, {
  double gap = CbDataVisualizationTokens.barGap,
}) {
  final List<double> usable = values
      .where((double value) => value.isFinite)
      .toList(growable: false);
  if (usable.isEmpty) return const <RRect>[];

  final double max = math.max(
    usable.reduce((double a, double b) => a > b ? a : b),
    0,
  );
  final double barWidth = math.max(
    (width - gap * (usable.length - 1)) / usable.length,
    CbDataVisualizationTokens.minBar,
  );

  return <RRect>[
    for (final (int index, double value) in usable.indexed)
      (() {
        final double barHeight = max > 0
            ? math.max((value / max) * height, CbDataVisualizationTokens.minBar)
            : CbDataVisualizationTokens.minBar;
        return RRect.fromRectAndRadius(
          Rect.fromLTWH(
            index * (barWidth + gap),
            height - barHeight,
            barWidth,
            barHeight,
          ),
          const Radius.circular(CbDataVisualizationTokens.barRadius),
        );
      })(),
  ];
}
