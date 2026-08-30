import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/loading/skeleton.dart';
import 'package:ceebee_ui/src/nav/pagination/pagination.dart';
import 'package:ceebee_ui/src/tokens/generated/structure.g.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

/// Loading companion with the same adaptive anatomy as [CbPagination].
class CbPaginationSkeleton extends StatelessWidget {
  const CbPaginationSkeleton({
    super.key,
    this.pageSlotCount = 5,
    this.motion = true,
  }) : assert(pageSlotCount > 0);

  final int pageSlotCount;
  final bool motion;

  @override
  Widget build(BuildContext context) => ExcludeSemantics(
    child: LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final bool expanded =
            constraints.hasBoundedWidth &&
            constraints.maxWidth >= CbStructure.space8 * 8;
        final int controlCount = expanded ? pageSlotCount + 2 : 3;
        return Align(
          alignment: AlignmentDirectional.center,
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              for (int index = 0; index < controlCount; index++) ...<Widget>[
                if (index > 0) const SizedBox(width: CbStructure.space2),
                SizedBox.square(
                  dimension: CbStructure.controlHeightLg,
                  child: index == 1 && !expanded
                      ? Center(
                          child: CbSkeleton.text(
                            size: CbSize.md,
                            motion: motion,
                          ),
                        )
                      : CbSkeleton.rect(size: CbSize.lg, motion: motion),
                ),
              ],
            ],
          ),
        );
      },
    ),
  );
}
