import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/loading/skeleton.dart';
import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/structure.g.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

/// Static loading companion with the same selection and row anatomy as [CbUpload].
class CbUploadSkeleton extends StatelessWidget {
  const CbUploadSkeleton({super.key, this.itemCount = 2, this.motion = true})
    : assert(itemCount >= 0);

  final int itemCount;
  final bool motion;

  @override
  Widget build(BuildContext context) => ExcludeSemantics(
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Align(
          alignment: AlignmentDirectional.centerStart,
          child: SizedBox(
            width: CbStructure.space8 * 2,
            child: CbSkeleton.rect(size: CbSize.lg, motion: motion),
          ),
        ),
        if (itemCount > 0) ...<Widget>[
          const SizedBox(height: CbStructure.space4),
          for (int index = 0; index < itemCount; index++) ...<Widget>[
            if (index > 0) const SizedBox(height: CbStructure.space2),
            Material(
              key: ValueKey<String>('cb-upload-skeleton-item-$index'),
              color: context.cb.surfaceRaised.toColor(),
              shape: RoundedRectangleBorder(
                side: BorderSide(color: context.cb.border.toColor()),
                borderRadius: BorderRadius.circular(CbStructure.radiusMd),
              ),
              clipBehavior: Clip.antiAlias,
              child: ConstrainedBox(
                constraints: BoxConstraints(
                  minHeight:
                      (CbStructure.textLg * CbStructure.leadingNormal +
                              CbStructure.textSm * CbStructure.leadingNormal +
                              CbStructure.space1 +
                              CbStructure.space4)
                          .ceilToDouble(),
                ),
                child: Padding(
                  padding: const EdgeInsetsDirectional.fromSTEB(
                    CbStructure.space3,
                    CbStructure.space2,
                    CbStructure.space2,
                    CbStructure.space2,
                  ),
                  child: Row(
                    children: <Widget>[
                      CbSkeleton.circle(size: CbSize.sm, motion: motion),
                      const SizedBox(width: CbStructure.space3),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: <Widget>[
                            CbSkeleton.text(size: CbSize.md, motion: motion),
                            const SizedBox(height: CbStructure.space1),
                            FractionallySizedBox(
                              widthFactor: 0.5,
                              alignment: AlignmentDirectional.centerStart,
                              child: CbSkeleton.text(
                                size: CbSize.sm,
                                motion: motion,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: CbStructure.space3),
                      CbSkeleton.circle(size: CbSize.lg, motion: motion),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ],
      ],
    ),
  );
}
