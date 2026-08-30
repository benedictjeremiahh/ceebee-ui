import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/motion.g.dart';
import 'package:ceebee_ui/src/tokens/generated/skeleton.g.dart';
import 'package:ceebee_ui/src/tokens/generated/structure.g.dart';
import 'package:ceebee_ui/src/tokens/oklch.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

enum _CbSkeletonShape { text, circle, rect }

/// A decorative loading shape for free-form layouts.
///
/// Compositions still provide geometry-matched `CbXxxSkeleton` companions;
/// this Atom is only the shared text, circle, or rectangular building block.
class CbSkeleton extends StatefulWidget {
  const CbSkeleton.text({super.key, this.size = CbSize.md, this.motion = true})
    : _shape = _CbSkeletonShape.text,
      radius = CbRadius.sm;

  const CbSkeleton.circle({
    super.key,
    this.size = CbSize.md,
    this.motion = true,
  }) : _shape = _CbSkeletonShape.circle,
       radius = CbRadius.none;

  const CbSkeleton.rect({
    super.key,
    this.size = CbSize.md,
    this.radius = CbRadius.md,
    this.motion = true,
  }) : _shape = _CbSkeletonShape.rect;

  final CbSize size;
  final CbRadius radius;

  /// Whether the placeholder may pulse. OS reduced-motion always wins.
  final bool motion;

  final _CbSkeletonShape _shape;

  @override
  State<CbSkeleton> createState() => _CbSkeletonState();
}

class _CbSkeletonState extends State<CbSkeleton>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: CbMotionTokens.deliberate,
  );
  late final Animation<double> _opacity =
      Tween<double>(
        begin: CbSkeletonTokens.opacityMax,
        end: CbSkeletonTokens.opacityMin,
      ).animate(
        CurvedAnimation(parent: _controller, curve: CbMotionTokens.standard),
      );
  bool _effectiveMotion = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _syncMotion();
  }

  @override
  void didUpdateWidget(CbSkeleton oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.motion != oldWidget.motion) _syncMotion();
  }

  void _syncMotion() {
    final bool disableAnimations =
        MediaQuery.maybeOf(context)?.disableAnimations ?? false;
    final bool nextEffectiveMotion = widget.motion && !disableAnimations;
    if (nextEffectiveMotion == _effectiveMotion) return;
    _effectiveMotion = nextEffectiveMotion;
    if (_effectiveMotion) {
      _controller.repeat(reverse: true);
    } else {
      _controller
        ..stop()
        ..value = 0;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final Widget shape = DecoratedBox(
      decoration: BoxDecoration(
        color: context.cb.fgMuted
            .mix(CbOklch.transparent, CbSkeletonTokens.fillStrength)
            .toColor(),
        borderRadius: widget._shape == _CbSkeletonShape.circle
            ? BorderRadius.circular(CbStructure.radiusFull)
            : widget.radius.borderRadius,
      ),
      child: switch (widget._shape) {
        _CbSkeletonShape.text => SizedBox(
          width: double.infinity,
          height: widget.size.textHeight,
        ),
        _CbSkeletonShape.circle => SizedBox.square(
          dimension: widget.size.controlHeight,
        ),
        _CbSkeletonShape.rect => SizedBox(
          width: double.infinity,
          height: widget.size.controlHeight,
        ),
      },
    );

    return ExcludeSemantics(
      child: _effectiveMotion
          ? FadeTransition(opacity: _opacity, child: shape)
          : shape,
    );
  }
}

extension on CbSize {
  double get textHeight => switch (this) {
    CbSize.sm => CbStructure.textSm,
    CbSize.md => CbStructure.textMd,
    CbSize.lg => CbStructure.textLg,
  };

  double get controlHeight => switch (this) {
    CbSize.sm => CbStructure.controlHeightSm,
    CbSize.md => CbStructure.controlHeightMd,
    CbSize.lg => CbStructure.controlHeightLg,
  };
}
