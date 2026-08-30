import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';

const Key stepsGalleryKey = Key('steps-gallery');
const Key stepsResolveKey = Key('steps-resolve');

class StepsGallery extends StatefulWidget {
  const StepsGallery({super.key, this.motion = true});

  final bool motion;

  @override
  State<StepsGallery> createState() => _StepsGalleryState();
}

class _StepsGalleryState extends State<StepsGallery> {
  int _current = 2;
  bool _reviewError = true;

  @override
  Widget build(BuildContext context) {
    final List<String> detailTitles = <String>[
      'Sender details',
      'Recipient details',
      'Review transfer',
      'Transfer ready',
    ];
    return Column(
      key: stepsGalleryKey,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Text('Transfer steps', style: Theme.of(context).textTheme.displaySmall),
        const SizedBox(height: CbStructure.space2),
        Text(
          'Steps communicates current progress while the application owns navigation and validation.',
          style: Theme.of(context).textTheme.bodyLarge,
        ),
        const SizedBox(height: CbStructure.space5),
        CbSurface(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              CbSteps(
                current: _current,
                motion: widget.motion,
                onStepSelected: (int index) => setState(() => _current = index),
                items: <CbStepItem>[
                  const CbStepItem(
                    title: 'Sender',
                    semanticLabel: 'Sender, complete, step 1 of 4',
                    content: Text('Account'),
                  ),
                  const CbStepItem(
                    title: 'Recipient',
                    semanticLabel: 'Recipient, complete, step 2 of 4',
                    content: Text('Bank details'),
                  ),
                  CbStepItem(
                    title: 'Review',
                    semanticLabel: _reviewError
                        ? 'Review, error, step 3 of 4'
                        : 'Review, active, step 3 of 4',
                    status: _reviewError && _current == 2
                        ? CbStepStatus.error
                        : null,
                    content: const Text('Limits and fees'),
                  ),
                  const CbStepItem(
                    title: 'Send',
                    semanticLabel: 'Send, waiting, step 4 of 4',
                    content: Text('Confirmation'),
                    disabled: true,
                  ),
                ],
              ),
              const SizedBox(height: CbStructure.space5),
              Divider(color: context.cb.border.toColor()),
              const SizedBox(height: CbStructure.space4),
              Text(
                detailTitles[_current],
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: CbStructure.space2),
              Text(
                _reviewError && _current == 2
                    ? 'Recipient bank code needs attention before this transfer can continue.'
                    : 'The application supplies the content and decides when this stage is complete.',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: _reviewError && _current == 2
                      ? context.cb.accent(tone: CbTone.danger).toColor()
                      : context.cb.fgMuted.toColor(),
                ),
              ),
              if (_reviewError && _current == 2) ...<Widget>[
                const SizedBox(height: CbStructure.space4),
                Align(
                  alignment: AlignmentDirectional.centerStart,
                  child: FilledButton.icon(
                    key: stepsResolveKey,
                    onPressed: () => setState(() => _reviewError = false),
                    icon: const Icon(Icons.build_outlined),
                    label: const Text('Resolve issue'),
                  ),
                ),
              ],
            ],
          ),
        ),
        const SizedBox(height: CbStructure.space4),
        CbSurface(
          variant: CbSurfaceVariant.tinted,
          child: CbStepsSkeleton(
            itemCount: 4,
            content: true,
            motion: widget.motion,
          ),
        ),
      ],
    );
  }
}
