import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/data/statistic/statistic.dart';
import 'package:ceebee_ui/src/loading/skeleton.dart';
import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/structure.g.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

/// Loading companion with the same anatomy as [CbStatistic].
class CbStatisticSkeleton extends StatelessWidget {
  const CbStatisticSkeleton({
    super.key,
    this.description = false,
    this.motion = true,
  });

  final bool description;

  /// Whether placeholders may pulse. OS reduced-motion always wins.
  final bool motion;

  @override
  Widget build(BuildContext context) => ExcludeSemantics(
    child: Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        SizedBox(
          width: CbStructure.space8 * 2,
          child: CbSkeleton.text(size: CbSize.sm, motion: motion),
        ),
        const SizedBox(height: CbStructure.space2),
        SizedBox(
          width: CbStructure.space8 * 3,
          child: CbSkeleton.rect(
            size: CbSize.sm,
            radius: CbRadius.sm,
            motion: motion,
          ),
        ),
        if (description) ...<Widget>[
          const SizedBox(height: CbStructure.space2),
          SizedBox(
            width: CbStructure.space8 * 2,
            child: CbSkeleton.text(size: CbSize.sm, motion: motion),
          ),
        ],
      ],
    ),
  );
}
