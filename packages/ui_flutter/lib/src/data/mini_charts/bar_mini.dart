import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/data/mini_charts/bar_mini_math.dart';
import 'package:ceebee_ui/src/data/mini_charts/chart_size.dart';
import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/data_visualization.g.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

/// Compact zero-based bars for counts, with no axis, tooltip, or gestures.
class CbBarMini extends StatelessWidget {
  const CbBarMini({
    super.key,
    required this.values,
    required this.semanticLabel,
    this.size = CbSize.md,
    this.tone = CbTone.brand,
    this.hue,
  });

  final List<double> values;
  final String semanticLabel;
  final CbSize size;
  final CbTone tone;
  final CbDecorHue? hue;

  @override
  Widget build(BuildContext context) {
    final Size plotSize = size.plotSize;
    final List<RRect> bars = cbBarMiniGeometry(
      values,
      plotSize.width,
      plotSize.height,
    );
    return Semantics(
      container: true,
      image: true,
      label: semanticLabel,
      child: ExcludeSemantics(
        child: SizedBox.fromSize(
          size: plotSize,
          child: RepaintBoundary(
            child: CustomPaint(
              painter: _CbBarMiniPainter(
                bars: bars,
                color: context.cb
                    .accent(tone: tone, hue: hue)
                    .withAlpha(CbDataVisualizationTokens.barStrength)
                    .toColor(),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _CbBarMiniPainter extends CustomPainter {
  const _CbBarMiniPainter({required this.bars, required this.color});

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
  bool shouldRepaint(_CbBarMiniPainter oldDelegate) =>
      !listEquals(bars, oldDelegate.bars) || color != oldDelegate.color;
}
