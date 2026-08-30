import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

import 'package:ceebee_ui/src/tokens/generated/motion.g.dart';
import 'package:ceebee_ui/src/tokens/generated/structure.g.dart';

/// The direction content travels from during a [CbReveal].
enum CbRevealFrom { below, above, left, right, none }

/// Tokenized travel distance for [CbReveal].
enum CbRevealDistance { sm, md, lg }

extension on CbRevealDistance {
  double get value => switch (this) {
    CbRevealDistance.sm => CbStructure.space1,
    CbRevealDistance.md => CbStructure.space3,
    CbRevealDistance.lg => CbStructure.space5,
  };
}

/// Tokenized delay between children in a [CbStagger].
enum CbStaggerPace { tight, standard, relaxed }

extension CbStaggerPaceDuration on CbStaggerPace {
  Duration get duration => switch (this) {
    CbStaggerPace.tight => CbMotionTokens.staggerTight,
    CbStaggerPace.standard => CbMotionTokens.staggerStandard,
    CbStaggerPace.relaxed => CbMotionTokens.staggerRelaxed,
  };
}

/// A one-shot entrance that communicates where content arrived from.
///
/// The child keeps its final layout throughout; only opacity and a compositor
/// transform animate. [motion] and the reader's OS animation preference are
/// combined, so a component can opt out but cannot override reduced motion.
class CbReveal extends StatefulWidget {
  const CbReveal({
    super.key,
    required this.child,
    this.from = CbRevealFrom.below,
    this.distance = CbRevealDistance.md,
    this.delaySteps = 0,
    this.pace = CbStaggerPace.standard,
    this.onView = false,
    this.motion = true,
  }) : assert(delaySteps >= 0);

  final Widget child;
  final CbRevealFrom from;
  final CbRevealDistance distance;

  /// Number of tokenized [pace] intervals before the entrance starts.
  final int delaySteps;
  final CbStaggerPace pace;

  /// Waits until the child intersects its nearest native scroll viewport.
  /// It fires once and never replays while the widget remains mounted.
  final bool onView;

  /// Component-level opt-out. The OS reduced-motion preference still wins.
  final bool motion;

  @override
  State<CbReveal> createState() => _CbRevealState();
}

class _CbRevealState extends State<CbReveal>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: CbMotionTokens.base,
  );
  late final Animation<double> _progress = _controller.drive(
    CurveTween(curve: CbMotionTokens.entrance),
  );
  ScrollPosition? _position;
  Timer? _delayTimer;
  bool _effectiveMotion = true;
  bool _started = false;
  bool _entryCheckScheduled = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final bool disableAnimations =
        MediaQuery.maybeOf(context)?.disableAnimations ?? false;
    final bool nextEffectiveMotion = widget.motion && !disableAnimations;
    _updateScrollPosition(
      widget.onView && !_started ? Scrollable.maybeOf(context)?.position : null,
    );

    if (!nextEffectiveMotion) {
      _delayTimer?.cancel();
      _started = true;
      _controller.value = 1;
      _updateScrollPosition(null);
    } else if (!_started) {
      _scheduleEntryCheck();
    }
    _effectiveMotion = nextEffectiveMotion;
  }

  @override
  void didUpdateWidget(CbReveal oldWidget) {
    super.didUpdateWidget(oldWidget);
    final bool disableAnimations =
        MediaQuery.maybeOf(context)?.disableAnimations ?? false;
    final bool nextEffectiveMotion = widget.motion && !disableAnimations;
    _updateScrollPosition(
      widget.onView && !_started ? Scrollable.maybeOf(context)?.position : null,
    );
    if (!nextEffectiveMotion) {
      _delayTimer?.cancel();
      _started = true;
      _controller.value = 1;
      _updateScrollPosition(null);
    } else if (!_started &&
        (widget.onView != oldWidget.onView ||
            widget.delaySteps != oldWidget.delaySteps ||
            widget.pace != oldWidget.pace)) {
      _delayTimer?.cancel();
      _scheduleEntryCheck();
    }
    _effectiveMotion = nextEffectiveMotion;
  }

  void _updateScrollPosition(ScrollPosition? next) {
    if (identical(next, _position)) return;
    _position?.removeListener(_checkVisibility);
    _position = next;
    _position?.addListener(_checkVisibility);
  }

  void _scheduleEntryCheck() {
    if (_entryCheckScheduled) return;
    _entryCheckScheduled = true;
    WidgetsBinding.instance.addPostFrameCallback((Duration _) {
      _entryCheckScheduled = false;
      if (!mounted || _started || !_effectiveMotion) return;
      if (widget.onView) {
        _checkVisibility();
      } else {
        _start();
      }
    });
  }

  void _checkVisibility() {
    if (!mounted || _started || !_effectiveMotion) return;
    final RenderObject? object = context.findRenderObject();
    if (object is! RenderBox || !object.attached) return;
    final RenderAbstractViewport? viewport = RenderAbstractViewport.maybeOf(
      object,
    );
    if (viewport == null) {
      _start();
      return;
    }
    final Rect childBounds = MatrixUtils.transformRect(
      object.getTransformTo(viewport),
      Offset.zero & object.size,
    );
    if (childBounds.overlaps(viewport.paintBounds)) _start();
  }

  void _start() {
    if (_started || !_effectiveMotion) return;
    _started = true;
    _updateScrollPosition(null);
    final int delayMicros =
        widget.pace.duration.inMicroseconds * widget.delaySteps;
    if (delayMicros == 0) {
      _controller.forward();
      return;
    }
    _delayTimer = Timer(Duration(microseconds: delayMicros), () {
      if (mounted && _effectiveMotion) _controller.forward();
    });
  }

  Offset get _hiddenOffset {
    final double distance = widget.distance.value;
    return switch (widget.from) {
      CbRevealFrom.below => Offset(0, distance),
      CbRevealFrom.above => Offset(0, -distance),
      CbRevealFrom.left => Offset(-distance, 0),
      CbRevealFrom.right => Offset(distance, 0),
      CbRevealFrom.none => Offset.zero,
    };
  }

  @override
  Widget build(BuildContext context) {
    if (!_effectiveMotion) return widget.child;
    return FadeTransition(
      opacity: _progress,
      child: widget.from == CbRevealFrom.none
          ? widget.child
          : AnimatedBuilder(
              animation: _progress,
              child: widget.child,
              builder: (BuildContext context, Widget? child) =>
                  Transform.translate(
                    offset: Offset.lerp(
                      _hiddenOffset,
                      Offset.zero,
                      _progress.value,
                    )!,
                    child: child,
                  ),
            ),
    );
  }

  @override
  void dispose() {
    _delayTimer?.cancel();
    _position?.removeListener(_checkVisibility);
    _controller.dispose();
    super.dispose();
  }
}

/// Reveals children in order without blocking their layout or interaction.
class CbStagger extends StatelessWidget {
  const CbStagger({
    super.key,
    required this.children,
    this.from = CbRevealFrom.below,
    this.distance = CbRevealDistance.md,
    this.pace = CbStaggerPace.standard,
    this.onView = false,
    this.motion = true,
  });

  final List<Widget> children;
  final CbRevealFrom from;
  final CbRevealDistance distance;
  final CbStaggerPace pace;
  final bool onView;
  final bool motion;

  @override
  Widget build(BuildContext context) => Column(
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: <Widget>[
      for (final (int index, Widget child) in children.indexed) ...<Widget>[
        if (index > 0) const SizedBox(height: CbStructure.space3),
        CbReveal(
          from: from,
          distance: distance,
          delaySteps: index,
          pace: pace,
          onView: onView,
          motion: motion,
          child: child,
        ),
      ],
    ],
  );
}
