import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/data/timeline/timeline.dart';
import 'package:ceebee_ui/src/loading/skeleton.dart';
import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/structure.g.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

/// Loading companion with the same responsive anatomy as [CbTimeline].
class CbTimelineSkeleton extends StatelessWidget {
  const CbTimelineSkeleton({
    super.key,
    this.itemCount = 4,
    this.timestamps = true,
    this.motion = true,
  }) : assert(itemCount > 0);

  final int itemCount;
  final bool timestamps;

  /// Whether placeholders may pulse. OS reduced-motion always wins.
  final bool motion;

  @override
  Widget build(BuildContext context) => ExcludeSemantics(
    child: LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final bool wide =
            constraints.hasBoundedWidth &&
            constraints.maxWidth >= CbStructure.space8 * 8;
        return Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            for (int index = 0; index < itemCount; index++)
              _TimelineSkeletonEvent(
                wide: wide,
                timestamp: timestamps,
                first: index == 0,
                last: index == itemCount - 1,
                motion: motion,
              ),
          ],
        );
      },
    ),
  );
}

class _TimelineSkeletonEvent extends StatelessWidget {
  const _TimelineSkeletonEvent({
    required this.wide,
    required this.timestamp,
    required this.first,
    required this.last,
    required this.motion,
  });

  final bool wide;
  final bool timestamp;
  final bool first;
  final bool last;
  final bool motion;

  @override
  Widget build(BuildContext context) {
    final Widget content = _TimelineSkeletonContent(
      timestamp: timestamp && !wide,
      motion: motion,
    );
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          if (wide) ...<Widget>[
            Expanded(
              flex: 2,
              child: Padding(
                padding: EdgeInsets.only(
                  top: CbStructure.space1,
                  bottom: last ? CbStructure.space0 : CbStructure.space5,
                ),
                child: timestamp
                    ? Align(
                        alignment: AlignmentDirectional.topEnd,
                        child: SizedBox(
                          width: CbStructure.space8,
                          child: CbSkeleton.text(
                            size: CbSize.sm,
                            motion: motion,
                          ),
                        ),
                      )
                    : const SizedBox.shrink(),
              ),
            ),
            const SizedBox(width: CbStructure.space4),
          ],
          _TimelineSkeletonRail(first: first, last: last, motion: motion),
          SizedBox(width: wide ? CbStructure.space4 : CbStructure.space3),
          Expanded(
            flex: wide ? 5 : 1,
            child: Padding(
              padding: EdgeInsets.only(
                bottom: last ? CbStructure.space0 : CbStructure.space5,
              ),
              child: content,
            ),
          ),
        ],
      ),
    );
  }
}

class _TimelineSkeletonRail extends StatelessWidget {
  const _TimelineSkeletonRail({
    required this.first,
    required this.last,
    required this.motion,
  });

  final bool first;
  final bool last;
  final bool motion;

  @override
  Widget build(BuildContext context) {
    const double markerInset = (CbStructure.space5 - CbStructure.space3) / 2;
    const double markerEnd = markerInset + CbStructure.space3;
    final Color connectorColor = context.cb.border.toColor();

    return SizedBox(
      width: CbStructure.space5,
      child: Stack(
        alignment: AlignmentDirectional.topCenter,
        children: <Widget>[
          if (!first)
            PositionedDirectional(
              top: CbStructure.space0,
              height: markerInset,
              child: ColoredBox(
                color: connectorColor,
                child: const SizedBox(width: CbStructure.borderWidth),
              ),
            ),
          if (!last)
            PositionedDirectional(
              top: markerEnd,
              bottom: CbStructure.space0,
              child: ColoredBox(
                color: connectorColor,
                child: const SizedBox(width: CbStructure.borderWidth),
              ),
            ),
          SizedBox.square(
            dimension: CbStructure.space5,
            child: Center(
              child: SizedBox.square(
                dimension: CbStructure.space3,
                child: FittedBox(
                  child: CbSkeleton.circle(size: CbSize.sm, motion: motion),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _TimelineSkeletonContent extends StatelessWidget {
  const _TimelineSkeletonContent({
    required this.timestamp,
    required this.motion,
  });

  final bool timestamp;
  final bool motion;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: <Widget>[
      if (timestamp) ...<Widget>[
        SizedBox(
          width: CbStructure.space8,
          child: CbSkeleton.text(size: CbSize.sm, motion: motion),
        ),
        const SizedBox(height: CbStructure.space1),
      ],
      SizedBox(
        width: CbStructure.space8 * 3,
        child: CbSkeleton.text(size: CbSize.md, motion: motion),
      ),
      const SizedBox(height: CbStructure.space2),
      SizedBox(
        width: CbStructure.space8 * 4,
        child: CbSkeleton.text(size: CbSize.md, motion: motion),
      ),
    ],
  );
}
