import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/loading/skeleton.dart';
import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/structure.g.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

/// Static loading companion with the same anatomy as `CbEmpty`.
class CbEmptySkeleton extends StatelessWidget {
  const CbEmptySkeleton({
    super.key,
    this.descriptionLines = 2,
    this.action = false,
    this.motion = true,
    this.padding = CbPad.lg,
  }) : assert(descriptionLines >= 0);

  final int descriptionLines;
  final bool action;
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
          CbSkeleton.circle(size: CbSize.lg, motion: motion),
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
          if (action) ...<Widget>[
            const SizedBox(height: CbStructure.space5),
            SizedBox(
              width: CbStructure.space8 * 2,
              child: CbSkeleton.rect(size: CbSize.md, motion: motion),
            ),
          ],
        ],
      ),
    ),
  );
}
