import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';

const Key motionGalleryKey = Key('motion-gallery');
const Key motionReplayKey = Key('motion-replay');
const Key motionToggleKey = Key('motion-toggle');
const Key motionRevealStoryKey = Key('motion-reveal-story');
const Key motionFirstActivityKey = Key('motion-first-activity');

class MotionGallery extends StatefulWidget {
  const MotionGallery({super.key});

  @override
  State<MotionGallery> createState() => _MotionGalleryState();
}

class _MotionGalleryState extends State<MotionGallery> {
  int _generation = 0;
  bool _motion = true;

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;
    return Column(
      key: motionGalleryKey,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Wrap(
          spacing: CbStructure.space3,
          runSpacing: CbStructure.space2,
          crossAxisAlignment: WrapCrossAlignment.center,
          alignment: WrapAlignment.spaceBetween,
          children: <Widget>[
            Text('Motion', style: type.displaySmall),
            Wrap(
              spacing: CbStructure.space3,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: <Widget>[
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    const Text('Animate'),
                    Switch(
                      key: motionToggleKey,
                      value: _motion,
                      onChanged: (bool value) => setState(() {
                        _motion = value;
                        _generation += 1;
                      }),
                    ),
                  ],
                ),
                OutlinedButton.icon(
                  key: motionReplayKey,
                  onPressed: () => setState(() => _generation += 1),
                  icon: const Icon(Icons.replay),
                  label: const Text('Replay'),
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: CbStructure.space2),
        Text(
          'Reveal communicates where one element arrives from. Stagger preserves list order without delaying layout or interaction.',
          style: type.bodyLarge,
        ),
        const SizedBox(height: CbStructure.space2),
        Text(
          'The component switch and the reader’s OS animation preference both collapse the sequence to its visible final state.',
          style: type.bodySmall,
        ),
        const SizedBox(height: CbStructure.space5),
        LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
            final bool wide = constraints.maxWidth >= CbStructure.space8 * 9;
            final Widget reveal = CbReveal(
              key: ValueKey<String>('reveal-$_generation'),
              from: CbRevealFrom.left,
              distance: CbRevealDistance.md,
              motion: _motion,
              child: const _RevealStory(key: motionRevealStoryKey),
            );
            final Widget stagger = CbStagger(
              key: ValueKey<String>('stagger-$_generation'),
              from: CbRevealFrom.below,
              pace: CbStaggerPace.standard,
              onView: true,
              motion: _motion,
              children: const <Widget>[
                _ActivityRow(
                  key: motionFirstActivityKey,
                  icon: Icons.check_circle_outline,
                  title: 'Token checks passed',
                  detail: 'Cross-platform source stayed in sync',
                  time: '09:12',
                ),
                _ActivityRow(
                  icon: Icons.visibility_outlined,
                  title: 'Visual review completed',
                  detail: 'Compact and wide baselines approved',
                  time: '09:18',
                ),
                _ActivityRow(
                  icon: Icons.android_outlined,
                  title: 'Android build ready',
                  detail: 'Debug artifact compiled successfully',
                  time: '09:24',
                ),
              ],
            );

            if (wide) {
              return IntrinsicHeight(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: <Widget>[
                    Expanded(child: reveal),
                    const SizedBox(width: CbStructure.space4),
                    Expanded(child: stagger),
                  ],
                ),
              );
            }
            return Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                reveal,
                const SizedBox(height: CbStructure.space4),
                stagger,
              ],
            );
          },
        ),
      ],
    );
  }
}

class _RevealStory extends StatelessWidget {
  const _RevealStory({super.key});

  @override
  Widget build(BuildContext context) => CbSurface(
    variant: CbSurfaceVariant.tinted,
    tone: CbTone.brand,
    padding: CbPad.lg,
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Icon(
          Icons.motion_photos_on_outlined,
          color: context.cb.toneBrand.toColor(),
        ),
        const SizedBox(height: CbStructure.space4),
        Text(
          '9 checks passed',
          style: Theme.of(context).textTheme.headlineSmall,
        ),
        const SizedBox(height: CbStructure.space2),
        const Text(
          'The surface fades and travels from the left while keeping this final layout reserved.',
        ),
      ],
    ),
  );
}

class _ActivityRow extends StatelessWidget {
  const _ActivityRow({
    super.key,
    required this.icon,
    required this.title,
    required this.detail,
    required this.time,
  });

  final IconData icon;
  final String title;
  final String detail;
  final String time;

  @override
  Widget build(BuildContext context) => CbSurface(
    elevation: CbElevation.none,
    padding: CbPad.md,
    child: Row(
      children: <Widget>[
        Icon(icon),
        const SizedBox(width: CbStructure.space3),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(title, style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: CbStructure.space1),
              Text(detail, style: Theme.of(context).textTheme.bodySmall),
            ],
          ),
        ),
        const SizedBox(width: CbStructure.space3),
        Text(time, style: Theme.of(context).textTheme.labelMedium),
      ],
    ),
  );
}
