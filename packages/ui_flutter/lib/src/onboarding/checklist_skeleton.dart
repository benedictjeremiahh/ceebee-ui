import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/foundation/surface.dart';
import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/structure.g.dart';

/// Static loading companion with the same geometry as [CbChecklist].
class CbChecklistSkeleton extends StatelessWidget {
  const CbChecklistSkeleton({super.key, this.taskCount = 3});

  final int taskCount;

  @override
  Widget build(BuildContext context) {
    final Color fill = context.cb.fgMuted.scaleAlpha(0.28).toColor();
    return ExcludeSemantics(
      child: CbSurface(
        padding: CbPad.lg,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Align(
              alignment: Alignment.centerLeft,
              child: _SkeletonBlock(
                width: CbStructure.space8 * 2,
                height: CbStructure.textLg,
                color: fill,
              ),
            ),
            const SizedBox(height: CbStructure.space3),
            _SkeletonBlock(
              height: CbStructure.space1,
              color: fill,
              radius: CbStructure.radiusFull,
            ),
            const SizedBox(height: CbStructure.space3),
            for (int index = 0; index < taskCount; index++)
              SizedBox(
                height: CbStructure.controlHeightLg + CbStructure.space2,
                child: Row(
                  children: <Widget>[
                    _SkeletonBlock(
                      width: CbStructure.space5,
                      height: CbStructure.space5,
                      color: fill,
                      radius: CbStructure.radiusFull,
                    ),
                    const SizedBox(width: CbStructure.space3),
                    Expanded(
                      child: _SkeletonBlock(
                        height: CbStructure.textMd,
                        color: fill,
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _SkeletonBlock extends StatelessWidget {
  const _SkeletonBlock({
    this.width,
    required this.height,
    required this.color,
    this.radius = CbStructure.radiusSm,
  });

  final double? width;
  final double height;
  final Color color;
  final double radius;

  @override
  Widget build(BuildContext context) => DecoratedBox(
    decoration: BoxDecoration(
      color: color,
      borderRadius: BorderRadius.circular(radius),
    ),
    child: SizedBox(width: width, height: height),
  );
}
