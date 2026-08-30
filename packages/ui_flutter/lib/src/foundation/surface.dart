import 'dart:ui' as ui;

import 'package:flutter/foundation.dart' show listEquals;
import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/structure.g.dart';
import 'package:ceebee_ui/src/tokens/generated/surface.g.dart';
import 'package:ceebee_ui/src/tokens/oklch.dart';
import 'package:ceebee_ui/src/tokens/skin_tokens.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

/// The visual treatment of a [CbSurface]. Interaction never changes with this value.
enum CbSurfaceVariant { plain, tinted, glass, gradient }

/// The density of a glass Surface.
enum CbGlassStyle { regular, clear }

/// Ceebee's non-interactive material for raised, tinted, glass, and gradient content.
class CbSurface extends StatelessWidget {
  const CbSurface({
    super.key,
    required this.child,
    this.variant = CbSurfaceVariant.plain,
    this.glassStyle = CbGlassStyle.regular,
    this.tone = CbTone.neutral,
    this.hue,
    this.elevation = CbElevation.sm,
    this.radius = CbRadius.lg,
    this.padding = CbPad.md,
    this.bordered = true,
  });

  final Widget child;
  final CbSurfaceVariant variant;
  final CbGlassStyle glassStyle;
  final CbTone tone;
  final CbDecorHue? hue;
  final CbElevation elevation;
  final CbRadius radius;
  final CbPad padding;
  final bool bordered;

  @override
  Widget build(BuildContext context) {
    final CbTheme theme = context.cbTheme;
    final CbSkinTokens tokens = theme.tokens;
    final BorderRadius borderRadius = radius.borderRadius;

    if (variant == CbSurfaceVariant.glass) {
      return _GlassSurface(
        theme: theme,
        tokens: tokens,
        glassStyle: glassStyle,
        elevation: elevation,
        borderRadius: borderRadius,
        padding: padding,
        bordered: bordered,
        child: child,
      );
    }

    final CbOklch accent = tokens.accent(tone: tone, hue: hue);
    final CbOklch? fill = switch (variant) {
      CbSurfaceVariant.tinted => accent.mix(
        tokens.surface,
        tokens.tintStrength,
      ),
      CbSurfaceVariant.gradient => null,
      _ => tokens.surface,
    };
    final LinearGradient? gradient = variant == CbSurfaceVariant.gradient
        ? CbGradient(
            angle: tokens.gradientAngle,
            stops: <CbGradientStop>[
              CbGradientStop(
                accent.mix(
                  tokens.surface,
                  CbSurfaceTokens.gradientStartStrength,
                ),
                0,
              ),
              CbGradientStop(
                accent.mix(tokens.surface, CbSurfaceTokens.gradientEndStrength),
                1,
              ),
            ],
          ).toLinearGradient()
        : null;
    final CbOklch edge = switch (variant) {
      CbSurfaceVariant.tinted => accent.mix(
        CbOklch.transparent,
        CbSurfaceTokens.tintedEdgeStrength,
      ),
      CbSurfaceVariant.gradient => accent.mix(
        CbOklch.transparent,
        CbSurfaceTokens.gradientEdgeStrength,
      ),
      _ => tokens.border,
    };

    return DecoratedBox(
      decoration: BoxDecoration(
        color: fill?.toColor(),
        gradient: gradient,
        border: bordered
            ? Border.all(color: edge.toColor(), width: CbStructure.borderWidth)
            : null,
        borderRadius: borderRadius,
        boxShadow: cbOutsetShadows(elevation.shadows(tokens)),
      ),
      child: Padding(
        padding: padding.insets,
        child: Material(type: MaterialType.transparency, child: child),
      ),
    );
  }
}

class _GlassSurface extends StatelessWidget {
  const _GlassSurface({
    required this.theme,
    required this.tokens,
    required this.glassStyle,
    required this.elevation,
    required this.borderRadius,
    required this.padding,
    required this.bordered,
    required this.child,
  });

  final CbTheme theme;
  final CbSkinTokens tokens;
  final CbGlassStyle glassStyle;
  final CbElevation elevation;
  final BorderRadius borderRadius;
  final CbPad padding;
  final bool bordered;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final bool clear = glassStyle == CbGlassStyle.clear;
    final CbOklch fill = theme.reduceTransparency
        ? tokens.glassBgOpaque
        : clear
        ? tokens.glassClearBg
        : tokens.glassBg;
    final CbOklch edge = theme.highContrast
        ? tokens.glassBorderStrong
        : clear
        ? tokens.glassClearBorder
        : tokens.glassBorder;
    final CbGradient? specular = theme.reduceTransparency
        ? null
        : clear
        ? tokens.glassClearSpecular
        : tokens.glassSpecular;
    final List<CbShadow> inset = clear
        ? tokens.glassClearInset
        : tokens.glassInset;

    Widget material = CustomPaint(
      foregroundPainter: _InsetShadowPainter(
        borderRadius: borderRadius,
        shadows: cbInsetShadows(inset),
      ),
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: fill.toColor(),
          gradient: specular?.toLinearGradient(),
          border: bordered
              ? Border.all(
                  color: edge.toColor(),
                  width: CbStructure.borderWidth,
                )
              : null,
          borderRadius: borderRadius,
        ),
        child: Padding(
          padding: padding.insets,
          child: Material(type: MaterialType.transparency, child: child),
        ),
      ),
    );

    if (!theme.reduceTransparency) {
      material = BackdropFilter.grouped(
        filter: _glassFilter(
          blur: clear ? tokens.glassClearBlur : tokens.glassBlur,
          saturation: clear
              ? tokens.glassClearSaturation
              : tokens.glassSaturation,
        ),
        child: material,
      );
    }

    return DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: borderRadius,
        boxShadow: cbOutsetShadows(elevation.shadows(tokens)),
      ),
      child: ClipRRect(borderRadius: borderRadius, child: material),
    );
  }
}

ui.ImageFilter _glassFilter({
  required double blur,
  required double saturation,
}) {
  final double inverse = 1 - saturation;
  const double redLuminance = 0.213;
  const double greenLuminance = 0.715;
  const double blueLuminance = 0.072;
  final ui.ColorFilter saturate = ui.ColorFilter.matrix(<double>[
    inverse * redLuminance + saturation,
    inverse * greenLuminance,
    inverse * blueLuminance,
    0,
    0,
    inverse * redLuminance,
    inverse * greenLuminance + saturation,
    inverse * blueLuminance,
    0,
    0,
    inverse * redLuminance,
    inverse * greenLuminance,
    inverse * blueLuminance + saturation,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
  ]);
  return ui.ImageFilter.compose(
    outer: saturate,
    // CSS blur radius is twice the Gaussian sigma accepted by Flutter.
    inner: ui.ImageFilter.blur(sigmaX: blur / 2, sigmaY: blur / 2),
  );
}

class _InsetShadowPainter extends CustomPainter {
  const _InsetShadowPainter({
    required this.borderRadius,
    required this.shadows,
  });

  final BorderRadius borderRadius;
  final List<CbShadow> shadows;

  @override
  void paint(Canvas canvas, Size size) {
    final Rect bounds = Offset.zero & size;
    final RRect clip = borderRadius.toRRect(bounds);
    canvas.save();
    canvas.clipRRect(clip);

    for (final CbShadow shadow in shadows) {
      final double extent =
          size.longestSide +
          shadow.blur +
          shadow.offsetX.abs() +
          shadow.offsetY.abs();
      final Path outside = Path()
        ..addRect(
          Rect.fromLTRB(
            -extent,
            -extent,
            size.width + extent,
            size.height + extent,
          ),
        );
      final Path inside = Path()
        ..addRRect(clip.shift(Offset(shadow.offsetX, shadow.offsetY)));
      final Paint paint = Paint()
        ..color = shadow.color.toColor()
        ..style = PaintingStyle.fill;
      if (shadow.blur > 0) {
        paint.maskFilter = MaskFilter.blur(BlurStyle.normal, shadow.blur / 2);
      }
      canvas.drawPath(
        Path.combine(PathOperation.difference, outside, inside),
        paint,
      );
    }

    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant _InsetShadowPainter oldDelegate) =>
      oldDelegate.borderRadius != borderRadius ||
      !listEquals(oldDelegate.shadows, shadows);
}
