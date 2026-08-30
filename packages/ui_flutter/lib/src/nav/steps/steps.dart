import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';

import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/motion.g.dart';
import 'package:ceebee_ui/src/tokens/generated/structure.g.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

enum CbStepStatus { waiting, active, complete, error }

enum CbStepsOrientation { adaptive, horizontal, vertical }

/// One application-owned stage in [CbSteps].
@immutable
class CbStepItem {
  const CbStepItem({
    this.key,
    required this.title,
    this.content,
    this.semanticLabel,
    this.status,
    this.icon,
    this.disabled = false,
  });

  final Key? key;
  final String title;
  final Widget? content;

  /// Complete localized spoken output when the derived status is important.
  final String? semanticLabel;

  /// Optional status override. Otherwise [CbSteps.current] derives the status.
  final CbStepStatus? status;
  final Widget? icon;
  final bool disabled;
}

/// A responsive progress indicator with optional app-owned step navigation.
class CbSteps extends StatelessWidget {
  const CbSteps({
    super.key,
    required this.items,
    this.current = 0,
    this.orientation = CbStepsOrientation.adaptive,
    this.onStepSelected,
    this.motion = true,
  }) : assert(current >= 0);

  final List<CbStepItem> items;
  final int current;
  final CbStepsOrientation orientation;

  /// When present, enabled steps become native Material touch targets.
  final ValueChanged<int>? onStepSelected;

  /// Whether visual state changes may animate. OS reduced-motion always wins.
  final bool motion;

  @override
  Widget build(BuildContext context) => Semantics(
    container: true,
    explicitChildNodes: true,
    child: LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final bool horizontal = switch (orientation) {
          CbStepsOrientation.horizontal => true,
          CbStepsOrientation.vertical => false,
          CbStepsOrientation.adaptive =>
            constraints.hasBoundedWidth &&
                constraints.maxWidth >= CbStructure.space8 * 8,
        };
        final bool reduceMotion =
            MediaQuery.maybeOf(context)?.disableAnimations ?? false;
        final Duration duration = motion && !reduceMotion
            ? CbMotionTokens.base
            : Duration.zero;
        final List<CbStepStatus> statuses = <CbStepStatus>[
          for (int index = 0; index < items.length; index++)
            items[index].status ?? _derivedStatus(index, current),
        ];
        if (horizontal) {
          return Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              for (int index = 0; index < items.length; index++)
                Expanded(
                  child: _StepBoundary(
                    item: items[index],
                    index: index,
                    status: statuses[index],
                    onStepSelected: onStepSelected,
                    child: _HorizontalStep(
                      item: items[index],
                      status: statuses[index],
                      previousStatus: index == 0 ? null : statuses[index - 1],
                      first: index == 0,
                      last: index == items.length - 1,
                      number: index + 1,
                      duration: duration,
                    ),
                  ),
                ),
            ],
          );
        }
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            for (int index = 0; index < items.length; index++)
              _StepBoundary(
                item: items[index],
                index: index,
                status: statuses[index],
                onStepSelected: onStepSelected,
                child: _VerticalStep(
                  item: items[index],
                  status: statuses[index],
                  last: index == items.length - 1,
                  number: index + 1,
                  duration: duration,
                ),
              ),
          ],
        );
      },
    ),
  );
}

CbStepStatus _derivedStatus(int index, int current) {
  if (index < current) return CbStepStatus.complete;
  if (index == current) return CbStepStatus.active;
  return CbStepStatus.waiting;
}

class _StepBoundary extends StatelessWidget {
  const _StepBoundary({
    required this.item,
    required this.index,
    required this.status,
    required this.onStepSelected,
    required this.child,
  });

  final CbStepItem item;
  final int index;
  final CbStepStatus status;
  final ValueChanged<int>? onStepSelected;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final bool interactive = onStepSelected != null;
    final Widget material = Material(
      type: MaterialType.transparency,
      child: InkWell(
        borderRadius: CbRadius.md.borderRadius,
        onTap: interactive && !item.disabled
            ? () => onStepSelected!(index)
            : null,
        child: ConstrainedBox(
          constraints: const BoxConstraints(
            minHeight: CbStructure.controlHeightLg,
          ),
          child: child,
        ),
      ),
    );
    final Semantics semantics = Semantics(
      key: item.key,
      container: true,
      explicitChildNodes: item.semanticLabel == null,
      sortKey: OrdinalSortKey(index.toDouble()),
      button: interactive,
      enabled: interactive ? !item.disabled : null,
      selected: status == CbStepStatus.active,
      label: item.semanticLabel ?? item.title,
      child: item.semanticLabel == null
          ? material
          : ExcludeSemantics(child: material),
    );
    return semantics;
  }
}

class _HorizontalStep extends StatelessWidget {
  const _HorizontalStep({
    required this.item,
    required this.status,
    required this.previousStatus,
    required this.first,
    required this.last,
    required this.number,
    required this.duration,
  });

  final CbStepItem item;
  final CbStepStatus status;
  final CbStepStatus? previousStatus;
  final bool first;
  final bool last;
  final int number;
  final Duration duration;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: <Widget>[
      Row(
        children: <Widget>[
          Expanded(
            child: first
                ? const SizedBox(height: CbStructure.borderWidth)
                : _StepConnector(status: previousStatus!, duration: duration),
          ),
          _StepMarker(
            item: item,
            status: status,
            number: number,
            duration: duration,
          ),
          Expanded(
            child: last
                ? const SizedBox(height: CbStructure.borderWidth)
                : _StepConnector(status: status, duration: duration),
          ),
        ],
      ),
      const SizedBox(height: CbStructure.space2),
      Padding(
        padding: const EdgeInsets.symmetric(horizontal: CbStructure.space1),
        child: _StepCopy(item: item, status: status, centered: true),
      ),
    ],
  );
}

class _VerticalStep extends StatelessWidget {
  const _VerticalStep({
    required this.item,
    required this.status,
    required this.last,
    required this.number,
    required this.duration,
  });

  final CbStepItem item;
  final CbStepStatus status;
  final bool last;
  final int number;
  final Duration duration;

  @override
  Widget build(BuildContext context) => IntrinsicHeight(
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        SizedBox(
          width: CbStructure.controlHeightLg,
          child: Stack(
            alignment: AlignmentDirectional.topCenter,
            children: <Widget>[
              if (!last)
                PositionedDirectional(
                  top: CbStructure.space4,
                  bottom: CbStructure.space0,
                  child: SizedBox(
                    width: CbStructure.borderWidth,
                    child: _StepConnector(
                      status: status,
                      duration: duration,
                      vertical: true,
                    ),
                  ),
                ),
              _StepMarker(
                item: item,
                status: status,
                number: number,
                duration: duration,
              ),
            ],
          ),
        ),
        const SizedBox(width: CbStructure.space3),
        Expanded(
          child: Padding(
            padding: EdgeInsets.only(
              top: CbStructure.space1,
              bottom: last ? CbStructure.space1 : CbStructure.space5,
            ),
            child: _StepCopy(item: item, status: status, centered: false),
          ),
        ),
      ],
    ),
  );
}

class _StepConnector extends StatelessWidget {
  const _StepConnector({
    required this.status,
    required this.duration,
    this.vertical = false,
  });

  final CbStepStatus status;
  final Duration duration;
  final bool vertical;

  @override
  Widget build(BuildContext context) => AnimatedContainer(
    duration: duration,
    curve: CbMotionTokens.standard,
    width: vertical ? CbStructure.borderWidth : null,
    height: vertical ? null : CbStructure.borderWidth,
    color: switch (status) {
      CbStepStatus.complete =>
        context.cb.accent(tone: CbTone.success).toColor(),
      CbStepStatus.error => context.cb.accent(tone: CbTone.danger).toColor(),
      _ => context.cb.border.toColor(),
    },
  );
}

class _StepMarker extends StatelessWidget {
  const _StepMarker({
    required this.item,
    required this.status,
    required this.number,
    required this.duration,
  });

  final CbStepItem item;
  final CbStepStatus status;
  final int number;
  final Duration duration;

  @override
  Widget build(BuildContext context) {
    final CbTone tone = switch (status) {
      CbStepStatus.complete => CbTone.success,
      CbStepStatus.error => CbTone.danger,
      _ => CbTone.brand,
    };
    final bool filled = status != CbStepStatus.waiting;
    final Color foreground = filled
        ? context.cb.onTone(tone).toColor()
        : context.cb.fgMuted.toColor();
    final Widget child = item.icon != null
        ? IconTheme.merge(
            data: IconThemeData(color: foreground, size: CbStructure.textLg),
            child: item.icon!,
          )
        : switch (status) {
            CbStepStatus.complete => Icon(
              Icons.check_rounded,
              color: foreground,
              size: CbStructure.textLg,
            ),
            CbStepStatus.error => Icon(
              Icons.close_rounded,
              color: foreground,
              size: CbStructure.textLg,
            ),
            _ => Text(
              '$number',
              style: Theme.of(context).textTheme.labelLarge?.copyWith(
                color: foreground,
                fontFeatures: const <FontFeature>[FontFeature.tabularFigures()],
              ),
            ),
          };
    return ExcludeSemantics(
      child: AnimatedContainer(
        duration: duration,
        curve: CbMotionTokens.standard,
        width: CbStructure.controlHeightSm,
        height: CbStructure.controlHeightSm,
        decoration: BoxDecoration(
          color: filled
              ? context.cb.accent(tone: tone).toColor()
              : context.cb.surface.toColor(),
          border: Border.all(
            color: filled
                ? context.cb.accent(tone: tone).toColor()
                : context.cb.borderStrong.toColor(),
            width: CbStructure.borderWidth,
          ),
          borderRadius: BorderRadius.circular(CbStructure.radiusFull),
        ),
        child: Center(child: child),
      ),
    );
  }
}

class _StepCopy extends StatelessWidget {
  const _StepCopy({
    required this.item,
    required this.status,
    required this.centered,
  });

  final CbStepItem item;
  final CbStepStatus status;
  final bool centered;

  @override
  Widget build(BuildContext context) {
    final TextAlign alignment = centered ? TextAlign.center : TextAlign.start;
    final Color titleColor = item.disabled
        ? context.cb.fgMuted.toColor()
        : status == CbStepStatus.error
        ? context.cb.accent(tone: CbTone.danger).toColor()
        : context.cb.fg.toColor();
    return Column(
      crossAxisAlignment: centered
          ? CrossAxisAlignment.center
          : CrossAxisAlignment.stretch,
      children: <Widget>[
        ExcludeSemantics(
          child: Text(
            item.title,
            textAlign: alignment,
            style: Theme.of(
              context,
            ).textTheme.titleSmall?.copyWith(color: titleColor),
          ),
        ),
        if (item.content case final Widget content) ...<Widget>[
          const SizedBox(height: CbStructure.space1),
          DefaultTextStyle.merge(
            textAlign: alignment,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: item.disabled
                  ? context.cb.fgMuted.toColor()
                  : status == CbStepStatus.error
                  ? context.cb.accent(tone: CbTone.danger).toColor()
                  : context.cb.fgMuted.toColor(),
            ),
            child: content,
          ),
        ],
      ],
    );
  }
}
