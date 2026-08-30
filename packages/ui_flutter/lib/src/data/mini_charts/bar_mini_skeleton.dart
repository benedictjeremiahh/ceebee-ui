import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/data/mini_charts/bar_mini_math.dart';
import 'package:ceebee_ui/src/data/mini_charts/chart_size.dart';
import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/data_visualization.g.dart';
import 'package:ceebee_ui/src/tokens/oklch.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

/// Static loading geometry for [CbBarMini].
class CbBarMiniSkeleton extends StatelessWidget {
  const CbBarMiniSkeleton({super.key, this.size = CbSize.md});

  final CbSize size;

  @override
  Widget build(BuildContext context) {
    final Size plotSize = size.plotSize;
    return ExcludeSemantics(
      child: SizedBox.fromSize(
        size: plotSize,
        child: CustomPaint(
          painter: _CbBarMiniSkeletonPainter(
            bars: cbBarMiniGeometry(
              const <double>[1, 2, 1, 3, 2],
              plotSize.width,
              plotSize.height,
            ),
            color: context.cb.fgSubtle
                .mix(CbOklch.transparent, CbDataVisualizationTokens.barStrength)
                .toColor(),
          ),
        ),
      ),
    );
  }
}

class _CbBarMiniSkeletonPainter extends CustomPainter {
  const _CbBarMiniSkeletonPainter({required this.bars, required this.color});

  final List<RRect> bars;
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final Paint paint = Paint()..color = color;
    for (final RRect bar in bars) {
      canvas.drawRRect(bar, paint);
    }
  }

  @override
  bool shouldRepaint(_CbBarMiniSkeletonPainter oldDelegate) =>
      !listEquals(bars, oldDelegate.bars) || color != oldDelegate.color;
}
