import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';

import 'package:ceebee_ui/src/theme/cb_theme.dart';
import 'package:ceebee_ui/src/tokens/generated/structure.g.dart';
import 'package:ceebee_ui/src/tokens/tone.dart';

/// One event in an app-ordered [CbTimeline].
@immutable
class CbTimelineItem {
  const CbTimelineItem({
    this.key,
    required this.title,
    this.timestamp,
    this.content,
    this.semanticLabel,
    this.tone = CbTone.brand,
    this.marker,
    this.pending = false,
  });

  /// Stable identity forwarded to the rendered event boundary.
  final Key? key;
  final String title;
  final String? timestamp;
  final Widget? content;

  /// Complete localized spoken output for visually complex event content.
  final String? semanticLabel;

  /// Semantic marker colour. Visible copy must still communicate the status.
  final CbTone tone;

  /// Optional decorative native marker. Ceebee supplies its size and colour.
  final Widget? marker;

  /// Whether the event is still in progress.
  ///
  /// This controls marker treatment only; application state remains external.
  final bool pending;
}

/// A responsive, non-interactive history of app-ordered events.
///
/// Timeline does not own a current index or reverse events. Those contracts
/// belong to Steps and application data respectively.
class CbTimeline extends StatelessWidget {
  const CbTimeline({super.key, required this.items, this.motion = true});

  final List<CbTimelineItem> items;

  /// Whether pending markers may animate. OS reduced-motion always wins.
  final bool motion;

  @override
  Widget build(BuildContext context) => Semantics(
    container: true,
    explicitChildNodes: true,
    child: LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final bool wide =
            constraints.hasBoundedWidth &&
            constraints.maxWidth >= CbStructure.space8 * 8;
        return Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            for (int index = 0; index < items.length; index++)
              _TimelineEvent(
                item: items[index],
                index: index,
                wide: wide,
                last: index == items.length - 1,
                motion: motion,
              ),
          ],
        );
      },
    ),
  );
}

class _TimelineEvent extends StatelessWidget {
  const _TimelineEvent({
    required this.item,
    required this.index,
    required this.wide,
    required this.last,
    required this.motion,
  });

  final CbTimelineItem item;
  final int index;
  final bool wide;
  final bool last;
  final bool motion;

  @override
  Widget build(BuildContext context) {
    final Widget event = wide
        ? _WideTimelineEvent(item: item, last: last, motion: motion)
        : _CompactTimelineEvent(item: item, last: last, motion: motion);
    if (item.semanticLabel case final String spokenEvent) {
      return Semantics(
        key: item.key,
        container: true,
        sortKey: OrdinalSortKey(index.toDouble()),
        label: spokenEvent,
        child: ExcludeSemantics(child: event),
      );
    }
    return Semantics(
      key: item.key,
      container: true,
      explicitChildNodes: true,
      sortKey: OrdinalSortKey(index.toDouble()),
      child: event,
    );
  }
}

class _CompactTimelineEvent extends StatelessWidget {
  const _CompactTimelineEvent({
    required this.item,
    required this.last,
    required this.motion,
  });

  final CbTimelineItem item;
  final bool last;
  final bool motion;

  @override
  Widget build(BuildContext context) => IntrinsicHeight(
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        _TimelineRail(item: item, last: last, motion: motion),
        const SizedBox(width: CbStructure.space3),
        Expanded(
          child: Padding(
            padding: EdgeInsets.only(
              bottom: last ? CbStructure.space0 : CbStructure.space5,
            ),
            child: _TimelineContent(item: item, showTimestamp: true),
          ),
        ),
      ],
    ),
  );
}

class _WideTimelineEvent extends StatelessWidget {
  const _WideTimelineEvent({
    required this.item,
    required this.last,
    required this.motion,
  });

  final CbTimelineItem item;
  final bool last;
  final bool motion;

  @override
  Widget build(BuildContext context) => IntrinsicHeight(
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Expanded(
          flex: 2,
          child: Padding(
            padding: EdgeInsets.only(
              top: CbStructure.space1,
              bottom: last ? CbStructure.space0 : CbStructure.space5,
            ),
            child: item.timestamp == null
                ? const SizedBox.shrink()
                : Align(
                    alignment: AlignmentDirectional.topEnd,
                    child: _Timestamp(value: item.timestamp!),
                  ),
          ),
        ),
        const SizedBox(width: CbStructure.space4),
        _TimelineRail(item: item, last: last, motion: motion),
        const SizedBox(width: CbStructure.space4),
        Expanded(
          flex: 5,
          child: Padding(
            padding: EdgeInsets.only(
              bottom: last ? CbStructure.space0 : CbStructure.space5,
            ),
            child: _TimelineContent(item: item, showTimestamp: false),
          ),
        ),
      ],
    ),
  );
}

class _TimelineRail extends StatelessWidget {
  const _TimelineRail({
    required this.item,
    required this.last,
    required this.motion,
  });

  final CbTimelineItem item;
  final bool last;
  final bool motion;

  @override
  Widget build(BuildContext context) {
    final Color markerColor = context.cb.accent(tone: item.tone).toColor();
    final bool reduceMotion =
        MediaQuery.maybeOf(context)?.disableAnimations ?? false;
    final bool animatePending = item.pending && motion && !reduceMotion;
    final Widget marker = item.marker != null
        ? IconTheme.merge(
            data: IconThemeData(color: markerColor, size: CbStructure.textLg),
            child: item.marker!,
          )
        : item.pending
        ? animatePending
              ? SizedBox.square(
                  dimension: CbStructure.textLg,
                  child: CircularProgressIndicator(
                    color: markerColor,
                    strokeWidth: CbStructure.borderWidth * 2,
                  ),
                )
              : Icon(
                  Icons.more_horiz_rounded,
                  color: markerColor,
                  size: CbStructure.textLg,
                )
        : DecoratedBox(
            decoration: BoxDecoration(
              color: markerColor,
              shape: BoxShape.circle,
            ),
            child: const SizedBox.square(dimension: CbStructure.space3),
          );

    return ExcludeSemantics(
      child: SizedBox(
        width: CbStructure.space5,
        child: Stack(
          alignment: AlignmentDirectional.topCenter,
          children: <Widget>[
            if (!last)
              PositionedDirectional(
                top: CbStructure.space3,
                bottom: CbStructure.space0,
                child: ColoredBox(
                  color: context.cb.border.toColor(),
                  child: const SizedBox(width: CbStructure.borderWidth),
                ),
              ),
            SizedBox.square(
              dimension: CbStructure.space5,
              child: Center(child: marker),
            ),
          ],
        ),
      ),
    );
  }
}

class _TimelineContent extends StatelessWidget {
  const _TimelineContent({required this.item, required this.showTimestamp});

  final CbTimelineItem item;
  final bool showTimestamp;

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        if (showTimestamp && item.timestamp != null) ...<Widget>[
          _Timestamp(value: item.timestamp!),
          const SizedBox(height: CbStructure.space1),
        ],
        Text(item.title, style: type.titleSmall),
        if (item.content case final Widget content) ...<Widget>[
          const SizedBox(height: CbStructure.space2),
          DefaultTextStyle.merge(
            style: type.bodyMedium?.copyWith(
              color: context.cb.fgMuted.toColor(),
            ),
            child: content,
          ),
        ],
      ],
    );
  }
}

class _Timestamp extends StatelessWidget {
  const _Timestamp({required this.value});

  final String value;

  @override
  Widget build(BuildContext context) => Text(
    value,
    style: Theme.of(
      context,
    ).textTheme.labelMedium?.copyWith(color: context.cb.fgMuted.toColor()),
  );
}
