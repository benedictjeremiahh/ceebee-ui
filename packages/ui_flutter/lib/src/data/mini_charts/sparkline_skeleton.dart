import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/data/mini_charts/chart_size.dart';
import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/data_visualization.g.dart';
import 'package:ceebee_ui/src/tokens/oklch.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

/// Static loading geometry for [CbSparkline].
class CbSparklineSkeleton extends StatelessWidget {
  const CbSparklineSkeleton({super.key, this.size = CbSize.md});

  final CbSize size;

  @override
  Widget build(BuildContext context) {
    final Size plotSize = size.plotSize;
    return ExcludeSemantics(
      child: SizedBox.fromSize(
        size: plotSize,
        child: CustomPaint(
          painter: _CbSparklineSkeletonPainter(
            color: context.cb.fgSubtle
                .mix(CbOklch.transparent, CbDataVisualizationTokens.barStrength)
                .toColor(),
          ),
        ),
      ),
    );
  }
}

class _CbSparklineSkeletonPainter extends CustomPainter {
  const _CbSparklineSkeletonPainter({required this.color});

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawLine(
      Offset(0, size.height / 2),
      Offset(size.width, size.height / 2),
      Paint()
        ..color = color
        ..strokeCap = StrokeCap.round
        ..strokeWidth = CbDataVisualizationTokens.lineWidth,
    );
  }

  @override
  bool shouldRepaint(_CbSparklineSkeletonPainter oldDelegate) =>
      color != oldDelegate.color;
}
