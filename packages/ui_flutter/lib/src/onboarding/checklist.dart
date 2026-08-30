import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/foundation/surface.dart';
import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/structure.g.dart';
import 'package:ceebee_ui/src/tokens/skin_tokens.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

/// One app-owned step in a [CbChecklist].
class CbChecklistTask {
  const CbChecklistTask({
    required this.id,
    required this.label,
    this.description,
    this.done = false,
    this.onSelect,
  });

  final String id;
  final String label;
  final String? description;
  final bool done;
  final VoidCallback? onSelect;
}

/// Mobile-friendly getting-started tasks with app-owned progress state.
///
/// Ceebee renders progress and task state. The app owns which tasks are done
/// and what selecting an unfinished task does.
class CbChecklist extends StatelessWidget {
  const CbChecklist({
    super.key,
    required this.tasks,
    this.title = 'Get started',
    this.completeSlot,
  });

  final String title;
  final List<CbChecklistTask> tasks;
  final Widget? completeSlot;

  @override
  Widget build(BuildContext context) {
    final int done = tasks.where((CbChecklistTask task) => task.done).length;
    final bool complete = tasks.isNotEmpty && done == tasks.length;
    final double progress = tasks.isEmpty ? 0 : done / tasks.length;

    return CbSurface(
      padding: CbPad.lg,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          Row(
            children: <Widget>[
              Expanded(
                child: Text(
                  title,
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              ),
              Text(
                '$done of ${tasks.length}',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
          ),
          const SizedBox(height: CbStructure.space3),
          Semantics(
            label: '$done of ${tasks.length} tasks done',
            value: '${(progress * 100).round()} percent',
            child: ExcludeSemantics(
              child: LinearProgressIndicator(value: progress),
            ),
          ),
          const SizedBox(height: CbStructure.space3),
          if (complete && completeSlot != null)
            completeSlot!
          else
            for (final CbChecklistTask task in tasks) _TaskRow(task: task),
        ],
      ),
    );
  }
}

class _TaskRow extends StatelessWidget {
  const _TaskRow({required this.task});

  final CbChecklistTask task;

  @override
  Widget build(BuildContext context) {
    final CbSkinTokens tokens = context.cb;
    final String semanticLabel = <String>[
      task.label,
      if (task.description != null) task.description!,
      if (task.done) 'done',
    ].join(', ');

    return Semantics(
      button: task.onSelect != null,
      enabled: task.onSelect != null,
      checked: task.done,
      label: semanticLabel,
      child: ExcludeSemantics(
        child: Material(
          type: MaterialType.transparency,
          child: InkWell(
            borderRadius: BorderRadius.circular(CbStructure.radiusSm),
            onTap: task.onSelect,
            child: ConstrainedBox(
              constraints: const BoxConstraints(
                minHeight: CbStructure.controlHeightLg,
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: CbStructure.space2,
                  vertical: CbStructure.space2,
                ),
                child: Row(
                  children: <Widget>[
                    Container(
                      width: CbStructure.space5,
                      height: CbStructure.space5,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: task.done
                            ? tokens.accent(tone: CbTone.success).toColor()
                            : null,
                        border: Border.all(
                          color: task.done
                              ? tokens.accent(tone: CbTone.success).toColor()
                              : tokens.borderStrong.toColor(),
                          width: CbStructure.borderWidth,
                        ),
                      ),
                      child: task.done
                          ? Icon(
                              Icons.check,
                              size: CbStructure.textMd,
                              color: tokens.fgOnBrand.toColor(),
                            )
                          : null,
                    ),
                    const SizedBox(width: CbStructure.space3),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Text(
                            task.label,
                            style: Theme.of(context).textTheme.bodyMedium
                                ?.copyWith(
                                  color: task.done
                                      ? tokens.fgMuted.toColor()
                                      : null,
                                  decoration: task.done
                                      ? TextDecoration.lineThrough
                                      : null,
                                ),
                          ),
                          if (task.description != null) ...<Widget>[
                            const SizedBox(height: CbStructure.space1),
                            Text(
                              task.description!,
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                          ],
                        ],
                      ),
                    ),
                    if (task.onSelect != null && !task.done) ...<Widget>[
                      const SizedBox(width: CbStructure.space2),
                      const Icon(Icons.chevron_right),
                    ],
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
