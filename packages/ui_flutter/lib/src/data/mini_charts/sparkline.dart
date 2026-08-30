import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/data/mini_charts/chart_size.dart';
import 'package:ceebee_ui/src/data/mini_charts/sparkline_math.dart';
import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/data_visualization.g.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

/// A compact trend widget with no axis, tooltip, or gesture model.
class CbSparkline extends StatelessWidget {
  const CbSparkline({
    super.key,
    required this.values,
    required this.semanticLabel,
    this.size = CbSize.md,
    this.tone = CbTone.brand,
    this.hue,
    this.filled = false,
    this.showLast = true,
  });

  final List<double> values;
  final String semanticLabel;
  final CbSize size;
  final CbTone tone;
  final CbDecorHue? hue;
  final bool filled;
  final bool showLast;

  @override
  Widget build(BuildContext context) {
    final Size plotSize = size.plotSize;
    final CbSparklineGeometry geometry = cbSparklineGeometry(
      values,
      plotSize.width,
      plotSize.height,
    );
    final Color accent = context.cb.accent(tone: tone, hue: hue).toColor();

    return Semantics(
      container: true,
      image: true,
      label: semanticLabel,
      child: ExcludeSemantics(
        child: SizedBox.fromSize(
          size: plotSize,
          child: RepaintBoundary(
            child: CustomPaint(
              painter: _CbSparklinePainter(
                points: geometry.points,
                accent: accent,
                filled: filled,
                showLast: showLast,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _CbSparklinePainter extends CustomPainter {
  const _CbSparklinePainter({
    required this.points,
    required this.accent,
    required this.filled,
    required this.showLast,
  });

  final List<Offset> points;
  final Color accent;
  final bool filled;
  final bool showLast;

  @override
  void paint(Canvas canvas, Size size) {
    if (points.isEmpty) return;
    final Path line = Path()..moveTo(points.first.dx, points.first.dy);
    for (final Offset point in points.skip(1)) {
      line.lineTo(point.dx, point.dy);
    }

    if (filled) {
      final Path area = Path.from(line)
        ..lineTo(points.last.dx, size.height)
        ..lineTo(points.first.dx, size.height)
        ..close();
      canvas.drawPath(
        area,
        Paint()
          ..color = accent.withValues(
            alpha: CbDataVisualizationTokens.areaStrength,
          ),
      );
    }

    canvas.drawPath(
      line,
      Paint()
        ..color = accent
        ..style = PaintingStyle.stroke
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round
        ..strokeWidth = CbDataVisualizationTokens.lineWidth,
    );
    if (showLast) {
      canvas.drawCircle(
        points.last,
        CbDataVisualizationTokens.markerRadius,
        Paint()..color = accent,
      );
    }
  }

  @override
  bool shouldRepaint(_CbSparklinePainter oldDelegate) =>
      !listEquals(points, oldDelegate.points) ||
      accent != oldDelegate.accent ||
      filled != oldDelegate.filled ||
      showLast != oldDelegate.showLast;
}
