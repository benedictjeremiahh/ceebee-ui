import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/structure.g.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

enum CbUploadStatus { queued, uploading, success, error }

@immutable
class CbUploadItem {
  const CbUploadItem({
    required this.id,
    required this.name,
    required this.status,
    required this.statusLabel,
    required this.semanticLabel,
    this.progress,
  }) : assert(progress == null || (progress >= 0 && progress <= 1));

  final String id;
  final String name;
  final CbUploadStatus status;
  final String statusLabel;
  final String semanticLabel;
  final double? progress;
}

typedef CbUploadActionLabelBuilder = String Function(CbUploadItem item);

/// A controlled file-selection and transfer-status composition.
///
/// The application injects the picker, upload transport, retry, removal,
/// persistence, validation, and all localized copy. This widget never touches
/// the filesystem or network.
class CbUpload extends StatelessWidget {
  const CbUpload({
    super.key,
    required this.items,
    required this.selectLabel,
    required this.semanticLabel,
    required this.removeLabelBuilder,
    this.onSelect,
    this.onRemove,
    this.onRetry,
    this.retryLabelBuilder,
  }) : assert(
         onRetry == null || retryLabelBuilder != null,
         'retryLabelBuilder is required when onRetry is supplied.',
       );

  final List<CbUploadItem> items;
  final String selectLabel;
  final String semanticLabel;
  final VoidCallback? onSelect;
  final ValueChanged<CbUploadItem>? onRemove;
  final ValueChanged<CbUploadItem>? onRetry;
  final CbUploadActionLabelBuilder removeLabelBuilder;
  final CbUploadActionLabelBuilder? retryLabelBuilder;

  @override
  Widget build(BuildContext context) => Semantics(
    container: true,
    explicitChildNodes: true,
    label: semanticLabel,
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Align(
          alignment: AlignmentDirectional.centerStart,
          child: FilledButton.icon(
            onPressed: onSelect,
            icon: const Icon(Icons.add_rounded),
            label: Text(selectLabel),
          ),
        ),
        if (items.isNotEmpty) ...<Widget>[
          const SizedBox(height: CbStructure.space4),
          for (int index = 0; index < items.length; index++) ...<Widget>[
            if (index > 0) const SizedBox(height: CbStructure.space2),
            _UploadRow(
              item: items[index],
              onRemove: onRemove,
              onRetry: onRetry,
              removeLabel: removeLabelBuilder(items[index]),
              retryLabel: retryLabelBuilder?.call(items[index]),
            ),
          ],
        ],
      ],
    ),
  );
}

class _UploadRow extends StatelessWidget {
  const _UploadRow({
    required this.item,
    required this.onRemove,
    required this.onRetry,
    required this.removeLabel,
    required this.retryLabel,
  });

  final CbUploadItem item;
  final ValueChanged<CbUploadItem>? onRemove;
  final ValueChanged<CbUploadItem>? onRetry;
  final String removeLabel;
  final String? retryLabel;

  @override
  Widget build(BuildContext context) {
    final CbTone tone = switch (item.status) {
      CbUploadStatus.queued => CbTone.neutral,
      CbUploadStatus.uploading => CbTone.info,
      CbUploadStatus.success => CbTone.success,
      CbUploadStatus.error => CbTone.danger,
    };
    final IconData icon = switch (item.status) {
      CbUploadStatus.queued => Icons.schedule_outlined,
      CbUploadStatus.uploading => Icons.upload_rounded,
      CbUploadStatus.success => Icons.check_circle_outline_rounded,
      CbUploadStatus.error => Icons.error_outline_rounded,
    };
    final bool canRetry =
        item.status == CbUploadStatus.error && onRetry != null;

    return Semantics(
      container: true,
      label: item.semanticLabel,
      child: Material(
        key: ValueKey<String>('cb-upload-item-${item.id}'),
        color: context.cb.surfaceRaised.toColor(),
        shape: RoundedRectangleBorder(
          side: BorderSide(color: context.cb.border.toColor()),
          borderRadius: BorderRadius.circular(CbStructure.radiusMd),
        ),
        clipBehavior: Clip.antiAlias,
        child: Padding(
          padding: const EdgeInsetsDirectional.fromSTEB(
            CbStructure.space3,
            CbStructure.space2,
            CbStructure.space2,
            CbStructure.space2,
          ),
          child: Row(
            children: <Widget>[
              ExcludeSemantics(
                child: Icon(
                  icon,
                  color: context.cb.accent(tone: tone).toColor(),
                ),
              ),
              const SizedBox(width: CbStructure.space3),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: <Widget>[
                    Text(
                      item.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: Theme.of(context).textTheme.bodyLarge,
                    ),
                    const SizedBox(height: CbStructure.space1),
                    Text(
                      item.statusLabel,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: context.cb.fgMuted.toColor(),
                      ),
                    ),
                    if (item.status == CbUploadStatus.uploading) ...<Widget>[
                      const SizedBox(height: CbStructure.space2),
                      LinearProgressIndicator(
                        value: item.progress,
                        semanticsLabel: item.statusLabel,
                        semanticsValue: item.progress == null
                            ? null
                            : '${(item.progress! * 100).round()}%',
                      ),
                    ],
                  ],
                ),
              ),
              if (canRetry)
                IconButton(
                  onPressed: () => onRetry!(item),
                  tooltip: retryLabel,
                  icon: const Icon(Icons.refresh_rounded),
                ),
              if (onRemove != null)
                IconButton(
                  onPressed: () => onRemove!(item),
                  tooltip: removeLabel,
                  icon: const Icon(Icons.close_rounded),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
