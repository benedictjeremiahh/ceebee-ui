import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';

const Key galleryChecklistInviteKey = Key('gallery-checklist-invite');
const Key galleryChecklistResetKey = Key('gallery-checklist-reset');

class ChecklistGallery extends StatefulWidget {
  const ChecklistGallery({super.key});

  @override
  State<ChecklistGallery> createState() => _ChecklistGalleryState();
}

class _ChecklistGalleryState extends State<ChecklistGallery> {
  final Set<String> _done = <String>{'profile'};

  void _complete(String id) => setState(() => _done.add(id));

  void _reset() => setState(() {
    _done
      ..clear()
      ..add('profile');
  });

  @override
  Widget build(BuildContext context) {
    final List<CbChecklistTask> tasks = <CbChecklistTask>[
      CbChecklistTask(
        id: 'profile',
        label: 'Complete your profile',
        description: 'Name and workspace are ready.',
        done: _done.contains('profile'),
      ),
      CbChecklistTask(
        id: 'team',
        label: 'Invite your first teammate',
        description: 'Share one release with a collaborator.',
        done: _done.contains('team'),
        onSelect: () => _complete('team'),
      ),
      CbChecklistTask(
        id: 'release',
        label: 'Publish a release',
        description: 'Turn the reviewed draft into a visible outcome.',
        done: _done.contains('release'),
        onSelect: () => _complete('release'),
      ),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Row(
          children: <Widget>[
            Expanded(
              child: Text(
                'Getting started',
                style: Theme.of(context).textTheme.displaySmall,
              ),
            ),
            TextButton.icon(
              key: galleryChecklistResetKey,
              onPressed: _reset,
              icon: const Icon(Icons.restart_alt),
              label: const Text('Reset'),
            ),
          ],
        ),
        const SizedBox(height: CbStructure.space2),
        Text(
          'Checklist keeps onboarding progress visible without owning account state. Every row is a native touch target and the app supplies each action.',
          style: Theme.of(context).textTheme.bodyLarge,
        ),
        const SizedBox(height: CbStructure.space5),
        LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
            final Widget checklist = CbChecklist(
              tasks: tasks,
              completeSlot: _CompleteSlot(onReset: _reset),
            );
            const Widget skeleton = CbChecklistSkeleton();
            if (constraints.maxWidth < CbStructure.space8 * 8) {
              return Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  KeyedSubtree(
                    key: galleryChecklistInviteKey,
                    child: checklist,
                  ),
                  const SizedBox(height: CbStructure.space4),
                  skeleton,
                ],
              );
            }
            return IntrinsicHeight(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  Expanded(
                    child: KeyedSubtree(
                      key: galleryChecklistInviteKey,
                      child: checklist,
                    ),
                  ),
                  const SizedBox(width: CbStructure.space4),
                  const Expanded(child: skeleton),
                ],
              ),
            );
          },
        ),
      ],
    );
  }
}

class _CompleteSlot extends StatelessWidget {
  const _CompleteSlot({required this.onReset});

  final VoidCallback onReset;

  @override
  Widget build(BuildContext context) => CbSurface(
    variant: CbSurfaceVariant.tinted,
    tone: CbTone.success,
    padding: CbPad.lg,
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        const Icon(Icons.celebration_outlined),
        const SizedBox(height: CbStructure.space2),
        Text('Workspace ready', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: CbStructure.space2),
        const Text('Every getting-started task is complete.'),
        const SizedBox(height: CbStructure.space3),
        OutlinedButton(onPressed: onReset, child: const Text('Start over')),
      ],
    ),
  );
}
