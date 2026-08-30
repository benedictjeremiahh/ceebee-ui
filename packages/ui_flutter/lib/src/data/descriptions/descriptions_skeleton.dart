import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/data/descriptions/descriptions.dart';
import 'package:ceebee_ui/src/loading/skeleton.dart';
import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/structure.g.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

/// Loading companion with the same responsive anatomy as [CbDescriptions].
class CbDescriptionsSkeleton extends StatelessWidget {
  const CbDescriptionsSkeleton({
    super.key,
    this.itemCount = 4,
    this.title = true,
    this.action = false,
    this.fullWidthLast = false,
    this.motion = true,
  }) : assert(itemCount > 0);

  final int itemCount;
  final bool title;
  final bool action;
  final bool fullWidthLast;

  /// Whether placeholders may pulse. OS reduced-motion always wins.
  final bool motion;

  @override
  Widget build(BuildContext context) => ExcludeSemantics(
    child: Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        if (title || action) ...<Widget>[
          Row(
            children: <Widget>[
              if (title)
                Expanded(
                  child: Align(
                    alignment: AlignmentDirectional.centerStart,
                    child: SizedBox(
                      width: CbStructure.space8 * 3,
                      child: CbSkeleton.text(size: CbSize.lg, motion: motion),
                    ),
                  ),
                )
              else
                const Spacer(),
              if (title && action) const SizedBox(width: CbStructure.space4),
              if (action)
                SizedBox(
                  width: CbStructure.space8,
                  child: CbSkeleton.rect(
                    size: CbSize.md,
                    radius: CbRadius.sm,
                    motion: motion,
                  ),
                ),
            ],
          ),
          const SizedBox(height: CbStructure.space5),
        ],
        LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
            final bool compact =
                !constraints.hasBoundedWidth ||
                constraints.maxWidth < CbStructure.space8 * 8;
            if (compact) {
              return Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  for (int index = 0; index < itemCount; index++) ...<Widget>[
                    if (index > 0) const SizedBox(height: CbStructure.space4),
                    _DescriptionItemSkeleton(motion: motion),
                  ],
                ],
              );
            }
            final double itemWidth =
                (constraints.maxWidth - CbStructure.space5) / 2;
            return Wrap(
              spacing: CbStructure.space5,
              runSpacing: CbStructure.space5,
              children: <Widget>[
                for (int index = 0; index < itemCount; index++)
                  SizedBox(
                    width: fullWidthLast && index == itemCount - 1
                        ? constraints.maxWidth
                        : itemWidth,
                    child: _DescriptionItemSkeleton(motion: motion),
                  ),
              ],
            );
          },
        ),
      ],
    ),
  );
}

class _DescriptionItemSkeleton extends StatelessWidget {
  const _DescriptionItemSkeleton({required this.motion});

  final bool motion;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: <Widget>[
      SizedBox(
        width: CbStructure.space8 * 2,
        child: CbSkeleton.text(size: CbSize.sm, motion: motion),
      ),
      const SizedBox(height: CbStructure.space2),
      SizedBox(
        width: CbStructure.space8 * 3,
        child: CbSkeleton.text(size: CbSize.md, motion: motion),
      ),
    ],
  );
}
