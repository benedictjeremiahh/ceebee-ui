import 'dart:math' as math;

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/data/mini_charts/chart_size.dart';
import 'package:ceebee_ui/src/data/mini_charts/donut_math.dart';
import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/data_visualization.g.dart';
import 'package:ceebee_ui/src/tokens/oklch.dart';
import 'package:ceebee_ui/src/tokens/skin_tokens.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

const List<CbDecorHue> _defaultDonutHues = <CbDecorHue>[
  CbDecorHue.violet,
  CbDecorHue.blue,
  CbDecorHue.teal,
  CbDecorHue.green,
  CbDecorHue.amber,
  CbDecorHue.rose,
];

/// A compact parts-of-whole widget with no axis, tooltip, or gesture model.
///
/// [semanticLabel] owns the complete spoken summary. Painting is decorative and
/// the optional [child] in the centre does not create a second semantics path.
class CbDonut extends StatelessWidget {
  const CbDonut({
    super.key,
    required this.slices,
    required this.semanticLabel,
    this.size = CbSize.md,
    this.hues = _defaultDonutHues,
    this.child,
  });

  final List<CbDonutSlice> slices;
  final String semanticLabel;
  final CbSize size;
  final List<CbDecorHue> hues;
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    final double diameter = size.donutDiameter;
    final double thickness = size.donutThickness;
    final double radius = (diameter - thickness) / 2;
    final List<CbDonutArc> arcs = cbDonutArcs(slices, 2 * math.pi * radius);
    final CbSkinTokens tokens = context.cb;
    final List<CbDecorHue> palette = hues.isEmpty ? _defaultDonutHues : hues;

    return Semantics(
      container: true,
      image: true,
      label: semanticLabel,
      child: ExcludeSemantics(
        child: SizedBox.square(
          dimension: diameter,
          child: RepaintBoundary(
            child: CustomPaint(
              painter: _CbDonutPainter(
                arcs: arcs,
                trackColor: tokens.fg
                    .mix(
                      CbOklch.transparent,
                      CbDataVisualizationTokens.trackStrength,
                    )
                    .toColor(),
                arcColors: <Color>[
                  for (final CbDecorHue hue in palette)
                    tokens.accent(hue: hue).toColor(),
                ],
                thickness: thickness,
              ),
              child: child == null ? null : Center(child: child),
            ),
          ),
        ),
      ),
    );
  }
}

class _CbDonutPainter extends CustomPainter {
  const _CbDonutPainter({
    required this.arcs,
    required this.trackColor,
    required this.arcColors,
    required this.thickness,
  });

  final List<CbDonutArc> arcs;
  final Color trackColor;
  final List<Color> arcColors;
  final double thickness;

  @override
  void paint(Canvas canvas, Size size) {
    final Rect bounds = (Offset.zero & size).deflate(thickness / 2);
    final Paint paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = thickness;
    canvas.drawOval(bounds, paint..color = trackColor);

    final double circumference = math.pi * bounds.width;
    for (final CbDonutArc arc in arcs) {
      canvas.drawArc(
        bounds,
        -math.pi / 2 - (arc.offset / circumference) * math.pi * 2,
        arc.fraction * math.pi * 2,
        false,
        paint..color = arcColors[arc.index % arcColors.length],
      );
    }
  }

  @override
  bool shouldRepaint(_CbDonutPainter oldDelegate) =>
      !listEquals(arcs, oldDelegate.arcs) ||
      trackColor != oldDelegate.trackColor ||
      !listEquals(arcColors, oldDelegate.arcColors) ||
      thickness != oldDelegate.thickness;
}
