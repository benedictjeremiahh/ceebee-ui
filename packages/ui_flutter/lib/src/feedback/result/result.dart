import 'package:flutter/material.dart';

import 'package:ceebee_ui/src/foundation/surface.dart';
import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/structure.g.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

/// The semantic outcome represented by [CbResult].
enum CbResultStatus { info, success, warning, error }

/// An inline end-state for a consequential operation.
///
/// The app owns copy, actions, details, and state transitions. [CbResult]
/// contributes only status semantics and stable visual anatomy.
class CbResult extends StatelessWidget {
  const CbResult({
    super.key,
    required this.title,
    this.status = CbResultStatus.info,
    this.semanticLabel,
    this.description,
    this.icon,
    this.actions = const <Widget>[],
    this.details,
    this.padding = CbPad.lg,
  });

  final CbResultStatus status;
  final String title;

  /// A localized announcement that may add the status to [title].
  ///
  /// When omitted, the visible title is announced directly. Ceebee does not
  /// synthesize English status copy inside the component.
  final String? semanticLabel;

  final String? description;
  final Widget? icon;
  final List<Widget> actions;
  final Widget? details;
  final CbPad padding;

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;
    final Color muted = context.cb.fgMuted.toColor();
    final CbTone tone = _toneForStatus(status);
    final Color statusColor = context.cb.accent(tone: tone).toColor();
    final Widget visibleTitle = Text(
      title,
      textAlign: TextAlign.center,
      style: type.headlineSmall,
    );

    return Semantics(
      container: true,
      explicitChildNodes: true,
      child: Padding(
        padding: padding.insets,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Center(
              child: ExcludeSemantics(
                child: SizedBox.square(
                  dimension: CbStructure.space8,
                  child: IconTheme.merge(
                    data: IconThemeData(
                      color: statusColor,
                      size: CbStructure.text3xl,
                    ),
                    child: Center(
                      child:
                          icon ??
                          Icon(
                            _iconForStatus(status),
                            color: statusColor,
                            size: CbStructure.text3xl,
                          ),
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: CbStructure.space4),
            Semantics(
              header: true,
              liveRegion: true,
              label: semanticLabel,
              child: semanticLabel == null
                  ? visibleTitle
                  : ExcludeSemantics(child: visibleTitle),
            ),
            if (description case final String copy) ...<Widget>[
              const SizedBox(height: CbStructure.space2),
              Text(
                copy,
                textAlign: TextAlign.center,
                style: type.bodyMedium?.copyWith(color: muted),
              ),
            ],
            if (actions.isNotEmpty) ...<Widget>[
              const SizedBox(height: CbStructure.space5),
              Center(
                child: Wrap(
                  alignment: WrapAlignment.center,
                  spacing: CbStructure.space2,
                  runSpacing: CbStructure.space2,
                  children: actions,
                ),
              ),
            ],
            if (details case final Widget detailsWidget) ...<Widget>[
              const SizedBox(height: CbStructure.space5),
              CbSurface(
                variant: CbSurfaceVariant.tinted,
                elevation: CbElevation.none,
                radius: CbRadius.md,
                child: detailsWidget,
              ),
            ],
          ],
        ),
      ),
    );
  }
}

CbTone _toneForStatus(CbResultStatus status) => switch (status) {
  CbResultStatus.info => CbTone.info,
  CbResultStatus.success => CbTone.success,
  CbResultStatus.warning => CbTone.warning,
  CbResultStatus.error => CbTone.danger,
};

IconData _iconForStatus(CbResultStatus status) => switch (status) {
  CbResultStatus.info => Icons.info_outline_rounded,
  CbResultStatus.success => Icons.check_circle_outline_rounded,
  CbResultStatus.warning => Icons.warning_amber_rounded,
  CbResultStatus.error => Icons.error_outline_rounded,
};
