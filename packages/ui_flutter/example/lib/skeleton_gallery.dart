import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';

const Key skeletonGalleryKey = Key('skeleton-gallery');

class SkeletonGallery extends StatelessWidget {
  const SkeletonGallery({super.key, this.motion = true});

  final bool motion;

  @override
  Widget build(BuildContext context) => Column(
    key: skeletonGalleryKey,
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: <Widget>[
      Text('Loading', style: Theme.of(context).textTheme.displaySmall),
      const SizedBox(height: CbStructure.space2),
      Text(
        'Skeleton shapes preserve layout while content is unavailable. The surrounding feature owns the loading announcement and final geometry.',
        style: Theme.of(context).textTheme.bodyLarge,
      ),
      const SizedBox(height: CbStructure.space5),
      CbSurface(
        variant: CbSurfaceVariant.tinted,
        padding: CbPad.lg,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Row(
              children: <Widget>[
                CbSkeleton.circle(size: CbSize.lg, motion: motion),
                const SizedBox(width: CbStructure.space4),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      SizedBox(
                        width: CbStructure.space8 * 3,
                        child: CbSkeleton.text(size: CbSize.lg, motion: motion),
                      ),
                      const SizedBox(height: CbStructure.space2),
                      SizedBox(
                        width: CbStructure.space8 * 2,
                        child: CbSkeleton.text(size: CbSize.sm, motion: motion),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: CbStructure.space5),
            CbSkeleton.text(size: CbSize.md, motion: motion),
            const SizedBox(height: CbStructure.space2),
            Align(
              alignment: Alignment.centerLeft,
              child: SizedBox(
                width: CbStructure.space8 * 4,
                child: CbSkeleton.text(size: CbSize.md, motion: motion),
              ),
            ),
            const SizedBox(height: CbStructure.space5),
            Row(
              children: <Widget>[
                Expanded(
                  child: CbSkeleton.rect(size: CbSize.md, motion: motion),
                ),
                const SizedBox(width: CbStructure.space3),
                Expanded(
                  child: CbSkeleton.rect(
                    size: CbSize.md,
                    radius: CbRadius.lg,
                    motion: motion,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    ],
  );
}
