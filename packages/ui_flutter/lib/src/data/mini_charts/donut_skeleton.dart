import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/data/mini_charts/chart_size.dart';
import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/data_visualization.g.dart';
import 'package:ceebee_ui/src/tokens/oklch.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

/// Static loading geometry for [CbDonut].
class CbDonutSkeleton extends StatelessWidget {
  const CbDonutSkeleton({super.key, this.size = CbSize.md});

  final CbSize size;

  @override
  Widget build(BuildContext context) {
    final double diameter = size.donutDiameter;
    final double thickness = size.donutThickness;
    final Color color = context.cb.fgSubtle
        .mix(CbOklch.transparent, CbDataVisualizationTokens.barStrength)
        .toColor();
    return ExcludeSemantics(
      child: SizedBox.square(
        dimension: diameter,
        child: CustomPaint(
          painter: _CbDonutSkeletonPainter(color: color, thickness: thickness),
        ),
      ),
    );
  }
}

class _CbDonutSkeletonPainter extends CustomPainter {
  const _CbDonutSkeletonPainter({required this.color, required this.thickness});

  final Color color;
  final double thickness;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawOval(
      (Offset.zero & size).deflate(thickness / 2),
      Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = thickness,
    );
  }

  @override
  bool shouldRepaint(_CbDonutSkeletonPainter oldDelegate) =>
      color != oldDelegate.color || thickness != oldDelegate.thickness;
}
