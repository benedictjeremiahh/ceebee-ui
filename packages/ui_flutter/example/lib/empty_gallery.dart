import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';

const Key emptyGalleryKey = Key('empty-gallery');
const Key emptyCreateKey = Key('empty-create');
const Key emptyResetKey = Key('empty-reset');

class EmptyGallery extends StatefulWidget {
  const EmptyGallery({super.key, this.motion = true});

  final bool motion;

  @override
  State<EmptyGallery> createState() => _EmptyGalleryState();
}

class _EmptyGalleryState extends State<EmptyGallery> {
  bool _created = false;

  @override
  Widget build(BuildContext context) => Column(
    key: emptyGalleryKey,
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: <Widget>[
      Text('Empty states', style: Theme.of(context).textTheme.displaySmall),
      const SizedBox(height: CbStructure.space2),
      Text(
        'Empty explains what is missing and keeps the next action nearby. The app owns the copy, action, and resulting content.',
        style: Theme.of(context).textTheme.bodyLarge,
      ),
      const SizedBox(height: CbStructure.space5),
      CbSurface(
        padding: CbPad.none,
        child: LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
            final Widget current = _created
                ? _CreatedView(onReset: () => setState(() => _created = false))
                : CbEmpty(
                    title: 'No saved views',
                    description:
                        'Create a view to keep your current filters nearby.',
                    action: FilledButton.icon(
                      key: emptyCreateKey,
                      onPressed: () => setState(() => _created = true),
                      icon: const Icon(Icons.add),
                      label: const Text('Create view'),
                    ),
                  );
            final Widget loading = CbEmptySkeleton(
              action: true,
              motion: widget.motion,
            );
            if (constraints.maxWidth < CbStructure.space8 * 8) {
              return Column(
                children: <Widget>[
                  current,
                  const Divider(height: CbStructure.space1),
                  loading,
                ],
              );
            }
            return IntrinsicHeight(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  Expanded(child: current),
                  const VerticalDivider(width: CbStructure.space1),
                  Expanded(child: loading),
                ],
              ),
            );
          },
        ),
      ),
    ],
  );
}

class _CreatedView extends StatelessWidget {
  const _CreatedView({required this.onReset});

  final VoidCallback onReset;

  @override
  Widget build(BuildContext context) => Padding(
    padding: CbPad.lg.insets,
    child: Column(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        Icon(
          Icons.bookmark_added_outlined,
          size: CbStructure.text2xl,
          color: context.cb.toneSuccess.toColor(),
        ),
        const SizedBox(height: CbStructure.space3),
        Text('View created', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: CbStructure.space2),
        Text(
          'Your current filters are ready to reuse.',
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.bodyMedium
              ?.copyWith(color: context.cb.fgMuted.toColor()),
        ),
        const SizedBox(height: CbStructure.space5),
        TextButton(
          key: emptyResetKey,
          onPressed: onReset,
          child: const Text('Reset example'),
        ),
      ],
    ),
  );
}
