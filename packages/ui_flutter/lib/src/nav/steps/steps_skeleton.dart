import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/loading/skeleton.dart';
import 'package:ceebee_ui/src/nav/steps/steps.dart';
import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/structure.g.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

/// Loading companion with the same adaptive anatomy as [CbSteps].
class CbStepsSkeleton extends StatelessWidget {
  const CbStepsSkeleton({
    super.key,
    this.itemCount = 3,
    this.orientation = CbStepsOrientation.adaptive,
    this.content = true,
    this.motion = true,
  }) : assert(itemCount > 0);

  final int itemCount;
  final CbStepsOrientation orientation;
  final bool content;
  final bool motion;

  @override
  Widget build(BuildContext context) => ExcludeSemantics(
    child: LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final bool horizontal = switch (orientation) {
          CbStepsOrientation.horizontal => true,
          CbStepsOrientation.vertical => false,
          CbStepsOrientation.adaptive =>
            constraints.hasBoundedWidth &&
                constraints.maxWidth >= CbStructure.space8 * 8,
        };
        if (horizontal) {
          return Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              for (int index = 0; index < itemCount; index++)
                Expanded(
                  child: _HorizontalStepSkeleton(
                    first: index == 0,
                    last: index == itemCount - 1,
                    content: content,
                    motion: motion,
                  ),
                ),
            ],
          );
        }
        return Column(
          children: <Widget>[
            for (int index = 0; index < itemCount; index++)
              _VerticalStepSkeleton(
                last: index == itemCount - 1,
                content: content,
                motion: motion,
              ),
          ],
        );
      },
    ),
  );
}

class _HorizontalStepSkeleton extends StatelessWidget {
  const _HorizontalStepSkeleton({
    required this.first,
    required this.last,
    required this.content,
    required this.motion,
  });

  final bool first;
  final bool last;
  final bool content;
  final bool motion;

  @override
  Widget build(BuildContext context) => Column(
    children: <Widget>[
      Row(
        children: <Widget>[
          Expanded(child: _SkeletonConnector(hidden: first)),
          _SkeletonMarker(motion: motion),
          Expanded(child: _SkeletonConnector(hidden: last)),
        ],
      ),
      const SizedBox(height: CbStructure.space2),
      _SkeletonCopy(content: content, motion: motion),
    ],
  );
}

class _VerticalStepSkeleton extends StatelessWidget {
  const _VerticalStepSkeleton({
    required this.last,
    required this.content,
    required this.motion,
  });

  final bool last;
  final bool content;
  final bool motion;

  @override
  Widget build(BuildContext context) => IntrinsicHeight(
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        SizedBox(
          width: CbStructure.controlHeightLg,
          child: Stack(
            alignment: AlignmentDirectional.topCenter,
            children: <Widget>[
              if (!last)
                PositionedDirectional(
                  top: CbStructure.space4,
                  bottom: CbStructure.space0,
                  child: ColoredBox(
                    color: context.cb.border.toColor(),
                    child: const SizedBox(width: CbStructure.borderWidth),
                  ),
                ),
              _SkeletonMarker(motion: motion),
            ],
          ),
        ),
        const SizedBox(width: CbStructure.space3),
        Expanded(
          child: Padding(
            padding: EdgeInsets.only(
              bottom: last ? CbStructure.space1 : CbStructure.space5,
            ),
            child: _SkeletonCopy(content: content, motion: motion),
          ),
        ),
      ],
    ),
  );
}

class _SkeletonMarker extends StatelessWidget {
  const _SkeletonMarker({required this.motion});

  final bool motion;

  @override
  Widget build(BuildContext context) => SizedBox.square(
    dimension: CbStructure.controlHeightSm,
    child: CbSkeleton.circle(size: CbSize.sm, motion: motion),
  );
}

class _SkeletonConnector extends StatelessWidget {
  const _SkeletonConnector({required this.hidden});

  final bool hidden;

  @override
  Widget build(BuildContext context) => hidden
      ? const SizedBox(height: CbStructure.borderWidth)
      : ColoredBox(
          color: context.cb.border.toColor(),
          child: const SizedBox(height: CbStructure.borderWidth),
        );
}

class _SkeletonCopy extends StatelessWidget {
  const _SkeletonCopy({required this.content, required this.motion});

  final bool content;
  final bool motion;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: <Widget>[
      SizedBox(
        width: CbStructure.space8 * 2,
        child: CbSkeleton.text(size: CbSize.md, motion: motion),
      ),
      if (content) ...<Widget>[
        const SizedBox(height: CbStructure.space1),
        SizedBox(
          width: CbStructure.space8 * 3,
          child: CbSkeleton.text(size: CbSize.md, motion: motion),
        ),
      ],
    ],
  );
}
