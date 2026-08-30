import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/feedback/result/result.dart';
import 'package:ceebee_ui/src/foundation/surface.dart';
import 'package:ceebee_ui/src/loading/skeleton.dart';
import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/structure.g.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

/// Loading companion with the same anatomy as [CbResult].
class CbResultSkeleton extends StatelessWidget {
  const CbResultSkeleton({
    super.key,
    this.descriptionLines = 1,
    this.actionCount = 0,
    this.detailLines = 0,
    this.motion = true,
    this.padding = CbPad.lg,
  }) : assert(descriptionLines >= 0),
       assert(actionCount >= 0),
       assert(detailLines >= 0);

  final int descriptionLines;
  final int actionCount;
  final int detailLines;

  /// Whether placeholders may pulse. OS reduced-motion always wins.
  final bool motion;

  final CbPad padding;

  @override
  Widget build(BuildContext context) => ExcludeSemantics(
    child: Padding(
      padding: padding.insets,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          SizedBox.square(
            dimension: CbStructure.space8,
            child: Center(
              child: CbSkeleton.circle(size: CbSize.lg, motion: motion),
            ),
          ),
          const SizedBox(height: CbStructure.space4),
          SizedBox(
            width: CbStructure.space8 * 3,
            child: CbSkeleton.text(size: CbSize.lg, motion: motion),
          ),
          if (descriptionLines > 0) ...<Widget>[
            const SizedBox(height: CbStructure.space2),
            for (int index = 0; index < descriptionLines; index++) ...<Widget>[
              if (index > 0) const SizedBox(height: CbStructure.space1),
              SizedBox(
                width: index == descriptionLines - 1
                    ? CbStructure.space8 * 3
                    : CbStructure.space8 * 4,
                child: CbSkeleton.text(size: CbSize.md, motion: motion),
              ),
            ],
          ],
          if (actionCount > 0) ...<Widget>[
            const SizedBox(height: CbStructure.space5),
            Wrap(
              alignment: WrapAlignment.center,
              spacing: CbStructure.space2,
              runSpacing: CbStructure.space2,
              children: <Widget>[
                for (int index = 0; index < actionCount; index++)
                  SizedBox(
                    width: CbStructure.space8 * 2,
                    child: CbSkeleton.rect(size: CbSize.md, motion: motion),
                  ),
              ],
            ),
          ],
          if (detailLines > 0) ...<Widget>[
            const SizedBox(height: CbStructure.space5),
            CbSurface(
              variant: CbSurfaceVariant.tinted,
              elevation: CbElevation.none,
              radius: CbRadius.md,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  for (int index = 0; index < detailLines; index++) ...<Widget>[
                    if (index > 0) const SizedBox(height: CbStructure.space2),
                    FractionallySizedBox(
                      widthFactor: index == detailLines - 1 ? 0.75 : 1,
                      alignment: AlignmentDirectional.centerStart,
                      child: CbSkeleton.text(size: CbSize.md, motion: motion),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ],
      ),
    ),
  );
}
